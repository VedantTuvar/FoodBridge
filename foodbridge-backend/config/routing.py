from django.urls import re_path
from apps.tasks.consumers import TaskTrackingConsumer
from apps.notifications.consumers import NotificationConsumer
from apps.donations.consumers import DonationStatusConsumer
from apps.notifications.chat_consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/tracking/(?P<task_id>[0-9a-f-]+)/$', TaskTrackingConsumer.as_asgi()),
    re_path(r'ws/notifications/(?P<user_id>[0-9a-f-]+)/$', NotificationConsumer.as_asgi()),
    re_path(r'ws/status/(?P<donation_id>[0-9a-f-]+)/$', DonationStatusConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<room_id>[0-9a-f-]+)/$', ChatConsumer.as_asgi()),
]
