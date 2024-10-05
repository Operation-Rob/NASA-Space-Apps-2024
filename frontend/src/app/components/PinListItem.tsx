// components/PinListItem.tsx
"use client";

import { useState } from "react";
import { Pin } from "@/types/types";
import { Draggable } from "@hello-pangea/dnd";

interface PinListItemProps {
  pin: Pin;
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  index: number;
}

export default function PinListItem({ pin, setPins, index }: PinListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(pin.name);

  const handleSave = () => {
    setPins((prevPins) =>
      prevPins.map((p) => (p.id === pin.id ? { ...p, name: newName } : p))
    );
    setIsEditing(false);
  };

  return (
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
            <button
              className="ml-2 bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onClick={() => setIsEditing(true)}
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
      )}
    </Draggable>
  );
}
