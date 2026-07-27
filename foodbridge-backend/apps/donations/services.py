from django.utils import timezone
from datetime import datetime, timedelta
from .models import Donation, RecurringDonationSchedule, DonationImageUpload
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

        notify_nearby_ngos_for_donation.delay(str(donation.id))
        return donation

    @staticmethod
    def update_donation(donation, food_type=None, quantity_kg=None, perishability_window=None, pickup_address=None, latitude=None, longitude=None, images=None):
        if donation.status != 'listed':
            raise ValueError("Only donations with 'listed' status can be modified.")

        if food_type:
            donation.food_type = food_type
        if quantity_kg:
            donation.quantity_kg = quantity_kg
            donation.estimated_meals = calculate_estimated_meals(quantity_kg)
        if perishability_window:
            donation.perishability_window = perishability_window
        if pickup_address:
            donation.pickup_address = pickup_address
        if latitude is not None and longitude is not None:
            donation.pickup_location = create_geography_point(latitude, longitude)
        if images is not None:
            donation.images = images

        donation.save()
        return donation

    @staticmethod
    def cancel_donation(donation):
        if donation.status in ['picked_up', 'in_transit', 'delivered', 'confirmed', 'closed']:
            raise ValueError("Donation cannot be cancelled after pickup has occurred.")
        donation.status = 'cancelled'
        donation.save(update_fields=['status'])
        return donation

    @staticmethod
    def delete_donation(donation):
        if donation.status in ['picked_up', 'in_transit', 'delivered', 'confirmed', 'closed']:
            raise ValueError("Cannot delete a donation after pickup has occurred.")
        donation.delete()

    @staticmethod
    def upload_image(file):
        image_obj = DonationImageUpload.objects.create(image=file)
        return image_obj.image.url

class RecurringDonationService:
    @staticmethod
    def create_schedule(donor_profile, food_type, quantity_kg, frequency, time_of_day, pickup_address, latitude, longitude):
        location = create_geography_point(latitude, longitude)
        schedule = RecurringDonationSchedule.objects.create(
            donor=donor_profile,
            food_type=food_type,
            quantity_kg=quantity_kg,
            frequency=frequency,
            time_of_day=time_of_day,
            pickup_address=pickup_address,
            pickup_location=location,
            is_active=True
        )
        return schedule

    @staticmethod
    def delete_schedule(schedule_id, donor_profile):
        schedule = RecurringDonationSchedule.objects.get(id=schedule_id, donor=donor_profile)
        schedule.delete()

    @staticmethod
    def process_due_schedules():
        # Process recurring schedules to automatically generate donation listings
        now = timezone.now()
        schedules = RecurringDonationSchedule.objects.filter(is_active=True)
        count = 0
        for s in schedules:
            perishability = now + timedelta(hours=6)
            DonationService.create_donation(
                donor_profile=s.donor,
                food_type=s.food_type,
                quantity_kg=s.quantity_kg,
                perishability_window=perishability,
                pickup_address=s.pickup_address,
                latitude=s.pickup_location.y,
                longitude=s.pickup_location.x
            )
            count += 1
        return count
