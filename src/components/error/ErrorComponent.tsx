import React from 'react';

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="text-lg text-red-500">{message}</div>
      <button 
        onClick={onRetry} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  );
};

export default ErrorComponent;