from django.contrib import admin
from .models import VolunteerProfile

@admin.register(VolunteerProfile)
class VolunteerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'vehicle_type', 'is_available', 'total_deliveries', 'rating_avg', 'created_at')
    list_filter = ('vehicle_type', 'is_available', 'created_at')
    search_fields = ('user__full_name', 'user__phone_number')
