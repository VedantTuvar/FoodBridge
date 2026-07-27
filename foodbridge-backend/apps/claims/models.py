import uuid
from django.db import models
from apps.donations.models import Donation
from apps.ngos.models import NGOProfile

class Claim(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='claim')
    ngo = models.ForeignKey(NGOProfile, on_delete=models.CASCADE, related_name='claims')
    claimed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim #{self.id} on Donation {self.donation_id} by {self.ngo.organization_name}"
