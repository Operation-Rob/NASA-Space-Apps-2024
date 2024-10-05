"use client";

// components/CustomMarker.js
import { Marker, Popup } from 'react-leaflet';
import { useRef } from 'react';
import { Marker as LeafletMarker } from 'leaflet'; // Import the Leaflet Marker type



import { Pin } from '@/types/types';
import { DivIcon, Icon, IconOptions } from 'leaflet';

interface CustomMarkerProps {
    pin: Pin;
    onDelete: (id: number) => void;
    customIcon: Icon<IconOptions> | DivIcon | undefined;
  }


const CustomMarker: React.FC<CustomMarkerProps> = ({ pin, onDelete, customIcon }) => {
  const markerRef = useRef<LeafletMarker>(null);

  return (
    <Marker
      ref={markerRef}
      position={[pin.lat, pin.lng]}
      icon={customIcon}
    >
      <Popup>
        {pin.name} <br />
        <button
          className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors"
          onClick={(event) => {
            event.stopPropagation(); // Prevent the map click event
            onDelete(pin.id);
          }}
        >
          Delete Pin
        </button>
      </Popup>
    </Marker>
  );
}

export default CustomMarker;