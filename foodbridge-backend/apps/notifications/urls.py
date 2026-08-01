from django.urls import path
from .views import (
    NotificationListView,
    UnreadNotificationCountView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    NotificationPreferencesView,
    ChatMessageListCreateView,
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('unread-count/', UnreadNotificationCountView.as_view(), name='notification-unread-count'),
    path('<uuid:pk>/read/', MarkNotificationReadView.as_view(), name='notification-mark-read'),
    path('read-all/', MarkAllNotificationsReadView.as_view(), name='notification-mark-all-read'),
    path('preferences/', NotificationPreferencesView.as_view(), name='notification-preferences'),
    path('chat/<str:room_id>/', ChatMessageListCreateView.as_view(), name='notification-chat-messages'),
]
