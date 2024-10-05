// components/SavePinsModal.js
import React, { useState } from 'react';
import { generateMagicString } from '@/utils/pinUtils';
import { Pin } from '@/types/types';

interface SavePinsModalProps {
    pins: Pin[];
    onClose: () => void;
  }

const SavePinsModal: React.FC<SavePinsModalProps> = ({ pins, onClose }) => {
  const magicString = generateMagicString(pins);
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(magicString).then(() => {
      setCopySuccess('Copied to clipboard!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Save Pins</h2>
        <p className="mb-2">Copy the magic string below to save your pins:</p>
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded"
          readOnly
          value={magicString}
        ></textarea>
        {copySuccess && <div className="text-green-500 text-sm mb-2">{copySuccess}</div>}
        <div className="flex justify-end mt-4">
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
      </div>
    </div>
  );
}

export default SavePinsModal;