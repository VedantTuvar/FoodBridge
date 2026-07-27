from celery import shared_task
from django.utils import timezone
from .models import Donation
import logging

logger = logging.getLogger(__name__)

@shared_task
def check_expired_donations():
    now = timezone.now()
    expired_count = Donation.objects.filter(
        status='listed',
        perishability_window__lt=now
    ).update(status='expired')
    
    if expired_count > 0:
        logger.info(f"Marked {expired_count} donations as expired.")
    return expired_count
