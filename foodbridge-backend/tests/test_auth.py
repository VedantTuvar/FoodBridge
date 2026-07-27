import pytest
from django.contrib.auth import get_user_model
from apps.accounts.services import (
    OTPService, UserService, AuthService, PasswordResetService, EmailVerificationService
)
from common.permissions import IsDonor, IsNGO, IsVolunteer, IsCorporate, IsAdminUser, IsSuperAdmin

User = get_user_model()

@pytest.mark.django_db
def test_phone_otp_workflow():
    phone = "+12025550999"
    otp_record = OTPService.generate_and_send_otp(phone)
    assert len(otp_record.code) == 6
    assert otp_record.is_valid() is True

    # Test incorrect code attempt counter
    is_valid, msg = OTPService.verify_otp(phone, "000000")
    assert is_valid is False
    assert "2 attempts remaining" in msg

    # Test valid code verification
    is_valid, msg = OTPService.verify_otp(phone, otp_record.code)
    assert is_valid is True

@pytest.mark.django_db
def test_email_password_registration_and_login():
    email = "donor@foodbridge.org"
    phone = "+12025550888"
    password = "SuperSecurePassword123!"

    user = UserService.register_user(
        full_name="Metro Restaurant",
        phone_number=phone,
        email=email,
        password=password,
        role="donor"
    )

    assert user.email == email
    assert user.role == "donor"
    assert user.check_password(password) is True

    # Test Login with Email
    auth_user, msg = AuthService.authenticate_email_or_phone(email, password)
    assert auth_user is not None
    assert auth_user.id == user.id

    # Test Token Issuance & Refresh
    tokens = AuthService.issue_tokens(user)
    assert "access_token" in tokens
    assert "refresh_token" in tokens

@pytest.mark.django_db
def test_password_reset_workflow():
    user = UserService.register_user(
        full_name="Shelter Director",
        phone_number="+12025550777",
        email="shelter@foodbridge.org",
        password="OldPassword123!",
        role="ngo"
    )

    success, reset_token = PasswordResetService.request_password_reset("shelter@foodbridge.org")
    assert success is True
    assert reset_token is not None

    # Perform password reset
    new_password = "NewSecurePassword456!"
    success, msg = PasswordResetService.reset_password(reset_token, new_password)
    assert success is True

    # Authenticate with new password
    auth_user, _ = AuthService.authenticate_email_or_phone("shelter@foodbridge.org", new_password)
    assert auth_user is not None

@pytest.mark.django_db
def test_email_verification_workflow():
    user = UserService.register_user(
        full_name="Corporate CSR",
        phone_number="+12025550666",
        email="csr@corporate.com",
        password="CorporatePassword123!",
        role="corporate"
    )

    token = EmailVerificationService.create_verification_token(user)
    assert token is not None

    success, msg = EmailVerificationService.verify_email(token)
    assert success is True
    
    user.refresh_from_db()
    assert user.is_email_verified is True
    assert user.is_verified is True

@pytest.mark.django_db
def test_role_permission_classes():
    donor = User(role='donor')
    ngo = User(role='ngo')
    vol = User(role='volunteer')
    corp = User(role='corporate')
    admin = User(role='admin')
    superadmin = User(role='superadmin')

    class MockRequest:
        def __init__(self, u):
            self.user = u

    assert IsDonor().has_permission(MockRequest(donor), None) is True
    assert IsNGO().has_permission(MockRequest(ngo), None) is True
    assert IsVolunteer().has_permission(MockRequest(vol), None) is True
    assert IsCorporate().has_permission(MockRequest(corp), None) is True
    assert IsAdminUser().has_permission(MockRequest(admin), None) is True
    assert IsSuperAdmin().has_permission(MockRequest(superadmin), None) is True
