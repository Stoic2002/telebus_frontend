import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { AWLRPerHourData } from '@/types/awlrTypes';
import ContentLoader from 'react-content-loader'

interface FormattedData {
  time: string;
  originalTime: Date;
  serayu: number;
  merawu: number;
  lumajang: number;
}

const InflowChartComponent = () => {
  const [data, setData] = useState<FormattedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<AWLRPerHourData[]>('http://192.168.105.90/db-awlr-hour');
        const rawData = response.data;

        // Kelompokkan data berdasarkan waktu
        const groupedData = rawData.reduce((acc: { [key: string]: FormattedData }, curr) => {
          const originalTime = new Date(curr.kWaktu);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          });

          if (!acc[timeKey]) {
            acc[timeKey] = {
              time: timeKey,
              originalTime: originalTime, // Store original time for sorting
              serayu: 0,
              merawu: 0,
              lumajang: 0
            };
          }

          // Map sensor IDs to river names
          switch (curr.id_sensor_tide) {
            case 1: // Serayu
              acc[timeKey].serayu = curr.debit;
              break;
            case 2: // Merawu
              acc[timeKey].merawu = curr.debit;
              break;
            case 3: // Lumajang
              acc[timeKey].lumajang = curr.debit;
              break;
          }

          return acc;
        }, {});

        // Convert to array and sort by time (oldest to newest)
        const formattedData = Object.values(groupedData)
          .sort((a, b) => a.originalTime.getTime() - b.originalTime.getTime());

        setData(formattedData);
      } catch (err) {
        setError('Failed to fetch water flow data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ContentLoader
          speed={2}
          width={400}
          height={160}
          viewBox="0 0 400 160"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="10" rx="5" ry="5" width="100" height="20" />
          <rect x="0" y="40" rx="5" ry="5" width="300" height="20" />
          <rect x="0" y="70" rx="5" ry="5" width="400" height="20" />
          <rect x="0" y="100" rx="5" ry="5" width="200" height="20" />
        </ContentLoader>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold mb-2">{`Waktu: ${label}`}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toFixed(2)} m³/s`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Legend dengan styling yang lebih baik
  const CustomLegend = () => (
    <div className="flex justify-center gap-8 mb-4">
      {[
        { name: 'Serayu', color: '#2563eb' },
        { name: 'Merawu', color: '#16a34a' },
        { name: 'Lumajang', color: '#dc2626' }
      ].map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );


  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg mt-6">
    <h2 className="text-xl font-bold mb-4 text-center">Debit Air per Jam</h2>
    <CustomLegend />
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
            label={{value:'date', position: 'bottom'}}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ 
              value: 'Debit (m³/s)', 
              angle: -90, 
              position: 'insideLeft',
              offset: -30
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="serayu" 
            name="Serayu"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="merawu" 
            name="Merawu"
            stroke="#16a34a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="lumajang" 
            name="Lumajang"
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default InflowChartComponent;