import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue, fetchSoedirmanLoadValue } from '../../services/loadUnit/soedirmanLoadUnit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatDate } from '../../lib/dateFormatter';
import { sensorData } from '../../data/sensorData';
import { SensorValueResponse } from '../../types/sensorTypes';
import { riverFlowData } from '@/data/riverFlowData';
import { fetchSoedirmanWaterLevel } from '@/services/waterLevel/soedirmanWaterLevel';
import { fetchSoedirmanInflowPerHour, fetchSoedirmanInflowPerSec } from '@/services/inflow/soedirmanInflow';
import { fetchSoedirmanWaterDepth, fetchSoedirmanWaterDepthCalculation } from '@/services/waterDepth/soedirmanWaterDepth';
import { fetchSoedirmanLevelSedimen } from '@/services/levelSedimen/soedirmanLevelSedimen';
import RainfallComponent from './TelemeteringArr';
import MonitoringPbsComponent from './MonitoringPBSoedirman';
import InflowChartComponent from './InflowChart';

const TelePBSoedirmanContent: React.FC = () => {
  const [pbsLoadValue, setPbsLoadValue] = useState<SensorValueResponse | null>(null);
  const [pbsLoadSecondValue, setPbsLoadSecondValue] = useState<SensorValueResponse | null>(null);
  const [pbsLoadThirdValue, setPbsLoadThirdValue] = useState<SensorValueResponse | null>(null);
  const [pbsWaterLevelValue, setPbsWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [pbsInflowValue, setPbsInflowValue] = useState<SensorValueResponse | null>(null);
  const [pbsWaterDepthValue, setPbsWaterDepthValue] = useState<SensorValueResponse | null>(null);
  const [pbsWaterDepthCalcValue, setPbsWaterDepthCalcValue] = useState<SensorValueResponse | null>(null);
  const [pbsLevelSedimenValue, setPbsLevelSedimenValue] = useState<SensorValueResponse | null>(null);


  //beban unit 1 pbs
  useEffect(() => {
    const getPbsLoad = async () => {
      try {
        const response = await fetchSoedirmanLoadValue();
        if (response?.data) {
          setPbsLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };
    getPbsLoad();
    
    const intervalId = setInterval(getPbsLoad, 10000);

    return () => clearInterval(intervalId);
  
  }, []);

   //beban unit 2 pbs
  useEffect(() => {

    const getPbsSecondLoad = async () => {
      try {
        const response = await fetchSoedirmanLoadSecondValue();
        if (response?.data) {
          setPbsLoadSecondValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getPbsSecondLoad();

    const intervalId = setInterval(getPbsSecondLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  //beban unit 3 pbs
  useEffect(() => {
  
    const getPbsThirdLoad = async () => {
      try {
        const response = await fetchSoedirmanLoadThirdValue();
        if (response?.data) {
          setPbsLoadThirdValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };


    getPbsThirdLoad();
 
    const intervalId = setInterval(getPbsThirdLoad, 10000);

    return () => clearInterval(intervalId);
  }, []);  

  // water level pbs
  useEffect(() => {
  
    const getPbsWaterLevel = async () => {
      try {
        const response = await fetchSoedirmanWaterLevel();
        if (response?.data) {
          setPbsWaterLevelValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getPbsWaterLevel();
 
    const intervalId = setInterval(getPbsWaterLevel, 10000);

    return () => clearInterval(intervalId);
  }, []);  

  //inflow pbs
  useEffect(() => {
  
    const getPbsInflow = async () => {
      try {
        const response = await fetchSoedirmanInflowPerSec();
        if (response?.data) {
          setPbsInflowValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getPbsInflow();
    
    const intervalId = setInterval(getPbsInflow, 10000); 

    return () => clearInterval(intervalId);
  }, []);  

  //water depth pbs
  useEffect(() => {
  
    const getPbsWaterDepth = async () => {
      try {
        const response = await fetchSoedirmanWaterDepth();
        if (response?.data) {
          setPbsWaterDepthValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getPbsWaterDepth();
    
    const intervalId = setInterval(getPbsWaterDepth, 10000); 

    return () => clearInterval(intervalId);
  }, []);  

  //water depth calculation pbs
  useEffect(() => {
  
    const getPbsWaterDepthCalc = async () => {
      try {
        const response = await fetchSoedirmanWaterDepthCalculation();
        if (response?.data) {
          setPbsWaterDepthCalcValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getPbsWaterDepthCalc();
    
    const intervalId = setInterval(getPbsWaterDepthCalc, 10000); 

    return () => clearInterval(intervalId);
  }, []);  

  //level sedimen  pbs
  useEffect(() => {
  
    const getPbsLevelSedimen = async () => {
      try {
        const response = await fetchSoedirmanLevelSedimen();
        if (response?.data) {
          setPbsLevelSedimenValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getPbsLevelSedimen();
    
    const intervalId = setInterval(getPbsLevelSedimen, 10000); 

    return () => clearInterval(intervalId);
  }, []);  


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
            <div className="text-xl font-bold text-blue-600">{pbsWaterLevelValue !== null ? pbsWaterLevelValue.data.value.value.toFixed(2) : 'N/A' } mdpl</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Inflow Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{pbsInflowValue !== null ? pbsInflowValue.data.value.value.toFixed(2) : "N/A"} m³/s</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Level Sedimen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{pbsLevelSedimenValue !== null ? pbsLevelSedimenValue.data.value.value.toFixed(2) : "N/A"} mdpl</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Total Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {pbsLoadValue && pbsLoadSecondValue && pbsLoadThirdValue !== null ? (pbsLoadValue.data.value.value + pbsLoadSecondValue.data.value.value + pbsLoadThirdValue.data.value.value).toFixed(2) : 'N/A'}
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
            <div className="text-xl font-bold text-green-600">{pbsWaterDepthValue !== null ? pbsWaterDepthValue.data.value.value.toFixed(2) : "N/A"} m</div>
            <p className="text-gray-500">Current condition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Water Depth Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">{pbsWaterDepthCalcValue !== null ? pbsWaterDepthCalcValue.data.value.value.toFixed(2) : "N/A"} m</div>
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