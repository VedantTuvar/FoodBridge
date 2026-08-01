import { useEffect, useState } from 'react';

export interface StatusUpdateEvent {
  donationId: string;
  status: string;
  message?: string;
  timestamp?: string;
}

export const useLiveStatusSocket = (donationId?: string) => {
  const [liveStatus, setLiveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!donationId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8000';
    const wsUrl = `${protocol}//${host}/ws/status/${donationId}/`;

    try {
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'STATUS_UPDATE' && data.status) {
            setLiveStatus(data.status);
          }
        } catch (e) {
          console.error('Status socket parse error', e);
        }
      };

      return () => {
        ws.close();
      };
    } catch {
      // Fallback
    }
  }, [donationId]);

  return { liveStatus };
};
