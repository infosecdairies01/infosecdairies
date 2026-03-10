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
            if not user.is_verified:
                user.is_verified = True
                updated = True
            if not user.is_active:
                user.is_active = True
                updated = True
            if updated:
                user.save(update_fields=['is_verified', 'is_active'])
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
            if updated:
                existing_user.save(update_fields=['is_verified', 'is_active'])
                
        except User.DoesNotExist:
            # No existing user with this email - proceed with new account creation
            pass

    def is_auto_signup_allowed(self, request, sociallogin):
        """
        Disable auto-signup. Our frontend flow handles user creation and OTP.
        """
        return False

    def get_connect_redirect_url(self, request, socialaccount):
        """
        Return the URL to redirect to after connecting a social account.
        """
        return '/'
