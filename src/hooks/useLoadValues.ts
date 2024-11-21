// hooks/useLoadValues.ts
import { useState, useEffect } from 'react';
import { LoadValueResponse } from '../types/sensorTypes';
import { fetchSoedirmanLoadValue, fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue } from '../services/loadUnit/soedirmanLoadUnit';

export const useLoadValues = () => {
  const [loadValues, setLoadValues] = useState<{
    unit1: LoadValueResponse | null;
    unit2: LoadValueResponse | null;
    unit3: LoadValueResponse | null;
  }>({
    unit1: null,
    unit2: null,
    unit3: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [unit1Data, unit2Data, unit3Data] = await Promise.all([
          fetchSoedirmanLoadValue(),
          fetchSoedirmanLoadSecondValue(),
          fetchSoedirmanLoadThirdValue(),
        ]);

        setLoadValues({
          unit1: unit1Data,
          unit2: unit2Data,
          unit3: unit3Data,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch load values');
        console.error('Error fetching load values:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
    const intervalId = setInterval(fetchAllData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate total load
  const totalLoad = !isLoading && loadValues.unit1 && loadValues.unit2 && loadValues.unit3
    ? (
        loadValues.unit1.data.value.value +
        loadValues.unit2.data.value.value +
        loadValues.unit3.data.value.value
      ).toFixed(2)
    : null;

  // Check if all units are connected
  const isAllConnected = loadValues.unit1?.data.statusCode.value === 0 &&
                        loadValues.unit2?.data.statusCode.value === 0 &&
                        loadValues.unit3?.data.statusCode.value === 0;

  return {
    loadValues,
    isLoading,
    error,
    totalLoad,
    isAllConnected,
    timestamp: loadValues.unit1?.data.sourceTimestamp
  };
};