import uuid
from django.db import models
from django.conf import settings

NOTIFICATION_TYPE_CHOICES = (
    ('task_alert', 'Task Alert'),
    ('status_update', 'Status Update'),
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
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification [{self.notification_type}] to {self.user.full_name}: {self.title}"
