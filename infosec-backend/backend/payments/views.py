import hashlib
import hmac
from datetime import datetime
import logging

import razorpay
from razorpay.errors import BadRequestError
from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from courses.models import Course, Enrollment
from accounts.email_templates import _send_html_email, get_payment_receipt_template

from .models import CoursePurchase, PromoCode, PromoCodeUsage


logger = logging.getLogger(__name__)


FREE_COURSE_SLUG = "network-fundamentals"
ALL_COURSES_BUNDLE_SLUG = "all-courses-bundle"
ALL_COURSES_BUNDLE_PRICE_INR = 3999


def _difficulty_price_inr(level: str) -> int:
    lvl = (level or "").strip().lower()
    if lvl in ["beginner", "easy"]:
        return 499
    if lvl in ["intermediate", "medium"]:
        return 799
    if lvl in ["advanced", "hard"]:
        return 1199
    return 499


def _is_test_mode() -> bool:
    return bool(getattr(settings, "PAYMENTS_TEST_MODE", False))


def _course_price_inr(course: Course) -> int:
    if course.slug == FREE_COURSE_SLUG:
        return 0
    if _is_test_mode():
        return _difficulty_price_inr(course.level)
    return _difficulty_price_inr(course.level)


def _bundle_price_inr() -> int:
    if _is_test_mode():
        return ALL_COURSES_BUNDLE_PRICE_INR
    return ALL_COURSES_BUNDLE_PRICE_INR


def _clean_razorpay_cred(value: str) -> str:
    """Best-effort sanitization for env-provided secrets."""
    v = (value or "").strip()
    if (v.startswith("(") and v.endswith(")")):
        v = v[1:-1].strip()
    return v


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    course_slug = request.data.get("course_slug")
    purchaser_name = request.data.get("full_name")
    promo_code = request.data.get("promo_code", "").strip().upper()

    if not course_slug:
        return Response({"detail": "course_slug is required"}, status=400)

    # Check promo code validity using PromoCode model with usage limits.
    # Supports a global promo code row with course_slug == "all".
    is_promo_valid = False
    promo_code_obj = None
    if promo_code:
        promo_code_obj = (
            PromoCode.objects.filter(code=promo_code, is_active=True, course_slug=course_slug).first()
            or PromoCode.objects.filter(code=promo_code, is_active=True, course_slug="all").first()
        )
        if not promo_code_obj:
            return Response({"detail": "Invalid promo code"}, status=400)

        if promo_code_obj.is_valid_for_user(request.user, target_course_slug=course_slug):
            is_promo_valid = True
        else:
            if promo_code_obj.current_uses >= promo_code_obj.max_uses and promo_code_obj.max_uses > 0:
                return Response({"detail": "This promo code has reached its usage limit"}, status=400)
            if PromoCodeUsage.objects.filter(code=promo_code, user=request.user, course_slug=course_slug).exists():
                return Response({"detail": "You have already used this promo code"}, status=400)
            return Response({"detail": "Invalid or inactive promo code"}, status=400)

    is_bundle = course_slug == ALL_COURSES_BUNDLE_SLUG
    course = None
    if not is_bundle:
        course = get_object_or_404(Course, slug=course_slug, is_published=True)
        amount_inr = _course_price_inr(course)
    else:
        amount_inr = _bundle_price_inr()

    # If promo code is valid, apply discount
    if is_promo_valid and promo_code_obj:
        amount_inr = promo_code_obj.calculate_discounted_price(amount_inr)

        # Record usage early so the code can't be reused if the user retries checkout.
        # This trades off some false-positives (abandoned payments) for simplicity.
        promo_code_obj.record_usage(request.user, course_slug)

    if amount_inr == 0:
        # Free access (promo code or free course): create enrollment directly
        if not is_bundle:
            course = get_object_or_404(Course, slug=course_slug, is_published=True)
            enrollment, _ = Enrollment.objects.get_or_create(
                user=request.user,
                course=course,
                defaults={"is_paid": True},
            )
            if not enrollment.is_paid:
                enrollment.is_paid = True
                enrollment.save(update_fields=["is_paid"])
        else:
            # Bundle - enroll in all courses
            courses = Course.objects.filter(is_published=True)
            for c in courses:
                enrollment, _ = Enrollment.objects.get_or_create(
                    user=request.user,
                    course=c,
                    defaults={"is_paid": True},
                )
                if not enrollment.is_paid:
                    enrollment.is_paid = True
                    enrollment.save(update_fields=["is_paid"])
        
        return Response(
            {
                "free": True,
                "course_slug": course_slug,
                "amount_inr": 0,
                "discount_percent": promo_code_obj.discount_percent if promo_code_obj else None,
            }
        )

    existing_paid = CoursePurchase.objects.filter(
        user=request.user,
        course_slug=course_slug,
        status=CoursePurchase.STATUS_PAID,
    ).exists()
    if existing_paid:
        return Response({"already_paid": True, "course_slug": course_slug, "amount_inr": amount_inr})

    key_id = _clean_razorpay_cred(getattr(settings, "RAZORPAY_KEY_ID", ""))
    key_secret = _clean_razorpay_cred(getattr(settings, "RAZORPAY_KEY_SECRET", ""))
    
    amount_paise = int(amount_inr) * 100
    
    # Test mode: simulate order without real Razorpay
    if _is_test_mode() and (not key_id or not key_secret):
        import uuid
        mock_order_id = f"mock_order_{uuid.uuid4().hex[:16]}"
        CoursePurchase.objects.create(
            user=request.user,
            course_slug=course_slug,
            amount_inr=amount_inr,
            currency="INR",
            status=CoursePurchase.STATUS_CREATED,
            razorpay_order_id=mock_order_id,
            purchaser_name=purchaser_name,
        )
        return Response(
            {
                "free": False,
                "key_id": "test_key_placeholder",
                "order_id": mock_order_id,
                "amount": amount_paise,
                "currency": "INR",
                "course_slug": course_slug,
                "amount_inr": amount_inr,
                "test_mode": True,
            }
        )
    
    if not key_id or not key_secret:
        return Response({"detail": "Razorpay is not configured"}, status=500)

    if not key_id.startswith("rzp_"):
        return Response({"detail": "Invalid Razorpay Key ID"}, status=500)

    client = razorpay.Client(auth=(key_id, key_secret))

    receipt = f"course_{course_slug}_{request.user.id}_{int(datetime.utcnow().timestamp())}"
    receipt = receipt[:40]  # Razorpay requires receipt <= 40 chars

    try:
        order = client.order.create(
            {
                "amount": amount_paise,
                "currency": "INR",
                "receipt": receipt,
                "payment_capture": 1,
                "notes": {
                    "course_slug": course_slug,
                    "user_id": str(request.user.id),
                },
            }
        )
    except BadRequestError as exc:
        # Common case: invalid key/secret => "Authentication failed"
        return Response({"detail": str(exc)}, status=502)

    CoursePurchase.objects.create(
        user=request.user,
        course_slug=course_slug,
        amount_inr=amount_inr,
        currency="INR",
        status=CoursePurchase.STATUS_CREATED,
        razorpay_order_id=order["id"],
        purchaser_name=purchaser_name,
    )

    return Response(
        {
            "free": False,
            "key_id": key_id,
            "order_id": order["id"],
            "amount": amount_paise,
            "currency": "INR",
            "course_slug": course_slug,
            "amount_inr": amount_inr,
            "discount_percent": promo_code_obj.discount_percent if promo_code_obj else None,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    order_id = request.data.get("razorpay_order_id")
    payment_id = request.data.get("razorpay_payment_id")
    signature = request.data.get("razorpay_signature")

    if not order_id or not payment_id or not signature:
        return Response({"detail": "Missing payment fields"}, status=400)

    purchase = get_object_or_404(CoursePurchase, user=request.user, razorpay_order_id=order_id)

    if purchase.status == CoursePurchase.STATUS_PAID:
        return Response({"success": True, "course_slug": purchase.course_slug, "already_paid": True})

    key_secret = _clean_razorpay_cred(getattr(settings, "RAZORPAY_KEY_SECRET", ""))
    
    # Test mode: skip signature verification
    is_test_mode = _is_test_mode()
    is_test_order = order_id.startswith("mock_order_")
    
    if is_test_mode and is_test_order:
        # In test mode, auto-approve test orders
        purchase.status = CoursePurchase.STATUS_PAID
        purchase.razorpay_payment_id = payment_id or "generic_payment_id"
        purchase.razorpay_signature = signature or "generic_signature"
        purchase.paid_at = timezone.now()
        purchase.save(update_fields=["status", "razorpay_payment_id", "razorpay_signature", "paid_at"])
    elif not key_secret:
        return Response({"detail": "Razorpay is not configured"}, status=500)
    else:
        msg = f"{order_id}|{payment_id}".encode("utf-8")
        expected = hmac.new(key_secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()

        if not hmac.compare_digest(expected, signature):
            purchase.status = CoursePurchase.STATUS_FAILED
            purchase.razorpay_payment_id = payment_id
            purchase.razorpay_signature = signature
            purchase.save(update_fields=["status", "razorpay_payment_id", "razorpay_signature"])
            return Response({"detail": "Invalid payment signature"}, status=400)

        purchase.status = CoursePurchase.STATUS_PAID
        purchase.razorpay_payment_id = payment_id
        purchase.razorpay_signature = signature
        purchase.paid_at = timezone.now()
        purchase.save(update_fields=["status", "razorpay_payment_id", "razorpay_signature", "paid_at"])

    if purchase.course_slug == ALL_COURSES_BUNDLE_SLUG:
        courses = Course.objects.filter(is_published=True)
        for c in courses:
            enrollment, _ = Enrollment.objects.get_or_create(
                user=request.user,
                course=c,
                defaults={"is_paid": True},
            )
            if not enrollment.is_paid:
                enrollment.is_paid = True
                enrollment.save(update_fields=["is_paid"])
        course_title = "All Courses Bundle"
    else:
        course = get_object_or_404(Course, slug=purchase.course_slug, is_published=True)
        enrollment, _ = Enrollment.objects.get_or_create(
            user=request.user,
            course=course,
            defaults={"is_paid": True},
        )
        if not enrollment.is_paid:
            enrollment.is_paid = True
            enrollment.save(update_fields=["is_paid"])
        course_title = course.title

    try:
        subject = f"Payment received: {course_title}"
        user_name = purchase.purchaser_name or request.user.email
        text_body, html_body = get_payment_receipt_template(
            course_title=course_title,
            amount=str(purchase.amount_inr),
            order_id=order_id,
            payment_id=payment_id,
            user_name=user_name
        )
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")
        _send_html_email(subject, text_body, html_body, request.user.email, from_email=from_email, context="payment_receipt")
    except Exception:
        logger.exception("Failed to send payment receipt email")

    return Response({"success": True, "course_slug": purchase.course_slug})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_purchases(request):
    """Return list of user's course purchases."""
    purchases = CoursePurchase.objects.filter(user=request.user).order_by("-created_at")
    data = [
        {
            "course_slug": p.course_slug,
            "status": p.status,
            "amount_inr": p.amount_inr,
            "paid_at": p.paid_at,
        }
        for p in purchases
    ]
    return Response(data)
