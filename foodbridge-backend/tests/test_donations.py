import pytest
from django.utils import timezone
from datetime import timedelta
from apps.accounts.services import UserService
from apps.donors.services import DonorService
from apps.donations.services import DonationService

@pytest.mark.django_db
def test_donation_creation_and_meal_estimation():
    user, _ = UserService.get_or_create_user("+12025550177", full_name="Bakery Donor", role="donor")
    donor_profile, _ = DonorService.get_or_create_profile(user, organization_name="Fresh Bakery")

    perishability = timezone.now() + timedelta(hours=4)
    donation = DonationService.create_donation(
        donor_profile=donor_profile,
        food_type="Bread & Pastries",
        quantity_kg=14.0,
        perishability_window=perishability,
        pickup_address="123 Main St",
        latitude=37.7749,
        longitude=-122.4194
    )

    assert donation.status == 'listed'
    assert donation.estimated_meals == 40  # 14 kg / 0.35 = 40 meals
    assert donation.quantity_kg == 14.0
