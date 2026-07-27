from django.contrib import admin
from .models import DonorProfile

@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'donor_type', 'user', 'rating_avg', 'created_at')
    list_filter = ('donor_type', 'created_at')
    search_fields = ('organization_name', 'user__full_name', 'user__phone_number', 'address')
