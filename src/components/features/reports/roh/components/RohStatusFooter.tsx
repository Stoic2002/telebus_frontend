import React from 'react';
import { IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';

interface RohStatusFooterProps {
  data: {
    content: {
      estimasiVolumeWadukSetelahOperasi: number;
      targetELevasiHariIni: number;
    };
  };
}

const RohStatusFooter: React.FC<RohStatusFooterProps> = ({ data }) => {
  const isOperationOk = data.content.estimasiVolumeWadukSetelahOperasi > data.content.targetELevasiHariIni;

  return (
    <>
      {/* Status Indicator */}
      <div className="mt-6">
        <div 
          className={`p-6 text-center text-white font-bold text-xl rounded-xl ${
            isOperationOk
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            {isOperationOk ? (
              <>
                <IoCheckmarkCircleOutline className="w-8 h-8" />
                <span>OPERATION STATUS: OK</span>
              </>
            ) : (
              <>
                <IoWarningOutline className="w-8 h-8" />
                <span>OPERATION STATUS: WARNING</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 mt-6">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>Report generated on {new Date().toLocaleDateString('id-ID')}</span>
          <span>PT. PLN Indonesia Power - Unit Pembangkitan Mrica</span>
        </div>
      </div>
    </>
  );
};

export default RohStatusFooter; 