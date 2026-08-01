import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Join chat room group
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

    # Receive message from WebSocket client
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        sender_name = data.get('sender_name', 'User')
        sender_role = data.get('sender_role', 'user')
        sender_id = data.get('sender_id')
        attachment_url = data.get('attachment_url')

        # Broadcast chat message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'room_id': self.room_id,
                'message': message,
                'sender_name': sender_name,
                'sender_role': sender_role,
                'sender_id': sender_id,
                'attachment_url': attachment_url,
                'timestamp': data.get('timestamp'),
            }
        )

    # Receive broadcast chat message from room group
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'CHAT_MESSAGE',
            'room_id': event['room_id'],
            'message': event['message'],
            'sender_name': event['sender_name'],
            'sender_role': event['sender_role'],
            'sender_id': event['sender_id'],
            'attachment_url': event.get('attachment_url'),
            'timestamp': event.get('timestamp'),
        }))
