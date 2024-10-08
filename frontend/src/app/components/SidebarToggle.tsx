// components/SidebarToggle.tsx
"use client";

interface SidebarToggleProps {
  isOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarToggle({
  isOpen,
  setIsSidebarOpen,
}: SidebarToggleProps) {
  return (
    <button
      className="fixed top-4 left-4 z-50 md:hidden bg-white bg-opacity-90 p-2 rounded-full shadow-md focus:outline-none"
      onClick={() => setIsSidebarOpen(!isOpen)}
    >
      {/* Hamburger icon */}
      <div className="space-y-1">
        <span className="block w-6 h-0.5 bg-black"></span>
        <span className="block w-6 h-0.5 bg-black"></span>
        <span className="block w-6 h-0.5 bg-black"></span>
      </div>
    </button>
  );
}
