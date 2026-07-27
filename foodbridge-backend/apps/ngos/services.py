from .models import NGOProfile
from common.utils import create_geography_point

class NGOService:
    @staticmethod
    def get_or_create_profile(user, organization_name=None, registration_number=None, address=None, latitude=0.0, longitude=0.0):
        location = create_geography_point(latitude, longitude)
        profile, created = NGOProfile.objects.get_or_create(
            user=user,
            defaults={
                'organization_name': organization_name or user.full_name,
                'registration_number': registration_number or f"REG-{user.phone_number[-6:]}",
                'address': address or 'Default NGO Address',
                'location': location,
                'verification_status': 'pending',
            }
        )
        return profile, created

    @staticmethod
    def update_verification_status(ngo_id, status_choice):
        profile = NGOProfile.objects.get(id=ngo_id)
        profile.verification_status = status_choice
        profile.user.is_verified = (status_choice == 'approved')
        profile.user.save(update_fields=['is_verified'])
        profile.save(update_fields=['verification_status'])
        return profile
