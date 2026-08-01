from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Notification, NotificationPreference, ChatMessage
from .serializers import NotificationSerializer, NotificationPreferenceSerializer, ChatMessageSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
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
                title="📦 Delivery Status Update: In Transit",
                body="Volunteer Alex Johnson has picked up donation #891 and is heading to Hope Sanctuary.",
                notification_type="delivery_update",
                link="/donor/history"
            )
            Notification.objects.create(
                user=user,
                title="⏰ Perishability Reminder",
                body="Listing #894 (Baked Goods) expires in 45 minutes.",
                notification_type="reminder",
                link="/ngo/browse"
            )
            Notification.objects.create(
                user=user,
                title="🏅 Badge Unlocked: First Mile Hero",
                body="Congratulations! You earned the First Mile Hero badge.",
                notification_type="badge_earned",
                link="/volunteer/badges"
            )

        return Notification.objects.filter(user=user)

class UnreadNotificationCountView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})

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

class NotificationPreferencesView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        prefs, _ = NotificationPreference.objects.get_or_create(user=request.user)
        return Response(NotificationPreferenceSerializer(prefs).data)

    def put(self, request):
        prefs, _ = NotificationPreference.objects.get_or_create(user=request.user)
        serializer = NotificationPreferenceSerializer(prefs, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'preferences': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChatMessageListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, room_id):
        messages = ChatMessage.objects.filter(room_id=room_id)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, room_id):
        message_text = request.data.get('message', '')
        attachment_url = request.data.get('attachment_url', '')

        if not message_text and not attachment_url:
            return Response({'error': 'Message text or attachment required.'}, status=status.HTTP_400_BAD_REQUEST)

        chat_msg = ChatMessage.objects.create(
            room_id=room_id,
            sender=request.user,
            message=message_text,
            attachment_url=attachment_url
        )
        return Response(ChatMessageSerializer(chat_msg).data, status=status.HTTP_201_CREATED)
