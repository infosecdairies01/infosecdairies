from django.conf import settings
from django.db import models


class PromoCode(models.Model):
    """Promo codes with usage limits per course."""
    code = models.CharField(max_length=50, unique=True, db_index=True)
    course_slug = models.SlugField(db_index=True)
    max_uses = models.PositiveIntegerField(default=0, help_text="Maximum unique users allowed (0 = unlimited)")
    current_uses = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["code", "course_slug"]),
        ]

    def __str__(self) -> str:
        return f"{self.code} ({self.current_uses}/{self.max_uses})"

    def is_valid_for_user(self, user) -> bool:
        """Check if promo code can be used by this user."""
        if not self.is_active:
            return False
        if self.max_uses > 0 and self.current_uses >= self.max_uses:
            return False
        # Check if user already used this code
        if PromoCodeUsage.objects.filter(code=self.code, user=user).exists():
            return False
        return True

    def record_usage(self, user, course_slug: str):
        """Record that a user used this promo code."""
        PromoCodeUsage.objects.get_or_create(
            code=self.code,
            user=user,
            defaults={"course_slug": course_slug}
        )
        self.current_uses = PromoCodeUsage.objects.filter(code=self.code).count()
        self.save(update_fields=["current_uses"])


class PromoCodeUsage(models.Model):
    """Tracks which users have used which promo codes."""
    code = models.CharField(max_length=50, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course_slug = models.SlugField()
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("code", "user")
        indexes = [
            models.Index(fields=["code", "used_at"]),
        ]


class CoursePurchase(models.Model):
    STATUS_CREATED = "created"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = [
        (STATUS_CREATED, "Created"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course_slug = models.SlugField()

    amount_inr = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_CREATED)

    razorpay_order_id = models.CharField(max_length=100, unique=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)

    purchaser_name = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "course_slug"]),
            models.Index(fields=["razorpay_order_id"]),
        ]

    def __str__(self) -> str:  # type: ignore[override]
        return f"{self.user.email} -> {self.course_slug} ({self.status})"
