from rest_framework import generics, permissions, views
from rest_framework.response import Response
from common.permissions import IsVolunteer
from common.utils import create_geography_point
from .models import VolunteerProfile
from .serializers import VolunteerProfileSerializer, AvailabilityToggleSerializer

class VolunteerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_object(self):
        profile, created = VolunteerProfile.objects.get_or_create(
            user=self.request.user,
            defaults={
                'vehicle_type': 'bike',
                'is_available': True,
                'current_location': create_geography_point(37.7749, -122.4194)
            }
        )
        return profile

class ToggleAvailabilityView(generics.UpdateAPIView):
    serializer_class = AvailabilityToggleSerializer
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get_object(self):
        profile, _ = VolunteerProfile.objects.get_or_create(user=self.request.user)
        return profile

class VolunteerLeaderboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        volunteers = VolunteerProfile.objects.select_related('user').order_by('-total_deliveries', '-rating_avg')[:20]
        leaderboard = []
        for idx, v in enumerate(volunteers, 1):
            deliveries = v.total_deliveries
            kg_moved = deliveries * 18.5
            points = deliveries * 50 + int(float(v.rating_avg) * 20)
            leaderboard.append({
                'rank': idx,
                'id': str(v.id),
                'user_id': str(v.user.id),
                'full_name': v.user.full_name or "Community Volunteer",
                'vehicle_type': v.vehicle_type,
                'total_deliveries': deliveries,
                'total_kg': round(kg_moved, 1),
                'rating_avg': float(v.rating_avg),
                'points': points,
                'is_current_user': v.user == request.user
            })
        return Response({'results': leaderboard})

class VolunteerBadgesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsVolunteer]

    def get(self, request):
        profile, _ = VolunteerProfile.objects.get_or_create(user=request.user)
        deliveries = profile.total_deliveries
        rating = float(profile.rating_avg)
        kg_rescued = round(deliveries * 18.5, 1)

        all_badges = [
            {
                'id': 'first_step',
                'title': 'First Mile Hero',
                'icon': '🌱',
                'description': 'Completed your 1st surplus food rescue mission',
                'req_count': 1,
                'unlocked': deliveries >= 1,
                'progress': min(100, int((deliveries / 1) * 100))
            },
            {
                'id': 'speedster',
                'title': 'Rapid Rescuer',
                'icon': '⚡',
                'description': 'Completed 5 deliveries within 30 minutes ETA',
                'req_count': 5,
                'unlocked': deliveries >= 5,
                'progress': min(100, int((deliveries / 5) * 100))
            },
            {
                'id': 'community_champion',
                'title': 'Community Champion',
                'icon': '🛡️',
                'description': 'Completed 10 successful pickup & delivery missions',
                'req_count': 10,
                'unlocked': deliveries >= 10,
                'progress': min(100, int((deliveries / 10) * 100))
            },
            {
                'id': 'heavy_lifter',
                'title': 'Heavy Hauler',
                'icon': '📦',
                'description': 'Rescued over 100 kg of edible surplus food',
                'req_count': 100,
                'unlocked': kg_rescued >= 100,
                'progress': min(100, int((kg_rescued / 100) * 100))
            },
            {
                'id': 'five_star_elite',
                'title': '5-Star Elite',
                'icon': '⭐',
                'description': 'Maintained a rating of 4.8+ across deliveries',
                'req_count': 4.8,
                'unlocked': rating >= 4.8 and deliveries >= 3,
                'progress': 100 if rating >= 4.8 and deliveries >= 3 else 60
            },
            {
                'id': 'legend',
                'title': 'FoodBridge Legend',
                'icon': '🏆',
                'description': 'Reached 50 completed rescue missions',
                'req_count': 50,
                'unlocked': deliveries >= 50,
                'progress': min(100, int((deliveries / 50) * 100))
            }
        ]

        certificate = {
            'certificate_id': f"CERT-FB-{str(profile.id)[:8].upper()}",
            'issue_date': profile.created_at.strftime('%Y-%m-%d'),
            'volunteer_name': profile.user.full_name,
            'total_deliveries': deliveries,
            'total_kg_rescued': kg_rescued,
            'estimated_meals_served': int(kg_rescued * 2.5),
            'verified_by': 'FoodBridge Governance & Impact Board'
        }

        return Response({
            'badges': all_badges,
            'certificate': certificate,
            'stats': {
                'total_deliveries': deliveries,
                'total_kg_rescued': kg_rescued,
                'rating_avg': rating,
                'points': deliveries * 50 + int(rating * 20)
            }
        })

