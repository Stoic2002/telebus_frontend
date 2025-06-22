import React from 'react';
import { Loader2 } from 'lucide-react';
import { IoSaveOutline } from 'react-icons/io5';

interface ElevationSubmitButtonProps {
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

const ElevationSubmitButton: React.FC<ElevationSubmitButtonProps> = ({
  onSubmit,
  loading,
  disabled
}) => {
  return (
    <button 
      onClick={onSubmit} 
      disabled={loading || disabled}
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
          <span>Simpan Data Volume Efektif</span>
        </>
      )}
    </button>
  );
};

export default ElevationSubmitButton; 