from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Rating
from .serializers import RatingSerializer
from .services import RatingService

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Rating.objects.filter(rated_by=user) | Rating.objects.filter(rated_user=user)

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        rated_user = serializer.validated_data['rated_user']
        score = serializer.validated_data['score']
        comment = serializer.validated_data.get('comment', '')

        rating = RatingService.create_rating(
            task=task,
            rated_by=self.request.user,
            rated_user=rated_user,
            score=score,
            comment=comment
        )
        serializer.instance = rating
