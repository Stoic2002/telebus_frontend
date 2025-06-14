import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IoDocumentTextOutline, IoDownloadOutline, IoCalendarOutline, IoStatsChartOutline, IoRefreshOutline, IoWarningOutline, IoFolderOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

// Shadcn UI Components
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Download, FileText, Loader2, Table } from 'lucide-react';

// Components and Data

import TmaTable from './TmaTable';
import InflowTable from './InflowTable';
import OutflowTable from './Outflow.table';
import axios from 'axios';
import ElevationTable from './ElevationTable';
import RtowTable from './RtowTable';
import html2canvas from 'html2canvas';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { error } from 'console';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import { ApiElevationData, ApiReportData, RohData } from '@/types/reportTypes';
import RohTable from './RohTable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


// Types
interface ReportOption {
  value: string;
  label: string;
}

interface ApiData {
  id: number;
  name: string;
  value: string;
  timestamp: string;
}

type FormattedHourlyData = {
  headers: string[];
  data: (string | number)[][];
};

const NoDataAlert = () => (
  <div className="bg-red-500/20 backdrop-blur-md p-6 rounded-xl border border-red-400/30 mb-6">
    <div className="flex items-center space-x-3">
      <IoWarningOutline className="w-8 h-8 text-red-400" />
      <div>
        <h3 className="text-red-300 text-lg font-semibold">Data Tidak Tersedia</h3>
        <p className="text-red-200 mt-1">Tidak dapat menemukan data untuk periode yang dipilih. Silakan coba dengan periode yang berbeda.</p>
      </div>
    </div>
  </div>
);

const ReportContent: React.FC = () => {
  // State Management
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [elevationData, setElevationData] = useState<any>(null);
  const [rtowData, setRtowData] = useState<any>(null);
  const [endDate, setEndDate] = useState<string>('');
  const [showReport, setShowReport] = useState<boolean>(false);
  const [tmaData, setTmaData] = useState<{ content: any[] }>({ content: [] });
  const [inflowData, setInflowData] = useState<{ content: any[] }>({ content: [] });
  const [outflowData, setOutflowData] = useState<{ content: any[] }>({ content: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  
  // Refs
  const reportRef = useRef<HTMLDivElement>(null);

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
        estimasiOutflow:0,
        estimasiElevasiWadukSetelahOperasi: 0,
        estimasiVolumeWadukSetelahOperasi: 0,
        totalDaya: 0
    }
}]);
// const [isLoading, setIsLoading] = useState(true);
// const [error, setError] = useState<string | null>(null);


    const fetchDataRoh = async (date: string) => {

      console.log(date)
        try {
          setLoading(true);
          setHasError(false);
            // Fetch report data
            const reportResponse = await fetchWithRetry(
              () => axios.post<ApiReportData>('http://192.168.105.90/report-data', {
                date: date
              }),
              3, // max attempts
              1000 // delay in ms
            );
            if (!reportResponse.data || Object.keys(reportResponse.data).length === 0) {
              setHasError(true);
              setShowReport(false);
              return;
            }
            const totalOutflow = (reportResponse.data.outflow.average_outflow_irigasi * 24 * 3600)  + 
                (reportResponse.data.outflow.total_outflow_ddc_m3s * 3600 * reportResponse.data.outflow.total_outflow_ddc_jam) 
                + (reportResponse.data.outflow.total_outflow_spillway_m3s * 3600 * reportResponse.data.outflow.total_outflow_spillway_jam);

            const estimasiVolumeWaduk = parseFloat(reportResponse.data.realisasiElv.volume) +
             ((parseFloat(reportResponse.data.estimationInflow.inflow_estimation)) * 3600 * 24) - 
                parseFloat(reportResponse.data.targetElv.volume) - totalOutflow;
           

            const totalDaya = ((
                estimasiVolumeWaduk -
                (reportResponse.data.outflow.average_outflow_irigasi * 24 * 3600))/4080) - 50
            // Calculate volume for elevation after operation

            const estimasiOutflow = (totalDaya * 4080)+ reportResponse.data.outflow.average_outflow_irigasi * 3600 * 24


            const volumeAfterOperation = parseFloat(reportResponse.data.realisasiElv.volume) + 
                ((parseFloat(reportResponse.data.estimationInflow.inflow_estimation))* 24 * 3600) - 
                estimasiOutflow - totalOutflow

            
              const year = date.split('-')[0];
              console.log('year',year)
            // Fetch elevation after operation
            const elevationResponse = await axios.post<ApiElevationData>('http://192.168.105.90/elevation-after', {
                volume: volumeAfterOperation.toString(),
                year: year
            });

            // function formatCustomDate(date: string | number | Date) {
            //   const options = { day: '2-digit', month: 'long', year: 'numeric' };
            //   return new Date(date).toLocaleDateString('id-ID', options );
            // }
            
            // Update state with fetched data
            setRohData([{
                ...rohData[0],
                content: {
                    ...rohData[0].content,
                    hariOrTanggal: new Date(date).toLocaleDateString('id-ID',{day:"2-digit",month:"long",year:"numeric"}),
                    estimasiInflow: parseFloat(reportResponse.data.estimationInflow.inflow_estimation),
                    targetELevasiHariIni: parseFloat(reportResponse.data.targetElv.targetElevasi),
                    volumeTargetELevasiHariIni: parseFloat(reportResponse.data.targetElv.volume),
                    realisasiElevasi: parseFloat(reportResponse.data.realisasiElv.tma_value),
                    volumeRealisasiElevasi: parseFloat(reportResponse.data.realisasiElv.volume),
                    estimasiIrigasi: reportResponse.data.outflow.average_outflow_irigasi,
                    estimasiDdcXTotalJamPembukaan: reportResponse.data.outflow.total_outflow_ddc_m3s,
                    ddcJam: reportResponse.data.outflow.total_outflow_ddc_jam,
                    estimasiSpillwayTotalJamPembukaan: reportResponse.data.outflow.total_outflow_spillway_m3s,
                    spillwayJam: reportResponse.data.outflow.total_outflow_spillway_jam,
                    estimasiElevasiWadukSetelahOperasi: parseFloat(elevationResponse.data.interpolated_elevation),
                    estimasiVolumeWadukSetelahOperasi: volumeAfterOperation,
                    totalDaya: totalDaya,
                    estimasiOutflow: estimasiOutflow,
                    estimasiVolumeWaduk:estimasiVolumeWaduk,
                }
            }]);

            setShowReport(true);
            setLoading(false)
        } catch (err) {
            // setError('Failed to fetch data');
            setHasError(true);
            setLoading(false);
        } finally {
          setLoading(false);
        }
    };



  // Fetch TMA Data from API
  const fetchTmaData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get('http://192.168.105.90/pbs-tma-h-date', {
          params: { startDate: start, endDate: end }
        }),
        3, // max attempts
        1000 // delay in ms
      );
      // console.log(start)
      // console.log(end)
      

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        setShowReport(false);
        return;
      }

      // Transform API data to match TmaTable's expected format
      const transformedData = {
        header: {
          logo: '/assets/ip-mrica-logo2.png', // Update with your default logo path
          judul: 'LAPORAN TINGGI MUKA ARI WADUK (MDPL)',
          unit: 'UNIT PEMBANGKITAN MRICA',
          periode: `${start} - ${end}`,
          lokasi: 'WADUK PLTA PB SOEDIRMAN'
        },
        content: processApiDataTma(response.data)
      };

      setTmaData({ content: [transformedData] });
      setShowReport(true);
    } catch (error) {
      setHasError(true);
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchInflowData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get('http://192.168.105.90/pbs-inflow-h-date', {
          params: { startDate: start, endDate: end }
        }),
        3, // max attempts
        1000 // delay in ms
      );


      if (!response.data || response.data.length === 0) {
        setHasError(true);
        setShowReport(false);
        return;
      }
  
      const transformedData = {
        header: {
          logo: '/assets/ip-mrica-logo2.png', 
          judul: 'LAPORAN DATA INFLOW (m3/s)',
          unit: 'UNIT PEMBANGKITAN MRICA',
          periode: `${start} - ${end}`,
          lokasi: 'WADUK PLTA PB SOEDIRMAN',
        },
        content: processApiDataInflow(response.data),
      };
  
      setInflowData({ content: [transformedData] });
      setShowReport(true);
    } catch (error) {
      setHasError(true);
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOutflowData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setHasError(false)

      const response = await fetchWithRetry(
        () => axios.get('http://192.168.105.90/pbs-outflow-h-date', {
          params: { startDate: start, endDate: end }
        }),
        3, // max attempts
        1000 // delay in ms
      );
      console.log(response)
      if (!response.data || response.data.length === 0) {
        setHasError(true);
        setShowReport(false);
        return;
      }
  
      const transformedData = {
        header: {
          logo: '/assets/ip-mrica-logo2.png',
          judul: 'LAPORAN DATA OUTFLOW (m3/s)',
          unit: 'UNIT PEMBANGKITAN MRICA',
          periode: `${start} - ${end}`,
          lokasi: 'WADUK PLTA PB SOEDIRMAN',
        },
        content: processApiDataOutflow(response.data),
      };
  
      setOutflowData({ content: [transformedData] });
      setShowReport(true);
    } catch (error) {
      setHasError(true);
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchElevationData = async (year: string) => {
    try {
      setLoading(true);
      setHasError(false);

      const response = await fetchWithRetry(
        () => axios.get(`http://192.168.105.90/elevation/${year}`),
        3, // max attempts
        1000 // delay in ms
      );
      
      if (!response.data || response.data.length === 0) {
        setHasError(true);
        setShowReport(false);
        return;
      }
      // Transformasi data sesuai dengan format yang diharapkan oleh ElevationTable
      const transformedData = {
        id: response.data.id,
        year: response.data.year,
        status: response.data.status,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        elevationData: response.data.elevationData.map((item: any) => ({
          id: item.id,
          ghwDataId: item.ghwDataId,
          elevation: item.elevation,
          volume: item.volume,
          area: item.area,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
      
      setElevationData(transformedData); // Simpan data ke state
      setShowReport(true);  // Mengembalikan data yang telah diproses
    } catch (error) {
      setHasError(true);
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRtowData = async (year: string) => {
    try {
      setLoading(true);
      setHasError(false)
      const response = await fetchWithRetry(
        () => axios.get(`http://192.168.105.90/rtow/${year}`),
        3, // max attempts
        1000 // delay in ms
      );

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        setShowReport(false);
        return;
      }
      
      // Transform the response data as needed for the RtowTable
      const transformedData = {
        id: response.data.id,
        tahun: response.data.tahun,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        data: response.data.data.map((item: any) => ({
          id: item.id,
          bulan: item.bulan,
          hari: item.hari,
          targetElevasi: item.targetElevasi,
          rtowId: item.rtowId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
      console.log('Transformed RTOW Data:', transformedData);
      setRtowData(transformedData)
      setShowReport(true); // Show the report after fetching data// Return the transformed data
    } catch (error) {
      setHasError(true);
      setShowReport(false);
    } finally {
      setLoading(false);
    }
  };
  

  // Process API data into TmaTable format
  const processApiDataTma = (apiData: ApiData[]) => {
    // Group data by date and organize by hour
    const groupedByDate: { [key: string]: { tanggal: number, item: { jam: number, tma: number }[] } } = {};

    apiData.forEach(item => {
      const date = new Date(item.timestamp);
      const tanggal = date.getDate();
      const jam = date.getHours();

      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = { tanggal, item: [] };
      }
      const filteredValue = parseFloat(item.value).toFixed(2);
      groupedByDate[tanggal].item.push({
        jam,
        tma: parseFloat(filteredValue)
      });
    });

    return Object.values(groupedByDate);
  };
  const processApiDataInflow = (apiData: ApiData[]) => {
    // Group data by date and organize by hour
    const groupedByDate: { [key: string]: { tanggal: number, item: { jam: number, inflow: number }[] } } = {};

    apiData.forEach(item => {
      const date = new Date(item.timestamp);
      const tanggal = date.getDate();
      const jam = date.getHours();

      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = { tanggal, item: [] };
      }
      // Convert to absolute value to ensure there are no negative values
      const parsedValue = parseFloat(item.value);
      const absoluteValue = Math.abs(parsedValue);
      const filteredValue = absoluteValue.toFixed(2);
      
      groupedByDate[tanggal].item.push({
        jam,
        inflow: parseFloat(filteredValue)
      });
    });

    return Object.values(groupedByDate);
  };
  const processApiDataOutflow = (apiData: ApiData[]) => {
    // Group data by date and organize by hour
    const groupedByDate: { [key: string]: { tanggal: number, item: { jam: number, outflow: number }[] } } = {};

    apiData.forEach(item => {
      const date = new Date(item.timestamp);
      const tanggal = date.getDate();
      const jam = date.getHours();

      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = { tanggal, item: [] };
      }
      const filteredValue = parseFloat(item.value).toFixed(2);
      groupedByDate[tanggal].item.push({
        jam,
        outflow: parseFloat(filteredValue)
      });
    });

    return Object.values(groupedByDate);
  };

  // Handle Report Selection
  const handleReportChange = (value: string) => {
    setSelectedReport(value);
    // Reset dates when changing reports
    setStartDate('');
    setEndDate('');
    setShowReport(false);
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (selectedReport === 'TMA' && startDate && endDate) {
      fetchTmaData(startDate, endDate);
    } else if (selectedReport === 'ROH' && startDate) {
      fetchDataRoh(startDate)
    } else if (selectedReport === 'inflow' && startDate && endDate) {
      fetchInflowData(startDate, endDate);
    } else if (selectedReport === 'outflow' && startDate && endDate) {
      fetchOutflowData(startDate, endDate);
    } else if (selectedReport === 'elevasi' && startDate) {
      const year = startDate; // Menggunakan startDate sebagai tahun
      await fetchElevationData(year);
      // elevationData sudah disimpan dalam state di dalam fetchElevationData
    } else if (selectedReport === 'rtow' && startDate) {
      const year = startDate; // Using startDate as the year
      await fetchRtowData(year);
    }
  };


  // PDF Download Handler
const handleDownloadPDF = async () => {
  if (!reportRef.current) return;

  try {
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    const formattedStartDate = new Date(startDate).toLocaleDateString('id-ID');
    const filename = selectedReport === 'ROH' 
      ? `${selectedReport}_${formattedStartDate}.pdf`
      : `${selectedReport}_${formattedStartDate}_${new Date(endDate).toLocaleDateString('id-ID')}.pdf`;
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Gagal membuat PDF. Silakan coba lagi.');
  }
};

const handleDownloadExcel = () => {
  const formatHourlyData = (data: any, valueKey: string): FormattedHourlyData => {
    if (!data?.content?.[0]?.content || data.content[0].content.length === 0) {
      return { headers: [], data: [] };
    }

    interface DayItem {
      tanggal: number;
      item: {
        jam: number;
        [key: string]: any;
      }[];
    }

    const content = data.content[0].content as DayItem[];
    const tanggalKeys: number[] = content.map(day => day.tanggal);
    
    // Always use hours 0-23 for consistent ordering
    const jamKeys: number[] = Array.from({ length: 24 }, (_, i) => i);

    // Create a mapping for quick lookups
    const valueMap: { [key: number]: { [key: number]: number } } = {};
    content.forEach(day => {
      day.item.forEach(item => {
        const jamValue = parseInt(String(item.jam), 10);
        if (!valueMap[jamValue]) valueMap[jamValue] = {};
        
        // Apply Math.abs for inflow values only
        if (valueKey === 'inflow') {
          valueMap[jamValue][day.tanggal] = Math.abs(item[valueKey]);
        } else {
          valueMap[jamValue][day.tanggal] = item[valueKey];
        }
      });
    });

    // Create headers: Jam + Tanggal values
    const headers = ['Jam', ...tanggalKeys.map(String)];

    // Create rows: for each jam, ensure proper ordering from 0-23
    const rows: (string | number)[][] = jamKeys.map(jam => {
      const rowData: (string | number)[] = [jam];
      tanggalKeys.forEach((tanggal: number) => {
        rowData.push(valueMap[jam]?.[tanggal] !== undefined ? valueMap[jam][tanggal] : 0);
      });
      return rowData;
    });

    // Add stats rows (AVG, MAX, MIN)
    const statRows: (string | number)[][] = [
      ['AVG'],
      ['MAX'],
      ['MIN']
    ];

    // Calculate stats for each column
    tanggalKeys.forEach((tanggal: number) => {
      // Get values for this tanggal column (excluding jam column)
      const columnValues = jamKeys
        .map(jam => valueMap[jam]?.[tanggal])
        .filter(value => value !== undefined) as number[];

      // Average
      const avg = columnValues.length ? columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length : 0;
      statRows[0].push(avg);

      // Max
      const max = columnValues.length ? Math.max(...columnValues) : 0;
      statRows[1].push(max);

      // Min
      const min = columnValues.length ? Math.min(...columnValues) : 0;
      statRows[2].push(min);
    });

    return {
      headers,
      data: [...rows, ...statRows]
    };
  };

  let worksheet;
  let filename;
  const formattedStartDate = new Date(startDate).toLocaleDateString('id-ID');
  const formattedEndDate = new Date(endDate).toLocaleDateString('id-ID');

  switch (selectedReport) {
    case 'TMA':
    case 'inflow':
    case 'outflow': {
      const valueKey = {
        'TMA': 'tma',
        'inflow': 'inflow',
        'outflow': 'outflow'
      }[selectedReport];
      
      const data = {
        'TMA': tmaData,
        'inflow': inflowData,
        'outflow': outflowData
      }[selectedReport];

      const formattedData = formatHourlyData(data, valueKey);
      
      // Create worksheet from the formatted data
      worksheet = XLSX.utils.aoa_to_sheet([
        formattedData.headers,
        ...formattedData.data
      ]);

      // Set column widths
      const colWidth = Array(formattedData.headers.length).fill({ wch: 12 });
      colWidth[0] = { wch: 8 }; // Width for Jam column
      worksheet['!cols'] = colWidth;

      filename = `${selectedReport}_${formattedStartDate}_${formattedEndDate}.xlsx`;
      break;
    }
    
    case 'ROH': {
      const data = rohData.map((item: any) => ({
        Tanggal: item.content.hariOrTanggal,
        'Estimasi Inflow': Math.abs(item.content.estimasiInflow), // Use absolute value for inflow
        'Target Elevasi Hari Ini': item.content.targetELevasiHariIni,
        'Volume Target Elevasi Hari Ini': item.content.volumeTargetELevasiHariIni,
        'Realisasi Elevasi': item.content.realisasiElevasi,
        'Volume Realisasi Elevasi': item.content.volumeRealisasiElevasi,
        'Estimasi Irigasi': item.content.estimasiIrigasi,
        'Estimasi DDC': item.content.estimasiDdcXTotalJamPembukaan,
        'DDC Jam': item.content.ddcJam,
        'Estimasi Spillway': item.content.estimasiSpillwayTotalJamPembukaan,
        'Spillway Jam': item.content.spillwayJam,
        'Total Outflow': item.content.totalOutflow,
        'Estimasi Volume Waduk': item.content.estimasiVolumeWaduk,
        'Estimasi Outflow': item.content.estimasiOutflow,
        'Water Consumption 1 MW': 1.13,
        'Water Consumption 1 MW To 1 Hour': 4080,
        'Estimasi Elevasi Waduk Setelah Operasi': item.content.estimasiElevasiWadukSetelahOperasi,
        'Estimasi Volume Waduk Setelah Operasi': item.content.estimasiVolumeWadukSetelahOperasi,
        'Total Daya': item.content.totalDaya,
      }));
      worksheet = XLSX.utils.json_to_sheet(data);
      filename = `${selectedReport}_${formattedStartDate}.xlsx`;
      break;
    }
    
    case 'rtow': {
      const data = rtowData.data.map((item: any) => ({
        Bulan: item.bulan,
        Hari: item.hari,
        'Target Elevasi': item.targetElevasi,
      }));
      worksheet = XLSX.utils.json_to_sheet(data);
      filename = `${selectedReport}_${formattedStartDate}_${formattedEndDate}.xlsx`;
      break;
    }
    
    default:
      return;
  }

  // Create and download workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

  

  // Validate submit button state
  // const isSubmitDisabled = selectedReport === 'ROH' 
  //   ? !startDate 
  //   : !selectedReport || !startDate || !endDate;
  const isSubmitDisabled = selectedReport === 'ROH'
  ? !startDate
  : selectedReport === 'elevasi' || selectedReport === 'rtow'
  ? !startDate // Cukup validasi tahun
  : !selectedReport || !startDate || !endDate;


  // Validate download button state
  const isDownloadDisabled = !showReport || selectedReport === 'elevasi';


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-4 text-3xl font-bold">
              <IoDocumentTextOutline className="w-10 h-10" />
              <div>
                <h1>Report Telemetering</h1>
                <p className="text-emerald-100 text-lg font-normal mt-1">Comprehensive Power Plant Reporting System</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Report Select */}
              <div className="space-y-2">
                <label className="text-white font-medium flex items-center space-x-2">
                  <IoFolderOutline className="w-4 h-4" />
                  <span>Jenis Report</span>
                </label>
                <Select
                  value={selectedReport}
                  onValueChange={handleReportChange}
                >
                  <SelectTrigger className="bg-white/90 border-white/30 text-slate-800 font-medium">
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
                <label className="text-white font-medium flex items-center space-x-2">
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
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/30 rounded-xl bg-white/90 text-slate-800 font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                    placeholder="Masukkan Tahun (YYYY)"
                  />
                ) : (
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-white/30 rounded-xl bg-white/90 text-slate-800 font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-white font-medium flex items-center space-x-2">
                  <IoCalendarOutline className="w-4 h-4" />
                  <span>Tanggal Akhir</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-white/30 rounded-xl bg-white/90 text-slate-800 font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabledReports.includes(selectedReport)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <IoStatsChartOutline className="w-5 h-5" />
                  <span>Generate Report</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      disabled={isDownloadDisabled}
                      className="bg-white/90 border-2 border-white/30 text-slate-800 font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <IoDownloadOutline className="w-5 h-5" />
                      <span>Download</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-2"
                    sideOffset={4}
                  >
                    <DropdownMenuItem 
                      onClick={handleDownloadPDF}
                      className="flex items-center cursor-pointer hover:bg-slate-100 px-4 py-3 rounded-lg transition-colors duration-200"
                    >
                      <FileText className="mr-3 h-5 w-5 text-red-600" />
                      <span className="font-medium">Export PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDownloadExcel}
                      className="flex items-center cursor-pointer hover:bg-slate-100 px-4 py-3 rounded-lg transition-colors duration-200"
                    >
                      <Table className="mr-3 h-5 w-5 text-green-600" />
                      <span className="font-medium">Export Excel</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-12">
              <div className="flex justify-center items-center space-x-4 text-white">
                <IoRefreshOutline className="w-10 h-10 animate-spin" />
                <span className="text-2xl font-medium">Memuat data report...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {hasError && <NoDataAlert />}

        {showReport && selectedReport && !hasError && (
          <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                <IoCheckmarkCircleOutline className="w-7 h-7" />
                <span>Report Generated Successfully</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={reportRef}>
                {selectedReport === 'ROH' && rohData && rohData.length > 0 && <RohTable rohData={rohData} />}
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
                {selectedReport === 'rtow' && rtowData && <RtowTable rtowData={rtowData} />}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportContent;



