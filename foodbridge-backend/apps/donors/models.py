import uuid
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.conf import settings

DONOR_TYPE_CHOICES = (
    ('restaurant', 'Restaurant'),
    ('hotel', 'Hotel'),
    ('grocery', 'Grocery Store'),
    ('individual', 'Individual'),
    ('event', 'Event Host'),
    ('corporate', 'Corporate'),
)

class DonorProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='donor_profile')
    organization_name = models.CharField(max_length=255)
    donor_type = models.CharField(max_length=30, choices=DONOR_TYPE_CHOICES, default='restaurant')
    address = models.TextField()
    location = gis_models.PointField(srid=4326)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization_name} ({self.donor_type})"
