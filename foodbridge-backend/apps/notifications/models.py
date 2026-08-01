import uuid
from django.db import models
from django.conf import settings

NOTIFICATION_TYPE_CHOICES = (
    ('task_alert', 'Task Alert'),
    ('status_update', 'Status Update'),
    ('delivery_update', 'Delivery Update'),
    ('reminder', 'Reminder Notification'),
    ('badge_earned', 'Badge Earned'),
    ('rating_received', 'Rating Received'),
    ('system', 'System Broadcast'),
)

class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    body = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES, default='system')
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, null=True, blank=True)
    delivered_channels = models.JSONField(default=list, blank=True) # ['in_app', 'push', 'email', 'sms']
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification [{self.notification_type}] to {self.user.full_name}: {self.title}"

class NotificationPreference(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=True)
    push_enabled = models.BooleanField(default=True)
    in_app_enabled = models.BooleanField(default=True)
    task_alerts = models.BooleanField(default=True)
    delivery_updates = models.BooleanField(default=True)
    reminders = models.BooleanField(default=True)
    marketing_promos = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"NotificationPreferences for {self.user.full_name}"

class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room_id = models.CharField(max_length=100, db_index=True) # task_id or donation_id
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_chat_messages')
    message = models.TextField()
    attachment_url = models.CharField(max_length=500, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Chat [{self.room_id}] from {self.sender.full_name}: {self.message[:30]}"
