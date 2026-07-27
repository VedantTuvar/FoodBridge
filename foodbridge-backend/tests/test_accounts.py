import pytest
from django.contrib.auth import get_user_model
from apps.accounts.services import OTPService, UserService

User = get_user_model()

@pytest.mark.django_db
def test_otp_generation_and_verification():
    phone = "+12025550199"
    otp_record = OTPService.generate_and_send_otp(phone)
    assert otp_record.code is not None
    assert len(otp_record.code) == 6

    # Test verification success
    is_valid, msg = OTPService.verify_otp(phone, otp_record.code)
    assert is_valid is True

@pytest.mark.django_db
def test_user_creation_with_role():
    phone = "+12025550188"
    user, created = UserService.get_or_create_user(phone, full_name="Test Donor", role="donor")
    assert created is True
    assert user.phone_number == phone
    assert user.role == "donor"
