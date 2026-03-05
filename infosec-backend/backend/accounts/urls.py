from django.urls import path

from .views import (
    register,
    login,
    google_jwt,
    update_profile,
    google_start_otp,
    google_verify_otp,
    verify_email,
    resend_verification_otp,
)

urlpatterns = [
    path("register/", register, name="auth-register"),
    path("login/", login, name="auth-login"),
    path("verify-email/", verify_email, name="auth-verify-email"),
    path("resend-verification-otp/", resend_verification_otp, name="auth-resend-verification-otp"),
    path("google/jwt/", google_jwt, name="auth-google-jwt"),
    path("google/start-otp/", google_start_otp, name="auth-google-start-otp"),
    path("google/verify-otp/", google_verify_otp, name="auth-google-verify-otp"),
    path("profile/", update_profile, name="auth-update-profile"),
]
