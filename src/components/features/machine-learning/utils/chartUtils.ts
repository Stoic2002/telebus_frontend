import { Prediction, PredictionParameter, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';

// Chart colors configuration
export const CHART_COLORS = {
  actual: '#FFB800',    // Yellow for actual data
  yesterdayPrediction: '#93C5FD', // Light blue for yesterday's predictions
  futurePrediction: '#2563EB' // Dark blue for future predictions
};

// Format datetime for better readability
export const formatDateTime = (datetime: string): string => {
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

// Format X-axis labels for 7-day view
export const formatXAxisTick = (datetime: string): string => {
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

// Format datetime for CSV export
export const formatDateTimeForCSV = (datetime: string): string => {
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

// Get appropriate X-axis interval for 7-day view
export const getXAxisInterval = (): number => 23; // Show every 24th hour (once a day)

// Process data to ensure future prediction line doesn't appear for yesterday
export const processChartData = (
  currentHistorical: Prediction[], 
  currentPredictions: Prediction[]
): any[] => {
  return [...currentHistorical, ...currentPredictions].map((item: Prediction) => {
    // For historical data (yesterday), explicitly set value to null to hide the future prediction line
    if (item.actualValue !== undefined || item.predictedValue !== undefined) {
      return {
        ...item,
        value: null // This will hide the future prediction line for yesterday's data
      };
    }
    return item;
  });
};

// Calculate total and average for selected parameter
export const calculateStats = (data: Prediction[]): { total: number; average: number } => {
  if (data.length === 0) return { total: 0, average: 0 };
  
  const total = data.reduce((sum: number, item: Prediction) => sum + item.value, 0);
  const average = total / data.length;

  return { 
    total: parseFloat(total.toFixed(2)), 
    average: parseFloat(average.toFixed(2)) 
  };
};

// Calculate prediction accuracy for yesterday
export const calculateAccuracy = (historical: Prediction[]): { 
  accuracy: number; 
  mape: number; 
  meanError: number; 
} => {
  if (!historical || historical.length === 0) return { accuracy: 0, mape: 0, meanError: 0 };
  
  let totalError = 0;
  let totalPercentageError = 0;
  let count = 0;
  
  historical.forEach((item: Prediction) => {
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

// Find first and last datetime of yesterday's data
export const getYesterdayBounds = (currentHistorical: Prediction[]): { 
  start: string; 
  end: string; 
} => {
  if (currentHistorical.length === 0) return { start: "", end: "" };
  
  const sorted = [...currentHistorical].sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
  
  return {
    start: sorted[0]?.datetime || "",
    end: sorted[sorted.length - 1]?.datetime || ""
  };
};

// Count missing data points
export const getMissingDataCounts = (currentHistorical: Prediction[]): {
  missingActualDataPoints: number;
  missingPredictionDataPoints: number;
} => {
  const missingActualDataPoints = currentHistorical.filter(
    (item: Prediction) => item.actualValue === null
  ).length;
  
  const missingPredictionDataPoints = currentHistorical.filter(
    (item: Prediction) => item.predictedValue === null
  ).length;
  
  return {
    missingActualDataPoints,
    missingPredictionDataPoints
  };
}; 