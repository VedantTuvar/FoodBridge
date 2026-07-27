from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from apps.accounts.services import UserService
from apps.donors.services import DonorService
from apps.ngos.services import NGOService
from apps.volunteers.services import VolunteerService
from apps.donations.services import DonationService

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial test users, profiles, and sample donations for development.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding FoodBridge sample data...")

        # 1. Admin Superuser
        admin_user, _ = UserService.get_or_create_user(
            phone_number="+10000000000",
            full_name="Platform Admin Ops",
            role="admin"
        )
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.is_verified = True
        admin_user.save()

        # 2. Donor Profile
        donor_user, _ = UserService.get_or_create_user(
            phone_number="+12025550100",
            full_name="Grand Hotel Banquets",
            role="donor"
        )
        donor_user.is_verified = True
        donor_user.save()
        donor_profile, _ = DonorService.get_or_create_profile(
            user=donor_user,
            organization_name="Grand Hotel Banquets",
            address="100 Market St, City Center",
            latitude=37.7749,
            longitude=-122.4194,
            donor_type="hotel"
        )

        # 3. NGO Profile (Approved)
        ngo_user, _ = UserService.get_or_create_user(
            phone_number="+12025550200",
            full_name="Hope Community Shelter",
            role="ngo"
        )
        ngo_user.is_verified = True
        ngo_user.save()
        ngo_profile, _ = NGOService.get_or_create_profile(
            user=ngo_user,
            organization_name="Hope Community Shelter",
            registration_number="REG-HOPE-99",
            address="450 Shelter Way",
            latitude=37.7833,
            longitude=-122.4167
        )
        ngo_profile.verification_status = 'approved'
        ngo_profile.save()

        # 4. Volunteer Profile
        vol_user, _ = UserService.get_or_create_user(
            phone_number="+12025550300",
            full_name="Alex Rivera (Volunteer)",
            role="volunteer"
        )
        vol_user.is_verified = True
        vol_user.save()
        vol_profile, _ = VolunteerService.get_or_create_profile(
            user=vol_user,
            vehicle_type="bike",
            latitude=37.7750,
            longitude=-122.4180
        )

        # 5. Sample Listed Donation
        perishability = timezone.now() + timedelta(hours=3)
        donation = DonationService.create_donation(
            donor_profile=donor_profile,
            food_type="Wedding Event Catering Surplus (Rice, Curry, Salads)",
            quantity_kg=35.0,
            perishability_window=perishability,
            pickup_address="100 Market St, Grand Hotel Loading Dock",
            latitude=37.7749,
            longitude=-122.4194,
            images=["https://images.unsplash.com/photo-1555396273-367ea4eb4db5"]
        )

        self.stdout.write(self.style.SUCCESS(
            f"Seeded successfully!\n"
            f" - Admin User: +10000000000\n"
            f" - Donor User: +12025550100 ({donor_profile.organization_name})\n"
            f" - NGO User:   +12025550200 ({ngo_profile.organization_name})\n"
            f" - Volunteer:  +12025550300 ({vol_user.full_name})\n"
            f" - Created Donation ID: {donation.id}"
        ))
