import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import usePbsNodeData from '@/hooks/usePbsNodeData';
import MonitoringPbsComponent from './MonitoringPBSoedirman';
import InflowChartComponent from './InflowChart';
import RainfallComponent from './TelemeteringArr';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import axios from 'axios';
import { ApiElevationData, ApiReportData, RohData } from '@/types/reportTypes';
import { formatNumber } from '../../lib/formatNumber';
import AwsComponent from './AwsComponent';
import { 
  IoWaterOutline, 
  IoFlashOutline, 
  IoBulbOutline, 
  IoTrendingUpOutline, 
  IoFlagOutline, 
  IoLayersOutline 
} from 'react-icons/io5';



const HomeContent: React.FC = () => {
  const [tmaData, setTmaData] = useState({ tmaValue: 0, volume: 0 });
  const [targetElevasi, setTargetElevasi] = useState<number | null>(null); // State untuk target elevasi
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
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

  useEffect(() => {
    // Function to fetch TMA data
    const fetchTMA = async () => {
      try {
        const response = await fetch('http://192.168.105.90/last-tma');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.length > 0) {
          setTmaData({
            tmaValue: parseFloat(data[0].tma_value),
            volume: parseFloat(data[0].volume),
          });
        }
      } catch (error) {
        console.error('Error fetching TMA data:', error);
      }
    };

    // Function to fetch Target Elevasi data
    const fetchTargetElevasi = async () => {
      try {
        const response = await fetch('http://192.168.105.90/rtow-by-today');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.targetElevasi) {
          setTargetElevasi(parseFloat(data.targetElevasi));
        }
      } catch (error) {
        console.error('Error fetching Target Elevasi data:', error);
      }
    };

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
                // const elevationResponse = await axios.post<ApiElevationData>('http://192.168.105.90/elevation-after', {
                //     volume: volumeAfterOperation.toString(),
                //     year: year
                // });
    
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
                        estimasiElevasiWadukSetelahOperasi: 0,
                        estimasiVolumeWadukSetelahOperasi: volumeAfterOperation,
                        totalDaya: totalDaya,
                        estimasiOutflow: estimasiOutflow,
                        estimasiVolumeWaduk:estimasiVolumeWaduk,
                    }
                }]);
    
                setLoading(false)
            } catch (err) {
                // setError('Failed to fetch data');
                setHasError(true);
                setLoading(false);
            } finally {
              setLoading(false);
            }
        };

    // Initial fetch
    const dateNow = new Date(Date.now());

    // Format ke "YYYY-MM-DD"
    const formattedDate = dateNow.toISOString().split('T')[0];
    
    fetchDataRoh(formattedDate)
    fetchTMA();
    fetchTargetElevasi();

    // Set interval for fetching data every 1 hour (3600000 ms)
    const intervalId = setInterval(() => {
      fetchTMA();
      fetchTargetElevasi();
    }, 3600000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const { soedirman } = usePbsNodeData({ interval: 30000 });

  const metricCards = [
    {
      title: "Water Level",
      value: `${tmaData.tmaValue.toFixed(2)} mdpl`,
      subtitle: "per hour",
      color: "from-blue-500 to-blue-600",
      icon: IoWaterOutline,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Volume Effective",
      value: `${formatNumber(tmaData.volume)} m³`,
      subtitle: "per hour",
      color: "from-cyan-500 to-cyan-600",
      icon: IoFlashOutline,
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700"
    },
    {
      title: "Total Load",
      value: `${soedirman.activeLoads.total.toFixed(2) ?? 0} MW`,
      subtitle: "current condition",
      color: "from-emerald-500 to-emerald-600",
      icon: IoFlashOutline,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      title: "Prediksi ROH",
      value: `${formatNumber(rohData[0].content.totalDaya)} MW`,
      subtitle: "today",
      color: "from-green-500 to-green-600",
      icon: IoBulbOutline,
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Target Water Level",
      value: targetElevasi !== null ? `${targetElevasi.toFixed(2)} mdpl` : 'Loading...',
      subtitle: "per day",
      color: "from-orange-500 to-orange-600",
      icon: IoFlagOutline,
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Level Sedimen",
      value: `${soedirman.levels.sediment?.toFixed(2) ?? 0} mdpl`,
      subtitle: "current condition",
      color: "from-pink-500 to-pink-600",
      icon: IoLayersOutline,
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {metricCards.map((card, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${card.color} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{card.title}</CardTitle>
                  <card.icon className="text-2xl opacity-80" />
                </div>
              </CardHeader>
              <CardContent className={`${card.bgColor} p-4`}>
                <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                  {card.value}
                </div>
                <p className="text-gray-500 text-sm">{card.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          <InflowChartComponent />

          {/* Monitoring Section */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <CardTitle className="text-xl font-semibold">Telemetering PB Soedirman</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <MonitoringPbsComponent />
            </CardContent>
          </Card>

          {/* Rainfall Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Rainfall Monitoring</h2>
            </div>
            <RainfallComponent />
          </div>

          {/* Weather Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Weather Station</h2>
            </div>
            <AwsComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
