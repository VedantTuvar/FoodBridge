import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TaskTrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.task_id = self.scope['url_route']['kwargs']['task_id']
        self.room_group_name = f'task_{self.task_id}'

        # Join task tracking room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket (volunteer client GPS ping)
    async def receive(self, text_data):
        data = json.loads(text_data)
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        speed = data.get('speed', 0)
        eta_minutes = data.get('eta_minutes', 0)

        # Broadcast location update to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'location_update',
                'task_id': self.task_id,
                'latitude': latitude,
                'longitude': longitude,
                'speed': speed,
                'eta_minutes': eta_minutes,
            }
        )

    # Receive broadcast location update from room group
    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'LOCATION_UPDATE',
            'task_id': event['task_id'],
            'latitude': event['latitude'],
            'longitude': event['longitude'],
            'speed': event['speed'],
            'eta_minutes': event['eta_minutes'],
        }))
