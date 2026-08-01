import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.room_group_name = f'user_notifications_{self.user_id}'

        # Join notification room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave notification room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive broadcast notification event
    async def user_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'NOTIFICATION',
            'id': event.get('id'),
            'title': event.get('title'),
            'message': event.get('message'),
            'level': event.get('level', 'info'),
            'timestamp': event.get('timestamp'),
        }))
