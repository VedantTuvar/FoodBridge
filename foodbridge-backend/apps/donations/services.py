from django.utils import timezone
from .models import Donation
from common.utils import create_geography_point, calculate_estimated_meals
from apps.matching.tasks import notify_nearby_ngos_for_donation

class DonationService:
    @staticmethod
    def create_donation(donor_profile, food_type, quantity_kg, perishability_window, pickup_address, latitude, longitude, images=None):
        estimated_meals = calculate_estimated_meals(quantity_kg)
        pickup_location = create_geography_point(latitude, longitude)

        donation = Donation.objects.create(
            donor=donor_profile,
            food_type=food_type,
            quantity_kg=quantity_kg,
            estimated_meals=estimated_meals,
            perishability_window=perishability_window,
            pickup_address=pickup_address,
            pickup_location=pickup_location,
            images=images or [],
            status='listed'
        )

        # Trigger high-priority Celery matching task to notify nearby approved NGOs
        notify_nearby_ngos_for_donation.delay(str(donation.id))
        return donation

    @staticmethod
    def cancel_donation(donation):
        if donation.status in ['picked_up', 'in_transit', 'delivered', 'confirmed', 'closed']:
            raise ValueError("Donation cannot be cancelled after pickup has occurred.")
        donation.status = 'cancelled'
        donation.save(update_fields=['status'])
        return donation
