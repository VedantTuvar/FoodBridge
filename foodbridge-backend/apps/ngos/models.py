import uuid
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.conf import settings

VERIFICATION_STATUS_CHOICES = (
    ('pending', 'Pending Review'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
)

class NGOProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ngo_profile')
    organization_name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending')
    verification_document_url = models.URLField(max_length=500, null=True, blank=True)
    capacity_per_day = models.IntegerField(default=100)
    address = models.TextField()
    location = gis_models.PointField(srid=4326)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization_name} [{self.verification_status}]"
