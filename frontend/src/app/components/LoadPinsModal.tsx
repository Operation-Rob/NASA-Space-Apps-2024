// components/LoadPinsModal.js
import React, { useState } from 'react';
import { loadPinsFromMagicString } from '@/utils/pinUtils';
import { Pin } from '@/types/types';

interface LoadPinsModalProps {
    onClose: () => void;
    onLoadPins: (pins: Pin[]) => void; // Function to load pins
  }

const LoadPinsModal: React.FC<LoadPinsModalProps> = ({ onClose, onLoadPins }) => {
  const [inputString, setInputString] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoad = () => {
    const loadedPins = loadPinsFromMagicString(inputString);
    if (loadedPins) {
      onLoadPins(loadedPins);
      onClose();
    } else {
      setErrorMessage('Invalid magic string');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Load Pins</h2>
        <p className="mb-2">Paste your magic string below to load pins:</p>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded"
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
        ></textarea>
        {errorMessage && <div className="text-red-500 text-sm mb-2">{errorMessage}</div>}
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition-colors mr-2"
            onClick={handleLoad}
          >
            Load
          </button>
          <button
            className="bg-gray-500 text-white py-1 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoadPinsModal;