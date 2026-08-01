import uuid
from django.db import models
from django.conf import settings

class ImpactMetric(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='impact_metric')
    total_kg_donated = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_meals_estimated = models.IntegerField(default=0)
    co2_saved_kg = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    water_saved_liters = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Impact ({self.user.full_name}): {self.total_meals_estimated} meals saved"

class PlatformReport(models.Model):
    REPORT_TYPES = (
        ('donation', 'Donation Activity Report'),
        ('volunteer', 'Volunteer Fleet Performance Report'),
        ('ngo', 'NGO Compliance & Claim Report'),
        ('corporate', 'Corporate CSR Compliance Report'),
        ('csr', 'ESG & Environmental Impact Audit'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    parameters = models.JSONField(default=dict)
    summary_data = models.JSONField(default=dict)
    format = models.CharField(max_length=10, default='pdf') # pdf, csv, json
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class DemandPrediction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    district = models.CharField(max_length=100)
    ngo_id = models.UUIDField(null=True, blank=True)
    predicted_demand_kg = models.DecimalField(max_digits=10, decimal_places=2)
    predicted_meals = models.IntegerField()
    confidence_score = models.FloatField(default=0.85)
    day_of_week = models.CharField(max_length=20)
    target_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-target_date']
