import { useState, useEffect } from 'react';
import { SensorValueResponse } from '../types/sensorTypes';

interface UseSensorDataProps {
  fetchFunction: () => Promise<SensorValueResponse>;
  interval?: number;
}

export const useSensorData = ({ fetchFunction, interval = 10000 }: UseSensorDataProps) => {
  const [data, setData] = useState<SensorValueResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchFunction();
        if (response?.data) {
          setData(response);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        setError('Failed to fetch sensor data');
      }
    };

    getData();
    const intervalId = setInterval(getData, interval);
    return () => clearInterval(intervalId);
  }, [fetchFunction, interval]);

  return { data, error };
};