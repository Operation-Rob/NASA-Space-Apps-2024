// components/SearchControl.tsx
"use client";

import React from "react";
import { Map as LeafletMap } from "leaflet";

interface SearchControlProps {
  latInput: string;
  lngInput: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  map?: { target: LeafletMap };
  onSearch?: () => void;
  variant?: "default" | "sidebar"; // New prop to adjust styles
}

const SearchControl: React.FC<SearchControlProps> = ({
  latInput,
  lngInput,
  onLatChange,
  onLngChange,
  map,
  onSearch,
  variant = "default",
}) => {
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (latInput && lngInput && map) {
      const lat = parseFloat(latInput);
      const lng = parseFloat(lngInput);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.target.flyTo([lat, lng], 15, { animate: true });
        if (onSearch) onSearch();
      }
    }
  };

  // Handler to stop event propagation
  const stopPropagation = (
    e: React.MouseEvent | React.WheelEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
  };

  // Adjust styles based on variant
  const containerClasses =
    variant === "sidebar"
      ? "w-full flex flex-col space-y-2"
      : "w-full p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex items-center";

  const inputClasses =
    "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  const buttonClasses =
    "bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form
      className={containerClasses}
      style={{ pointerEvents: "auto" }}
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}
      onWheel={stopPropagation}
      onTouchStart={stopPropagation}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Latitude"
        value={latInput}
        onChange={(e) => onLatChange(e.target.value)}
        className={inputClasses}
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lngInput}
        onChange={(e) => onLngChange(e.target.value)}
        className={inputClasses}
      />
      <button
        onClick={handleSearch}
        className={buttonClasses}
        style={{ width: "100%" }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchControl;
