// components/MapComponent.tsx
"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import PinAdder from "./PinAdder";
import { Pin } from "@/types/types";
import { Icon, IconOptions, DivIcon } from "leaflet";
import { useRef } from "react";
import { Map as LeafletMap } from "leaflet";
import SearchControl from "./SearchControl"; // Import remains for desktop view

const VectorTileLayer = dynamic(() => import("./VectorTileLayer"), {
  ssr: false,
});

const CustomMarker = dynamic(() => import("./CustomMarker"), {
  ssr: false,
});

const SatelliteLayer = dynamic(() => import("./SatelliteLayer"), {
  ssr: false,
});

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
  const mapRef = useRef<{ target: LeafletMap } | null>(null);

  return (
    <div className="relative h-full w-full">
      {/* Render SearchControl outside of MapContainer for desktop */}
      {mapRef.current && (
        <div className="hidden md:block absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-xl z-50">
          <SearchControl
            latInput={latInput}
            lngInput={lngInput}
            onLatChange={setLatInput}
            onLngChange={setLngInput}
            map={mapRef.current}
          />
        </div>
      )}

      <MapContainer
        center={[0, 0]}
        zoom={3}
        className="absolute inset-0 h-full w-full z-0"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        whenReady={(mapInstance: { target: LeafletMap } | null) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <VectorTileLayer />

        {pins.map((pin) => (
          <CustomMarker
            key={pin.id}
            pin={pin}
            customIcon={customIcon}
            onDelete={(id) =>
              setPins((prevPins) => prevPins.filter((p) => p.id !== id))
            }
          />
        ))}

        <PinAdder pins={pins} setPins={setPins} />
        <SatelliteLayer
          satellites={[
            { id: "landsat_8", customIcon: satelliteIcon },
            { id: "landsat_9", customIcon: satelliteIcon },
          ]}
        />
      </MapContainer>
    </div>
  );
}
