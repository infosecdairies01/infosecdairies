from django.contrib import admin

from .models import CoursePurchase


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
