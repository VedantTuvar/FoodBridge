from celery import shared_task
from .services import MatchingService
from apps.donations.models import Donation
import logging

logger = logging.getLogger(__name__)

@shared_task(queue='high_priority')
def notify_nearby_ngos_for_donation(donation_id):
    try:
        donation = Donation.objects.get(id=donation_id)
        lat = donation.pickup_location.y
        lng = donation.pickup_location.x
        
        ngos = MatchingService.find_nearby_approved_ngos(lat, lng, radius_km=10)
        logger.info(f"Dispatched high priority push notifications to {ngos.count()} nearby NGOs for donation {donation_id}")
        return ngos.count()
    except Donation.DoesNotExist:
        logger.error(f"Donation {donation_id} not found for matching task.")
        return 0
