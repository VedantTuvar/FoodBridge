from rest_framework import generics, permissions
from common.permissions import IsVolunteer
from common.utils import create_geography_point
from .models import VolunteerProfile
from .serializers import VolunteerProfileSerializer, AvailabilityToggleSerializer

class VolunteerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_object(self):
        profile, created = VolunteerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'vehicle_type': 'bike',
                'is_available': True,
                'current_location': create_geography_point(0.0, 0.0)
            }
        )
        return profile

class ToggleAvailabilityView(generics.UpdateAPIView):
    serializer_class = AvailabilityToggleSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_object(self):
        return VolunteerProfile.objects.get(user=self.request.user)
