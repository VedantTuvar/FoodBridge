from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from common.permissions import IsDonor
from .models import Donation, RecurringDonationSchedule, DonationImageUpload
from .serializers import DonationSerializer, RecurringDonationScheduleSerializer, DonationImageUploadSerializer
from .services import DonationService, RecurringDonationService

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

class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        DonationService.delete_donation(instance)

class CancelDonationView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def patch(self, request, pk):
        try:
            donation = Donation.objects.get(pk=pk, donor=request.user.donor_profile)
            updated = DonationService.cancel_donation(donation)
            return Response({
                'success': True,
                'message': 'Donation cancelled successfully.',
                'donation': DonationSerializer(updated).data
            })
        except Donation.DoesNotExist:
            return Response({'success': False, 'message': 'Donation not found.'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as exc:
            return Response({'success': False, 'message': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

class RecurringScheduleListCreateView(generics.ListCreateAPIView):
    serializer_class = RecurringDonationScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def get_queryset(self):
        return RecurringDonationSchedule.objects.filter(donor=self.request.user.donor_profile)

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user.donor_profile)

class RecurringScheduleDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = RecurringDonationScheduleSerializer
    permission_classes = [permissions.IsAuthenticated, IsDonor]

    def get_queryset(self):
        return RecurringDonationSchedule.objects.filter(donor=self.request.user.donor_profile)

class DonationImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsDonor]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file_obj = request.FILES.get('image')
        if not file_obj:
            return Response({'success': False, 'message': 'No image file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        image_url = DonationService.upload_image(file_obj)
        return Response({
            'success': True,
            'image_url': image_url
        }, status=status.HTTP_201_CREATED)
