import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue, fetchSoedirmanLoadValue } from '@/services/loadUnit/soedirmanLoadUnit';
import { fetchSoedirmanWaterLevel } from '@/services/waterLevel/soedirmanWaterLevel';
import { useSensorData } from '@/hooks/useSensorData';
import { fetchSoedirmanLevelSedimen } from '@/services/levelSedimen/soedirmanLevelSedimen';
import usePbsNodeData from '@/hooks/usePbsNodeData';

// Dynamic import for MapContent to enable client-side rendering
const MapContent = dynamic(() => import('../../components/Home/MapContent'), { 
  ssr: false 
});


const HomeContent: React.FC = () => {
  // Use custom hook for sensor data fetching
  // const { data : pbsLevelSedimenValue, error: errSedimen} = useSensorData( {fetchFunction: fetchSoedirmanLevelSedimen});
  // const { data: pbsLoad1, error: errLoad1 } = useSensorData({ fetchFunction: fetchSoedirmanLoadValue});
  // const { data: pbsLoad2, error: errLoad2 } = useSensorData({ fetchFunction: fetchSoedirmanLoadSecondValue });
  // const { data: pbsLoad3, error: erLoad3 } = useSensorData({ fetchFunction: fetchSoedirmanLoadThirdValue });
  // const { data: pbsWaterLevel } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });

  // // Calculate total load
  // const totalLoad = pbsLoad1 && pbsLoad2 && pbsLoad3
  //   ? (
  //       pbsLoad1.data.value.value + 
  //       pbsLoad2.data.value.value + 
  //       pbsLoad3.data.value.value
  //     ).toFixed(2)
  //   : 'N/A';

  const { 
    soedirman
  } = usePbsNodeData({ interval: 10000 });

  return (
    <div className="p-6" style={{height: 850}}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Water Level Card */}
        <Card>
          <CardHeader>
            <CardTitle>Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {soedirman.levels.elevation?.toFixed(2) ?? 0} mdpl
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
            <div className="text-2xl font-bold text-orange-600">N/A mdpl</div>
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

      {/* Map Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Map PLTA</CardTitle>
        </CardHeader>
        <CardContent style={{height: 500}}>
          <MapContent />
        </CardContent>
      </Card>


    </div>
  );
};

export default HomeContent;