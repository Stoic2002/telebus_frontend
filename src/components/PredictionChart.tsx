import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Text } from 'recharts';
import { Prediction, PredictionParameter, PARAMETER_COLORS, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';
import { usePredictionData } from '@/hooks/useMachineLearningData';
import ContentLoader from 'react-content-loader';

interface PredictionChartProps {
  parameter: PredictionParameter;
  title?: string;
}

interface CombinedDataPoint {
  datetime: string;
  formattedDate: string;
  actual?: number;
  prediction?: number;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ parameter, title }) => {
  const { actualData, predictionData, accuracy, isLoading, error } = usePredictionData(parameter);
  
  // Combine actual and prediction data for the chart
  const combinedData: CombinedDataPoint[] = React.useMemo(() => {
    const dataMap = new Map<string, CombinedDataPoint>();
    
    // Extract just the date and hour from ISO string for display
    const formatDateString = (isoString: string) => {
      try {
        // Extract just the date and hour part, e.g. "2025-04-19 00"
        const dateTimeParts = isoString.split('T');
        if (dateTimeParts.length > 0) {
          const datePart = dateTimeParts[0]; // 2025-04-19
          const timePart = dateTimeParts[1] ? dateTimeParts[1].substr(0, 2) : "00"; // Get just the hour
          return `${datePart} ${timePart}`;
        }
        return isoString;
      } catch {
        return isoString;
      }
    };
    
    // Add actual data to the map
    actualData.forEach(item => {
      // Use the raw datetime as key
      const key = item.datetime;
      const formattedDate = formatDateString(item.datetime);
      
      dataMap.set(key, {
        datetime: key,
        formattedDate,
        actual: item.value
      });
    });
    
    // Add prediction data to the map (merge with actual if same timestamp)
    predictionData.forEach(item => {
      // Use the raw datetime as key
      const key = item.datetime;
      const formattedDate = formatDateString(item.datetime);
      
      if (dataMap.has(key)) {
        // Merge with existing data point
        const existing = dataMap.get(key)!;
        existing.prediction = item.value;
      } else {
        // Create new data point
        dataMap.set(key, {
          datetime: key,
          formattedDate,
          prediction: item.value
        });
      }
    });
    
    // Convert map to array and sort by datetime
    return Array.from(dataMap.values())
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
  }, [actualData, predictionData]);

  const formatYAxis = (value: number) => {
    return value.toFixed(1);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color, margin: '2px 0' }}>
              {`${pld.name}: ${pld.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
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
        <div className="text-lg text-red-500">{error.message}</div>
      </div>
    );
  }

  const yDomain = Y_AXIS_DOMAIN[parameter];

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        {title || `Prediksi ${parameter} (7 Hari)`}
      </h2>
      
      <div className="flex justify-center gap-8 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#1E40AF' }} />
          <span className="text-sm font-medium">Prediksi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
          <span className="text-sm font-medium">Aktual</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-black font-bold">
            Akurasi: {accuracy.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="formattedDate"
              angle={-45}
              textAnchor="end"
              interval="preserveStartEnd"
              minTickGap={50}
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={formatYAxis}
              label={{
                value: parameter,
                angle: -90,
                position: 'insideLeft',
                offset: -20
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Line for actual data (1 day) */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Aktual"
              stroke="#F59E0B"  // Yellow color for actual data
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            
            {/* Line for prediction data (7 days) */}
            <Line
              type="monotone"
              dataKey="prediction"
              name="Prediksi"
              stroke="#1E40AF"  // Blue color for prediction
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Add accuracy text overlay */}
        <div className="absolute top-5 right-5 bg-white bg-opacity-70 px-3 py-1 rounded-lg shadow">
          <span className="text-lg font-bold text-indigo-600">
            Akurasi: {accuracy.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart; 