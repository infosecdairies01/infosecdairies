"""Custom allauth adapter to link social accounts to existing users by email."""

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter that connects social logins to existing users with the same email.
    
    This prevents creating duplicate user accounts when a user who previously
    signed up with email/password later signs in with Google (or vice versa).
    """

    def pre_social_login(self, request, sociallogin):
        """
        Called before the social login is processed.
        
        If a user with the same email already exists, connect the social account
        to that existing user instead of creating a new one.
        Also ensures user is marked as verified when using social auth.
        """
        # Skip if user is already connected
        if sociallogin.user.pk:
            # User already exists - ensure they're marked as verified for social login
            user = sociallogin.user
            updated = False
            if getattr(sociallogin.account, "provider", None) == "google":
                if getattr(user, "auth_provider", None) != "google":
                    user.auth_provider = "google"
                    updated = True
                if user.has_usable_password():
                    user.set_unusable_password()
                    updated = True
            if not user.is_verified:
                user.is_verified = True
                updated = True
            if not user.is_active:
                user.is_active = True
                updated = True
            if updated:
                user.save()
            return

        email = sociallogin.user.email
        if not email:
            return

        # Normalize email for lookup
        email = email.lower().strip()

        try:
            # Check if a user with this email already exists
            existing_user = User.objects.get(email=email)
            
            # Check if this social account is already connected
            social_account_exists = SocialAccount.objects.filter(
                user=existing_user,
                provider=sociallogin.account.provider,
                uid=sociallogin.account.uid
            ).exists()
            
            if not social_account_exists:
                # Connect the social login to the existing user
                sociallogin.user = existing_user
                sociallogin.account.user = existing_user
                
            # Always ensure user is verified and active when using social auth
            updated = False
            if not existing_user.is_verified:
                existing_user.is_verified = True
                updated = True
            if not existing_user.is_active:
                existing_user.is_active = True
                updated = True
            if getattr(sociallogin.account, "provider", None) == "google" and getattr(existing_user, "auth_provider", None) != "google":
                existing_user.auth_provider = "google"
                updated = True
            if getattr(sociallogin.account, "provider", None) == "google" and existing_user.has_usable_password():
                existing_user.set_unusable_password()
                updated = True
            if updated:
                existing_user.save()
                
        except User.DoesNotExist:
            # No existing user with this email - proceed with new account creation
            pass

        if getattr(sociallogin.account, "provider", None) == "google":
            user = sociallogin.user
            try:
                if getattr(user, "auth_provider", None) != "google":
                    user.auth_provider = "google"
                user.is_active = True
                user.is_verified = True
                user.save()
            except Exception:
                pass

    def is_auto_signup_allowed(self, request, sociallogin):
        """
        Allow auto-signup. The adapter's pre_social_login handles user linking.
        """
        return True

    def get_connect_redirect_url(self, request, socialaccount):
        """
        Return the URL to redirect to after connecting a social account.
        """
        return '/'
