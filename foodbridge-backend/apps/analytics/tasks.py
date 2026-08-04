from celery import shared_task
from django.contrib.auth import get_user_model
from django.db.models import Sum
from apps.donations.models import Donation
from apps.analytics.models import ImpactMetric
from common.utils import calculate_co2_avoided
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@shared_task
def aggregate_daily_impact():
    users = User.objects.filter(role__in=['donor', 'ngo', 'volunteer'])
    updated_count = 0

    for user in users:
        metric, created = ImpactMetric.objects.get_or_create(user=user)
        
        if user.role == 'donor':
            donor_profile = getattr(user, 'donor_profile', None)
            if donor_profile is None:
                continue

            donations = Donation.objects.filter(
                donor=donor_profile,
                status__in=['delivered', 'confirmed', 'closed']
            ).aggregate(
                total_kg=Sum('quantity_kg'),
                total_meals=Sum('estimated_meals')
            )
            
            kg = donations['total_kg'] or 0.0
            meals = donations['total_meals'] or 0
            
            metric.total_kg_donated = kg
            metric.total_meals_estimated = meals
            metric.co2_saved_kg = calculate_co2_avoided(kg)
            metric.save()
            updated_count += 1

    logger.info(f"Aggregated daily impact metrics for {updated_count} users.")
    return updated_count
