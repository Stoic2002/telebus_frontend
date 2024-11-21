import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { SensorValueResponse } from '@/types/sensorTypes';
import * as LoadUnitServices from '@/services/loadUnit/soedirmanLoadUnit';
import * as WaterLevelServices from '@/services/waterLevel/soedirmanWaterLevel';
import * as SedimenServices from '@/services/levelSedimen/soedirmanLevelSedimen';
import RohTable from '../report/RohTable';
import { rohData } from '@/data/ROH/rohData';
import CustomTable from '../report/RohTable';

// Dynamic import for MapContent to enable client-side rendering
const MapContent = dynamic(() => import('../../components/Home/MapContent'), { 
  ssr: false 
});

// Custom hook for fetching sensor data
const useSensorData = <T,>(
  fetchFunction: () => Promise<SensorValueResponse | null>, 
  interval = 10000
) => {
  const [value, setValue] = useState<SensorValueResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFunction();
        if (response?.data) {
          setValue(response);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchFunction, interval]);

  return value;
};

const HomeContent: React.FC = () => {
  // Use custom hook for sensor data fetching
  const pbsLoadValue = useSensorData(LoadUnitServices.fetchSoedirmanLoadValue);
  const pbsLoadSecondValue = useSensorData(LoadUnitServices.fetchSoedirmanLoadSecondValue);
  const pbsLoadThirdValue = useSensorData(LoadUnitServices.fetchSoedirmanLoadThirdValue);
  const pbsWaterLevelValue = useSensorData(WaterLevelServices.fetchSoedirmanWaterLevel);
  const pbsLevelSedimenValue = useSensorData(SedimenServices.fetchSoedirmanLevelSedimen);

  // Calculate total load
  const totalLoad = pbsLoadValue && pbsLoadSecondValue && pbsLoadThirdValue
    ? (
        pbsLoadValue.data.value.value + 
        pbsLoadSecondValue.data.value.value + 
        pbsLoadThirdValue.data.value.value
      ).toFixed(2)
    : 'N/A';

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Water Level Card */}
        <Card>
          <CardHeader>
            <CardTitle>Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pbsWaterLevelValue?.data.value.value.toFixed(2) ?? 'N/A'} mdpl
            </div>
            <p className="text-gray-500">current condition</p>
          </CardContent>
        </Card>
        
        {/* Total Load Card */}
        <Card>
          <CardHeader>
            <CardTitle>Total Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalLoad} MW
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
            <div className="text-2xl font-bold text-orange-600">N/A MW</div>
          </CardContent>
        </Card>

        {/* Level Sedimen Card */}
        <Card>
          <CardHeader>
            <CardTitle>Level Sedimen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pbsLevelSedimenValue?.data.value.value.toFixed(2) ?? "N/A"} mdpl
            </div>
            <p className="text-gray-500">current condition</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Map PLTA</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <MapContent />
        </CardContent>
      </Card>


    </div>
  );
};

export default HomeContent;