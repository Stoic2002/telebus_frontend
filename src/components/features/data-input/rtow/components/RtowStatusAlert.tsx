import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';

interface RtowStatusAlertProps {
  status: {
    type: string;
    message: string;
  };
}

const RtowStatusAlert: React.FC<RtowStatusAlertProps> = ({ status }) => {
  if (!status.message) return null;

  return (
    <Alert 
      variant={status.type === 'error' ? 'destructive' : 'default'}
      className="bg-white/80 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-2">
        {status.type === 'success' ? (
          <IoCheckmarkCircleOutline className="w-5 h-5 text-green-500" />
        ) : (
          <IoWarningOutline className="w-5 h-5 text-red-500" />
        )}
        <AlertDescription className="font-medium">{status.message}</AlertDescription>
      </div>
    </Alert>
  );
};

export default RtowStatusAlert; 