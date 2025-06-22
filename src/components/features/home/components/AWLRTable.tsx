import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusCell } from '@/components/common/tables/StatusCell';
import { formatDate } from '@/lib/utils/dateFormatter';
import { AWLRService } from '@/services/AWLR/awlr';
import { IoLayersOutline } from 'react-icons/io5';

// Types for AWLR data (preserving original structure)
interface AWLRData {
  water_level: number;
  debit: number;
  alert_waspada: number;
  alert_awas: number;
  battery: number;
  kWaktu: string;
}

interface AWLRTableProps {
  awlrData: {
    serayu?: AWLRData | null;
    merawu?: AWLRData | null;
    lumajang?: AWLRData | null;
  };
  awlrPerHourData: {
    serayu?: { debit: number } | null;
    lumajang?: { debit: number } | null;
  };
}

export const AWLRTable: React.FC<AWLRTableProps> = ({
  awlrData,
  awlrPerHourData
}) => {
  const awlrService = new AWLRService();
  
  // Extract individual values (preserving original logic)
  const { serayu: serayuValue, merawu: merawuValue, lumajang: lumajangValue } = awlrData;
  const { serayu: serayuPerHourValue, lumajang: lumajangPerHourValue } = awlrPerHourData;

  // Calculate alert status (preserved from original)
  const alertStatusSerayuValue = awlrService.getAlertStatus(
    serayuValue?.water_level ?? 0,
    serayuValue?.alert_waspada ?? 0, 
    serayuValue?.alert_awas ?? 0
  );
  const alertStatusMerawuValue = awlrService.getAlertStatus(
    merawuValue?.water_level ?? 0,
    merawuValue?.alert_waspada ?? 0, 
    merawuValue?.alert_awas ?? 0
  );
  const alertStatusLumajangValue = awlrService.getAlertStatus(
    lumajangValue?.water_level ?? 0,
    lumajangValue?.alert_waspada ?? 0, 
    lumajangValue?.alert_awas ?? 0
  );

  // River flow data (preserved from original)
  const riverFlowData = [
    { 
      sensor: 'Sungai Serayu',
      waterLevel: serayuValue?.water_level ?? "N/A", 
      inflowPerSec: serayuValue?.debit ?? "N/A", 
      inflowPerHour: serayuPerHourValue?.debit ?? "N/A", 
      status: alertStatusSerayuValue ?? "N/A",
      battery: serayuValue?.battery ?? "N/A", 
      receiveData: serayuValue ? formatDate(serayuValue.kWaktu) : "N/A" 
    },
    { 
      sensor: 'Sungai Merawu', 
      waterLevel: merawuValue?.water_level ?? "N/A", 
      inflowPerSec: merawuValue?.debit ?? "N/A", 
      inflowPerHour: 0, // Not available for Merawu (preserved logic)
      status: alertStatusMerawuValue ?? "N/A",  
      battery: merawuValue?.battery ?? "N/A",
      receiveData: merawuValue ? formatDate(merawuValue.kWaktu) : "N/A" 
    },
    { 
      sensor: 'Sungai Lumajang', 
      waterLevel: lumajangValue?.water_level ?? "N/A", 
      inflowPerSec: lumajangValue?.debit ?? "N/A", 
      inflowPerHour: lumajangPerHourValue?.debit ?? "N/A", 
      status: alertStatusLumajangValue ?? "N/A",
      battery: lumajangValue?.battery ?? "N/A", 
      receiveData: lumajangValue ? formatDate(lumajangValue.kWaktu) : "N/A" 
    },
  ];

  return (
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <CardTitle className="text-xl font-semibold">Inflow Air Sungai AWLR</CardTitle>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Real-time Data
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sensor</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Water Level (m)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Debit (m³/s)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Debit 1 jam (m³/h)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Battery (v)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Data diterima</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riverFlowData.map((reading, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-gray-900">{reading.sensor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.waterLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.inflowPerSec}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.inflowPerHour}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><StatusCell status={reading.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.battery}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.receiveData}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">
                  <div className="flex items-center space-x-2">
                    <IoLayersOutline className="text-lg" />
                    <span>Total</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-700">
                  {serayuValue && merawuValue && lumajangValue 
                    ? (serayuValue.water_level + merawuValue.water_level + lumajangValue.water_level).toFixed(2) 
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-700">
                  {serayuValue && merawuValue && lumajangValue  
                    ? (serayuValue.debit + merawuValue.debit + lumajangValue.debit).toFixed(2) 
                    : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-blue-700">
                  {serayuValue && merawuValue && lumajangValue  
                    ? (serayuValue.water_level + merawuValue.water_level + lumajangValue.water_level).toFixed(2) 
                    : "N/A"}
                </td>
                <td className="px-6 py-4"><StatusCell status="NORMAL" /></td>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={2}>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Aggregated Data</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AWLRTable; 