from django.contrib import admin
from .models import Donation

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'food_type', 'donor', 'quantity_kg', 'estimated_meals', 'status', 'perishability_window', 'created_at')
    list_filter = ('status', 'created_at', 'perishability_window')
    search_fields = ('food_type', 'donor__organization_name', 'pickup_address')
    ordering = ('-created_at',)
