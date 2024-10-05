// components/CustomMarker.js
import { Marker, Popup } from 'react-leaflet';
import { useEffect, useRef } from 'react';

import { Pin } from '@/types/types';
import { DivIcon, Icon, IconOptions } from 'leaflet';

interface CustomMarkerProps {
    pin: Pin;
    isHovered: boolean;
    onDelete: (id: number) => void;
    customIcon: Icon<IconOptions> | DivIcon | undefined;
  }


const CustomMarker: React.FC<CustomMarkerProps> = ({ pin, isHovered, onDelete, customIcon }) => {
  const markerRef = useRef<typeof Marker>(null);

  useEffect(() => {
    if (isHovered && markerRef.current) {
      const markerElement = markerRef.current.getElement();
      if (markerElement) {
        markerElement.classList.add('jump');

        // Remove the 'jump' class after the animation completes
        const handleAnimationEnd = () => {
          markerElement.classList.remove('jump');
          markerElement.removeEventListener('animationend', handleAnimationEnd);
        };

        markerElement.addEventListener('animationend', handleAnimationEnd);
      }
    }
  }, [isHovered]);

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