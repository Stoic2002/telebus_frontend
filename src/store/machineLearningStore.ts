import { create } from 'zustand';
import { Prediction, PredictionParameter, TransformedLast24HData } from '@/types/machineLearningTypes';
import { PredictionService } from '@/services/MachineLearning/predictionService';

type PredictionDuration = '7-day' | '14-day' | '30-day';

export interface MachineLearningState {
  // Current predictions
  predictions: Record<PredictionParameter, Prediction[]>;
  historicalData: Record<PredictionParameter, Prediction[]>;
  
  // Last 24 hours data
  last24HData: TransformedLast24HData[];
  
  // Loading states
  loading: boolean;
  last24HLoading: boolean;
  predictionsLoading: boolean;
  
  // Error states
  error: string | null;
  last24HError: string | null;
  predictionsError: string | null;
  
  // Yesterday's data for comparison
  actualYesterdayData: Prediction[];
  yesterdayPredictions: Prediction[];
  hasYesterdayPredictions: boolean;
  isLoadingYesterdayData: boolean;
  isLoadingYesterdayPredictions: boolean;
  yesterdayDataError: string | null;
  yesterdayPredictionsError: string | null;
  
  // Selected parameters
  selectedParameter: PredictionParameter;
  predictionDuration: PredictionDuration;
  
  // Accuracy metrics
  accuracy: Record<PredictionParameter, number>;
}

export interface MachineLearningActions {
  // Fetch data
  fetchPredictions: (parameter: PredictionParameter) => Promise<void>;
  fetchLast24HData: () => Promise<void>;
  fetchYesterdayData: (parameter: PredictionParameter) => Promise<void>;
  fetchYesterdayPredictions: (parameter: PredictionParameter) => Promise<void>;
  
  // Set parameters
  setSelectedParameter: (parameter: PredictionParameter) => void;
  setPredictionDuration: (duration: PredictionDuration) => void;
  
  // Clear errors
  clearErrors: () => void;
  clearError: (errorType: 'predictions' | 'last24H' | 'yesterdayData' | 'yesterdayPredictions') => void;
  
  // Reset
  reset: () => void;
}

const initialPredictions: Record<PredictionParameter, Prediction[]> = {
  INFLOW: [],
  OUTFLOW: [],
  TMA: [],
  BEBAN: []
};

const initialAccuracy: Record<PredictionParameter, number> = {
  INFLOW: 0,
  OUTFLOW: 0,
  TMA: 0,
  BEBAN: 0
};

export const useMachineLearningStore = create<MachineLearningState & MachineLearningActions>((set, get) => ({
  // State
  predictions: initialPredictions,
  historicalData: initialPredictions,
  last24HData: [],
  
  loading: false,
  last24HLoading: false,
  predictionsLoading: false,
  
  error: null,
  last24HError: null,
  predictionsError: null,
  
  actualYesterdayData: [],
  yesterdayPredictions: [],
  hasYesterdayPredictions: false,
  isLoadingYesterdayData: false,
  isLoadingYesterdayPredictions: false,
  yesterdayDataError: null,
  yesterdayPredictionsError: null,
  
  selectedParameter: 'INFLOW',
  predictionDuration: '7-day',
  
  accuracy: initialAccuracy,

  // Actions
  fetchPredictions: async (parameter) => {
    set({ predictionsLoading: true, predictionsError: null });
    try {
      // Use PredictionService instead of localhost API
      const predictionData = await PredictionService.fetchPredictionData(parameter);
      
      set((state) => ({
        predictions: {
          ...state.predictions,
          [parameter]: predictionData.predictionData || []
        },
        historicalData: {
          ...state.historicalData,
          [parameter]: predictionData.actualData || []
        },
        accuracy: {
          ...state.accuracy,
          [parameter]: predictionData.accuracy || 0
        },
        predictionsLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${parameter} predictions`;
      set({ predictionsError: errorMessage, predictionsLoading: false });
    }
  },

  fetchLast24HData: async () => {
    set({ last24HLoading: true, last24HError: null });
    try {
      const response = await fetch('/api/predictions/last24h');
      if (!response.ok) {
        throw new Error('Failed to fetch last 24 hours data');
      }
      
      const data = await response.json();
      set({ last24HData: data, last24HLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch last 24 hours data';
      set({ last24HError: errorMessage, last24HLoading: false });
    }
  },

  fetchYesterdayData: async (parameter) => {
    set({ isLoadingYesterdayData: true, yesterdayDataError: null });
    try {
      // Use PredictionService for consistency
      const predictionData = await PredictionService.fetchPrevDayPrediction(parameter);
      
      set({ 
        actualYesterdayData: predictionData?.actualData || [],
        isLoadingYesterdayData: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch yesterday's ${parameter} data`;
      set({ yesterdayDataError: errorMessage, isLoadingYesterdayData: false });
    }
  },

  fetchYesterdayPredictions: async (parameter) => {
    set({ isLoadingYesterdayPredictions: true, yesterdayPredictionsError: null });
    try {
      // Use PredictionService for consistency
      const predictionData = await PredictionService.fetchPrevDayPrediction(parameter);
      
      set({ 
        yesterdayPredictions: predictionData?.predictionData || [],
        hasYesterdayPredictions: predictionData?.predictionData && predictionData.predictionData.length > 0,
        isLoadingYesterdayPredictions: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to fetch yesterday's ${parameter} predictions`;
      set({ 
        yesterdayPredictionsError: errorMessage, 
        isLoadingYesterdayPredictions: false,
        hasYesterdayPredictions: false 
      });
    }
  },

  setSelectedParameter: (parameter) => {
    set({ selectedParameter: parameter });
    // Auto-fetch data for the new parameter
    get().fetchPredictions(parameter);
  },

  setPredictionDuration: (duration) => {
    set({ predictionDuration: duration });
    // Re-fetch predictions with new duration
    const currentParameter = get().selectedParameter;
    get().fetchPredictions(currentParameter);
  },

  clearErrors: () => {
    set({
      error: null,
      last24HError: null,
      predictionsError: null,
      yesterdayDataError: null,
      yesterdayPredictionsError: null
    });
  },

  clearError: (errorType) => {
    const errorMap = {
      predictions: 'predictionsError',
      last24H: 'last24HError',
      yesterdayData: 'yesterdayDataError',
      yesterdayPredictions: 'yesterdayPredictionsError'
    };
    
    set({ [errorMap[errorType]]: null });
  },

  reset: () => {
    set({
      predictions: initialPredictions,
      historicalData: initialPredictions,
      last24HData: [],
      
      loading: false,
      last24HLoading: false,
      predictionsLoading: false,
      
      error: null,
      last24HError: null,
      predictionsError: null,
      
      actualYesterdayData: [],
      yesterdayPredictions: [],
      hasYesterdayPredictions: false,
      isLoadingYesterdayData: false,
      isLoadingYesterdayPredictions: false,
      yesterdayDataError: null,
      yesterdayPredictionsError: null,
      
      selectedParameter: 'INFLOW',
      predictionDuration: '7-day',
      
      accuracy: initialAccuracy
    });
  }
})); 