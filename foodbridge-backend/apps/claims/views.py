from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.db import transaction
from common.permissions import IsVerifiedNGO
from apps.donations.models import Donation
from apps.tasks.models import Task
from common.utils import generate_otp_code
from .models import Claim

class ClaimDonationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsVerifiedNGO]

    def post(self, request, donation_id):
        try:
            with transaction.atomic():
                donation = Donation.objects.select_for_update().get(id=donation_id)

                if donation.status != 'listed':
                    return Response({
                        'success': False,
                        'message': f'Donation cannot be claimed. Current status: {donation.status}'
                    }, status=status.HTTP_400_BAD_REQUEST)

                ngo_profile = request.user.ngo_profile
                
                # Create Claim record
                claim = Claim.objects.create(donation=donation, ngo=ngo_profile)
                
                # Update Donation status
                donation.status = 'claimed'
                donation.save()

                # Automatically generate associated Volunteer Task record
                task = Task.objects.create(
                    donation=donation,
                    status='assigned',
                    otp_code=generate_otp_code(6)
                )

                return Response({
                    'success': True,
                    'message': 'Donation claimed successfully.',
                    'claim_id': str(claim.id),
                    'task_id': str(task.id),
                    'donation_status': donation.status
                }, status=status.HTTP_201_CREATED)

        except Donation.DoesNotExist:
            return Response({'success': False, 'message': 'Donation not found.'}, status=status.HTTP_404_NOT_FOUND)
