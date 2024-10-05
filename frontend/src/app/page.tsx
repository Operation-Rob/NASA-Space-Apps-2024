"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import SearchControl from "./components/SearchControl";
import PinAdder from "./components/PinAdder";
import L from "leaflet";
import SavePinsModal from "./components/SavePinsModal";
import LoadPinsModal from "./components/LoadPinsModal";
import { Pin } from "@/types/types";
import CustomMarker from "./components/CustomMarker";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Mock data for Landsat overlay
const landsatOverlay = {
  url: "https://example.com/landsat-overlay.png",
  bounds: [
    [90, -180],
    [-90, 180],
  ],
};

// Mock data for initial pins
const initialPins: Pin[] = [];

// Custom Pin Icon
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function LandsatMap() {
  const [pins, setPins] = useState(initialPins);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [editingPinId, setEditingPinId] = useState<null | number>(null);
  const [newName, setNewName] = useState("");

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const [hoveredPinId, setHoveredPinId] = useState<number | null>(null);

  useEffect(() => {
    // This useEffect is used to prevent any SSR issues with leaflet
    if (typeof window !== "undefined") {
      // Fix for the default Leaflet icon issue (optional)
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    }
  }, []);

  const handleEditClick = (pin: Pin) => {
    setEditingPinId(pin.id);
    setNewName(pin.name);
  };

  const handleSaveClick = (pinId: number) => {
    setPins((prevPins) =>
      prevPins.map((pin) =>
        pin.id === pinId ? { ...pin, name: newName } : pin
      )
    );
    setEditingPinId(null);
    setNewName("");
  };

  return (
    <div className="relative h-screen w-screen">
      {/* MapContainer */}
      <MapContainer
        center={[0, 0]}
        zoom={3}
        className="absolute inset-0 h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <TileLayer url={landsatOverlay.url} bounds={landsatOverlay.bounds} />

        {/* Add markers for the pins with custom icons */}
        {pins.map((pin) => (
          <CustomMarker
            key={pin.id}
            pin={pin}
            isHovered={pin.id === hoveredPinId}
            onDelete={(id) => setPins((prevPins) => prevPins.filter((p) => p.id !== id))}
            customIcon={customIcon}
          />
        ))}

        {/* Add markers for the pins with custom icons
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={customIcon}>
            <Popup>
              {pin.name} <br />
              <button
                className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors"
                onClick={(event) => {
                  event.stopPropagation(); // Stop the click event from reaching the map
                  setPins((prevPins) =>
                    prevPins.filter((p) => p.id !== pin.id)
                  );
                }}
              >
                Delete Pin
              </button>
            </Popup>
          </Marker>
        ))} */}

        {/* Components using hooks */}
        <PinAdder pins={pins} setPins={setPins} />
        <SearchControl
          latInput={latInput}
          lngInput={lngInput}
          onLatChange={setLatInput}
          onLngChange={setLngInput}
        />
      </MapContainer>

      {/* Sidebar */}
      <div className="absolute top-0 left-0 w-80 h-full p-4 flex flex-col bg-white bg-opacity-90 shadow-lg z-40">
        <h2 className="text-2xl font-bold mb-4">Your Pins</h2>
        <ul className="flex-grow overflow-auto">
          {pins.map((pin) => (
            <li
              key={pin.id}
              className={`mb-2 p-2 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center transition-colors ${
                hoveredPinId === pin.id ? "bg-gray-300" : "hover:bg-gray-100"
              }`}
              onMouseEnter={() => setHoveredPinId(pin.id)}
              onMouseLeave={() => setHoveredPinId(null)}
            >
              {editingPinId === pin.id ? (
                <div className="flex-grow mr-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded"
                  />
                </div>
              ) : (
                <div>
                  <div className="font-semibold text-gray-800">{pin.name}</div>
                  <div className="text-sm text-gray-600">
                    ({pin.lat.toFixed(2)}, {pin.lng.toFixed(2)})
                  </div>
                </div>
              )}
              {editingPinId === pin.id ? (
                <button
                  className="ml-2 bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => handleSaveClick(pin.id)}
                >
                  Save
                </button>
              ) : (
                <button
                  className="ml-2 bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onClick={() => handleEditClick(pin)}
                >
                  Edit
                </button>
              )}
              <button
                className="ml-2 bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() =>
                  setPins((prevPins) => prevPins.filter((p) => p.id !== pin.id))
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="flex space-x-2 mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsSaveModalOpen(true)}
          >
            Save Pins
          </button>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setIsLoadModalOpen(true)}
          >
            Load Pins
          </button>
        </div>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
          Subscribe
        </button>
      </div>

      {/* Modals */}
      {isSaveModalOpen && (
        <SavePinsModal pins={pins} onClose={() => setIsSaveModalOpen(false)} />
      )}
      {isLoadModalOpen && (
        <LoadPinsModal
          onClose={() => setIsLoadModalOpen(false)}
          onLoadPins={(loadedPins: Pin[]) => {
            setPins(loadedPins);
          }}
        />
      )}
    </div>
  );
}
