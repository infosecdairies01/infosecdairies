from django.contrib import admin

from .models import CoursePurchase, PromoCode, PromoCodeUsage


@admin.register(CoursePurchase)
class CoursePurchaseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "course_slug",
        "amount_inr",
        "status",
        "razorpay_order_id",
        "razorpay_payment_id",
        "created_at",
        "paid_at",
    )
    search_fields = ("course_slug", "razorpay_order_id", "razorpay_payment_id", "user__email")
    list_filter = ("status", "course_slug")


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "course_slug", "is_active", "current_uses", "max_uses", "created_at")
    search_fields = ("code", "course_slug")
    list_filter = ("is_active", "course_slug")


@admin.register(PromoCodeUsage)
class PromoCodeUsageAdmin(admin.ModelAdmin):
    list_display = ("id", "promo_code", "code", "user", "course_slug", "used_at")
    search_fields = ("code", "promo_code__code", "promo_code__course_slug", "user__email")
    list_filter = ("course_slug", "used_at")
