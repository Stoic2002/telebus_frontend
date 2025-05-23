import { Prediction, PredictionParameter } from '@/types/machineLearningTypes';

interface ExtendedPrediction extends Prediction {
  actualValue?: number;
  predictedValue?: number;
}

// Helper function to generate mock data for previous day with distinct actual and predicted values
const generatePreviousDayData = (parameter: PredictionParameter): ExtendedPrediction[] => {
  const data: ExtendedPrediction[] = [];
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Base values for each parameter to create a wave pattern
  const baseValues: Record<PredictionParameter, number> = {
    INFLOW: 100,
    OUTFLOW: 80,
    TMA: 228,
    BEBAN: 500
  };

  // Amplitude for the wave pattern
  const amplitudes: Record<PredictionParameter, number> = {
    INFLOW: 30,
    OUTFLOW: 25,
    TMA: 2,
    BEBAN: 200
  };

  // Generate 24 hours of yesterday's data
  for (let hour = 0; hour < 24; hour++) {
    const date = new Date(yesterday);
    date.setHours(hour, 0, 0, 0);
    
    // Create wave pattern based on hour (24-hour cycle)
    const progress = (hour / 24) * 2 * Math.PI;
    const baseValue = baseValues[parameter];
    const amplitude = amplitudes[parameter];

    // Generate actual value with a sine wave pattern
    const actualValue = baseValue + amplitude * Math.sin(progress);
    
    // Generate predicted value with a similar pattern but shifted and with some error
    const predictedValue = baseValue + amplitude * Math.sin(progress + 0.5) + (amplitude * 0.2 * (Math.random() - 0.5));

    // Ensure TMA stays within bounds
    if (parameter === 'TMA') {
      data.push({
        datetime: date.toISOString(),
        actualValue: Math.max(224.50, Math.min(231.50, actualValue)),
        predictedValue: Math.max(224.50, Math.min(231.50, predictedValue)),
        value: 0 // Set to 0 as we don't want to show future prediction line for yesterday
      });
    } else {
      data.push({
        datetime: date.toISOString(),
        actualValue: Math.max(0, actualValue),
        predictedValue: Math.max(0, predictedValue),
        value: 0 // Set to 0 as we don't want to show future prediction line for yesterday
      });
    }
  }

  // Format all numbers to 2 decimal places
  return data.map(item => ({
    ...item,
    actualValue: Number(item.actualValue?.toFixed(2)),
    predictedValue: Number(item.predictedValue?.toFixed(2)),
    value: 0 // Keep value as 0 to hide future prediction line
  }));
};

// Function to fetch predictions with previous day data
export const fetchPredictionsWithHistory = async (
  parameter: PredictionParameter,
  lookBack: number = 168,
  currentData: any[]
): Promise<{
  predictions: ExtendedPrediction[];
  historicalData: ExtendedPrediction[];
}> => {
  try {
    // Generate mock data for previous day with distinct actual and predicted values
    const historicalData = generatePreviousDayData(parameter);

    // Fetch future predictions from API
    const response = await fetch('http://192.168.105.90:8989/prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        target_column: parameter,
        look_back: lookBack,
        data: currentData
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Process future predictions (starting from today)
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const predictions = data.predictions
      .filter((pred: any) => new Date(pred.datetime) >= now) // Only include predictions from today onwards
      .map((pred: any) => {
        const predictedValue = parameter === 'TMA' 
          ? Math.max(224.50, Math.min(231.50, pred.value))
          : Number(pred.value.toFixed(2));
        
        return {
          datetime: pred.datetime,
          value: predictedValue, // Only show future prediction line for future data
          predictedValue: undefined,
          actualValue: undefined
        };
      });

    return {
      predictions,
      historicalData
    };
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};

// Function to combine historical and prediction data
export const combinePredictionData = (
  historicalData: ExtendedPrediction[],
  predictions: ExtendedPrediction[]
): ExtendedPrediction[] => {
  return [...historicalData, ...predictions];
}; 