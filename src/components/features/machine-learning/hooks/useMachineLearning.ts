import { useEffect } from 'react';
import { Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import { useLast24HData } from '@/hooks/useMachineLearningData';
import { useMachineLearningStore } from '@/store/machineLearningStore';

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
  fetchPredictions: (dataLast24H?: any[]) => Promise<void>;
}

export const useMachineLearning = (selectedParameter: PredictionParameter = 'INFLOW'): UseMachineLearningReturn => {
  // Get data from external hook
  const { data: dataLast24H } = useLast24HData();
  
  // Get all data and functions from Zustand store
  const {
    // Data
    predictions,
    historicalData,
    actualYesterdayData,
    yesterdayPredictions,
    
    // Loading states
    loading,
    isLoadingYesterdayData,
    isLoadingYesterdayPredictions,
    
    // Error states
    error,
    yesterdayDataError,
    yesterdayPredictionsError,
    
    // Flags
    hasYesterdayPredictions,
    
    // Functions
    fetchYesterdayData,
    fetchYesterdayPredictions,
    fetchPredictions,
    setSelectedParameter,
  } = useMachineLearningStore();

  // Initialize data on component mount
  useEffect(() => {
    // Set the selected parameter in store
    setSelectedParameter(selectedParameter);
    
    // Fetch yesterday's data first
    fetchYesterdayData();
    fetchYesterdayPredictions();
  }, [selectedParameter, setSelectedParameter, fetchYesterdayData, fetchYesterdayPredictions]);

  // Fetch predictions when dataLast24H is available
  useEffect(() => {
    if (dataLast24H) {
      fetchPredictions(dataLast24H);
    }
  }, [dataLast24H, fetchPredictions]);

  return {
    // Data
    predictions,
    historicalData,
    actualYesterdayData,
    yesterdayPredictions,
    
    // Loading states
    loading,
    isLoadingYesterdayData,
    isLoadingYesterdayPredictions,
    
    // Error states
    error,
    yesterdayDataError,
    yesterdayPredictionsError,
    
    // Flags
    hasYesterdayPredictions,
    
    // Functions
    fetchYesterdayData,
    fetchYesterdayPredictions,
    fetchPredictions,
  };
}; 