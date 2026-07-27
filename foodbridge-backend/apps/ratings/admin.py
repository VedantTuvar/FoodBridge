from django.contrib import admin
from .models import Rating

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'rated_by', 'rated_user', 'score', 'created_at')
    list_filter = ('score', 'created_at')
    search_fields = ('rated_by__full_name', 'rated_user__full_name', 'comment')
