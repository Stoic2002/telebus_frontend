import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import { Loader2, BarChart2, Download, Clock } from 'lucide-react';
import { PARAMETER_COLORS, Prediction, PredictionParameter, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';
import { useLast24HData } from '@/hooks/useMachineLearningData';
import { fetchPredictionsWithHistory, combinePredictionData } from '@/services/MachineLearning/machineLearningService';

// Define prediction duration type
type PredictionDuration = '7-day';

// Modified chart colors
const CHART_COLORS = {
  actual: '#FFB800',    // Yellow for actual data
  yesterdayPrediction: '#93C5FD', // Light blue for yesterday's predictions
  futurePrediction: '#2563EB' // Dark blue for future predictions
};

const MachineLearningContent: React.FC = () => {
  // State for predictions, loading, error, and parameter selection
  const [predictions, setPredictions] = useState<Record<PredictionParameter, Prediction[]>>({
    INFLOW: [],
    OUTFLOW: [],
    TMA: [],
    BEBAN: []
  });
  
  const [historicalData, setHistoricalData] = useState<Record<PredictionParameter, Prediction[]>>({
    INFLOW: [],
    OUTFLOW: [],
    TMA: [],
    BEBAN: []
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Set default parameter to INFLOW only
  const [selectedParameter] = useState<PredictionParameter>('INFLOW');
  
  // Set default to 7-day only
  const [predictionDuration] = useState<PredictionDuration>('7-day');
  
  const { data: dataLast24H, isLoading, error: err1 } = useLast24HData();

  const formatDateTimeForCSV = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).replace(',', ''); // Remove comma between date and time
  };

  // Always return 7-day steps (24 * 7 = 168)
  const getDurationSteps = (): number => 24 * 7;

  // Get appropriate X-axis interval for 7-day
  const getXAxisInterval = (): number => 23; // Show every 24th hour (once a day)

  // Fetch predictions from API
  const fetchPredictions = async () => {
    const parameters: PredictionParameter[] = ['INFLOW', 'OUTFLOW', 'TMA', 'BEBAN'];
    const steps = getDurationSteps();
    
    try {
      setLoading(true);
      const predictionResults: Record<PredictionParameter, Prediction[]> = {
        INFLOW: [],
        OUTFLOW: [],
        TMA: [],
        BEBAN: []
      };
      
      const historicalResults: Record<PredictionParameter, Prediction[]> = {
        INFLOW: [],
        OUTFLOW: [],
        TMA: [],
        BEBAN: []
      };

      // Fetch predictions for each parameter
      for (const param of parameters) {
        const result = await fetchPredictionsWithHistory(param, 168, dataLast24H);
        predictionResults[param] = result.predictions;
        historicalResults[param] = result.historicalData;
      }

      setPredictions(predictionResults);
      setHistoricalData(historicalResults);
      setError(null);
    } catch (err) {
      setError('Failed to fetch predictions. Please check your API connection.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch predictions when data changes
  useEffect(() => {
    if (dataLast24H && dataLast24H.length > 0) {
      fetchPredictions();
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

  // Format X-axis labels for 7-day view
  const formatXAxisTick = (datetime: string) => {
    const date = new Date(datetime);
    
    // Show day and hour for 7-day view
    const dayStr = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Jakarta'
    }).format(date);
      
    const hourStr = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date);
      
    return `${dayStr} ${hourStr}`;
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

  // Modified download function with proper CSV handling
  const handleDownload = () => {
    const currentPredictions = predictions[selectedParameter];
    
    // Properly escape and format CSV content
    const escapeCsvValue = (value: string) => {
      // If value contains commas, quotes, or newlines, wrap in quotes
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Create CSV content with proper formatting
    const csvRows = [
      // Header row
      [`DateTime,${selectedParameter}_Predicted_Value`],
      // Data rows
      ...currentPredictions.map(prediction => 
        `${escapeCsvValue(formatDateTimeForCSV(prediction.datetime))},${prediction.value.toFixed(2)}`
      ),
      // Summary rows
      `Total,${calculateStats(currentPredictions).total.toFixed(2)}`,
      `Average,${calculateStats(currentPredictions).average.toFixed(2)}`
    ];

    const csvContent = csvRows.join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedParameter}_predictions_7-day_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  // Prepare data for the chart with separate actual and predicted values
  const prepareChartData = (historical: Prediction[], predictions: Prediction[]) => {
    const historicalData = historical.map(item => ({
      ...item,
      actualValue: item.value,
      predictedValue: null
    }));

    const predictionData = predictions.map(item => ({
      ...item,
      actualValue: null,
      predictedValue: item.value
    }));

    return [...historicalData, ...predictionData];
  };

  // Get current predictions and stats
  const currentPredictions = predictions[selectedParameter];
  const currentHistorical = historicalData[selectedParameter];

  // Process data to ensure future prediction line doesn't appear for yesterday
  const processedData = [...currentHistorical, ...currentPredictions].map(item => {
    // For historical data (yesterday), explicitly set value to null to hide the future prediction line
    if (item.actualValue !== undefined || item.predictedValue !== undefined) {
      return {
        ...item,
        value: null // This will hide the future prediction line for yesterday's data
      };
    }
    return item;
  });

  // Calculate prediction accuracy for yesterday
  const calculateAccuracy = (historical: Prediction[]) => {
    if (!historical || historical.length === 0) return { accuracy: 0, mape: 0 };
    
    let totalError = 0;
    let totalPercentageError = 0;
    
    historical.forEach(item => {
      if (item.actualValue !== undefined && item.predictedValue !== undefined) {
        const error = Math.abs(item.actualValue - item.predictedValue);
        totalError += error;
        
        // Prevent division by zero
        if (item.actualValue !== 0) {
          const percentageError = (error / Math.abs(item.actualValue)) * 100;
          totalPercentageError += percentageError;
        }
      }
    });
    
    const meanError = totalError / historical.length;
    const mape = totalPercentageError / historical.length; // Mean Absolute Percentage Error
    
    // Convert MAPE to accuracy (100% - MAPE)
    const accuracy = Math.max(0, Math.min(100, 100 - mape));
    
    return { 
      accuracy: parseFloat(accuracy.toFixed(2)),
      mape: parseFloat(mape.toFixed(2)),
      meanError: parseFloat(meanError.toFixed(2))
    };
  };

  const { accuracy: accuracyYesterday, mape: mapeYesterday, meanError: meanErrorYesterday } = calculateAccuracy(currentHistorical);
  const { total, average } = calculateStats([...currentHistorical, ...currentPredictions]);

  // Find first and last datetime of yesterday's data
  const getYesterdayBounds = () => {
    if (currentHistorical.length === 0) return { start: "", end: "" };
    
    const sorted = [...currentHistorical].sort((a, b) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    
    return {
      start: sorted[0]?.datetime || "",
      end: sorted[sorted.length - 1]?.datetime || ""
    };
  };

  const { start: yesterdayStart, end: yesterdayEnd } = getYesterdayBounds();

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

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden mt-6">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BarChart2 className="w-10 h-10" />
            <span className="text-2xl font-bold">Inflow Predictions</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Download button */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-white text-blue-600 rounded-full flex items-center space-x-2 hover:bg-blue-50 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-700">
              Inflow Historical and Prediction Data
            </h3>
            <div className="text-sm text-gray-500">
              Showing {currentHistorical.length} historical + {currentPredictions.length} predicted hours
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              {/* Reference area for yesterday's data with yellow background */}
              {yesterdayStart && yesterdayEnd && (
                <ReferenceArea
                  x1={yesterdayStart}
                  x2={yesterdayEnd}
                  fill="#FEF9C3"
                  fillOpacity={0.4}
                  strokeOpacity={0}
                >
                  <Label
                    value={`Accuracy: ${accuracyYesterday}%`}
                    position="insideTop"
                    fill="#B45309"
                    fontSize={12}
                    offset={10}
                  />
                </ReferenceArea>
              )}
              <XAxis 
                dataKey="datetime" 
                tickFormatter={formatXAxisTick}
                interval={getXAxisInterval()}
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={60}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                domain={Y_AXIS_DOMAIN[selectedParameter]}
                label={{ 
                  value: `${selectedParameter} Value`, 
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
                formatter={(value, name) => {
                  if (value === null || value === undefined || value === 0) return ['-', name];
                  return [parseFloat(value.toString()).toFixed(2), name];
                }}
              />
              <Legend />
              {/* Yesterday's Actual Data Line */}
              <Line 
                type="monotone" 
                dataKey="actualValue" 
                stroke={CHART_COLORS.actual}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 2, fill: CHART_COLORS.actual }}
                name="Yesterday's Actual"
                connectNulls
              />
              {/* Yesterday's Prediction Line */}
              <Line 
                type="monotone" 
                dataKey="predictedValue" 
                stroke={CHART_COLORS.yesterdayPrediction}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 2, fill: CHART_COLORS.yesterdayPrediction }}
                name="Yesterday's Prediction"
                connectNulls
              />
              {/* Future Prediction Line (starting from today) */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={CHART_COLORS.futurePrediction}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8, strokeWidth: 2, fill: CHART_COLORS.futurePrediction }}
                name="Future Prediction"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Prediction Table */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Inflow Data Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Actual Value</th>
                  <th className="px-4 py-3">Predicted Value</th>
                  <th className="px-4 py-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((data, index) => {
                  const isYesterday = data.actualValue !== undefined;
                  return (
                    <tr key={index} className={`border-b hover:bg-gray-50 ${isYesterday ? 'bg-yellow-50' : ''}`}>
                      <td className="px-4 py-3">{formatDateTime(data.datetime)}</td>
                      <td className="px-4 py-3">{data.actualValue?.toFixed(2) || '-'}</td>
                      <td className="px-4 py-3">
                        {isYesterday ? data.predictedValue?.toFixed(2) : data.value?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs ${
                            isYesterday 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isYesterday ? 'Yesterday' : 'Future Prediction'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-4 py-3 text-gray-700">Total / Average</td>
                  <td className="px-4 py-3 text-blue-700" colSpan={3}>
                    {total.toFixed(2)} / {average.toFixed(2)}
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