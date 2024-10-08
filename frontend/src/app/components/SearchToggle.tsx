// components/SearchToggle.tsx
"use client";

interface SearchToggleProps {
  isSearchOpen: boolean;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchToggle({
  isSearchOpen,
  setIsSearchOpen,
}: SearchToggleProps) {
  return (
    <button
      className="fixed top-4 right-4 z-50 bg-white bg-opacity-90 p-2 rounded-full shadow-md focus:outline-none md:hidden"
      onClick={() => setIsSearchOpen(!isSearchOpen)}
    >
      {isSearchOpen ? (
        // Close icon
        <span className="text-xl">✕</span>
      ) : (
        // Search icon
        <svg
          className="h-6 w-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            cx="11"
            cy="11"
            r="8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
