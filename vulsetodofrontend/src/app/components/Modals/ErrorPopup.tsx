import React from "react";

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 z-60">
      <h2 className="text-xl font-bold text-black tracking-tighter mb-4">
        Error
      </h2>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold transition-colors duration-300 ease-in-out"
      >
        Close
      </button>
    </div>
  </div>
);

export default ErrorPopup;
