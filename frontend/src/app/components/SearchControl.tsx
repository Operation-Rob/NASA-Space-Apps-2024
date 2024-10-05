// File: app/map/components/SearchControl.tsx
import { useMap } from 'react-leaflet/hooks';
import React from 'react';

interface SearchControlProps {
  latInput: string;
  lngInput: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
}

const SearchControl: React.FC<SearchControlProps> = ({ latInput, lngInput, onLatChange, onLngChange }) => {
  const map = useMap();

const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    if (latInput && lngInput) {
        const lat = parseFloat(latInput);
        const lng = parseFloat(lngInput);
        if (!isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], 15, { animate: true });
        }
    }
};

  return (
    <div
      className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-xl p-4 bg-white bg-opacity-90 rounded-lg shadow-lg flex items-center"
      style={{ zIndex: 1000 }} // Set zIndex higher to ensure it's above the map
    >
      <input
        type="text"
        placeholder="Latitude"
        value={latInput}
        onChange={(e) => onLatChange(e.target.value)}
        onClick={(e) => e.stopPropagation()} // Stop the click event from reaching the map
        className="flex-1 p-2 mr-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lngInput}
        onChange={(e) => onLngChange(e.target.value)}
        onClick={(e) => e.stopPropagation()} // Stop the click event from reaching the map
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
