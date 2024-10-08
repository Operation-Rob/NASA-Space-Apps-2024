// LandsatMap.tsx
"use client";

import { useState } from "react";
import useLeaflet from "@/hooks/useLeaflet";
import MapComponent from "./components/MapComponent";
import Sidebar from "./components/Sidebar";
import SavePinsModal from "./components/SavePinsModal";
import LoadPinsModal from "./components/LoadPinsModal";
import SubscribeModal from "./components/SubscribeModal";
import SidebarToggle from "./components/SidebarToggle";
import { Pin } from "@/types/types";

export default function LandsatMap() {
  const { customIcon, satelliteIcon } = useLeaflet();

  const [pins, setPins] = useState<Pin[]>([]);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen">
      {customIcon != null && satelliteIcon != null && (
        <MapComponent
          pins={pins}
          setPins={setPins}
          customIcon={customIcon}
          satelliteIcon={satelliteIcon}
          latInput={latInput}
          lngInput={lngInput}
          setLatInput={setLatInput}
          setLngInput={setLngInput}
        />
      )}
      <Sidebar
        pins={pins}
        setPins={setPins}
        setIsSaveModalOpen={setIsSaveModalOpen}
        setIsLoadModalOpen={setIsLoadModalOpen}
        setIsSubscribeModalOpen={setIsSubscribeModalOpen}
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        latInput={latInput}
        lngInput={lngInput}
        setLatInput={setLatInput}
        setLngInput={setLngInput}
      />
      <SidebarToggle
        isOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
      {isSubscribeModalOpen && (
        <SubscribeModal
          pins={pins}
          onClose={() => setIsSubscribeModalOpen(false)}
        />
      )}
    </div>
  );
}
