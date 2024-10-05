// components/Sidebar.tsx
"use client";

import { Pin } from "@/types/types";
import PinListItem from "./PinListItem";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

interface SidebarProps {
  pins: Pin[];
  setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
  setIsSaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubscribeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  pins,
  setPins,
  setIsSaveModalOpen,
  setIsLoadModalOpen,
  setIsSubscribeModalOpen,
}: SidebarProps) {
const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return; // Dropped outside the list
    
        const reorderedPins = Array.from(pins);
        const [movedPin] = reorderedPins.splice(result.source.index, 1);
        reorderedPins.splice(result.destination.index, 0, movedPin);
    
        setPins(reorderedPins);
      };

  return (
    <div className="absolute top-0 left-0 w-80 h-full p-4 flex flex-col bg-white bg-opacity-90 shadow-lg z-40">
      <h2 className="text-2xl font-bold mb-4">Your Pins</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="pins">
          {(provided) => (
            <ul
              className="flex-grow overflow-auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {pins.map((pin, index) => (
                <PinListItem key={pin.id} pin={pin} setPins={setPins} index={index} />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>


      <div className="flex justify-between space-x-2 mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-8 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsSaveModalOpen(true)}
        >
          Save Pins
        </button>
        <button
          className="bg-green-500 text-white py-2 px-8 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => setIsLoadModalOpen(true)}
        >
          Load Pins
        </button>
      </div>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsSubscribeModalOpen(true)}
      >
        Subscribe
      </button>
    </div>
  );
}
