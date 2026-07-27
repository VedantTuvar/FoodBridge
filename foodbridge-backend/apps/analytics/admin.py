from django.contrib import admin
from .models import ImpactMetric

@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_kg_donated', 'total_meals_estimated', 'co2_saved_kg', 'updated_at')
    search_fields = ('user__full_name', 'user__phone_number')
