import React, { useState, useRef } from 'react';
import { IoDocumentTextOutline, IoWarningOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

// Import refactored components
import ReportForm from '@/components/features/reports/components/ReportForm';
import ReportDisplay from '@/components/features/reports/components/ReportDisplay';
import { LoadingState } from '@/components/features/reports/components/ReportStates';
import { useReportData } from '@/components/features/reports/hooks/useReportData';
import { downloadExcel } from '@/components/features/reports/utils';

// Components
import TmaTable from './TmaTable';
import InflowTable from './InflowTable';
import OutflowTable from './Outflow.table';
import ElevationTable from './ElevationTable';
import RtowTable from './RtowTable';
import RohTable from './RohTable';

// Types
import { RohData } from '@/types/reportTypes';

interface ReportOption {
  value: string;
  label: string;
}

const NoDataAlert = () => (
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

const ReportContent: React.FC = () => {
  // State Management
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showReport, setShowReport] = useState<boolean>(false);
  
  // Data State
  const [elevationData, setElevationData] = useState<any>(null);
  const [rtowData, setRtowData] = useState<any>(null);
  const [tmaData, setTmaData] = useState<{ content: any[] }>({ content: [] });
  const [inflowData, setInflowData] = useState<{ content: any[] }>({ content: [] });
  const [outflowData, setOutflowData] = useState<{ content: any[] }>({ content: [] });
  
  // Initial ROH Data
  const [rohData, setRohData] = useState<RohData[]>([{
    header: {
        logo: '/assets/ip-mrica-logo.png',
        judul: 'PT. PLN INDONESIA POWER'
    },
    content: {
        hariOrTanggal: '',
        estimasiInflow: 0,
        targetELevasiHariIni: 0,
        volumeTargetELevasiHariIni: 0,
        realisasiElevasi: 0,
        volumeRealisasiElevasi: 0,
        estimasiIrigasi: 0,
        estimasiDdcXTotalJamPembukaan: 0,
        ddcJam: 0,
        estimasiSpillwayTotalJamPembukaan: 0,
        spillwayJam: 0,
        totalOutflow: 0,
        estimasiVolumeWaduk: 0,
        estimasiOutflow: 0,
        estimasiElevasiWadukSetelahOperasi: 0,
        estimasiVolumeWadukSetelahOperasi: 0,
        totalDaya: 0
    }
  }]);

  // Refs
  const reportRef = useRef<HTMLDivElement>(null);

  // Custom Hook
  const {
    loading,
    hasError,
    fetchTmaData,
    fetchInflowData,
    fetchOutflowData,
    fetchElevationData,
    fetchRtowData,
    fetchDataRoh
  } = useReportData();

  // Report Options
  const reportOptions: ReportOption[] = [
    { value: 'ROH', label: 'ROH' },
    { value: 'inflow', label: 'Inflow' },
    { value: 'outflow', label: 'Outflow' },
    { value: 'TMA', label: 'TMA' },
    { value: 'elevasi', label: 'Volume efektif' },
    { value: 'rtow', label: 'RTOW' },
  ];

  const disabledReports = ['ROH', 'elevasi', 'rtow'];

  // Event Handlers
  const handleReportChange = (value: string) => {
    setSelectedReport(value);
    setStartDate('');
    setEndDate('');
    setShowReport(false);
  };

  const handleSubmit = async () => {
    let result = null;

    switch (selectedReport) {
      case 'TMA':
        if (startDate && endDate) {
          result = await fetchTmaData(startDate, endDate);
          if (result) setTmaData(result);
        }
        break;

      case 'ROH':
        if (startDate) {
          console.log('ROH: Fetching data for date:', startDate);
          console.log('ROH: Initial rohData:', rohData);
          result = await fetchDataRoh(startDate, rohData);
          console.log('ROH: fetchDataRoh result:', result);
          if (result) {
            setRohData(result);
            console.log('ROH: Data set successfully:', result);
          } else {
            console.log('ROH: No result returned from fetchDataRoh');
          }
        }
        break;

      case 'inflow':
        if (startDate && endDate) {
          result = await fetchInflowData(startDate, endDate);
          if (result) setInflowData(result);
        }
        break;

      case 'outflow':
        if (startDate && endDate) {
          result = await fetchOutflowData(startDate, endDate);
          if (result) setOutflowData(result);
        }
        break;

      case 'elevasi':
        if (startDate) {
          result = await fetchElevationData(startDate);
          if (result) setElevationData(result);
        }
        break;

      case 'rtow':
        if (startDate) {
          result = await fetchRtowData(startDate);
          if (result) setRtowData(result);
        }
        break;
    }

    setShowReport(!!result);
  };

  const handleDownloadExcel = () => {
    console.log('Download Excel - selectedReport:', selectedReport);
    console.log('Download Excel - rohData:', rohData);
    console.log('Download Excel - rohData[0]?.content:', rohData[0]?.content);
    
    downloadExcel(
      selectedReport,
      startDate,
      endDate,
      tmaData,
      inflowData,
      outflowData,
      rohData,
      rtowData
    );
  };

  // Validation
  const isSubmitDisabled = selectedReport === 'ROH'
    ? !startDate
    : selectedReport === 'elevasi' || selectedReport === 'rtow'
    ? !startDate
    : !selectedReport || !startDate || !endDate;

  const isDownloadDisabled = !showReport || selectedReport === 'elevasi';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">

          {/* Form Section */}
          <ReportForm
            selectedReport={selectedReport}
            startDate={startDate}
            endDate={endDate}
            isSubmitDisabled={isSubmitDisabled}
            isDownloadDisabled={isDownloadDisabled}
            onReportChange={handleReportChange}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSubmit={handleSubmit}
            onDownloadExcel={handleDownloadExcel}
          />
        </div>

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {hasError && <NoDataAlert />}

        {/* Report Display */}
        {showReport && selectedReport && !hasError && (
          <div ref={reportRef}>
            <ReportDisplay
              selectedReport={selectedReport}
              showReport={showReport}
              hasError={hasError}
              rohData={rohData}
              tmaData={tmaData}
              inflowData={inflowData}
              outflowData={outflowData}
              elevationData={elevationData}
              rtowData={rtowData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportContent;



