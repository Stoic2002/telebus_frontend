import { last24HDataService } from '@/services/MachineLearning/machineLearning';
import { TransformedLast24HData } from '@/types/machineLearningTypes';
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
