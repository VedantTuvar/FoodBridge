import { useEffect, useState } from 'react';

export interface SocketNotification {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'emergency';
  timestamp: string;
}

export const useNotificationSocket = (userId?: string) => {
  const [latestNotification, setLatestNotification] = useState<SocketNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8000';
    const wsUrl = `${protocol}//${host}/ws/notifications/${userId}/`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'NOTIFICATION') {
            const notif: SocketNotification = {
              id: data.id || `notif-${Date.now()}`,
              title: data.title || 'Notification',
              message: data.message || '',
              level: data.level || 'info',
              timestamp: data.timestamp || new Date().toISOString(),
            };
            setLatestNotification(notif);
            setUnreadCount(prev => prev + 1);
          }
        } catch (e) {
          console.error('Notification socket parse error', e);
        }
      };

      return () => {
        ws.close();
      };
    } catch {
      // Fallback silent
    }
  }, [userId]);

  return { latestNotification, unreadCount, setUnreadCount };
};
