import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue, fetchSoedirmanLoadValue } from '../../services/loadUnit/soedirmanLoadUnit';
import { fetchSoedirmanWaterLevel } from '@/services/waterLevel/soedirmanWaterLevel';
import { fetchSoedirmanWaterDepth, fetchSoedirmanWaterDepthCalculation } from '@/services/waterDepth/soedirmanWaterDepth';
import { fetchSoedirmanLevelSedimen } from '@/services/levelSedimen/soedirmanLevelSedimen';
import RainfallComponent from './TelemeteringArr';
import MonitoringPbsComponent from './MonitoringPBSoedirman';
import InflowChartComponent from './InflowChart';
import { useSensorData } from '@/hooks/useSensorData';
import usePbsNodeData from '@/hooks/usePbsNodeData';

const TelePBSoedirmanContent: React.FC = () => {
  // const { data : pbsLevelSedimen} = useSensorData( {fetchFunction: fetchSoedirmanLevelSedimen});
  // const { data: pbsLoad1 } = useSensorData({ fetchFunction: fetchSoedirmanLoadValue});
  // const { data: pbsLoad2 } = useSensorData({ fetchFunction: fetchSoedirmanLoadSecondValue });
  // const { data: pbsLoad3 } = useSensorData({ fetchFunction: fetchSoedirmanLoadThirdValue });
  // const { data: pbsWaterLevel } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });
  // const { data: pbsInflow } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });
  // const { data: pbsWaterDepth } = useSensorData({ fetchFunction: fetchSoedirmanWaterDepth });
  // const { data: pbsWaterDepthCalc } = useSensorData({ fetchFunction: fetchSoedirmanWaterDepthCalculation});

  const { 
    soedirman
  } = usePbsNodeData({ interval: 10000 });
  return (

    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <Card>
          <CardHeader className='bg-gradient-to-r from-green-500 to-gray-300 text-white rounded-md'>
            <CardTitle>Telemetering PB Soedirman</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Water Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">{soedirman.levels.elevation?.toFixed(2) ?? 0} mdpl</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Inflow Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{soedirman.flows.inflow?.toFixed(2) ?? 0} m³/s</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Level Sedimen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{soedirman.levels.sediment?.toFixed(2) ?? 0} mdpl</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Total Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {soedirman.activeLoads.total.toFixed(2) ?? 0}
              {' MW'}
            </div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Water depth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{soedirman.levels.waterDepth?.toFixed(2) ?? 0} m</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Water Depth Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{soedirman.levels.waterDepthCalc?.toFixed(2) ?? 0} m</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle >Mekanisme Waduk</CardTitle>
          </CardHeader>
          <CardContent>
          <img src='/assets/mekanisme-waduk.png' alt="Map AWLR dan ARR" className="w-full h-auto" />
          </CardContent>
        </Card>
      </div>
      

      <MonitoringPbsComponent/>

      {/* chart debit */}
      <InflowChartComponent/>
      

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 pt-8">
        <Card>
          <CardHeader className='bg-gradient-to-r from-green-500 to-gray-300 text-white rounded-md'>
            <CardTitle>Curah Hujan</CardTitle>
          </CardHeader>
        </Card>
      </div>
      {/* curah hujan */}
      <RainfallComponent/>
    </div>
  );
};

export default TelePBSoedirmanContent;