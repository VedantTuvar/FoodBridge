import logging

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def send_sms_otp(phone_number, otp_code):
        logger.info(f"[SMS Integration] Sending OTP {otp_code} to {phone_number}")
        return True

    @staticmethod
    def send_push_notification(user_id, title, body, payload=None):
        logger.info(f"[FCM Integration] Push to User {user_id}: '{title}' - '{body}'")
        return True

    @staticmethod
    def send_email_notification(email_address, subject, content):
        logger.info(f"[SendGrid Integration] Email to {email_address}: '{subject}'")
        return True
