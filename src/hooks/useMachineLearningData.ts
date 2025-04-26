import { last24HDataService, predictionService } from '@/services/MachineLearning/machineLearning';
import { TransformedLast24HData, Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import { useState, useEffect } from 'react';

export const useLast24HData = () => {
  const [data, setData] = useState<TransformedLast24HData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const fetchedData = await last24HDataService.fetchLast24HData();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};

export type PredictionMode = '7day' | 'day-before';

export const usePredictionData = (parameter: PredictionParameter, mode: PredictionMode = '7day') => {
  const [actualData, setActualData] = useState<Prediction[]>([]);
  const [predictionData, setPredictionData] = useState<Prediction[]>([]);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Choose which data to fetch based on mode
      let result;
      if (mode === 'day-before') {
        result = await predictionService.fetchDayBeforePrediction(parameter);
      } else {
        result = await predictionService.fetchPredictionData(parameter);
      }
      
      const { actualData, predictionData, accuracy } = result;
      setActualData(actualData);
      setPredictionData(predictionData);
      setAccuracy(accuracy);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setActualData([]);
      setPredictionData([]);
      setAccuracy(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [parameter, mode]);

  return {
    actualData,
    predictionData,
    accuracy,
    isLoading,
    error,
    refetch: fetchData
  };
};
