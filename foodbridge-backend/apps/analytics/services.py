from django.db.models import Sum
from .models import ImpactMetric
from apps.donations.models import Donation
from common.utils import calculate_co2_avoided

class ImpactService:
    @staticmethod
    def recalculate_user_impact(user):
        metric, _ = ImpactMetric.objects.get_or_create(user=user)
        
        if user.role == 'donor' and hasattr(user, 'donor_profile'):
            donations = Donation.objects.filter(
                donor=user.donor_profile,
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

        return metric
