from django.db import transaction
from .models import Claim
from apps.donations.models import Donation
from apps.tasks.models import Task
from common.utils import generate_otp_code

class ClaimService:
    @staticmethod
    def claim_donation(ngo_profile, donation_id):
        with transaction.atomic():
            # Lock the donation record to prevent race conditions from concurrent claims
            donation = Donation.objects.select_for_update().get(id=donation_id)

            if donation.status != 'listed':
                raise ValueError(f"Donation cannot be claimed. Current status: {donation.status}")

            if ngo_profile.verification_status != 'approved':
                raise ValueError("NGO must be approved by Platform Ops before claiming donations.")

            # Create Claim
            claim = Claim.objects.create(donation=donation, ngo=ngo_profile)

            # Update donation status
            donation.status = 'claimed'
            donation.save(update_fields=['status'])

            # Automatically generate associated Volunteer Task record
            task = Task.objects.create(
                donation=donation,
                status='assigned',
                otp_code=generate_otp_code(6)
            )

            return claim, task
