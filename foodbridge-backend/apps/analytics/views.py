from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum
from apps.donations.models import Donation
from common.utils import calculate_co2_avoided
from .models import ImpactMetric
from .serializers import ImpactMetricSerializer

class UserImpactView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        metric, created = ImpactMetric.objects.get_or_create(user=request.user)
        return Response({'success': True, 'impact': ImpactMetricSerializer(metric).data})

class GlobalPlatformImpactView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        totals = Donation.objects.filter(status__in=['delivered', 'confirmed', 'closed']).aggregate(
            total_kg=Sum('quantity_kg'),
            total_meals=Sum('estimated_meals')
        )

        kg = totals['total_kg'] or 0.0
        meals = totals['total_meals'] or 0
        co2 = calculate_co2_avoided(kg)

        return Response({
            'success': True,
            'global_impact': {
                'total_kg_donated': kg,
                'total_meals_saved': meals,
                'co2_saved_kg': co2
            }
        })
