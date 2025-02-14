import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { ARRData, BebanData, FormattedData, InflowData, OutflowData, TMAData } from '@/types/trendsTypes';
import ErrorComponent from '../error/ErrorComponent';
import { Card, CardContent } from '../ui/card';
// import ErrorComponent from '../error/ErrorComponent';

const TrendsContent = () => {
  const [data, setData] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trends1' | 'trends2' | 'trends3'>('trends1');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        bebanResponse, 
        outflowResponse, 
        tmaResponse, 
        arrResponse, 
        inflowResponse,
      ] = await Promise.all([
        axios.get<BebanData[]>('http://192.168.105.90/pbs-beban-last-24-h'),
        axios.get<OutflowData[]>('http://192.168.105.90/pbs-outflow-last-24-h'),
        axios.get<TMAData[]>('http://192.168.105.90/pbs-tma-last-24-h'),
        axios.get<ARRData[]>('http://192.168.105.90/arr-st01-h'),
        axios.get<InflowData[]>('http://192.168.105.90/pbs-inflow-last-24-h')
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const groupedData: { [key: string]: FormattedData } = {};

      const isToday = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getTime() >= today.getTime() && date.getTime() < today.getTime() + 24 * 60 * 60 * 1000;
      };

      // Process Beban data
      bebanResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: BebanData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            // minute: '2-digit'
          });

          if (!groupedData[timeKey]) {
            groupedData[timeKey] = {
              time: timeKey,
              originalTime: originalTime
            };
          }

          if (curr.name.includes('PB01.ACTIVE_LOAD')) {
            groupedData[timeKey].bebanPB01 = parseFloat(curr.value);
          } else if (curr.name.includes('PB02.ACTIVE_LOAD')) {
            groupedData[timeKey].bebanPB02 = parseFloat(curr.value);
          } else if (curr.name.includes('PB03.ACTIVE_LOAD')) {
            groupedData[timeKey].bebanPB03 = parseFloat(curr.value);
          }
        });

      // Process Outflow data
      outflowResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: OutflowData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            // minute: '2-digit'
          });

          if (groupedData[timeKey]) {
            groupedData[timeKey].outflow = parseFloat(curr.value);
          }
        });

      // Process TMA data
      tmaResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: TMAData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            // minute: '2-digit'
          });
          console.log(timeKey)


          if (groupedData[timeKey]) {
            groupedData[timeKey].tma = parseFloat(curr.value);
            // console.log(groupedData[timeKey].tma)
          }
        });

        inflowResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: InflowData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            // minute: '2-digit'
          });


      
          if (groupedData[timeKey]) {
            groupedData[timeKey].inflow = parseFloat(curr.value);
            // console.log(groupedData[timeKey].inflow)
          }
          // console.log(groupedData)
        });
      
      // Process ARR data
      arrResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: ARRData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            // minute: '2-digit'
          });

          if (groupedData[timeKey]) {
            if (curr.name.includes('ARR_ST01_RT')) {
              groupedData[timeKey].arrST01 = parseFloat(curr.value);
            } else if (curr.name.includes('ARR_ST02_RT')) {
              groupedData[timeKey].arrST02 = parseFloat(curr.value);
            } else if (curr.name.includes('ARR_ST03_RT')) {
              groupedData[timeKey].arrST03 = parseFloat(curr.value);
            }
          }
        });

      // Calculate total beban
      Object.values(groupedData).forEach(item => {
        const beban1 = item.bebanPB01 || 0;
        const beban2 = item.bebanPB02 || 0;
        const beban3 = item.bebanPB03 || 0;
        item.totalBeban = beban1 + beban2 + beban3;
      });

      // Convert to array and sort by time
      const formattedData = Object.values(groupedData)
        .sort((a, b) => a.originalTime.getTime() - b.originalTime.getTime());

      setData(formattedData);
      setError(null);
      // console.log('Grouped Data:', groupedData);
      setLoading(false)
      console.log('Data for Chart:', data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    

    fetchData();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold mb-2">{`Waktu: ${label}`}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    let lines, legend, yAxisLabel;

    switch (activeTab) {
      case 'trends1':
        lines = (
          <>
            <Line 
              type="monotone" 
              dataKey="totalBeban" 
              name="Total Beban"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="inflow" 
              name="Inflow"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="tma" 
              name="TMA"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="outflow" 
              name="Outflow"
              stroke="#ffc658"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </>
        );
        legend = [
          { name: 'Total Beban', color: '#2563eb' },
          { name: 'Inflow', color: '#16a34a' },
          { name: 'TMA', color: '#dc2626' },
          { name: 'Outflow', color: '#ffc658' }
        ];
        yAxisLabel = 'Values';
        break;

      case 'trends2':
        lines = (
          <>
            <Line 
              type="monotone" 
              dataKey="arrST01" 
              name="ARR ST01"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="arrST02" 
              name="ARR ST02"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="arrST03" 
              name="ARR ST03"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </>
        );
        legend = [
          { name: 'ARR ST01', color: '#2563eb' },
          { name: 'ARR ST02', color: '#16a34a' },
          { name: 'ARR ST03', color: '#dc2626' }
        ];
        yAxisLabel = 'Values';
        break;

      case 'trends3':
        lines = (
          <Line 
            type="monotone" 
            dataKey="inflow" 
            name="Inflow"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        );
        legend = [
          { name: 'Inflow', color: '#2563eb' }
        ];
        yAxisLabel = 'Value';
        break;
    }

    return (
      <>
        <div className="flex justify-center gap-8 mb-4">
          {legend.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 40,
                bottom: 60
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                angle={-45}
                textAnchor="end"
                interval={0}
                height={40}
                label={{value:'Time', position: 'bottom'}}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -30
                }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              {lines}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4 mx-auto"></div>
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
      </div>
    );
  }


  if (error) {
    return (
      <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-red-600 text-lg font-semibold text-center">
            {error}
          </div>
          <button 
            onClick={fetchData} 
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Retry Connection
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full p-4 bg-white rounded-lg shadow-lg ">
        <h2 className="text-xl font-bold mb-4 text-center">Trends</h2>
        
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('trends1')}
              className={`px-4 py-2 rounded ${activeTab === 'trends1' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Trends 1 (Total Beban, Inflow, TMA, Outflow)
            </button>
            <button 
              onClick={() => setActiveTab('trends2')}
              className={`px-4 py-2 rounded ${activeTab === 'trends2' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Trends 2 (ARR)
            </button>
            <button 
              onClick={() => setActiveTab('trends3')}
              className={`px-4 py-2 rounded ${activeTab === 'trends3' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Trends 3 (Inflow)
            </button>
          </div>
        </div>
        
        {renderChart()}
      </div>
    </div>
  );
};

export default TrendsContent;