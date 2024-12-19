import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, BarChart2 } from 'lucide-react';
import { inputData } from '@/data/predictionData/predictionData';
import { PARAMETER_COLORS, Prediction, PredictionParameter, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';
import { useLast24HData } from '@/hooks/useMachineLearningData';

const MachineLearningContent: React.FC = () => {
  // State for predictions, loading, and error
  const [predictions, setPredictions] = useState<Record<PredictionParameter, Prediction[]>>({
    INFLOW: [],
    OUTFLOW: [],
    TMA: [],
    BEBAN: []
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParameter, setSelectedParameter] = useState<PredictionParameter>('INFLOW');
  const { data: dataLast24H, isLoading, error:err1 } = useLast24HData();

  // Fetch predictions from API
  const fetchPredictions = async () => {
    const parameters: PredictionParameter[] = ['INFLOW','OUTFLOW', 'TMA', 'BEBAN'];

    
    try {
      setLoading(true);
      const predictionResults: Record<PredictionParameter, Prediction[]> = {
        INFLOW: [],
        OUTFLOW: [],
        TMA: [],
        BEBAN: []
      };

      // Fetch predictions for each parameter
      for (const param of parameters) {
        const response = await fetch('http://localhost:8989/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            target_column: param,
            look_back: 24,
            steps: 24,
            data: dataLast24H
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        

        // Map API response to Prediction type
        predictionResults[param] = data.predictions.map((pred: any) => ({
          datetime: pred.datetime,
          value: param === 'TMA' 
            ? Math.max(224.50, Math.min(231.50, pred.value)) // Clamp TMA values
            : pred.value
        }));
      }
      setPredictions(predictionResults);
      setError(null);
    } catch (err) {
      setError('Failed to fetch predictions. Please check your API connection.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch predictions on component mount
  useEffect(() => {
    if (dataLast24H && dataLast24H.length > 0) {
      fetchPredictions();
      console.log('data last ',dataLast24H)
    }
  }, [dataLast24H]);


  // Format datetime for better readability
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    
    // Create a formatter for Indonesian locale
    const formatter = new Intl.DateTimeFormat('id-ID', {
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false, // Use 24-hour format
      timeZone: 'Asia/Jakarta' // Explicitly set to WIB
    });

    return formatter.format(date);
  };

  // Calculate total and average for selected parameter
  const calculateStats = (data: Prediction[]) => {
    if (data.length === 0) return { total: 0, average: 0 };
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const average = total / data.length;

    return { 
      total: parseFloat(total.toFixed(2)), 
      average: parseFloat(average.toFixed(2)) 
    };
  };

  // Render loading state
  if (loading || isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto flex justify-center items-center h-96 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg mt-6">
        <div className="w-full flex flex-col items-center space-y-4">
          {/* Shimmer Block */}
          <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-1/2 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-full h-56 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </Card>
    );
  }

  // Render error state
  if (error || err1) {
    return (
      <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-red-600 text-lg font-semibold text-center">
            {error}
          </div>
          <button 
            onClick={fetchPredictions} 
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Retry Connection
          </button>
        </CardContent>
      </Card>
    );
  }

  // Get current predictions and stats
  const currentPredictions = predictions[selectedParameter];
  const { total, average } = calculateStats(currentPredictions);

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BarChart2 className="w-10 h-10" />
            <span className="text-2xl font-bold">Machine Learning Predictions</span>
          </div>
          <div className="space-x-2">
            {/* Parameter selection buttons */}
            {(['INFLOW','TMA','BEBAN'] as PredictionParameter[]).map((param) => (
              <button
                key={param}
                onClick={() => setSelectedParameter(param)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 text-sm ${
                  selectedParameter === param 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'bg-blue-700 text-white hover:bg-blue-600'
                }`}
              >
                {param}
              </button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={currentPredictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="datetime" 
                tickFormatter={(value) => formatDateTime(value)}
                interval="preserveStartEnd"
                stroke="#6b7280"
              />
              <YAxis 
                domain={Y_AXIS_DOMAIN[selectedParameter]}
                label={{ 
                  value: `Predicted ${selectedParameter}`, 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#6b7280'
                }} 
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.9)', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}
                labelFormatter={(value) => formatDateTime(value)} 
                formatter={(value) => [parseFloat(value.toString()).toFixed(2), 'Predicted Value']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={PARAMETER_COLORS[selectedParameter]} 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: PARAMETER_COLORS[selectedParameter] }}
                activeDot={{ r: 8, strokeWidth: 2, fill: PARAMETER_COLORS[selectedParameter] }}
                name={`${selectedParameter} Prediction`} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Prediction Table */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {selectedParameter} Prediction Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Predicted Value</th>
                </tr>
              </thead>
              <tbody>
                {currentPredictions.map((prediction, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{formatDateTime(prediction.datetime)}</td>
                    <td className="px-4 py-3">{prediction.value.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-4 py-3 text-gray-700">Total / Average</td>
                  <td className="px-4 py-3 text-blue-700">
                    {total} / {average}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineLearningContent;