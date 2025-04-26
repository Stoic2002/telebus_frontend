import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Label, Text } from 'recharts';
import { Prediction, PredictionParameter, PARAMETER_COLORS, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';
import { usePredictionData } from '@/hooks/useMachineLearningData';
import ContentLoader from 'react-content-loader';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

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
    
    // Add actual data to the map
    actualData.forEach(item => {
      const date = new Date(item.datetime);
      const key = date.toISOString();
      
      dataMap.set(key, {
        datetime: key,
        formattedDate: format(date, 'dd/MM HH:mm', { locale: id }),
        actual: item.value
      });
    });
    
    // Add prediction data to the map (merge with actual if same timestamp)
    predictionData.forEach(item => {
      const date = new Date(item.datetime);
      const key = date.toISOString();
      
      if (dataMap.has(key)) {
        // Merge with existing data point
        const existing = dataMap.get(key)!;
        existing.prediction = item.value;
      } else {
        // Create new data point
        dataMap.set(key, {
          datetime: key,
          formattedDate: format(date, 'dd/MM HH:mm', { locale: id }),
          prediction: item.value
        });
      }
    });
    
    // Convert map to array and sort by datetime
    return Array.from(dataMap.values())
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
  }, [actualData, predictionData]);

  // Determine if date is actual (for domain calculation)
  const isActualDate = (dateStr: string) => {
    if (!actualData.length) return false;
    
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    
    const firstActualDate = new Date(actualData[0].datetime);
    firstActualDate.setHours(0, 0, 0, 0);
    
    return checkDate.getTime() === firstActualDate.getTime();
  };

  const formatYAxis = (value: number) => {
    return value.toFixed(1);
  };

  const formatXAxis = (value: string) => {
    try {
      const date = parseISO(value);
      return format(date, 'dd/MM HH:mm');
    } catch {
      return value;
    }
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

  // Calculate minimum domain value for the 80% height effect
  const minDomain = yDomain 
    ? yDomain[0] + (yDomain[1] - yDomain[0]) * 0.2 
    : Math.min(...combinedData.filter(d => d.actual).map(d => d.actual || 0)) * 0.8;

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
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="80%" stopColor="#F59E0B" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            
            {/* Area for actual data with 80% height and 0.5 opacity */}
            <Area
              type="monotone"
              dataKey="actual"
              name="Aktual"
              stroke="#F59E0B"  // Yellow color
              fill="url(#actualGradient)"  // Gradient fill with yellow
              fillOpacity={0.5}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={false}
              // Set the base value to create the 80% height effect
              baseValue={minDomain}
            />
            
            {/* Line for prediction data */}
            <Line
              type="monotone"
              dataKey="prediction"
              name="Prediksi"
              stroke="#1E40AF"  // Blue color
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Add accuracy text overlay in the area fill */}
        <div className="absolute top-1/3 left-1/4 transform -translate-y-1/2 bg-white bg-opacity-70 px-3 py-1 rounded-lg shadow">
          <span className="text-lg font-bold text-yellow-600">
            Akurasi: {accuracy.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default PredictionChart; 