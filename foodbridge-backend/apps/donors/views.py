from rest_framework import generics, permissions
from common.permissions import IsDonor
from common.utils import create_geography_point
from .models import DonorProfile
from .serializers import DonorProfileSerializer

class DonorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def get_object(self):
        profile, created = DonorProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'organization_name': self.request.user.full_name,
                'address': 'Default Address',
                'location': create_geography_point(0.0, 0.0)
            }
        )
        return profile
