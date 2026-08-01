import { useState, useEffect } from 'react';

export interface LocationState {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  accuracy: number;
}

export const useGeoLocation = (enabled: boolean = true) => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, [enabled]);

  return { location, error };
};
