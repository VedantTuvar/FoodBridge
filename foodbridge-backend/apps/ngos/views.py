from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from common.permissions import IsNGO
from common.utils import create_geography_point
from .models import NGOProfile, NGOFoodRequest
from .serializers import NGOProfileSerializer, NGOFoodRequestSerializer
from .services import NGOService
from apps.claims.models import Claim

class NGOProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = NGOProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def get_object(self):
        profile, created = NGOProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'organization_name': self.request.user.full_name,
                'registration_number': 'REG-PENDING',
                'address': 'Default Shelter Address',
                'location': create_geography_point(37.7749, -122.4194)
            }
        )
        return profile

class NGOVerificationUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsNGO]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file_obj = request.FILES.get('document')
        if not file_obj:
            return Response({'success': False, 'message': 'No verification document provided.'}, status=status.HTTP_400_BAD_REQUEST)

        ngo_profile = request.user.ngo_profile
        updated = NGOService.upload_verification_document(ngo_profile, file_obj)
        return Response({
            'success': True,
            'message': 'Verification document submitted successfully.',
            'profile': NGOProfileSerializer(updated).data
        }, status=status.HTTP_200_OK)

class NGOFoodRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = NGOFoodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'ngo' and hasattr(self.request.user, 'ngo_profile'):
            return NGOFoodRequest.objects.filter(ngo=self.request.user.ngo_profile)
        return NGOFoodRequest.objects.filter(is_fulfilled=False)

    def perform_create(self, serializer):
        serializer.save(ngo=self.request.user.ngo_profile)

class NGOFoodRequestDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = NGOFoodRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def get_queryset(self):
        return NGOFoodRequest.objects.filter(ngo=self.request.user.ngo_profile)

class NGOAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsNGO]

    def get(self, request):
        ngo = request.user.ngo_profile
        claims = Claim.objects.filter(ngo=ngo)
        total_claims = claims.count()
        total_meals_received = sum(c.donation.estimated_meals for c in claims if c.donation)
        total_kg_received = sum(c.donation.quantity_kg for c in claims if c.donation)

        return Response({
            'total_claims': total_claims,
            'total_meals_received': total_meals_received,
            'total_kg_received': float(total_kg_received),
            'capacity_per_day': ngo.capacity_per_day,
            'rating_avg': float(ngo.rating_avg)
        })
