import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simulasi data realtime (dalam implementasi nyata, ini akan diganti dengan data dari API/websocket)
const generateRealtimeData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    waterLevel: Math.random() * (80 - 70) + 70,
    flow: Math.random() * (150 - 100) + 100,
    power: Math.random() * (100 - 80) + 80,
  }));
};

const PLTADetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [realtimeData, setRealtimeData] = React.useState(generateRealtimeData());

  // Simulasi update data realtime setiap 5 detik
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...realtimeData];
      const lastEntry = newData[newData.length - 1];
      newData.shift();
      newData.push({
        time: lastEntry.time,
        waterLevel: Math.random() * (80 - 70) + 70,
        flow: Math.random() * (150 - 100) + 100,
        power: Math.random() * (100 - 80) + 80,
      });
      setRealtimeData(newData);
    }, 5000);

    return () => clearInterval(interval);
  }, [realtimeData]);

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100">
        <Header />
        <Sidebar />
        <main className="pl-16 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">PLTA {id}</h1>
            <p className="text-gray-600">Real-time Monitoring Dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Water Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {realtimeData[realtimeData.length - 1].waterLevel.toFixed(1)} m
                </div>
                <p className="text-gray-500">Updated just now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {realtimeData[realtimeData.length - 1].flow.toFixed(1)} m³/s
                </div>
                <p className="text-gray-500">Current discharge</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Power Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {realtimeData[realtimeData.length - 1].power.toFixed(1)} MW
                </div>
                <p className="text-gray-500">Current generation</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Water Level Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[60, 90]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="waterLevel" 
                      stroke="#2563eb" 
                      name="Water Level (m)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Power Generation</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 120]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="power" 
                      stroke="#dc2626" 
                      name="Power (MW)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PLTADetail;