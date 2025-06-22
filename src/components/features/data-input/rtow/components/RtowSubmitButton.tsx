import React from 'react';
import { Loader2 } from "lucide-react";
import { IoSaveOutline } from 'react-icons/io5';

interface RTOWData {
  bulan: string;
  hari: number;
  targetElevasi: number;
}

interface RtowSubmitButtonProps {
  loading: boolean;
  formData: RTOWData[];
  onSubmit: () => void;
}

const RtowSubmitButton: React.FC<RtowSubmitButtonProps> = ({
  loading,
  formData,
  onSubmit
}) => {
  return (
    <button 
      onClick={onSubmit} 
      disabled={loading || formData.length === 0}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 text-lg font-semibold"
    >
      {loading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Menyimpan Data...</span>
        </>
      ) : (
        <>
          <IoSaveOutline className="w-6 h-6" />
          <span>Simpan Data RTOW</span>
        </>
      )}
    </button>
  );
};

export default RtowSubmitButton; 