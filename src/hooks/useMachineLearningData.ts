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

export const usePredictionData = (parameter: PredictionParameter, usePrevDay: boolean = false) => {
  const [actualData, setActualData] = useState<Prediction[]>([]);
  const [predictionData, setPredictionData] = useState<Prediction[]>([]);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      if (usePrevDay) {
        // Fetch previous day prediction
        const prevDayData = await predictionService.fetchPrevDayPrediction(parameter);
        
        if (prevDayData) {
          // Use previous day data
          setActualData(prevDayData.actualData);
          setPredictionData(prevDayData.predictionData);
          setAccuracy(prevDayData.accuracy);
        } else {
          // Fallback to current data if previous day data is not available
          const { actualData, predictionData, accuracy } = await predictionService.fetchPredictionData(parameter);
          setActualData(actualData);
          setPredictionData(predictionData);
          setAccuracy(accuracy);
        }
      } else {
        // Fetch current prediction
        const { actualData, predictionData, accuracy } = await predictionService.fetchPredictionData(parameter);
        setActualData(actualData);
        setPredictionData(predictionData);
        setAccuracy(accuracy);
      }
      
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
  }, [parameter, usePrevDay]);

  return {
    actualData,
    predictionData,
    accuracy,
    isLoading,
    error,
    refetch: fetchData
  };
};
