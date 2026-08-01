import logging
from django.utils import timezone
from .models import Notification, NotificationPreference

logger = logging.getLogger(__name__)

def send_push_notification(user, title, body, extra_data=None):
    """Simulates/dispatches Firebase Cloud Messaging (FCM) Push Notification"""
    logger.info(f"[FCM PUSH] Sent to User {user.id} ({user.full_name}): {title} - {body}")
    return True

def send_sms_notification(phone_number, message):
    """Simulates/dispatches Twilio SMS Notification"""
    logger.info(f"[TWILIO SMS] Sent to {phone_number}: {message}")
    return True

def send_email_notification(email, subject, html_content):
    """Simulates/dispatches SendGrid/SMTP Email Notification"""
    logger.info(f"[SENDGRID EMAIL] Sent to {email}: Subject: {subject}")
    return True

def dispatch_unified_notification(user, title, body, notification_type='system', link=None, extra_data=None):
    """
    Dispatches notifications across In-App, Push, Email, and SMS
    based on the user's explicit NotificationPreferences.
    """
    prefs, _ = NotificationPreference.objects.get_or_create(user=user)
    delivered = []

    # 1. In-App Notification (Persistent)
    if prefs.in_app_enabled:
        notif = Notification.objects.create(
            user=user,
            title=title,
            body=body,
            notification_type=notification_type,
            link=link
        )
        delivered.append('in_app')

    # 2. Push Notification
    if prefs.push_enabled:
        send_push_notification(user, title, body, extra_data)
        delivered.append('push')

    # 3. SMS Notification for urgent task alerts or delivery updates
    if prefs.sms_enabled and notification_type in ['task_alert', 'delivery_update', 'reminder']:
        send_sms_notification(user.phone_number, f"FoodBridge: {title} - {body}")
        delivered.append('sms')

    # 4. Email Notification
    if prefs.email_enabled and user.email:
        send_email_notification(user.email, title, body)
        delivered.append('email')

    if 'notif' in locals():
        notif.delivered_channels = delivered
        notif.save()

    return delivered

def send_perishability_reminder(donation):
    """Automated reminder helper when food perishability window is nearing expiry"""
    title = f"⏰ Perishability Reminder: {donation.food_type}"
    body = f"Donation listing #{donation.id} expires in 1 hour. NGO claim status: {donation.status}."
    dispatch_unified_notification(donation.donor.user, title, body, notification_type='reminder')
