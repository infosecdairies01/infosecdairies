from datetime import timedelta

import logging

from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import LoginOtp
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .email_templates import _send_html_email, get_otp_email_template
from .throttles import (
    EmailRateThrottle,
    LoginIPRateThrottle,
    OTPIPRateThrottle,
    RegisterIPRateThrottle,
)


logger = logging.getLogger(__name__)


def _send_email(subject: str, message: str, to_email: str, *, from_email: str, context: str) -> None:
    """Legacy function - use _send_html_email for HTML emails."""
    try:
        logger.info(
            "Sending email (%s): EMAIL_BACKEND=%s DEFAULT_FROM_EMAIL=%s to=%s",
            context,
            getattr(settings, "EMAIL_BACKEND", None),
            getattr(settings, "DEFAULT_FROM_EMAIL", None),
            to_email,
        )
        send_mail(subject, message, from_email, [to_email], fail_silently=False)
    except Exception:
        logger.exception("Failed to send email (%s)", context)


def _jwt_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def google_jwt(request):
    """Issue JWT tokens for the currently authenticated social user, or require email verification.

    This endpoint is meant to be called from the frontend after a successful
    Google login via django-allauth. The user is already authenticated via
    the session cookie. If verified, we issue tokens. If not verified (new user),
    we return a flag requiring verification.
    """

    user = request.user
    if not user.is_authenticated:
        return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

    # If user is already verified, skip OTP step and just issue JWT tokens
    if getattr(user, "is_verified", False):
        tokens = _jwt_for_user(user)
        data = {"user": UserSerializer(user).data, "tokens": tokens}
        return Response(data, status=status.HTTP_200_OK)
    
    # New Google user - send verification OTP
    import random
    code = f"{random.randint(0, 999999):06d}"
    expires_at = timezone.now() + timedelta(minutes=10)
    LoginOtp.objects.create(user=user, code=code, expires_at=expires_at)

    # Send beautiful HTML verification email
    subject = "Verify your Infosec Dairies account"
    text_body, html_body = get_otp_email_template(code)
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")
    _send_html_email(subject, text_body, html_body, user.email, from_email=from_email, context="google_jwt")

    return Response(
        {
            "detail": "Verification code sent to your email. Please verify to complete registration.",
            "email": user.email,
            "requires_verification": True,
        },
        status=status.HTTP_200_OK,
    )


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])  # use Django's session auth directly, skip DRF CSRF
@permission_classes([AllowAny])
@throttle_classes([OTPIPRateThrottle, EmailRateThrottle])
def google_start_otp(request):
    """Start OTP verification for a logged-in Google user.

    Generates a 6-digit code, stores it, and emails it to the user's address.
    """

    user = request.user
    if not user.is_authenticated:
        return Response(
            {"detail": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # If user is already verified, skip OTP and just issue JWT tokens
    if getattr(user, "is_verified", False):
        tokens = _jwt_for_user(user)
        data = {"user": UserSerializer(user).data, "tokens": tokens}
        return Response(data, status=status.HTTP_200_OK)

    # Generate a simple 6-digit numeric code for new/unverified users
    import random

    code = f"{random.randint(0, 999999):06d}"
    expires_at = timezone.now() + timedelta(minutes=10)

    LoginOtp.objects.create(user=user, code=code, expires_at=expires_at)

    # Send beautiful HTML OTP email
    subject = "Your Infosec Dairies login code"
    text_body, html_body = get_otp_email_template(code)
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")

    # This will use the configured EMAIL_BACKEND. In development we default
    # to console backend so you can see the code in the terminal.
    _send_html_email(subject, text_body, html_body, user.email, from_email=from_email, context="google_start_otp")

    return Response({"detail": "OTP sent"}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([OTPIPRateThrottle, EmailRateThrottle])
def google_verify_otp(request):
    """Verify the OTP and issue JWT tokens for the authenticated user."""

    user = request.user
    code = request.data.get("code")
    if not code:
        return Response({"detail": "code is required"}, status=status.HTTP_400_BAD_REQUEST)

    otp = (
        LoginOtp.objects.filter(user=user, code=code).order_by("-created_at").first()
    )
    if not otp or not otp.is_valid():
        return Response({"detail": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

    otp.used = True
    otp.save(update_fields=["used"])

    # Mark the user as verified so future logins can skip OTP
    if hasattr(user, "is_verified") and not user.is_verified:
        user.is_verified = True
        user.save(update_fields=["is_verified"])

    tokens = _jwt_for_user(user)
    data = {
        "user": UserSerializer(user).data,
        "tokens": tokens,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def update_profile(request):
    """Allow the authenticated user to update their own profile fields.

    For now we just support updating full_name (display username).
    """

    user = request.user
    full_name = request.data.get("full_name")
    if not full_name:
        return Response(
            {"detail": "full_name is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    raw = str(full_name).strip()
    cleaned = strip_tags(raw).strip()
    if cleaned != raw:
        return Response({"detail": "Invalid characters in full_name"}, status=status.HTTP_400_BAD_REQUEST)
    if len(cleaned) < 2 or len(cleaned) > 255:
        return Response({"detail": "full_name length is invalid"}, status=status.HTTP_400_BAD_REQUEST)

    user.full_name = cleaned
    user.save()

    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([RegisterIPRateThrottle, EmailRateThrottle])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Create user but keep inactive until email verified
    user = serializer.save(is_active=False)

    # Generate OTP for email verification
    import random

    code = f"{random.randint(0, 999999):06d}"
    expires_at = timezone.now() + timedelta(minutes=10)
    LoginOtp.objects.create(user=user, code=code, expires_at=expires_at)

    # Send verification email
    subject = "Verify your Infosec Dairies account"
    text_body, html_body = get_otp_email_template(code)
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")
    _send_html_email(subject, text_body, html_body, user.email, from_email=from_email, context="register")

    return Response(
        {
            "detail": "Verification code sent to your email. Please verify to complete registration.",
            "email": user.email,
            "requires_verification": True,
        },
        status=status.HTTP_201_CREATED,
    )


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([OTPIPRateThrottle, EmailRateThrottle])
def password_reset_request(request):
    email = (request.data.get("email") or "").strip().lower()
    if not email:
        return Response({"detail": "email is required"}, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import get_user_model
    User = get_user_model()

    user = User.objects.filter(email=email).first()
    if user:
        import random

        code = f"{random.randint(0, 999999):06d}"
        expires_at = timezone.now() + timedelta(minutes=10)
        LoginOtp.objects.create(user=user, code=code, expires_at=expires_at)

        subject = "Reset your Infosec Dairies password"
        text_body, html_body = get_otp_email_template(code)
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")
        _send_html_email(subject, text_body, html_body, user.email, from_email=from_email, context="password_reset_request")

    return Response(
        {"detail": "If an account exists, a password reset code has been sent."},
        status=status.HTTP_200_OK,
    )


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([OTPIPRateThrottle, EmailRateThrottle])
def password_reset_confirm(request):
    email = (request.data.get("email") or "").strip().lower()
    code = (request.data.get("code") or "").strip()
    new_password = request.data.get("new_password")

    if not email or not code or not new_password:
        return Response(
            {"detail": "email, code and new_password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    from django.contrib.auth import get_user_model
    from django.contrib.auth.password_validation import validate_password
    from django.core.exceptions import ValidationError

    User = get_user_model()
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({"detail": "Invalid email or code"}, status=status.HTTP_400_BAD_REQUEST)

    otp = LoginOtp.objects.filter(user=user, code=code).order_by("-created_at").first()
    if not otp or not otp.is_valid():
        return Response({"detail": "Invalid or expired code"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return Response({"detail": list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

    otp.used = True
    otp.save(update_fields=["used"])

    user.set_password(new_password)
    user.is_active = True
    user.is_verified = True
    user.save(update_fields=["password", "is_active", "is_verified"])

    tokens = _jwt_for_user(user)
    return Response(
        {"detail": "Password reset successful", "user": UserSerializer(user).data, "tokens": tokens},
        status=status.HTTP_200_OK,
    )


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([OTPIPRateThrottle, EmailRateThrottle])
def verify_email(request):
    """Verify email OTP and activate user account."""
    email = request.data.get("email")
    code = request.data.get("code")
    
    if not email or not code:
        return Response(
            {"detail": "email and code are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"detail": "Invalid email or code"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    # Check the OTP
    otp = LoginOtp.objects.filter(user=user, code=code).order_by("-created_at").first()
    
    if not otp or not otp.is_valid():
        return Response(
            {"detail": "Invalid or expired code"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    # Mark OTP as used
    otp.used = True
    otp.save(update_fields=["used"])
    
    # Activate user and mark verified
    user.is_active = True
    user.is_verified = True
    user.save(update_fields=["is_active", "is_verified"])
    
    # Issue JWT tokens
    tokens = _jwt_for_user(user)
    
    return Response(
        {
            "detail": "Email verified successfully",
            "user": UserSerializer(user).data,
            "tokens": tokens,
        },
        status=status.HTTP_200_OK,
    )


@csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([OTPIPRateThrottle, EmailRateThrottle])
def resend_verification_otp(request):
    """Resend verification OTP for pending registration."""
    email = request.data.get("email")
    
    if not email:
        return Response(
            {"detail": "email is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = User.objects.get(email=email, is_active=False)
    except User.DoesNotExist:
        # Don't reveal if user exists or not
        return Response(
            {"detail": "If an account exists, a verification code has been sent"},
            status=status.HTTP_200_OK,
        )
    
    # Generate new OTP
    import random
    code = f"{random.randint(0, 999999):06d}"
    expires_at = timezone.now() + timedelta(minutes=10)
    LoginOtp.objects.create(user=user, code=code, expires_at=expires_at)
    
    # Send verification email
    subject = "Verify your Infosec Dairies account"
    text_body, html_body = get_otp_email_template(code)
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@infosecdairies.io")
    _send_html_email(subject, text_body, html_body, user.email, from_email=from_email, context="resend_verification_otp")
    
    return Response(
        {"detail": "If an account exists, a verification code has been sent"},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
@throttle_classes([LoginIPRateThrottle, EmailRateThrottle])
def login(request):
    serializer = LoginSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        tokens = _jwt_for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": tokens,
            },
            status=status.HTTP_200_OK,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def verify_token(request):
    """Verify if the provided JWT access token is valid.
    
    This endpoint cryptographically validates the token signature and expiry.
    Used by frontend to prevent response manipulation attacks.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return Response({"valid": False, "detail": "Authorization header required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(" ")[1]
    try:
        AccessToken(token)  # Validates signature, expiry, and issuer
        return Response({"valid": True}, status=status.HTTP_200_OK)
    except TokenError as e:
        return Response({"valid": False, "detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
