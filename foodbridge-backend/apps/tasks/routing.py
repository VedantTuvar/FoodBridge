from django.urls import re_path
from .consumers import TaskTrackingConsumer

websocket_urlpatterns = [
    re_path(r'ws/tracking/(?P<task_id>[0-9a-f-]+)/$', TaskTrackingConsumer.as_asgi()),
]
