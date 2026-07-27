import uuid
import secrets
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from common.utils import generate_otp_code
from .models import OTPCode, PasswordResetToken, EmailVerificationToken

User = get_user_model()

class OTPService:
    @staticmethod
    def generate_and_send_otp(phone_number):
        OTPCode.objects.filter(phone_number=phone_number, is_used=False).update(is_used=True)
        code = generate_otp_code(6)
        expires_at = timezone.now() + timedelta(minutes=5)
        otp_record = OTPCode.objects.create(
            phone_number=phone_number,
            code=code,
            expires_at=expires_at
        )
        return otp_record

    @staticmethod
    def verify_otp(phone_number, code):
        try:
            otp_record = OTPCode.objects.filter(
                phone_number=phone_number,
                is_used=False
            ).latest('created_at')

            if not otp_record.is_valid():
                return False, "OTP code has expired or exceeded maximum verification attempts."

            if otp_record.code != code:
                otp_record.attempts += 1
                otp_record.save(update_fields=['attempts'])
                return False, f"Invalid OTP code. {3 - otp_record.attempts} attempts remaining."

            otp_record.is_used = True
            otp_record.save(update_fields=['is_used'])
            return True, "OTP verified successfully."

        except OTPCode.DoesNotExist:
            return False, "No active OTP code found for this phone number."

class UserService:
    @staticmethod
    def get_or_create_user(phone_number, full_name=None, role='donor', email=None):
        user, created = User.objects.get_or_create(
            phone_number=phone_number,
            defaults={
                'full_name': full_name or f"User {phone_number[-4:]}",
                'role': role,
                'email': email
            }
        )
        if created:
            user.is_phone_verified = True
            user.save(update_fields=['is_phone_verified'])
        return user, created

    @staticmethod
    def register_user(full_name, phone_number, email, password, role='donor'):
        if User.objects.filter(phone_number=phone_number).exists():
            raise ValueError("A user with this phone number already exists.")
        if email and User.objects.filter(email=email).exists():
            raise ValueError("A user with this email address already exists.")

        user = User.objects.create_user(
            username=phone_number,
            phone_number=phone_number,
            email=email,
            password=password,
            full_name=full_name,
            role=role,
            is_phone_verified=False,
            is_email_verified=False
        )

        # Generate initial email verification token
        if email:
            EmailVerificationService.create_verification_token(user)

        return user

class AuthService:
    @staticmethod
    def authenticate_email_or_phone(identity, password):
        # Allow login using either email or phone_number
        try:
            if '@' in identity:
                user = User.objects.get(email=identity)
            else:
                user = User.objects.get(phone_number=identity)
        except User.DoesNotExist:
            return None, "Invalid email/phone number or password."

        if not user.check_password(password):
            return None, "Invalid email/phone number or password."

        if not user.is_active:
            return None, "Account is disabled. Please contact support."

        return user, "Authentication successful."

    @staticmethod
    def issue_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }

    @staticmethod
    def logout_token(refresh_token):
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return True, "Successfully logged out."
        except Exception:
            return False, "Invalid or expired refresh token."

class PasswordResetService:
    @staticmethod
    def request_password_reset(identity):
        user = None
        if '@' in identity:
            user = User.objects.filter(email=identity).first()
        else:
            user = User.objects.filter(phone_number=identity).first()

        if not user:
            # Silent return to avoid user enumeration
            return True, "If an account exists, a password reset link/token has been issued."

        # Invalidate existing unused tokens
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

        token_str = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=1)
        reset_token = PasswordResetToken.objects.create(
            user=user,
            token=token_str,
            expires_at=expires_at
        )
        return True, reset_token.token

    @staticmethod
    def reset_password(token_str, new_password):
        try:
            token_obj = PasswordResetToken.objects.get(token=token_str, is_used=False)
            if not token_obj.is_valid():
                return False, "Password reset token has expired or already been used."

            user = token_obj.user
            user.set_password(new_password)
            user.save()

            token_obj.is_used = True
            token_obj.save(update_fields=['is_used'])

            return True, "Password reset successfully. You may now log in with your new password."
        except PasswordResetToken.DoesNotExist:
            return False, "Invalid password reset token."

class EmailVerificationService:
    @staticmethod
    def create_verification_token(user):
        EmailVerificationToken.objects.filter(user=user, is_used=False).update(is_used=True)
        token_str = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(days=3)
        token_obj = EmailVerificationToken.objects.create(
            user=user,
            token=token_str,
            expires_at=expires_at
        )
        return token_obj.token

    @staticmethod
    def verify_email(token_str):
        try:
            token_obj = EmailVerificationToken.objects.get(token=token_str, is_used=False)
            if not token_obj.is_valid():
                return False, "Verification token has expired or been used."

            user = token_obj.user
            user.is_email_verified = True
            user.is_verified = True
            user.save(update_fields=['is_email_verified', 'is_verified'])

            token_obj.is_used = True
            token_obj.save(update_fields=['is_used'])

            return True, "Email verified successfully."
        except EmailVerificationToken.DoesNotExist:
            return False, "Invalid verification token."
