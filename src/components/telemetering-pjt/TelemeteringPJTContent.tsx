import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      <div className="p-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">Loading telemetry data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-red-500 text-center">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-green-500 to-gray-300 text-white rounded-t-md">
          <CardTitle>Telemetering Perum Jasa Tirta</CardTitle>
        </CardHeader>
      </Card>

      <MapPJTContent />

      <Tabs defaultValue="waterlevel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waterlevel">Water Level</TabsTrigger>
          <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
        </TabsList>

        <TabsContent value="waterlevel">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {telemeterData.Waterlevel?.map((station) => (
              <Card key={station.header.name}>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg">{station.header.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Level:</span>
                      <span className="font-semibold">
                        {getLatestValidReading(station.data, 'wl')} m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coordinates:</span>
                      <span className="text-sm">
                        {station.header.x}, {station.header.y}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Last updated: {getLatestDateTime(station.data)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rainfall">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {telemeterData.Rainfall?.map((station) => (
              <Card key={station.header.name}>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg">{station.header.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Rainfall:</span>
                      <span className="font-semibold">
                        {getLatestValidReading(station.data, 'rf')} mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Today:</span>
                      <span className="font-semibold">
                        {getTotalRainfall(station.data as RainfallData[])} mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coordinates:</span>
                      <span className="text-sm">
                        {station.header.x}, {station.header.y}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Last updated: {getLatestDateTime(station.data)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelemeteringPJTContent;