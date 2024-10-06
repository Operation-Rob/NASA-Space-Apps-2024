// components/MapComponent.tsx
"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import PinAdder from "./PinAdder";
import SearchControl from "./SearchControl";
import { Pin } from "@/types/types";
import { Icon, IconOptions, DivIcon } from 'leaflet'; // Ensure these are imported


// Dynamically import CustomMarker with SSR disabled
const CustomMarker = dynamic(() => import("./CustomMarker"), {
  ssr: false,
});

// Dynamically import SatelliteLayer with SSR disabled
const SatelliteLayer = dynamic(() => import("./SatelliteLayer"), {
  ssr: false,
});

const GridLayer = dynamic(() => import("./GridLayer"), { ssr: false });

// Similarly, dynamically import MapContainer and TileLayer
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface MapComponentProps {
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  customIcon: Icon<IconOptions> | DivIcon | undefined;
  satelliteIcon: Icon<IconOptions> | DivIcon | undefined;
  latInput: string;
  lngInput: string;
  setLatInput: React.Dispatch<React.SetStateAction<string>>;
  setLngInput: React.Dispatch<React.SetStateAction<string>>;
}

export default function MapComponent({
  pins,
  setPins,
  customIcon,
  satelliteIcon,
  latInput,
  lngInput,
  setLatInput,
  setLngInput,
}: MapComponentProps) {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      className="absolute inset-0 h-full w-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {pins.map((pin) => (
        <CustomMarker
          key={pin.id}
          pin={pin}
          customIcon={customIcon}
          onDelete={(id) => setPins((prevPins) => prevPins.filter((p) => p.id !== id))}
        />
      ))}

      <PinAdder pins={pins} setPins={setPins} />
      <SearchControl
        latInput={latInput}
        lngInput={lngInput}
        onLatChange={setLatInput}
        onLngChange={setLngInput}
      />
      <SatelliteLayer customIcon={satelliteIcon} />
    </MapContainer>

    


  );
}
