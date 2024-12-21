import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import usePbsNodeData from '@/hooks/usePbsNodeData';
import MonitoringPbsComponent from './MonitoringPBSoedirman';
import InflowChartComponent from './InflowChart';
import RainfallComponent from './TelemeteringArr';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import axios from 'axios';
import { ApiElevationData, ApiReportData, RohData } from '@/types/reportTypes';


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

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Water Level Card */}
        <Card>
          <CardHeader>
            <CardTitle>Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tmaData.tmaValue.toFixed(2)} mdpl
            </div>
            <p className="text-gray-500">per hour</p>
          </CardContent>
        </Card>

        {/* Volume Efektif Card */}
        <Card>
          <CardHeader>
            <CardTitle>Volume Effective</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tmaData.volume.toFixed(2)} m³
            </div>
            <p className="text-gray-500">per hour</p>
          </CardContent>
        </Card>

        {/* Total Load Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {soedirman.activeLoads.total.toFixed(2) ?? 0} MW
            </div>
            <p className="text-gray-500">current condition</p>
          </CardContent>
        </Card>

        {/* Prediksi ROH Card */}
        <Card>
          <CardHeader>
            <CardTitle>Prediksi ROH</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{rohData[0].content.totalDaya.toFixed(2)} MW</div>
          </CardContent>
        </Card>

        {/* Target Water Level Card */}
        <Card>
          <CardHeader>
            <CardTitle>Target Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {targetElevasi !== null ? `${targetElevasi.toFixed(2)} mdpl` : 'Loading...'}
            </div>
            <p className="text-gray-500">per day</p>
          </CardContent>
        </Card>

        {/* Level Sedimen Card */}
        <Card>
          <CardHeader>
            <CardTitle>Level Sedimen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {soedirman.levels.sediment?.toFixed(2) ?? 0} mdpl
            </div>
            <p className="text-gray-500">current condition</p>
          </CardContent>
        </Card>
      </div>

      <InflowChartComponent />

      <Card className="mt-6">
        <CardHeader className="bg-gradient-to-r from-green-500 to-gray-300 text-white rounded-md">
          <CardTitle>Telemetering PB Soedirman</CardTitle>
        </CardHeader>
      </Card>

      <MonitoringPbsComponent />

      <RainfallComponent />
    </div>
  );
};

export default HomeContent;
