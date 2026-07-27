from django.contrib import admin
from .models import NGOProfile
from .services import NGOService

@admin.register(NGOProfile)
class NGOProfileAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'registration_number', 'verification_status', 'capacity_per_day', 'rating_avg', 'created_at')
    list_filter = ('verification_status', 'created_at')
    search_fields = ('organization_name', 'registration_number', 'user__full_name', 'user__phone_number')
    actions = ['approve_ngos', 'reject_ngos']

    @admin.action(description='Approve selected NGOs for platform access')
    def approve_ngos(self, request, queryset):
        for profile in queryset:
            NGOService.update_verification_status(profile.id, 'approved')
        self.message_user(request, f"{queryset.count()} NGO profiles approved.")

    @admin.action(description='Reject selected NGOs')
    def reject_ngos(self, request, queryset):
        for profile in queryset:
            NGOService.update_verification_status(profile.id, 'rejected')
        self.message_user(request, f"{queryset.count()} NGO profiles rejected.")
