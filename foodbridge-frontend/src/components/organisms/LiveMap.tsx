import React, { useState } from 'react';
import { Navigation, MapPin, Building, Truck, Compass } from 'lucide-react';

export interface MarkerLocation {
  lat: number;
  lng: number;
  title: string;
  address?: string;
}

export interface LiveMapProps {
  pickupLocation?: MarkerLocation;
  deliveryLocation?: MarkerLocation;
  driverLocation?: { lat: number; lng: number; speed?: number; heading?: number; etaMinutes?: number } | null;
  radiusKm?: number;
  height?: string;
  interactive?: boolean;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  pickupLocation = { lat: 28.6139, lng: 77.2090, title: 'Grand Hyatt Catering', address: '100 Luxury Avenue' },
  deliveryLocation = { lat: 28.6350, lng: 77.2250, title: 'Hope Harvest Shelter', address: '42 Sanctuary Way' },
  driverLocation,
  radiusKm,
  height = '360px',
}) => {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  // Default driver position if not provided or static
  const activeDriverLat = driverLocation?.lat || 28.6240;
  const activeDriverLng = driverLocation?.lng || 77.2170;
  const speed = driverLocation?.speed || 24;
  const eta = driverLocation?.etaMinutes || 12;

  // Convert lat/lng to SVG viewport coordinates for vector pathing
  const pickupX = 120;
  const pickupY = 240;
  const deliveryX = 480;
  const deliveryY = 80;

  // Compute interpolate driver position on route
  const driverX = 260;
  const driverY = 160;

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)', backgroundColor: mapType === 'street' ? '#f4f1ea' : '#10201d' }}>
      
      {/* Map Control Overlay */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600, background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          🗺 {mapType === 'street' ? 'Satellite View' : 'Street View'}
        </button>
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.2, 1.6))}
          style={{ padding: '6px 10px', fontSize: '14px', background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          +
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))}
          style={{ padding: '6px 10px', fontSize: '14px', background: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          -
        </button>
      </div>

      {/* Real-time Telemetry HUD Overlay */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(16, 32, 29, 0.88)', color: '#fff', padding: '10px 14px', borderRadius: '6px', backdropFilter: 'blur(4px)', fontSize: '13px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--amber)' }}>
          <Navigation className="w-4 h-4 animate-spin" /> LIVE DRIVER TELEMETRY
        </div>
        <div style={{ marginTop: '4px' }}>
          Speed: <strong>{speed} km/h</strong> • ETA: <strong>{eta} min</strong>
        </div>
        <div style={{ fontSize: '11px', color: '#ccc', marginTop: '2px' }}>
          GPS: {activeDriverLat.toFixed(4)}, {activeDriverLng.toFixed(4)}
        </div>
      </div>

      {/* Interactive Map Visual Engine (SVG Pathing) */}
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.3s ease', width: '100%', height: '100%' }}>
        <svg viewBox="0 0 600 320" style={{ width: '100%', height: '100%' }}>
          
          {/* Map Grid Roads */}
          <path d="M 0 100 Q 300 120 600 80" stroke={mapType === 'street' ? '#e2ded5' : '#233d36'} strokeWidth="12" fill="none" />
          <path d="M 120 0 L 120 320" stroke={mapType === 'street' ? '#e2ded5' : '#233d36'} strokeWidth="10" fill="none" />
          <path d="M 0 240 C 200 240, 400 200, 600 260" stroke={mapType === 'street' ? '#e2ded5' : '#233d36'} strokeWidth="8" fill="none" />
          <path d="M 480 0 L 480 320" stroke={mapType === 'street' ? '#e2ded5' : '#233d36'} strokeWidth="10" fill="none" />

          {/* Radius Search Circle (Optional) */}
          {radiusKm && (
            <circle
              cx={pickupX}
              cy={pickupY}
              r={radiusKm * 12}
              fill="rgba(15, 92, 86, 0.12)"
              stroke="var(--teal)"
              strokeWidth="2"
              strokeDasharray="4"
            />
          )}

          {/* Active Navigation Route Polyline */}
          <path
            d={`M ${pickupX} ${pickupY} Q 240 200 ${deliveryX} ${deliveryY}`}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="6"
            style={{ animation: 'dash 1.5s linear infinite' }}
          />

          {/* Pickup Marker (Donor) */}
          <g transform={`translate(${pickupX}, ${pickupY})`}>
            <circle r="14" fill="#0F5C56" opacity="0.3" />
            <circle r="8" fill="#0F5C56" />
            <text x="12" y="4" fontSize="12" fontWeight="bold" fill={mapType === 'street' ? '#16211D' : '#FFF'}>
              📍 Pickup: {pickupLocation.title}
            </text>
          </g>

          {/* Delivery Marker (NGO) */}
          <g transform={`translate(${deliveryX}, ${deliveryY})`}>
            <circle r="14" fill="#E2932B" opacity="0.3" />
            <circle r="8" fill="#E2932B" />
            <text x="-12" y="-12" fontSize="12" fontWeight="bold" textAnchor="end" fill={mapType === 'street' ? '#16211D' : '#FFF'}>
              🏢 NGO: {deliveryLocation.title}
            </text>
          </g>

          {/* Moving Driver Marker (Volunteer Vehicle) */}
          <g transform={`translate(${driverX}, ${driverY})`}>
            <circle r="22" fill="var(--amber)" opacity="0.25" />
            <circle r="12" fill="var(--amber)" stroke="#fff" strokeWidth="2" />
            <text x="0" y="4" fontSize="11" textAnchor="middle" fill="#fff">🛵</text>
            <text x="0" y="24" fontSize="11" fontWeight="bold" textAnchor="middle" fill={mapType === 'street' ? '#000' : '#FFF'}>
              Volunteer (In Transit)
            </text>
          </g>

        </svg>
      </div>

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
      `}</style>
    </div>
  );
};
