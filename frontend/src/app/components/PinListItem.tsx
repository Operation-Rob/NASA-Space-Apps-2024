// components/PinListItem.tsx
"use client";

import { useState, useEffect } from "react";
import { Pin } from "@/types/types";
import { Draggable } from "@hello-pangea/dnd";
import SRDataModal from "./SRDataModal";

interface PinListItemProps {
  pin: Pin;
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  index: number;
}

export default function PinListItem({ pin, setPins, index }: PinListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(pin.name);
  const [isSRModalOpen, setIsSRModalOpen] = useState(false);

  useEffect(() => {
    if (pin.loading) {
      fetch(`/api/sr/data?lat=${pin.lat}&lng=${pin.lng}`)
        .then((response) => response.json())
        .then((data) => {
          setPins((prevPins) =>
            prevPins.map((p) =>
              p.id === pin.id ? { ...p, loading: false, data } : p
            )
          );
        })
        .catch((error) => {
          setPins((prevPins) =>
            prevPins.map((p) =>
              p.id === pin.id
                ? { ...p, loading: false, error: error.toString() }
                : p
            )
          );
        });
    }
  }, [pin.loading, pin.id, pin.lat, pin.lng, setPins]);

  const handleSave = () => {
    setPins((prevPins) =>
      prevPins.map((p) => (p.id === pin.id ? { ...p, name: newName } : p))
    );
    setIsEditing(false);
  };

  return (
    <>
      <Draggable draggableId={pin.id.toString()} index={index}>
        {(provided, snapshot) => (
          <li
            className={`mb-2 p-2 rounded-lg shadow-sm flex justify-between items-center transition-colors ${
              snapshot.isDragging ? "bg-blue-100" : "bg-gray-100"
            }`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {isEditing ? (
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
            {isEditing ? (
              <button
                className="ml-2 bg-green-500 text-white py-1 px-2 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <>
                {
                // pin.loading ? (
                //   <div className="ml-2">
                //     <svg
                //       className="animate-spin h-5 w-5 text-blue-500"
                //       xmlns="http://www.w3.org/2000/svg"
                //       fill="none"
                //       viewBox="0 0 24 24"
                //     >
                //       <circle
                //         className="opacity-25"
                //         cx="12"
                //         cy="12"
                //         r="10"
                //         stroke="currentColor"
                //         strokeWidth="4"
                //       ></circle>
                //       <path
                //         className="opacity-75"
                //         fill="currentColor"
                //         d="M4 12a8 8 0 018-8v8H4z"
                //       ></path>
                //     </svg>
                //   </div>
                // ) : pin.error ? (
                //   // Error icon or message
                //   <div className="ml-2 text-red-500">Error</div>
                // ) : 
                (
                  <button
                    className="ml-2 bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsSRModalOpen(true)}
                  >
                    Info
                  </button>
                )}
                <button
                  className="ml-2 bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() =>
                    setPins((prevPins) =>
                      prevPins.filter((p) => p.id !== pin.id)
                    )
                  }
                >
                  Delete
                </button>
              </>
            )}
          </li>
        )}
      </Draggable>
      {isSRModalOpen && (
        <SRDataModal pin={pin} onClose={() => setIsSRModalOpen(false)} />
      )}
    </>
  );
}
