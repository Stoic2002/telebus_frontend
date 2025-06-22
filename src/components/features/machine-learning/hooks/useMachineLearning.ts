import { useState, useEffect } from 'react';
import { Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import { useLast24HData } from '@/hooks/useMachineLearningData';
import { fetchPredictionsWithHistory } from '@/services/MachineLearning/machineLearningService';

interface UseMachineLearningReturn {
  // Data
  predictions: Record<PredictionParameter, Prediction[]>;
  historicalData: Record<PredictionParameter, Prediction[]>;
  actualYesterdayData: Prediction[];
  yesterdayPredictions: Prediction[];
  
  // Loading states
  loading: boolean;
  isLoadingYesterdayData: boolean;
  isLoadingYesterdayPredictions: boolean;
  
  // Error states
  error: string | null;
  yesterdayDataError: string | null;
  yesterdayPredictionsError: string | null;
  
  // Flags
  hasYesterdayPredictions: boolean;
  
  // Functions
  fetchYesterdayData: () => Promise<void>;
  fetchYesterdayPredictions: () => Promise<void>;
  fetchPredictions: () => Promise<void>;
}

export const useMachineLearning = (selectedParameter: PredictionParameter = 'INFLOW'): UseMachineLearningReturn => {
  // State management
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
  
  // Yesterday data state
  const [actualYesterdayData, setActualYesterdayData] = useState<Prediction[]>([]);
  const [isLoadingYesterdayData, setIsLoadingYesterdayData] = useState<boolean>(false);
  const [yesterdayDataError, setYesterdayDataError] = useState<string | null>(null);
  
  // Yesterday predictions state
  const [yesterdayPredictions, setYesterdayPredictions] = useState<Prediction[]>([]);
  const [isLoadingYesterdayPredictions, setIsLoadingYesterdayPredictions] = useState<boolean>(false);
  const [yesterdayPredictionsError, setYesterdayPredictionsError] = useState<string | null>(null);
  const [hasYesterdayPredictions, setHasYesterdayPredictions] = useState<boolean>(false);
  
  const { data: dataLast24H } = useLast24HData();

  // Always return 7-day steps (24 * 7 = 168)
  const getDurationSteps = (): number => 24 * 7;

  // Fetch actual yesterday data from API
  const fetchYesterdayData = async (): Promise<void> => {
    try {
      setIsLoadingYesterdayData(true);
      const response = await fetch('http://192.168.105.90/pbs-inflow-calc-h-yesterday');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const transformedData = transformYesterdayData(data);
      
      setActualYesterdayData(transformedData);
      setYesterdayDataError(null);
    } catch (err) {
      console.error('Error fetching yesterday data:', err);
      setYesterdayDataError('Failed to fetch yesterday data');
    } finally {
      setIsLoadingYesterdayData(false);
    }
  };

  // Fetch yesterday's predictions from API
  const fetchYesterdayPredictions = async (): Promise<void> => {
    try {
      setIsLoadingYesterdayPredictions(true);
      const response = await fetch('http://192.168.105.90/prediction-inflow-yesterday');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length) {
        const transformedData = transformYesterdayPredictions(data);
        setYesterdayPredictions(transformedData);
        setHasYesterdayPredictions(true);
        setYesterdayPredictionsError(null);
      } else {
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

  // Fetch predictions from API
  const fetchPredictions = async (): Promise<void> => {
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
        
        // Process future predictions to ensure absolute values
        predictionResults[param] = result.predictions.map((pred: Prediction) => ({
          ...pred,
          value: Math.abs(pred.value),
          predictedValue: pred.predictedValue !== undefined ? Math.abs(pred.predictedValue) : undefined,
          actualValue: pred.actualValue !== undefined ? Math.abs(pred.actualValue) : undefined
        }));
        
        if (param === 'INFLOW') {
          // For INFLOW, use the actual API data for actual values
          if (actualYesterdayData.length > 0) {
            historicalResults[param] = actualYesterdayData.map((actualItem, index) => {
              const predictionItem = hasYesterdayPredictions && yesterdayPredictions.length > index 
                ? yesterdayPredictions[index] 
                : null;
              
              return {
                datetime: actualItem.datetime,
                value: 0,
                actualValue: actualItem.actualValue,
                predictedValue: predictionItem ? predictionItem.predictedValue : undefined
              };
            });
          } else {
            historicalResults[param] = result.historicalData.map((histItem: Prediction, index: number) => {
              const predictionItem = hasYesterdayPredictions && yesterdayPredictions.length > index 
                ? yesterdayPredictions[index] 
                : null;
              
              return {
                ...histItem,
                value: 0,
                predictedValue: predictionItem ? predictionItem.predictedValue : histItem.predictedValue
              };
            });
          }
        } else {
          historicalResults[param] = result.historicalData.map((histItem: Prediction) => ({
            ...histItem,
            value: 0,
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

  // Transform yesterday data helper
  const transformYesterdayData = (data: any[]): Prediction[] => {
    const hourData = new Map<number, number>();
    
    data.forEach((item: any) => {
      const timestamp = new Date(item.timestamp);
      const hour = timestamp.getHours();
      const parsedValue = parseFloat(item.value);
      const absoluteValue = Math.abs(parsedValue);
      
      hourData.set(hour, absoluteValue);
    });
    
    const transformedData: Prediction[] = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const refDate = new Date(data[0]?.timestamp || yesterday);
    refDate.setDate(refDate.getDate());
    
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(refDate);
      date.setHours(hour, 0, 0, 0);
      
      const value = hourData.get(hour);
      
      if (value !== undefined) {
        transformedData.push({
          datetime: date.toISOString(),
          value: value,
          actualValue: value,
          predictedValue: undefined
        });
      } else {
        transformedData.push({
          datetime: date.toISOString(),
          value: null as any,
          actualValue: null as any,
          predictedValue: undefined
        });
      }
    }
    
    return transformedData.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  };

  // Transform yesterday predictions helper
  const transformYesterdayPredictions = (data: any[]): Prediction[] => {
    const hourData = new Map<number, number>();
    
    data.forEach((item: any) => {
      const timestamp = new Date(item.date);
      const hour = timestamp.getHours();
      const value = Math.abs(parseFloat(item.inflow_prediction_value));
      hourData.set(hour, value);
    });
    
    const transformedData: Prediction[] = [];
    const refDate = new Date(data[0]?.date || new Date());
    
    for (let hour = 0; hour < 24; hour++) {
      const date = new Date(refDate);
      date.setHours(hour, 0, 0, 0);
      
      const value = hourData.get(hour);
      
      if (value !== undefined) {
        transformedData.push({
          datetime: date.toISOString(),
          value: value,
          predictedValue: value,
          actualValue: undefined
        });
      } else {
        transformedData.push({
          datetime: date.toISOString(),
          value: null as any,
          predictedValue: null as any,
          actualValue: undefined
        });
      }
    }
    
    return transformedData.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  };

  // Effects
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

  return {
    predictions,
    historicalData,
    actualYesterdayData,
    yesterdayPredictions,
    loading,
    isLoadingYesterdayData,
    isLoadingYesterdayPredictions,
    error,
    yesterdayDataError,
    yesterdayPredictionsError,
    hasYesterdayPredictions,
    fetchYesterdayData,
    fetchYesterdayPredictions,
    fetchPredictions
  };
}; 