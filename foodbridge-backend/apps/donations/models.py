import uuid
from django.db import models
from django.contrib.gis.db import models as gis_models
from apps.donors.models import DonorProfile

DONATION_STATUS_CHOICES = (
    ('listed', 'Listed'),
    ('claimed', 'Claimed'),
    ('assigned', 'Assigned'),
    ('picked_up', 'Picked Up'),
    ('in_transit', 'In Transit'),
    ('delivered', 'Delivered'),
    ('confirmed', 'Confirmed'),
    ('closed', 'Closed'),
    ('cancelled', 'Cancelled'),
    ('expired', 'Expired'),
)

class Donation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='donations')
    food_type = models.CharField(max_length=100)
    quantity_kg = models.DecimalField(max_digits=8, decimal_places=2)
    estimated_meals = models.IntegerField()
    perishability_window = models.DateTimeField()
    pickup_address = models.TextField()
    pickup_location = gis_models.PointField(srid=4326)
    status = models.CharField(max_length=20, choices=DONATION_STATUS_CHOICES, default='listed')
    images = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'perishability_window']),
        ]

    def __str__(self):
        return f"{self.food_type} ({self.quantity_kg} kg) - {self.status}"
