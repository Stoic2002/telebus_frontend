import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

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
import { AlertCircle, Download, Loader2 } from 'lucide-react';

// Components and Data
import { rohData } from '@/data/ROH/rohData';
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

const NoDataAlert = () => (
  <Alert variant="destructive" className="my-4">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Data Tidak Tersedia</AlertTitle>
    <AlertDescription>
      Tidak dapat menemukan data untuk periode yang dipilih. Silakan coba dengan periode yang berbeda.
    </AlertDescription>
  </Alert>
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
             ((parseFloat(reportResponse.data.estimationInflow.inflow_estimation)/2) * 3600 * 24) - 
                parseFloat(reportResponse.data.targetElv.volume) - totalOutflow;
           

            const totalDaya = ((
                estimasiVolumeWaduk -
                (reportResponse.data.outflow.average_outflow_irigasi * 24 * 3600))/4080) - 50
            // Calculate volume for elevation after operation

            const estimasiOutflow = (totalDaya * 4080)+ reportResponse.data.outflow.average_outflow_irigasi * 3600 * 24


            const volumeAfterOperation = parseFloat(reportResponse.data.realisasiElv.volume) + 
                ((parseFloat(reportResponse.data.estimationInflow.inflow_estimation)/2)* 24 * 3600) - 
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
                    estimasiInflow: parseFloat(reportResponse.data.estimationInflow.inflow_estimation) / 2,
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
      console.log(start)
      console.log(end)
      

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
      const filteredValue = parseFloat(item.value).toFixed(2);
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
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Telemetering</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Report Select */}
            <div>
              <Select
                value={selectedReport}
                onValueChange={handleReportChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {reportOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Date Inputs */}
            <div>
            {selectedReport === 'elevasi' || selectedReport === 'rtow' ? (
              <input
                type="number"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Masukkan Tahun (YYYY)"
              />
            ) : (
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={selectedReport === 'ROH' ? 'Pilih Tanggal' : 'Tanggal Mulai'}
              />
            )}
          </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={disabledReports.includes(selectedReport)}
                placeholder="Tanggal Akhir"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF}
                disabled={isDownloadDisabled}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center my-4">
          <Loader2 className="animate-spin" />
          <span className="ml-2">Memuat data...</span>
        </div>
      )}

      {hasError && <NoDataAlert />}

      {showReport && selectedReport && !hasError && (
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
      )}
    </div>
  );
};

export default ReportContent;



