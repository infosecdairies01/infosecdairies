from django.contrib.auth import authenticate
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.html import strip_tags
from allauth.account.models import EmailAddress
from rest_framework import serializers

from .models import User, AuthProvider


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=10)

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "mobile"]

    def validate_full_name(self, value):
        # Prevent stored XSS: do not allow HTML/JS in names.
        raw = (value or "").strip()
        cleaned = strip_tags(raw).strip()
        if cleaned != raw:
            raise serializers.ValidationError("Invalid characters in name.")
        if len(cleaned) < 2:
            raise serializers.ValidationError("Name is too short.")
        if len(cleaned) > 255:
            raise serializers.ValidationError("Name is too long.")
        return cleaned

    def validate_password(self, value):
        password = value or ""
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return password

    def validate_mobile(self, value):
        if value in (None, ""):
            return value
        raw = str(value).strip()
        cleaned = strip_tags(raw).strip()
        if cleaned != raw:
            raise serializers.ValidationError("Invalid characters in mobile.")
        if len(cleaned) > 20:
            raise serializers.ValidationError("Mobile is too long.")
        return cleaned

    def validate_email(self, value):
        """Check if user with this email already exists."""
        email = value.lower().strip()
        if "@" not in email:
            raise serializers.ValidationError("Invalid email address.")

        allowed_domains = getattr(settings, "ALLOWED_EMAIL_DOMAINS", None)
        if allowed_domains:
            domain = email.split("@", 1)[1]
            allowed = {str(d).strip().lower() for d in allowed_domains if str(d).strip()}
            if allowed and domain not in allowed:
                raise serializers.ValidationError("Email domain is not allowed.")

        block_disposable = getattr(settings, "BLOCK_DISPOSABLE_EMAILS", True)
        if block_disposable and "@" in email:
            domain = email.split("@", 1)[1]
            blocked_domains = set(
                d.strip().lower()
                for d in getattr(
                    settings,
                    "DISPOSABLE_EMAIL_DOMAINS",
                    [
                        "mailinator.com",
                        "guerrillamail.com",
                        "guerrillamail.info",
                        "guerrillamail.net",
                        "sharklasers.com",
                        "yopmail.com",
                        "yopmail.fr",
                        "yopmail.net",
                        "temp-mail.org",
                        "10minutemail.com",
                        "10minutemail.net",
                        "mohmal.com",
                        "dispostable.com",
                        "getnada.com",
                    ],
                )
                if d.strip()
            )
            if domain in blocked_domains:
                raise serializers.ValidationError("Disposable email addresses are not allowed.")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists. Please sign in instead."
            )
        return email

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(
            full_name=validated_data.get("full_name"),
            email=validated_data.get("email"),
            mobile=validated_data.get("mobile"),
            auth_provider=AuthProvider.EMAIL,
        )
        user.set_password(password)
        user.save()

        # Ensure there's an EmailAddress entry for this user so that
        # the email shows up under Admin -> Email addresses linked
        # to the correct user account.
        EmailAddress.objects.get_or_create(
            user=user,
            email=user.email,
            defaults={"verified": False, "primary": True},
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get("request"), email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        
        # Check if user has verified their email
        if not user.is_active:
            raise serializers.ValidationError("Please verify your email before logging in. Check your inbox for the verification code.")
        
        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "full_name", "email", "mobile", "auth_provider"]
