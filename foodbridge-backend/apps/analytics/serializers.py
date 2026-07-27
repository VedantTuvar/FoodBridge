from rest_framework import serializers
from .models import ImpactMetric

class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = ('id', 'user', 'total_kg_donated', 'total_meals_estimated', 'co2_saved_kg', 'updated_at')
        read_only_fields = ('id', 'user', 'updated_at')
