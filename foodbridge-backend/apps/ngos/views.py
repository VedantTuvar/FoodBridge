from rest_framework import generics, permissions, status
from rest_framework.response import Response
from common.permissions import IsNGO
from common.utils import create_geography_point
from .models import NGOProfile
from .serializers import NGOProfileSerializer, NGOVerificationDocUploadSerializer

class NGOProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = NGOProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def get_object(self):
        profile, created = NGOProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'organization_name': self.request.user.full_name,
                'registration_number': f"REG-{self.request.user.phone_number[-6:]}",
                'address': 'Default NGO Address',
                'location': create_geography_point(0.0, 0.0)
            }
        )
        return profile

class UploadNGOVerificationDocsView(generics.UpdateAPIView):
    serializer_class = NGOVerificationDocUploadSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def get_object(self):
        return NGOProfile.objects.get(user=self.request.user)

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(verification_status='pending')
        return Response({
            'success': True,
            'message': 'Verification documents submitted. Pending admin review.',
            'profile': NGOProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)
