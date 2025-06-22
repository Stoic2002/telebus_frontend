import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';

interface UserErrorAlertProps {
  error: string | null;
  onDismiss: () => void;
}

const UserErrorAlert: React.FC<UserErrorAlertProps> = ({
  error,
  onDismiss
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fade-in">
      <div className="flex items-center">
        <IoWarningOutline className="w-5 h-5 text-red-400 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            User Management Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <button
            onClick={onDismiss}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserErrorAlert; 