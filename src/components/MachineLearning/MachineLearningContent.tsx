import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import { Loader2, BarChart2, Download, Clock, AlertCircle } from 'lucide-react';
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

  // Fetch actual yesterday data from API
  const fetchYesterdayData = async () => {
    try {
      setIsLoadingYesterdayData(true);
      const response = await fetch('http://192.168.105.90/pbs-inflow-h-yesterday');
      
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
          // This will create a gap in the line chart rather than connecting through incorrect values
          transformedData.push({
            datetime: date.toISOString(),
            value: null as any, // Use null to create a gap
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

  // Use effect to fetch yesterday's actual data
  useEffect(() => {
    fetchYesterdayData();
  }, []);

  // Fetch yesterday's predictions from API
  const fetchYesterdayPredictions = async () => {
    try {
      setIsLoadingYesterdayPredictions(true);
      const response = await fetch('http://192.168.105.90/prediction-inflow-today');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      
      if (data.length > 24) {
        const yesterdayData = data.slice(24, 48);
        
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
              value: null as any, // Use null to create a gap in the chart
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

  // Use effect to fetch yesterday's predictions on component mount
  useEffect(() => {
    fetchYesterdayPredictions();
  }, []);

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
        // Only use the service for predictions and predicted historical data
        const result = await fetchPredictionsWithHistory(param, 168, dataLast24H);
        
        // Process future predictions to ensure absolute values
        predictionResults[param] = result.predictions.map(pred => ({
          ...pred,
          value: Math.abs(pred.value), // Ensure value is absolute (positive)
          predictedValue: pred.predictedValue !== undefined ? Math.abs(pred.predictedValue) : undefined,
          actualValue: pred.actualValue !== undefined ? Math.abs(pred.actualValue) : undefined
        }));
        
        if (param === 'INFLOW') {
          // For INFLOW, use the actual API data for actual values
          if (actualYesterdayData.length > 0) {
            // Create a map of yesterday's historical data with both actual and predicted values
            historicalResults[param] = actualYesterdayData.map((actualItem, index) => {
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
            historicalResults[param] = result.historicalData.map((histItem, index) => {
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
        } else {
          // For other parameters, use the service mock data
          historicalResults[param] = result.historicalData.map(histItem => ({
            ...histItem,
            value: 0, // Set to 0 to hide future prediction line
            predictedValue: histItem.predictedValue !== undefined ? Math.abs(histItem.predictedValue) : undefined,
            actualValue: histItem.actualValue !== undefined ? Math.abs(histItem.actualValue) : undefined
          }));
        }
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

  // Use effect to fetch predictions when data changes or when actualYesterdayData changes
  useEffect(() => {
    if (dataLast24H && dataLast24H.length > 0) {
      fetchPredictions();
    }
  }, [dataLast24H, actualYesterdayData]);

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
    if (!historical || historical.length === 0) return { accuracy: 0, mape: 0, meanError: 0 };
    
    let totalError = 0;
    let totalPercentageError = 0;
    let count = 0;
    
    historical.forEach(item => {
      // Only include points that have both actual and predicted values (not null)
      if (item.actualValue !== undefined && item.predictedValue !== undefined && 
          item.actualValue !== null && item.predictedValue !== null) {
        const error = Math.abs(item.actualValue - item.predictedValue);
        totalError += error;
        
        // Prevent division by zero
        if (item.actualValue !== 0) {
          const percentageError = (error / Math.abs(item.actualValue)) * 100;
          totalPercentageError += percentageError;
        }
        
        count++;
      }
    });
    
    // If no valid matching points, return 0
    if (count === 0) return { accuracy: 0, mape: 0, meanError: 0 };
    
    const meanError = totalError / count;
    const mape = totalPercentageError / count; // Mean Absolute Percentage Error
    
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

  // Find first and last datetime of yesterday's data to position the "Not enough data" message
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

  // Render info for missing predictions or data points
  const renderChartLabels = () => {
    // For missing yesterday predictions
    if (!hasYesterdayPredictions && !isLoadingYesterdayPredictions && yesterdayStart && yesterdayEnd) {
      return (
        <ReferenceArea
          x1={yesterdayStart}
          x2={yesterdayEnd}
          fill="#FEF9C3"
          fillOpacity={0.2}
          strokeOpacity={0}
        >
          
        </ReferenceArea>
      );
    }
    
    // Check for missing data points
    const missingDataPoints = currentHistorical.filter(
      item => item.actualValue === null || item.predictedValue === null
    ).length;
    
    if (missingDataPoints > 0 && yesterdayStart && yesterdayEnd) {
      return (
        <ReferenceArea
          x1={yesterdayStart}
          x2={yesterdayEnd}
          fill="#FEF9C3"
          fillOpacity={0.2}
          strokeOpacity={0}
        >
          <Label
            value={`Accuracy: ${accuracyYesterday}%`}
            position="insideTop"
            fill="#B45309"
            fontSize={12}
            offset={10}
          />
          <Label
            value={`(${missingDataPoints} missing data)`}
            position="insideTop"
            fill="#B45309"
            fontSize={12}
            offset={20}
          />
        </ReferenceArea>
      );
    }
    
    // Default label with accuracy
    if (yesterdayStart && yesterdayEnd) {
      return (
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
      );
    }
    
    return null;
  };

  // Render info for missing predictions
  const renderNotEnoughDataLabel = () => {
    if (!hasYesterdayPredictions && !isLoadingYesterdayPredictions && yesterdayStart && yesterdayEnd) {
      return (
        <ReferenceArea
          x1={yesterdayStart}
          x2={yesterdayEnd}
          fill="#FEF9C3"
          fillOpacity={0.2}
          strokeOpacity={0}
        >
          <Label
            value="Not enough data"
            position="center"
            fill="#B45309"
            fontSize={14}
            fontWeight="bold"
          />
        </ReferenceArea>
      );
    }
    return null;
  };

  // Add warning for yesterday predictions
  const renderYesterdayPredictionsWarning = () => {
    if (isLoadingYesterdayPredictions) {
      return (
        <div className="mb-2 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <span>Loading yesterday's prediction data...</span>
          </div>
        </div>
      );
    }
    
    if (yesterdayPredictionsError) {
      return (
        <div className="mb-2 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">
              {hasYesterdayPredictions 
                ? 'Using incomplete prediction data from yesterday' 
                : 'No prediction data available for yesterday'}
            </span>
            <button 
              onClick={fetchYesterdayPredictions}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Add warning for yesterday data
  const renderYesterdayDataWarning = () => {
    if (isLoadingYesterdayData) {
      return (
        <div className="mb-2 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <span>Loading yesterday's actual data...</span>
          </div>
        </div>
      );
    }
    
    if (yesterdayDataError) {
      return (
        <div className="mb-2 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Using mock data for yesterday (API connection failed)</span>
            <button 
              onClick={fetchYesterdayData}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Add warning for missing data points
  const renderMissingDataWarning = () => {
    // Count missing data points
    const missingActualDataPoints = currentHistorical.filter(item => item.actualValue === null).length;
    const missingPredictionDataPoints = currentHistorical.filter(item => item.predictedValue === null).length;
    
    if (missingActualDataPoints > 0 || missingPredictionDataPoints > 0) {
      return (
        <div className="mb-2 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
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

  // Render an improved shimmer skeleton loading state
  const renderShimmerSkeleton = () => {
    return (
      <Card className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden mt-6">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-md animate-pulse"></div>
              <div className="w-64 h-8 bg-white/20 rounded-md animate-pulse"></div>
            </div>
            <div className="w-36 h-10 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-gray-50">
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="mb-4 flex justify-between items-center">
              <div className="w-60 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Chart skeleton */}
            <div className="w-full h-[400px] bg-gray-100 rounded-xl animate-pulse flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-4"></div>
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-36 h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          </div>
          
          {/* Table skeleton */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-3">
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render loading state
  if (loading || isLoading || isLoadingYesterdayData) {
    return renderShimmerSkeleton();
  }

  // Render error state
  if (error || err1 || yesterdayDataError) {
    // Convert errors to string to avoid React Node issues
    const errorMessage = error || err1 || yesterdayDataError;
    const errorText = errorMessage ? 
      (typeof errorMessage === 'object' ? 
        (errorMessage.message || 'An unknown error occurred') : 
        String(errorMessage))
      : 'An unknown error occurred';

    return (
      <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-red-600 text-lg font-semibold text-center">
            {errorText}
          </div>
          <div className="flex space-x-4">
            {(error || err1) && (
              <button 
                onClick={fetchPredictions} 
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Retry Prediction API
              </button>
            )}
            {yesterdayDataError && (
              <button 
                onClick={fetchYesterdayData} 
                className="px-6 py-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Retry Yesterday Data
              </button>
            )}
          </div>
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
          
          {renderYesterdayDataWarning()}
          {renderYesterdayPredictionsWarning()}
          {renderMissingDataWarning()}
          
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                {/* Reference area with appropriate labels */}
                {renderChartLabels()}
                {renderNotEnoughDataLabel()}
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
      </CardContent>
    </Card>
  );
};

export default MachineLearningContent;