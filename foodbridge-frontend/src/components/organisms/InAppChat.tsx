import React, { useEffect, useRef, useState } from 'react';
import { Send, Paperclip, MessageSquare } from 'lucide-react';
import { notificationApi, ChatMessageItem } from '../../api/notificationApi';
import { Button } from '../atoms/Button';

export interface InAppChatProps {
  roomId: string;
  roomTitle?: string;
  currentUserRole?: string;
  currentUserName?: string;
}

export const InAppChat: React.FC<InAppChatProps> = ({
  roomId,
  roomTitle = 'Mission Coordination Chat',
  currentUserRole = 'volunteer',
  currentUserName = 'You',
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickReplies = [
    "📍 I'm 5 mins away from pickup",
    "📦 Food is packed and ready!",
    "🚚 Arrived at destination shelter",
    "👍 Received, thank you!",
  ];

  useEffect(() => {
    // Load existing message history
    const loadHistory = async () => {
      const history = await notificationApi.getChatMessages(roomId);
      setMessages(history);
    };
    loadHistory();

    // Setup WebSocket connection for real-time chat room
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8000';
    const wsUrl = `${protocol}//${host}/ws/chat/${roomId}/`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => setWsConnected(true);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CHAT_MESSAGE') {
            const newMsg: ChatMessageItem = {
              id: `c-${Date.now()}`,
              room_id: data.room_id,
              sender_name: data.sender_name,
              sender_role: data.sender_role,
              message: data.message,
              attachment_url: data.attachment_url,
              created_at: data.timestamp || new Date().toISOString(),
            };
            setMessages(prev => [...prev, newMsg]);
          }
        } catch (e) {
          console.error('Chat message parse error', e);
        }
      };

      ws.onclose = () => setWsConnected(false);

      return () => {
        ws.close();
      };
    } catch {
      // Fallback mode
    }
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputText;
    if (!message.trim()) return;

    // Send via API / WebSocket broadcast
    const sentMsg = await notificationApi.sendChatMessage(roomId, message);
    setMessages(prev => [...prev, sentMsg]);
    setInputText('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        message,
        sender_name: currentUserName,
        sender_role: currentUserRole,
        timestamp: new Date().toISOString(),
      }));
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '420px',
      backgroundColor: 'var(--white)',
      border: '1px solid var(--line)',
      borderRadius: '6px',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--paper-alt)',
        borderBottom: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare className="w-5 h-5 text-teal" />
          <div>
            <strong style={{ fontSize: '14px', display: 'block' }}>{roomTitle}</strong>
            <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Room #{roomId.substring(0, 8)}</span>
          </div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px',
          backgroundColor: wsConnected ? '#e6f4ea' : '#fde8e8',
          color: wsConnected ? 'var(--green-soft)' : 'var(--amber)'
        }}>
          {wsConnected ? '● REAL-TIME CONNECTED' : 'OFFLINE MODE'}
        </span>
      </div>

      {/* Messages Stream */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={msg.id || i} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.sender_name.includes('You') ? 'flex-end' : 'flex-start'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginBottom: '2px' }}>
              <strong>{msg.sender_name}</strong> • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: 1.4,
              backgroundColor: msg.sender_name.includes('You') ? 'var(--teal)' : 'var(--paper-alt)',
              color: msg.sender_name.includes('You') ? '#FFF' : 'var(--ink)'
            }}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Replies */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--line)', backgroundColor: 'var(--paper)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {quickReplies.map((qr, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qr)}
            style={{
              padding: '4px 8px', fontSize: '11px', whiteSpace: 'nowrap', borderRadius: '12px',
              border: '1px solid var(--line)', backgroundColor: 'var(--white)', cursor: 'pointer'
            }}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--line)', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Type live message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '13px' }}
        />
        <Button size="small" variant="primary" onClick={() => handleSendMessage()}>
          Send 🚀
        </Button>
      </div>
    </div>
  );
};
