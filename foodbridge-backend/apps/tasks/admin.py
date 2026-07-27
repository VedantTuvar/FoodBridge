from django.contrib import admin
from .models import Task, TaskLocationLog

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'donation', 'volunteer', 'status', 'pickup_time', 'delivery_time', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('donation__food_type', 'volunteer__user__full_name')

@admin.register(TaskLocationLog)
class TaskLocationLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'recorded_at')
    list_filter = ('recorded_at',)
