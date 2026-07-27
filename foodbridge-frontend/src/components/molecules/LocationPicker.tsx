import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Input } from '../atoms/Input';

export interface LocationPickerProps {
  address: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  address,
  onAddressChange,
  onCoordinatesChange,
}) => {
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setLat(newLat);
        setLng(newLng);
        onCoordinatesChange(newLat, newLng);
      });
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="font-mono text-xs uppercase tracking-wider text-ink-soft dark:text-paper-alt font-medium">
          Pickup Address & Location
        </label>
        <button
          type="button"
          onClick={handleDetectLocation}
          className="inline-flex items-center gap-1 font-mono text-xs text-teal hover:underline"
        >
          <Navigation className="w-3.5 h-3.5" /> Detect My GPS Location
        </button>
      </div>

      <Input
        placeholder="Enter street address or landmark..."
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
      />

      <div className="bg-paper-alt dark:bg-night-soft border border-line rounded-sm p-3 flex items-center gap-2 text-xs font-mono text-ink-soft">
        <MapPin className="w-4 h-4 text-amber shrink-0" />
        <span>Selected Coordinates: Latitude {lat.toFixed(4)}, Longitude {lng.toFixed(4)}</span>
      </div>
    </div>
  );
};
