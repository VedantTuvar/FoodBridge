from .models import VolunteerProfile
from common.utils import create_geography_point

class VolunteerService:
    @staticmethod
    def get_or_create_profile(user, vehicle_type='bike', latitude=0.0, longitude=0.0):
        location = create_geography_point(latitude, longitude)
        profile, created = VolunteerProfile.objects.get_or_create(
            user=user,
            defaults={
                'vehicle_type': vehicle_type,
                'is_available': True,
                'current_location': location
            }
        )
        return profile, created

    @staticmethod
    def update_location(volunteer_profile, latitude, longitude):
        volunteer_profile.current_location = create_geography_point(latitude, longitude)
        volunteer_profile.save(update_fields=['current_location'])
        return volunteer_profile

    @staticmethod
    def toggle_availability(volunteer_profile, is_available):
        volunteer_profile.is_available = is_available
        volunteer_profile.save(update_fields=['is_available'])
        return volunteer_profile
