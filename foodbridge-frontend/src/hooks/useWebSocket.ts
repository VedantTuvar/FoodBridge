import { useEffect, useRef, useState } from 'react';

export interface TrackingCoordinates {
  latitude: number;
  longitude: number;
  speed: number;
  heading?: number;
  etaMinutes: number;
}

export const useWebSocket = (taskId: string) => {
  const [coordinates, setCoordinates] = useState<TrackingCoordinates | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!taskId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8000';
    const wsUrl = `${protocol}//${host}/ws/tracking/${taskId}/`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'LOCATION_UPDATE') {
            setCoordinates({
              latitude: data.latitude,
              longitude: data.longitude,
              speed: data.speed || 0,
              heading: data.heading || 0,
              etaMinutes: data.eta_minutes || 0,
            });
          }
        } catch (e) {
          console.error('Error parsing WebSocket location data', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.warn('WebSocket connection fallback mode active for task', taskId);
    }
  }, [taskId]);

  const sendLocationUpdate = (latitude: number, longitude: number, speed = 0, heading = 0, etaMinutes = 0) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          latitude,
          longitude,
          speed,
          heading,
          eta_minutes: etaMinutes,
        })
      );
    }
  };

  return { coordinates, isConnected, sendLocationUpdate, setCoordinates };
};
