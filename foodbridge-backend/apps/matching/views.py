from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .services import SmartMatchingEngine

class SmartMatchingRecommendationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        quantity_kg = float(request.data.get('quantity_kg', 30.0))
        perishability_hours = float(request.data.get('perishability_hours', 3.5))
        lat = float(request.data.get('latitude', 28.6139))
        lng = float(request.data.get('longitude', 77.2090))

        candidates = SmartMatchingEngine.rank_ngo_candidates(
            donation_quantity_kg=quantity_kg,
            perishability_hours=perishability_hours,
            latitude=lat,
            longitude=lng
        )

        return Response({
            'success': True,
            'donation_parameters': {
                'quantity_kg': quantity_kg,
                'perishability_hours': perishability_hours,
            },
            'recommended_ngos': candidates
        })
