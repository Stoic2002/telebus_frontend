import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import usePbsNodeData from '@/hooks/usePbsNodeData';
import MonitoringPbsComponent from './MonitoringPBSoedirman';
import InflowChartComponent from './InflowChart';
import RainfallComponent from './TelemeteringArr';

const HomeContent: React.FC = () => {
  const [tmaData, setTmaData] = useState({ tmaValue: 0, volume: 0 });
  const [targetElevasi, setTargetElevasi] = useState<number | null>(null); // State untuk target elevasi

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

    // Initial fetch
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
    <div className="p-6" style={{ height: 850 }}>
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
            <div className="text-2xl font-bold text-green-600">N/A MW</div>
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
