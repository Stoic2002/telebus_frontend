import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import { Loader2, Download, AlertCircle } from 'lucide-react';
import { Prediction, PredictionParameter, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';
import { useLast24HData } from '@/hooks/useMachineLearningData';
import { fetchPredictionsWithHistory } from '@/services/MachineLearning/machineLearningService';
import { MetricCard } from '@/components/common/cards/MetricCard';
import { CARD_THEMES } from '@/constants/colors';
import { Button } from '@/components/ui/button';
import { 
  IoWaterOutline,
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoAnalyticsOutline
} from 'react-icons/io5';

// Modified chart colors - same as legacy
const CHART_COLORS = {
  actual: '#FFB800',    // Yellow for actual data
  yesterdayPrediction: '#93C5FD', // Light blue for yesterday's predictions
  futurePrediction: '#2563EB' // Dark blue for future predictions
};

export const MLInflowSection: React.FC = () => {
  // State for predictions, loading, error - only INFLOW focused
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [historicalData, setHistoricalData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add state for actual yesterday data
  const [actualYesterdayData, setActualYesterdayData] = useState<Prediction[]>([]);
  const [isLoadingYesterdayData, setIsLoadingYesterdayData] = useState<boolean>(false);
  const [yesterdayDataError, setYesterdayDataError] = useState<string | null>(null);
  
  // Update state for yesterday's predictions
  const [yesterdayPredictions, setYesterdayPredictions] = useState<Prediction[]>([]);
  const [isLoadingYesterdayPredictions, setIsLoadingYesterdayPredictions] = useState<boolean>(false);
  const [yesterdayPredictionsError, setYesterdayPredictionsError] = useState<string | null>(null);
  const [hasYesterdayPredictions, setHasYesterdayPredictions] = useState<boolean>(false);
  
  const { data: dataLast24H, isLoading, error: err1 } = useLast24HData();

  // Format datetime for CSV - same as legacy
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
    }).replace(',', '');
  };

  // Always return 7-day steps (24 * 7 = 168) - same as legacy
  const getDurationSteps = (): number => 24 * 7;

  // Get appropriate X-axis interval for 7-day - same as legacy
  const getXAxisInterval = (): number => 23; // Show every 24th hour (once a day)

  // Fetch actual yesterday data from API - EXACT same as legacy
  const fetchYesterdayData = async () => {
    try {
      setIsLoadingYesterdayData(true);
      const response = await fetch('http://192.168.105.90/pbs-inflow-calc-h-yesterday');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create a map to check for and fill missing hours
      const hourData = new Map<number, number>();
      
      // Parse the timestamp and populate the map with available data
      data.forEach((item: any) => {
        const timestamp = new Date(item.timestamp);
        const hour = timestamp.getHours();
        const parsedValue = parseFloat(item.value);
        const absoluteValue = Math.abs(parsedValue);
        
        hourData.set(hour, absoluteValue);
      });
      
      // Create complete 24-hour dataset, filling in missing hours
      const transformedData: Prediction[] = [];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Get reference date for yesterday (keep year, month, day consistent)
      const refDate = new Date(data[0]?.timestamp || yesterday);
      refDate.setDate(refDate.getDate());
      
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date(refDate);
        date.setHours(hour, 0, 0, 0);
        
        // Check if we have data for this hour
        const value = hourData.get(hour);
        
        if (value !== undefined) {
          // Use actual value if available
          transformedData.push({
            datetime: date.toISOString(),
            value: value,
            actualValue: value,
            predictedValue: undefined
          });
        } else {
          // If hour is missing, add a placeholder with null value
          transformedData.push({
            datetime: date.toISOString(),
            value: null as any,
            actualValue: null as any,
            predictedValue: undefined
          });
        }
      }
      
      // Sort by datetime to ensure correct order
      transformedData.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
      
      setActualYesterdayData(transformedData);
      setYesterdayDataError(null);
    } catch (err) {
      console.error('Error fetching yesterday data:', err);
      setYesterdayDataError('Failed to fetch yesterday data');
    } finally {
      setIsLoadingYesterdayData(false);
    }
  };

  // Fetch yesterday's predictions from API - EXACT same as legacy
  const fetchYesterdayPredictions = async () => {
    try {
      setIsLoadingYesterdayPredictions(true);
      const response = await fetch('http://192.168.105.90/prediction-inflow-yesterday');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      
      if (data.length) {
        const yesterdayData = data;
        
        // Create a map to track which hours we have data for
        const hourData = new Map<number, number>();
        
        // Process the existing data to find available hours
        yesterdayData.forEach((item: any) => {
          const timestamp = new Date(item.date);
          const hour = timestamp.getHours();
          const value = Math.abs(parseFloat(item.inflow_prediction_value));
          hourData.set(hour, value);
        });
        
        // Create a complete 24-hour dataset
        const transformedData: Prediction[] = [];
        const refDate = new Date(yesterdayData[0]?.date || new Date());
        
        for (let hour = 0; hour < 24; hour++) {
          const date = new Date(refDate);
          date.setHours(hour, 0, 0, 0);
          
          // Check if we have data for this hour
          const value = hourData.get(hour);
          
          if (value !== undefined) {
            // Use actual prediction if available
            transformedData.push({
              datetime: date.toISOString(),
              value: value,
              predictedValue: value,
              actualValue: undefined
            });
          } else {
            // For missing hours, add a placeholder with null value
            transformedData.push({
              datetime: date.toISOString(),
              value: null as any,
              predictedValue: null as any,
              actualValue: undefined
            });
          }
        }
        
        // Sort by datetime to ensure correct order
        transformedData.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
        
        setYesterdayPredictions(transformedData);
        setHasYesterdayPredictions(true);
        setYesterdayPredictionsError(null);
      } else {
        // Not enough historical data
        setYesterdayPredictions([]);
        setHasYesterdayPredictions(false);
        setYesterdayPredictionsError('Not enough historical prediction data');
      }
    } catch (err) {
      console.error('Error fetching yesterday predictions:', err);
      setYesterdayPredictionsError('Error loading prediction data');
      setHasYesterdayPredictions(false);
    } finally {
      setIsLoadingYesterdayPredictions(false);
    }
  };

  // Fetch predictions from API - simplified for INFLOW only
  const fetchPredictions = async () => {
    const steps = getDurationSteps();
    
    try {
      setLoading(true);
      
      // Only fetch INFLOW predictions
      const result = await fetchPredictionsWithHistory('INFLOW', 168, dataLast24H);
      
      // Process future predictions to ensure absolute values
      const futurePredictions = result.predictions.map((pred: Prediction) => ({
        ...pred,
        value: Math.abs(pred.value),
        predictedValue: pred.predictedValue !== undefined ? Math.abs(pred.predictedValue) : undefined,
        actualValue: pred.actualValue !== undefined ? Math.abs(pred.actualValue) : undefined
      }));

      // For INFLOW, use the actual API data for historical values
      let historicalResults: Prediction[] = [];
      if (actualYesterdayData.length > 0) {
        // Create a map of yesterday's historical data with both actual and predicted values
        historicalResults = actualYesterdayData.map((actualItem, index) => {
          // Get corresponding prediction from API data if available
          const predictionItem = hasYesterdayPredictions && yesterdayPredictions.length > index 
            ? yesterdayPredictions[index] 
            : null;
          
          return {
            datetime: actualItem.datetime,
            value: 0, // Set to 0 to hide future prediction line
            actualValue: actualItem.actualValue, // Actual value from API
            predictedValue: predictionItem ? predictionItem.predictedValue : undefined // From API
          };
        });
      } else {
        // If no actual data, use service mock data
        historicalResults = result.historicalData.map((histItem: Prediction, index: number) => {
          // Get corresponding prediction from API data if available
          const predictionItem = hasYesterdayPredictions && yesterdayPredictions.length > index 
            ? yesterdayPredictions[index] 
            : null;
          
          return {
            ...histItem,
            value: 0, // Set to 0 to hide future prediction line
            predictedValue: predictionItem ? predictionItem.predictedValue : histItem.predictedValue
          };
        });
      }

      setPredictions(futurePredictions);
      setHistoricalData(historicalResults);
      setError(null);
    } catch (err) {
      setError('Failed to fetch predictions. Please check your API connection.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Use effects - same as legacy
  useEffect(() => {
    fetchYesterdayData();
  }, []);

  useEffect(() => {
    fetchYesterdayPredictions();
  }, []);

  useEffect(() => {
    if (dataLast24H && dataLast24H.length > 0) {
      fetchPredictions();
    }
  }, [dataLast24H, actualYesterdayData]);

  // Format datetime for better readability - same as legacy
  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    
    const formatter = new Intl.DateTimeFormat('id-ID', {
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false,
      timeZone: 'Asia/Jakarta'
    });

    return formatter.format(date);
  };

  // Format X-axis labels for 7-day view - same as legacy
  const formatXAxisTick = (datetime: string) => {
    const date = new Date(datetime);
    
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

  // Calculate total and average - same as legacy
  const calculateStats = (data: Prediction[]) => {
    if (data.length === 0) return { total: 0, average: 0 };
    
    const total = data.reduce((sum: number, item: Prediction) => sum + item.value, 0);
    const average = total / data.length;

    return { 
      total: parseFloat(total.toFixed(2)), 
      average: parseFloat(average.toFixed(2)) 
    };
  };

  // Download function - same as legacy
  const handleDownload = () => {
    const escapeCsvValue = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvRows = [
      [`DateTime,INFLOW_Predicted_Value`],
      ...predictions.map((prediction: Prediction) => 
        `${escapeCsvValue(formatDateTimeForCSV(prediction.datetime))},${prediction.value.toFixed(2)}`
      ),
      `Total,${calculateStats(predictions).total.toFixed(2)}`,
      `Average,${calculateStats(predictions).average.toFixed(2)}`
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `INFLOW_predictions_7-day_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Process data to ensure future prediction line doesn't appear for yesterday - same as legacy
  const processedData = [...historicalData, ...predictions].map((item: Prediction) => {
    if (item.actualValue !== undefined || item.predictedValue !== undefined) {
      return {
        ...item,
        value: null // This will hide the future prediction line for yesterday's data
      };
    }
    return item;
  });

  // Calculate prediction accuracy for yesterday - same as legacy  
  const calculateAccuracy = (historical: Prediction[]) => {
    if (!historical || historical.length === 0) return { accuracy: 0, mape: 0, meanError: 0 };
    
    let totalError = 0;
    let totalPercentageError = 0;
    let count = 0;
    
    historical.forEach((item: Prediction) => {
      if (item.actualValue !== undefined && item.predictedValue !== undefined && 
          item.actualValue !== null && item.predictedValue !== null) {
        const error = Math.abs(item.actualValue - item.predictedValue);
        totalError += error;
        
        if (item.actualValue !== 0) {
          const percentageError = (error / Math.abs(item.actualValue)) * 100;
          totalPercentageError += percentageError;
        }
        
        count++;
      }
    });
    
    if (count === 0) return { accuracy: 0, mape: 0, meanError: 0 };
    
    const meanError = totalError / count;
    const mape = totalPercentageError / count;
    const accuracy = Math.max(0, Math.min(100, 100 - mape));
    
    return { 
      accuracy: parseFloat(accuracy.toFixed(2)),
      mape: parseFloat(mape.toFixed(2)),
      meanError: parseFloat(meanError.toFixed(2))
    };
  };

  // Get yesterday bounds - same as legacy
  const getYesterdayBounds = () => {
    if (historicalData.length === 0) return { start: "", end: "" };
    
    const sorted = [...historicalData].sort((a, b) => 
      new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    
    return {
      start: sorted[0]?.datetime || "",
      end: sorted[sorted.length - 1]?.datetime || ""
    };
  };

  const { accuracy: accuracyYesterday } = calculateAccuracy(historicalData);
  const { total, average } = calculateStats([...historicalData, ...predictions]);
  const { start: yesterdayStart, end: yesterdayEnd } = getYesterdayBounds();

  // Warning components - same logic as legacy
  const renderYesterdayPredictionsWarning = () => {
    if (isLoadingYesterdayPredictions) {
      return (
        <div className="mb-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <span>Loading yesterday's prediction data...</span>
          </div>
        </div>
      );
    }
    
    if (yesterdayPredictionsError) {
      return (
        <div className="mb-4 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">
              {hasYesterdayPredictions 
                ? 'Using incomplete prediction data from yesterday' 
                : 'No prediction data available for yesterday'}
            </span>
            <Button 
              onClick={fetchYesterdayPredictions}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderYesterdayDataWarning = () => {
    if (isLoadingYesterdayData) {
      return (
        <div className="mb-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <span>Loading yesterday's actual data...</span>
          </div>
        </div>
      );
    }
    
    if (yesterdayDataError) {
      return (
        <div className="mb-4 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Using mock data for yesterday (API connection failed)</span>
            <Button 
              onClick={fetchYesterdayData}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderMissingDataWarning = () => {
    const missingActualDataPoints = historicalData.filter((item: Prediction) => item.actualValue === null).length;
    const missingPredictionDataPoints = historicalData.filter((item: Prediction) => item.predictedValue === null).length;
    
    if (missingActualDataPoints > 0 || missingPredictionDataPoints > 0) {
      return (
        <div className="mb-4 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-amber-700">
              Data gaps detected: {missingActualDataPoints > 0 ? `${missingActualDataPoints} missing actual values` : ''}
              {missingActualDataPoints > 0 && missingPredictionDataPoints > 0 ? ' and ' : ''}
              {missingPredictionDataPoints > 0 ? `${missingPredictionDataPoints} missing prediction values` : ''}
            </span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Shimmer loading - simplified for project pattern
  if (loading || isLoading || isLoadingYesterdayData) {
    return (
      <div className="space-y-6">
        {/* Metrics Section Loading */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-xl overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-16"></div>
                <div className="p-4 space-y-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chart Section Loading */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gray-200 h-16 animate-pulse"></div>
          <div className="p-6">
            <div className="h-[400px] bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || err1) {
    const errorMessage = error || err1;
    const errorText = errorMessage ? 
      (typeof errorMessage === 'object' ? 
        (errorMessage.message || 'An unknown error occurred') : 
        String(errorMessage))
      : 'An unknown error occurred';

    return (
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-300 rounded-full"></div>
            <h3 className="text-xl font-semibold">Error Loading Data</h3>
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="text-center space-y-4">
            <div className="text-red-600 text-lg font-semibold">
              {errorText}
            </div>
            <div className="flex space-x-4 justify-center">
              <Button 
                onClick={fetchPredictions} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Retry Prediction API
              </Button>
              {yesterdayDataError && (
                <Button 
                  onClick={fetchYesterdayData} 
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Retry Yesterday Data
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics for MetricCards
  const currentPredictions = predictions || [];
  const currentHistorical = historicalData || [];
  
  const avgValue = currentPredictions.length > 0 ? 
    currentPredictions.reduce((sum, item) => sum + item.value, 0) / currentPredictions.length : 0;
  const maxValue = currentPredictions.length > 0 ? 
    Math.max(...currentPredictions.map(item => item.value)) : 0;

  // Metric cards configuration
  const metricCards = [
    {
      title: "Akurasi Kemarin",
      value: `${accuracyYesterday.toFixed(1)}%`,
      subtitle: "accuracy prediction",
      icon: IoAnalyticsOutline,
      ...CARD_THEMES.waterLevel
    },
    {
      title: "Rata-rata Prediksi",
      value: `${avgValue.toFixed(2)} m³/s`,
      subtitle: "7 hari kedepan",
      icon: IoWaterOutline,
      ...CARD_THEMES.volumeEffective
    },
    {
      title: "Nilai Maksimum",
      value: `${maxValue.toFixed(2)} m³/s`,
      subtitle: "peak prediction",
      icon: IoTrendingUpOutline,
      ...CARD_THEMES.totalLoad
    },
    {
      title: "Total Data Points",
      value: `${currentHistorical.length + currentPredictions.length}`,
      subtitle: "historical + predicted",
      icon: IoStatsChartOutline,
      ...CARD_THEMES.prediction
    }
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Overview */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Inflow Metrics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((card, index) => (
            <MetricCard
              key={index}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              gradient={card.gradient}
              bgColor={card.bgColor}
              textColor={card.textColor}
            />
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-semibold">Inflow Predictions - 7 Day Forecast</h3>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-white/20 hover:bg-white/30 text-white flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </Button>
          </div>
        </div>
        <div className="p-6 bg-white">
          {/* Warnings */}
          {renderYesterdayDataWarning()}
          {renderYesterdayPredictionsWarning()}
          {renderMissingDataWarning()}
          
          {/* Chart */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                {/* Reference area with appropriate labels */}
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
                  domain={Y_AXIS_DOMAIN['INFLOW']}
                  label={{ 
                    value: `INFLOW Value`, 
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
                  connectNulls={false}
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
                  connectNulls={false}
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
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prediction Table */}
      <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-semibold">Inflow Data Details</h3>
          </div>
        </div>
        <div className="p-6 bg-white">
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
                {processedData.map((data: any, index: number) => {
                  const isYesterday = data.actualValue !== undefined;
                  const isMissingData = data.actualValue === null || data.predictedValue === null;
                  return (
                    <tr key={index} className={`border-b hover:bg-gray-50 ${isYesterday ? 'bg-yellow-50' : ''} ${isMissingData ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3">{formatDateTime(data.datetime)}</td>
                      <td className="px-4 py-3">
                        {data.actualValue === null 
                          ? <span className="text-red-500">Missing Data</span> 
                          : data.actualValue?.toFixed(2) || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {isYesterday 
                          ? (data.predictedValue === null 
                              ? <span className="text-red-500">Missing Data</span> 
                              : data.predictedValue?.toFixed(2)) 
                          : data.value?.toFixed(2)}
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
      </div>
    </div>
  );
}; 