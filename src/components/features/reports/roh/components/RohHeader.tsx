import React from 'react';
import { IoDocumentTextOutline, IoStatsChartOutline } from 'react-icons/io5';

interface RohHeaderProps {
  title: string;
}

const RohHeader: React.FC<RohHeaderProps> = ({ title }) => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
              <img 
                src="/assets/ip-mrica-logo.png" 
                alt="Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            
            {/* Company Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <IoDocumentTextOutline className="w-8 h-8" />
                <span>{title}</span>
              </h1>
              <div className="space-y-1 text-slate-200">
                <p className="text-xl">RENCANA OPERASI HARIAN</p>
                <p className="text-sm opacity-90">Document No: IK. MRC.03.01.05</p>
              </div>
            </div>
          </div>

          {/* Report Type Badge */}
          <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <IoStatsChartOutline className="w-6 h-6" />
              <span className="font-semibold text-lg">ROH Report</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RohHeader; 