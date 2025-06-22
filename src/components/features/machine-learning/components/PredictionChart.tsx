import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface PredictionData {
  datetime: string;
  actualValue?: number | null;
  predictedValue?: number | null;
}

interface PredictionChartProps {
  data: PredictionData[];
  isLoading?: boolean;
  className?: string;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ 
  data, 
  isLoading = false, 
  className 
}) => {
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`h-96 flex items-center justify-center ${className || ''}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center py-20 ${className || ''}`}>
        <div className="text-center space-y-4">
          <BarChart2 className="w-16 h-16 text-gray-400 mx-auto" />
          <div>
            <p className="text-gray-600 font-medium">No prediction data available</p>
            <p className="text-gray-500 text-sm">Please check back later or refresh the data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-96 ${className || ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="datetime"
            tickFormatter={formatDateTime}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip 
            labelFormatter={(value) => formatDateTime(value)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          
          <Line 
            type="monotone" 
            dataKey="actualValue" 
            stroke="#FFB800"
            strokeWidth={3}
            dot={{ fill: "#FFB800", strokeWidth: 2, r: 4 }}
            name="Actual Data"
            connectNulls={false}
          />
          <Line 
            type="monotone" 
            dataKey="predictedValue" 
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
            name="Predictions"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart; 