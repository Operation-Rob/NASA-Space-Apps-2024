// components/SavePinsModal.tsx
"use client";

import React, { useState } from "react";
import { generateMagicString } from "@/utils/pinUtils";
import { Pin } from "@/types/types";
import Modal from "./Modal";

interface SavePinsModalProps {
  pins: Pin[];
  onClose: () => void;
}

const SavePinsModal: React.FC<SavePinsModalProps> = ({ pins, onClose }) => {
  const magicString = generateMagicString(pins);
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(magicString).then(() => {
      setCopySuccess("Copied to clipboard!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const footer = (
    <div className="flex justify-end">
      <button
        className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition-colors mr-2"
        onClick={handleCopy}
      >
        Copy
      </button>
      <button
        className="bg-gray-500 text-white py-1 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );

  return (
    <Modal onClose={onClose} title="Save Pins" footer={footer}>
      <p className="mb-2">Copy the magic string below to save your pins:</p>
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded"
        readOnly
        value={magicString}
      ></textarea>
      {copySuccess && <div className="text-green-500 text-sm mt-2">{copySuccess}</div>}
    </Modal>
  );
};

export default SavePinsModal;
