from django.contrib.auth import authenticate
from allauth.account.models import EmailAddress
from rest_framework import serializers

from .models import User, AuthProvider


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["full_name", "email", "password", "mobile"]

    def validate_email(self, value):
        """Check if user with this email already exists."""
        email = value.lower().strip()
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
