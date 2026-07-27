import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (taskId) => {
  const [coordinates, setCoordinates] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!taskId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/tracking/${taskId}/`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'LOCATION_UPDATE') {
        setCoordinates({
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          etaMinutes: data.eta_minutes,
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [taskId]);

  const sendLocationUpdate = (latitude, longitude, speed = 0, etaMinutes = 0) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          latitude,
          longitude,
          speed,
          eta_minutes: etaMinutes,
        })
      );
    }
  };

  return { coordinates, sendLocationUpdate };
};
