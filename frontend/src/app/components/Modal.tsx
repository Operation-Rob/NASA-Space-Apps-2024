// components/Modal.tsx
"use client";

import React from "react";

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children, size = "medium", footer }) => {
  let modalWidthClass = "max-w-md";
  if (size === "small") modalWidthClass = "max-w-sm";
  if (size === "large") modalWidthClass = "max-w-3xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`bg-white rounded-lg p-6 w-full ${modalWidthClass} mx-auto`}>
        <div className="flex justify-between items-start">
          {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &#x2715;
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
