import React from "react";

interface SuccessMessageProps {
  message: string;
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center">
        <h3 className="text-2xl font-semibold mb-4 text-green-600">Success!</h3>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white rounded px-6 py-2 font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;
