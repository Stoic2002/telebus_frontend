import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoTrendingUpOutline, IoFlashOutline, IoWaterOutline, IoRefreshOutline, IoWarningOutline, IoStatsChartOutline, IoTimeOutline } from 'react-icons/io5';
import axios from 'axios';
import { ARRData, BebanData, FormattedData, InflowData, OutflowData, TMAData } from '@/types/trendsTypes';
import ErrorComponent from '../error/ErrorComponent';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
        <div className="bg-slate-900/95 backdrop-blur-md p-4 border border-white/20 rounded-xl shadow-2xl">
          <p className="font-bold mb-2 text-white">{`Waktu: ${label}`}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color }} className="font-medium">
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
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="inflow" 
              name="Inflow"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="tma" 
              name="TMA"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#f59e0b' }}
            />
            <Line 
              type="monotone" 
              dataKey="outflow" 
              name="Outflow"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#ef4444' }}
            />
          </>
        );
        legend = [
          { name: 'Total Beban', color: '#3b82f6', icon: IoFlashOutline },
          { name: 'Inflow', color: '#10b981', icon: IoWaterOutline },
          { name: 'TMA', color: '#f59e0b', icon: IoStatsChartOutline },
          { name: 'Outflow', color: '#ef4444', icon: IoWaterOutline }
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
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="arrST02" 
              name="ARR ST02"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="arrST03" 
              name="ARR ST03"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#ef4444' }}
            />
          </>
        );
        legend = [
          { name: 'ARR ST01', color: '#3b82f6', icon: IoStatsChartOutline },
          { name: 'ARR ST02', color: '#10b981', icon: IoStatsChartOutline },
          { name: 'ARR ST03', color: '#ef4444', icon: IoStatsChartOutline }
        ];
        yAxisLabel = 'Values';
        break;

      case 'trends3':
        lines = (
          <Line 
            type="monotone" 
            dataKey="inflow" 
            name="Inflow"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }}
          />
        );
        legend = [
          { name: 'Inflow', color: '#3b82f6', icon: IoWaterOutline }
        ];
        yAxisLabel = 'Value';
        break;
    }

    return (
      <>
        <div className="flex justify-center gap-8 mb-6">
          {legend.map((item) => (
            <div key={item.name} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <div 
                className="w-5 h-5 rounded-full shadow-lg" 
                style={{ backgroundColor: item.color }}
              />
              <item.icon className="w-5 h-5 text-white/80" />
              <span className="text-sm font-semibold text-white">{item.name}</span>
            </div>
          ))}
        </div>
        <div className="h-[500px] bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="time" 
                angle={-45}
                textAnchor="end"
                interval={0}
                height={40}
                label={{value:'Time', position: 'bottom'}}
                tick={{ fontSize: 12, fill: '#ffffff80' }}
                stroke="#ffffff60"
              />
              <YAxis 
                label={{ 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -30,
                  style: { fill: '#ffffff80' }
                }}
                tick={{ fontSize: 12, fill: '#ffffff80' }}
                stroke="#ffffff60"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-center space-x-4 text-white">
                <IoRefreshOutline className="w-10 h-10 animate-spin" />
                <span className="text-2xl font-medium">Loading trends data...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-red-500/20 to-red-700/20 backdrop-blur-md border-red-400/30 shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
              <IoWarningOutline className="w-16 h-16 text-red-400" />
              <div className="text-red-300 text-xl font-semibold text-center">
                {error}
              </div>
              <button 
                onClick={fetchData} 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg font-medium flex items-center space-x-2"
              >
                <IoRefreshOutline className="w-5 h-5" />
                <span>Retry Connection</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-4 text-3xl font-bold">
              <IoTrendingUpOutline className="w-10 h-10" />
              <div>
                <h1>Data Trends Analytics</h1>
                <p className="text-emerald-100 text-lg font-normal mt-1">Real-time Power Plant Performance Monitoring</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Main Content Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/20">
                <button 
                  onClick={() => setActiveTab('trends1')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'trends1' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <IoStatsChartOutline className="w-5 h-5" />
                  <span>Trends 1 (Total Beban, Inflow, TMA, Outflow)</span>
                </button>
                <button 
                  onClick={() => setActiveTab('trends2')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'trends2' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <IoFlashOutline className="w-5 h-5" />
                  <span>Trends 2 (ARR)</span>
                </button>
                <button 
                  onClick={() => setActiveTab('trends3')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    activeTab === 'trends3' 
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg scale-105' 
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <IoWaterOutline className="w-5 h-5" />
                  <span>Trends 3 (Inflow)</span>
                </button>
              </div>
            </div>

            {/* Data Info Banner */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-400/30">
              <div className="flex items-center space-x-3 text-blue-100">
                <IoTimeOutline className="w-6 h-6" />
                <span className="font-medium">
                  Showing data trends for today • Last updated: {new Date().toLocaleTimeString('id-ID')} • Auto-refresh every 5 minutes
                </span>
              </div>
            </div>
            
            {renderChart()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendsContent;