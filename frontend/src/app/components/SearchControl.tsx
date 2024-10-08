// File: app/map/components/SearchControl.tsx
import React from "react";
import { Map as LeafletMap } from "leaflet";

interface SearchControlProps {
  latInput: string;
  lngInput: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  map: { 'target': LeafletMap };
}

const SearchControl: React.FC<SearchControlProps> = ({
  latInput,
  lngInput,
  onLatChange,
  onLngChange,
  map,
}) => {
  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (latInput && lngInput) {
      const lat = parseFloat(latInput);
      const lng = parseFloat(lngInput);
      if (!isNaN(lat) && !isNaN(lng)) {
        map.target.flyTo([lat, lng], 15, { animate: true });
      }
    }
  };

  // Handler to stop event propagation
  const stopPropagation = (e: React.MouseEvent | React.WheelEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-xl p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex items-center"
      style={{ zIndex: 1000, pointerEvents: "auto" }}
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
      onDoubleClick={stopPropagation}
      onWheel={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <input
        type="text"
        placeholder="Latitude"
        value={latInput}
        onChange={(e) => onLatChange(e.target.value)}
        className="flex-1 p-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lngInput}
        onChange={(e) => onLngChange(e.target.value)}
        className="flex-1 p-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </div>
  );
};

export default SearchControl;
