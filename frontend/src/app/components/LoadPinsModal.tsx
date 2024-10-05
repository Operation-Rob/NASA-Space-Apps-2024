// components/LoadPinsModal.tsx
"use client";

import React, { useState } from "react";
import { loadPinsFromMagicString } from "@/utils/pinUtils";
import { Pin } from "@/types/types";
import Modal from "./Modal";

interface LoadPinsModalProps {
  onClose: () => void;
  onLoadPins: (pins: Pin[]) => void;
}

const LoadPinsModal: React.FC<LoadPinsModalProps> = ({ onClose, onLoadPins }) => {
  const [inputString, setInputString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoad = () => {
    const loadedPins = loadPinsFromMagicString(inputString);
    if (loadedPins) {
      onLoadPins(loadedPins);
      onClose();
    } else {
      setErrorMessage("Invalid magic string");
    }
  };

  const footer = (
    <div className="flex justify-end">
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
  );

  return (
    <Modal onClose={onClose} title="Load Pins" footer={footer}>
      <p className="mb-2">Paste your magic string below to load pins:</p>
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded"
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
      ></textarea>
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
    </Modal>
  );
};

export default LoadPinsModal;
