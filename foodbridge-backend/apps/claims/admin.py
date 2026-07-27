from django.contrib import admin
from .models import Claim

@admin.register(Claim)
class ClaimAdmin(admin.ModelAdmin):
    list_display = ('id', 'donation', 'ngo', 'claimed_at')
    list_filter = ('claimed_at',)
    search_fields = ('ngo__organization_name', 'donation__food_type')
