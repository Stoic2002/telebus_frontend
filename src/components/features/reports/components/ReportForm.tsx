import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { IoCalendarOutline, IoFolderOutline, IoStatsChartOutline } from 'react-icons/io5';
import { Table } from 'lucide-react';

interface ReportOption {
  value: string;
  label: string;
}

interface ReportFormProps {
  selectedReport: string;
  startDate: string;
  endDate: string;
  onReportChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSubmit: () => void;
  onDownloadExcel: () => void;
  isSubmitDisabled: boolean;
  isDownloadDisabled: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({
  selectedReport,
  startDate,
  endDate,
  onReportChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onDownloadExcel,
  isSubmitDisabled,
  isDownloadDisabled
}) => {
  const reportOptions: ReportOption[] = [
    { value: 'ROH', label: 'ROH' },
    { value: 'inflow', label: 'Inflow' },
    { value: 'outflow', label: 'Outflow' },
    { value: 'TMA', label: 'TMA' },
    { value: 'elevasi', label: 'Volume efektif' },
    { value: 'rtow', label: 'RTOW' },
  ];

  const disabledReports = ['ROH', 'elevasi', 'rtow'];

  return (
    <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
      <div className="p-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Report Select */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center space-x-2">
              <IoFolderOutline className="w-4 h-4" />
              <span>Jenis Report</span>
            </label>
            <Select
              value={selectedReport}
              onValueChange={onReportChange}
            >
              <SelectTrigger className="bg-white border-gray-300 text-slate-800 font-medium">
                <SelectValue placeholder="Pilih Report" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectGroup>
                  {reportOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-slate-100">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Date Inputs */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center space-x-2">
              <IoCalendarOutline className="w-4 h-4" />
              <span>
                {selectedReport === 'elevasi' || selectedReport === 'rtow' 
                  ? 'Tahun' 
                  : selectedReport === 'ROH' 
                    ? 'Tanggal' 
                    : 'Tanggal Mulai'
                }
              </span>
            </label>
            {selectedReport === 'elevasi' || selectedReport === 'rtow' ? (
              <input
                type="number"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-slate-800 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                placeholder="Masukkan Tahun (YYYY)"
              />
            ) : (
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-slate-800 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 font-medium flex items-center space-x-2">
              <IoCalendarOutline className="w-4 h-4" />
              <span>Tanggal Akhir</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-slate-800 font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabledReports.includes(selectedReport)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={onSubmit}
              disabled={isSubmitDisabled}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <IoStatsChartOutline className="w-5 h-5" />
              <span>Generate Report</span>
            </Button>
            
            <Button 
              onClick={onDownloadExcel}
              disabled={isDownloadDisabled}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Table className="w-5 h-5" />
              <span>Download Excel</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm; 