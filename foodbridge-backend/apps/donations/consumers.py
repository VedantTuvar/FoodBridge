import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DonationStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.donation_id = self.scope['url_route']['kwargs']['donation_id']
        self.room_group_name = f'donation_status_{self.donation_id}'

        # Join donation status room group
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

    # Broadcast donation status transition
    async def status_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'STATUS_UPDATE',
            'donation_id': event['donation_id'],
            'status': event['status'],
            'message': event.get('message', ''),
            'timestamp': event.get('timestamp'),
        }))
