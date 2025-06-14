import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IoWaterOutline, IoRainyOutline, IoLocationOutline, IoTimeOutline, IoRefreshOutline } from 'react-icons/io5';
import axios from 'axios';
import { RainfallData, TelemeterData } from '@/types/telemeteringPjtTypes';
// import MapPJTContent from './MapPJTContent';

  
import dynamic from 'next/dynamic';

const MapPJTContent = dynamic(() => import('@/components/telemetering-pjt/MapPJTContent'), {
  ssr: false, // Menonaktifkan server-side rendering untuk komponen ini
});

const TelemeteringPJTContent: React.FC = () => {
  const [telemeterData, setTelemeterData] = useState<TelemeterData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [waterLevelRes, rainfallRes] = await Promise.all([
          axios.get('/api/pjt-wl'),
          axios.get('/api/pjt-rf')
        ]);
        setTelemeterData({
          Waterlevel: waterLevelRes.data.Waterlevel,
          Rainfall: rainfallRes.data.Rainfall
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch telemetry data');
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const getLatestValidReading = (data: any[], key: 'wl' | 'rf') => {
    // Sort data by datetime in descending order (most recent first)
    const sortedData = [...data].sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    
    // Find the first valid reading
    const validReading = sortedData.find(reading => reading[key] !== '-');
    return validReading ? validReading[key] : '-';
  };

  const getLatestDateTime = (data: any[]) => {
    // Sort data by datetime in descending order and get the most recent
    const sortedData = [...data].sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    return sortedData[0]?.datetime || '-';
  };

  const getTotalRainfall = (data: RainfallData[]) => {
    // Get today's date at start of day for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return data
      .filter(reading => {
        // Only include readings from today
        const readingDate = new Date(reading.datetime);
        return readingDate >= today && reading.rf !== '-';
      })
      .reduce((sum, reading) => sum + parseFloat(reading.rf || '0'), 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-4 text-white">
                <IoRefreshOutline className="w-8 h-8 animate-spin" />
                <span className="text-xl font-medium">Loading telemetry data...</span>
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
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-red-400 text-center text-xl font-medium">{error}</div>
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
          <CardHeader className="bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
              <IoWaterOutline className="w-8 h-8" />
              <span>Telemetering Perum Jasa Tirta</span>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Map Component */}
        <MapPJTContent />

        {/* Tabs Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <Tabs defaultValue="waterlevel" className="space-y-6">
              <TabsList className="bg-white/20 backdrop-blur-sm border-white/30 p-1 rounded-xl">
                <TabsTrigger 
                  value="waterlevel" 
                  className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-white/80 rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoWaterOutline className="w-5 h-5 mr-2" />
                  Water Level
                </TabsTrigger>
                <TabsTrigger 
                  value="rainfall" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-white/80 rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoRainyOutline className="w-5 h-5 mr-2" />
                  Rainfall
                </TabsTrigger>
              </TabsList>

              <TabsContent value="waterlevel">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {telemeterData.Waterlevel?.map((station, index) => (
                    <Card key={station.header.name} className="bg-white/90 backdrop-blur-md border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-b border-slate-200">
                        <CardTitle className="text-white text-lg font-semibold flex items-center space-x-2">
                          <IoWaterOutline className="w-6 h-6 text-cyan-100" />
                          <span>{station.header.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4 bg-white">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Current Level:</span>
                          <span className="font-bold text-cyan-700 text-xl">
                            {getLatestValidReading(station.data, 'wl')} m
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium flex items-center">
                            <IoLocationOutline className="w-4 h-4 mr-1 text-slate-500" />
                            Coordinates:
                          </span>
                          <span className="text-slate-600 text-sm font-mono">
                            {station.header.x}, {station.header.y}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center text-slate-500 text-sm">
                            <IoTimeOutline className="w-4 h-4 mr-2" />
                            <span>Last updated: {getLatestDateTime(station.data)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rainfall">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {telemeterData.Rainfall?.map((station, index) => (
                    <Card key={station.header.name} className="bg-white/90 backdrop-blur-md border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-b border-slate-200">
                        <CardTitle className="text-white text-lg font-semibold flex items-center space-x-2">
                          <IoRainyOutline className="w-6 h-6 text-blue-100" />
                          <span>{station.header.name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4 bg-white">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Current Rainfall:</span>
                          <span className="font-bold text-blue-700 text-xl">
                            {getLatestValidReading(station.data, 'rf')} mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Total Today:</span>
                          <span className="font-bold text-indigo-700 text-xl">
                            {getTotalRainfall(station.data as RainfallData[])} mm
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 font-medium flex items-center">
                            <IoLocationOutline className="w-4 h-4 mr-1 text-slate-500" />
                            Coordinates:
                          </span>
                          <span className="text-slate-600 text-sm font-mono">
                            {station.header.x}, {station.header.y}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center text-slate-500 text-sm">
                            <IoTimeOutline className="w-4 h-4 mr-2" />
                            <span>Last updated: {getLatestDateTime(station.data)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelemeteringPJTContent;