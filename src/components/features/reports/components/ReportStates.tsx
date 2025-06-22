import React from 'react';
import { IoWarningOutline } from 'react-icons/io5';

export const LoadingState: React.FC = () => (
  <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
    <div className="p-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-t-2 border-blue-200 animate-pulse"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Memuat Report</h3>
          <p className="text-gray-600">Sedang mengumpulkan data...</p>
        </div>
      </div>
    </div>
  </div>
);

export const NoDataAlert: React.FC = () => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fade-in">
    <div className="flex items-center">
      <IoWarningOutline className="w-5 h-5 text-red-400 mr-2" />
      <div>
        <h3 className="text-sm font-medium text-red-800">
          Data Tidak Tersedia
        </h3>
        <div className="mt-2 text-sm text-red-700">
          <p>Tidak dapat menemukan data untuk periode yang dipilih. Silakan coba dengan periode yang berbeda.</p>
        </div>
      </div>
    </div>
  </div>
); 