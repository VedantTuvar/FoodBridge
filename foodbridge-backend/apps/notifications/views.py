from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Create initial sample notifications for demonstration if user has none
        user = self.request.user
        if not Notification.objects.filter(user=user).exists():
            Notification.objects.create(
                user=user,
                title="🛵 New Surplus Pickup Nearby",
                body="30 kg of Fresh Produce listed by Golden Gate Bakery (1.2 km away).",
                notification_type="task_alert",
                link="/volunteer/tasks/nearby"
            )
            Notification.objects.create(
                user=user,
                title="🏅 Badge Unlocked: First Mile Hero",
                body="Congratulations! You earned the First Mile Hero badge for completing your first rescue mission.",
                notification_type="badge_earned",
                link="/volunteer/badges"
            )
            Notification.objects.create(
                user=user,
                title="⭐ 5-Star Review Received",
                body="Hope Kitchen shelter left a 5-star rating: 'Arrived super fast and food was in perfect condition!'",
                notification_type="rating_received",
                link="/volunteer/ratings"
            )

        return Notification.objects.filter(user=user)

class MarkNotificationReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({'success': True, 'message': 'Notification marked as read'})
        except Notification.DoesNotExist:
            return Response({'success': False, 'message': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

class MarkAllNotificationsReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'success': True, 'message': 'All notifications marked as read'})
