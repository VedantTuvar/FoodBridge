import uuid
from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    ACTION_TYPES = (
        ('VERIFICATION_APPROVED', 'NGO/Donor Approved'),
        ('VERIFICATION_REJECTED', 'NGO/Donor Rejected'),
        ('USER_SUSPENDED', 'User Account Suspended'),
        ('USER_ACTIVATED', 'User Account Activated'),
        ('DISPUTE_RESOLVED', 'Dispute Resolved'),
        ('EMERGENCY_MODE_TOGGLED', 'Emergency Mode Toggled'),
        ('SETTING_UPDATED', 'Platform Setting Updated'),
        ('ROLE_UPDATED', 'Role Permissions Updated'),
        ('MANUAL_DISPATCH', 'Manual Task Dispatch'),
    )

    SEVERITY_LEVELS = (
        ('INFO', 'Information'),
        ('WARNING', 'Warning'),
        ('CRITICAL', 'Critical'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='admin_audit_logs')
    action = models.CharField(max_length=50, choices=ACTION_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='INFO')
    description = models.TextField()
    target_entity = models.CharField(max_length=100, null=True, blank=True)
    target_id = models.CharField(max_length=100, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.severity}] {self.action} by {self.actor} at {self.created_at}"

class Dispute(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    )

    CATEGORY_CHOICES = (
        ('non_pickup', 'Non-Pickup by Volunteer'),
        ('food_spoilage', 'Food Spoilage Issue'),
        ('quantity_mismatch', 'Quantity Mismatch'),
        ('misbehavior', 'User Misbehavior'),
        ('other', 'Other'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disputer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='filed_disputes')
    respondent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='disputes_against')
    donation_id = models.UUIDField(null=True, blank=True)
    task_id = models.UUIDField(null=True, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    subject = models.CharField(max_length=200)
    description = models.TextField()
    evidence_urls = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution_notes = models.TextField(null=True, blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_disputes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class Complaint(models.Model):
    STATUS_CHOICES = (
        ('new', 'New'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complainant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints_made')
    complaint_type = models.CharField(max_length=50) # hygiene, delay, app_bug, rating_abuse
    subject = models.CharField(max_length=200)
    details = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

class PlatformSetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField(default=dict)
    description = models.CharField(max_length=255, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key}: {self.value}"

class SystemAlert(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    message = models.TextField()
    level = models.CharField(max_length=20, choices=[('info', 'Info'), ('warning', 'Warning'), ('emergency', 'Emergency')], default='info')
    is_active = models.BooleanField(default=True)
    broadcast_to = models.CharField(max_length=50, default='all') # all, ngos, volunteers, donors
    created_at = models.DateTimeField(auto_now_add=True)
