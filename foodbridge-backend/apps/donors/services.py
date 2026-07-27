from .models import DonorProfile
from common.utils import create_geography_point

class DonorService:
    @staticmethod
    def get_or_create_profile(user, organization_name=None, address=None, latitude=0.0, longitude=0.0, donor_type='restaurant'):
        location = create_geography_point(latitude, longitude)
        profile, created = DonorProfile.objects.get_or_create(
            user=user,
            defaults={
                'organization_name': organization_name or user.full_name,
                'donor_type': donor_type,
                'address': address or 'Default Donor Address',
                'location': location,
            }
        )
        return profile, created
