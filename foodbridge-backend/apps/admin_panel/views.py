from rest_framework import generics, permissions, status
from rest_framework.response import Response
from common.permissions import IsAdminUser
from apps.ngos.models import NGOProfile
from apps.ngos.serializers import NGOProfileSerializer

class PendingNGOVerificationsView(generics.ListAPIView):
    serializer_class = NGOProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return NGOProfile.objects.filter(verification_status='pending')

class ApproveNGOView(generics.UpdateAPIView):
    queryset = NGOProfile.objects.all()
    serializer_class = NGOProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        profile.verification_status = 'approved'
        profile.user.is_verified = True
        profile.user.save()
        profile.save()
        return Response({
            'success': True,
            'message': f'NGO {profile.organization_name} approved successfully.',
            'profile': NGOProfileSerializer(profile).data
        })

class RejectNGOView(generics.UpdateAPIView):
    queryset = NGOProfile.objects.all()
    serializer_class = NGOProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        profile.verification_status = 'rejected'
        profile.user.is_verified = False
        profile.user.save()
        profile.save()
        return Response({
            'success': True,
            'message': f'NGO {profile.organization_name} rejected.',
            'profile': NGOProfileSerializer(profile).data
        })
