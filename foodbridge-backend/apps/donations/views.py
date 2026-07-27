from rest_framework import generics, permissions, status
from rest_framework.response import Response
from common.permissions import IsDonor
from .models import Donation
from .serializers import DonationSerializer

class DonationListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'donor' and hasattr(user, 'donor_profile'):
            return Donation.objects.filter(donor=user.donor_profile)
        return Donation.objects.filter(status='listed')

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user.donor_profile)

class DonationDetailView(generics.RetrieveAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

class CancelDonationView(generics.UpdateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def update(self, request, *args, **kwargs):
        donation = self.get_object()
        if donation.status in ['picked_up', 'in_transit', 'delivered', 'closed']:
            return Response({
                'success': False,
                'message': 'Cannot cancel donation once pickup has occurred.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        donation.status = 'cancelled'
        donation.save()
        return Response({
            'success': True,
            'message': 'Donation cancelled successfully.',
            'donation': DonationSerializer(donation).data
        })
