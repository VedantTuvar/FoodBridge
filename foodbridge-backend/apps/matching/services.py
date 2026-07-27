from django.contrib.gis.db.models.functions import Distance
from common.utils import create_geography_point
from apps.ngos.models import NGOProfile
import logging

logger = logging.getLogger(__name__)

class MatchingService:
    @staticmethod
    def find_nearby_approved_ngos(latitude, longitude, radius_km=10):
        origin = create_geography_point(latitude, longitude)
        ngos = NGOProfile.objects.filter(
            verification_status='approved'
        ).annotate(
            distance=Distance('location', origin)
        ).filter(
            distance__lte=radius_km * 1000
        ).order_by('distance')

        logger.info(f"Found {ngos.count()} approved NGOs within {radius_km} km of coordinates ({latitude}, {longitude})")
        return ngos
