from celery import shared_task
from .services import NotificationService

@shared_task(queue='notifications')
def dispatch_push_notification(user_id, title, body, payload=None):
    return NotificationService.send_push_notification(user_id, title, body, payload)

@shared_task(queue='notifications')
def dispatch_sms_otp(phone_number, otp_code):
    return NotificationService.send_sms_otp(phone_number, otp_code)
