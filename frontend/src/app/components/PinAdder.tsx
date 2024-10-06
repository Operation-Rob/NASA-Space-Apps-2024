// File: app/map/components/PinAdder.tsx
import { useMapEvents } from 'react-leaflet/hooks';
import { Dispatch, SetStateAction } from 'react';
import { LatLng } from 'leaflet';
import { Pin } from '@/types/types';

interface PinAdderProps {
  pins: Pin[];
  setPins: Dispatch<SetStateAction<Pin[]>>;
}

const PinAdder: React.FC<PinAdderProps> = ({ pins, setPins }) => {
  useMapEvents({
    click: (e: { latlng: LatLng }) => {
      const newPin: Pin = {
        id: pins.length + 1,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: `Location ${pins.length + 1}`,
        loading: true,
        data: null,
        error: null,
      };
      setPins((prevPins) => [...prevPins, newPin]);
    },
  });

  return null;
};

export default PinAdder;
