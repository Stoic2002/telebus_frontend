import React from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import TmaTable from '../../../report/TmaTable';
import InflowTable from '../../../report/InflowTable';
import OutflowTable from '../../../report/Outflow.table';
import ElevationTable from '../../../report/ElevationTable';
import RtowTable from '../../../report/RtowTable';
import RohTable from '../../../report/RohTable';

interface ReportDisplayProps {
  selectedReport: string;
  showReport: boolean;
  hasError: boolean;
  tmaData: { content: any[] };
  inflowData: { content: any[] };
  outflowData: { content: any[] };
  elevationData: any;
  rtowData: any;
  rohData: any[];
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({
  selectedReport,
  showReport,
  hasError,
  tmaData,
  inflowData,
  outflowData,
  elevationData,
  rtowData,
  rohData
}) => {
  if (!showReport || !selectedReport || hasError) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4">
        <div className="w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-3"></div>
        <div className="flex items-center space-x-3">
          <IoCheckmarkCircleOutline className="w-7 h-7 text-white" />
          <h3 className="text-xl font-bold text-white">Report Generated Successfully</h3>
        </div>
      </div>
      <div className="p-0">
        {selectedReport === 'ROH' && rohData && rohData.length > 0 && (
          <RohTable rohData={rohData} />
        )}
        {selectedReport === 'TMA' && tmaData.content && tmaData.content.length > 0 && (
          <TmaTable tmaData={tmaData.content} />
        )}
        {selectedReport === 'inflow' && inflowData.content && inflowData.content.length > 0 && (
          <InflowTable inflowData={inflowData.content} />
        )}
        {selectedReport === 'outflow' && outflowData.content && outflowData.content.length > 0 && (
          <OutflowTable outflowData={outflowData.content} />
        )}
        {selectedReport === 'elevasi' && elevationData && (
          <ElevationTable report={elevationData} />
        )}
        {selectedReport === 'rtow' && rtowData && (
          <RtowTable rtowData={rtowData} />
        )}
      </div>
    </div>
  );
};

export default ReportDisplay; 