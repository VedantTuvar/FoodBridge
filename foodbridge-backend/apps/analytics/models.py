import uuid
from django.db import models
from django.conf import settings

class ImpactMetric(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='impact_metric')
    total_kg_donated = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_meals_estimated = models.IntegerField(default=0)
    co2_saved_kg = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Impact ({self.user.full_name}): {self.total_meals_estimated} meals saved"
