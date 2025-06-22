import { create } from 'zustand';
import { Prediction, PredictionParameter, TransformedLast24HData } from '@/types/machineLearningTypes';
import { fetchPredictionsWithHistory } from '@/services/MachineLearning/machineLearningService';

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
  // Helper functions
  getDurationSteps: () => number;
  transformYesterdayData: (data: any[]) => Prediction[];
  transformYesterdayPredictions: (data: any[]) => Prediction[];
  
  // Fetch data
  fetchPredictions: (dataLast24H?: TransformedLast24HData[]) => Promise<void>;
  fetchLast24HData: () => Promise<void>;
  fetchYesterdayData: () => Promise<void>;
  fetchYesterdayPredictions: () => Promise<void>;
  
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

  // Helper function to get duration steps
  getDurationSteps: (): number => 24 * 7, // Always 7-day (168 hours)

  // Transform yesterday data
  transformYesterdayData: (data: any[]): Prediction[] => {
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
  },

  // Transform yesterday predictions
  transformYesterdayPredictions: (data: any[]): Prediction[] => {
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
  },

  // Actions
  fetchPredictions: async (dataLast24H) => {
    const parameters: PredictionParameter[] = ['INFLOW', 'OUTFLOW', 'TMA', 'BEBAN'];
    const steps = 168; // 7 days * 24 hours
    
    try {
      set({ loading: true, error: null });
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
        const result = await fetchPredictionsWithHistory(param, steps, dataLast24H || []);
        
        // Process future predictions to ensure absolute values
        predictionResults[param] = result.predictions.map((pred: Prediction) => ({
          ...pred,
          value: Math.abs(pred.value),
          predictedValue: pred.predictedValue !== undefined ? Math.abs(pred.predictedValue) : undefined,
          actualValue: pred.actualValue !== undefined ? Math.abs(pred.actualValue) : undefined
        }));
        
        if (param === 'INFLOW') {
          const state = get();
          // For INFLOW, use the actual API data for actual values
          if (state.actualYesterdayData.length > 0) {
            historicalResults[param] = state.actualYesterdayData.map((actualItem, index) => {
              const predictionItem = state.hasYesterdayPredictions && state.yesterdayPredictions.length > index 
                ? state.yesterdayPredictions[index] 
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
              const state = get();
              const predictionItem = state.hasYesterdayPredictions && state.yesterdayPredictions.length > index 
                ? state.yesterdayPredictions[index] 
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

      set({
        predictions: predictionResults,
        historicalData: historicalResults,
        loading: false
      });
    } catch (err) {
      set({
        error: 'Failed to fetch predictions. Please check your API connection.',
        loading: false
      });
      console.error('API Error:', err);
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

  fetchYesterdayData: async () => {
    try {
      set({ isLoadingYesterdayData: true, yesterdayDataError: null });
      const response = await fetch('http://192.168.105.90/pbs-inflow-calc-h-yesterday');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const transformedData = get().transformYesterdayData(data);
      
      set({ 
        actualYesterdayData: transformedData,
        isLoadingYesterdayData: false 
      });
    } catch (error) {
      console.error('Error fetching yesterday data:', error);
      set({ 
        yesterdayDataError: 'Failed to fetch yesterday data',
        isLoadingYesterdayData: false 
      });
    }
  },

  fetchYesterdayPredictions: async () => {
    try {
      set({ isLoadingYesterdayPredictions: true, yesterdayPredictionsError: null });
      const response = await fetch('http://192.168.105.90/prediction-inflow-yesterday');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length) {
        const transformedData = get().transformYesterdayPredictions(data);
        set({
          yesterdayPredictions: transformedData,
          hasYesterdayPredictions: true,
          isLoadingYesterdayPredictions: false
        });
      } else {
        set({
          yesterdayPredictions: [],
          hasYesterdayPredictions: false,
          yesterdayPredictionsError: 'Not enough historical prediction data',
          isLoadingYesterdayPredictions: false
        });
      }
    } catch (error) {
      console.error('Error fetching yesterday predictions:', error);
      set({ 
        yesterdayPredictionsError: 'Error loading prediction data',
        hasYesterdayPredictions: false,
        isLoadingYesterdayPredictions: false
      });
    }
  },

  setSelectedParameter: (parameter) => {
    set({ selectedParameter: parameter });
  },

  setPredictionDuration: (duration) => {
    set({ predictionDuration: duration });
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