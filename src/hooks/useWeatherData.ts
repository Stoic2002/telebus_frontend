import { useState, useEffect } from 'react';
import { NodeResponse } from '@/types/nodeTypes';
import AwsService from '@/services/allNode/awsService';

export interface WeatherData {
  evaporation: {
    evapoTranspiration: number | null | undefined;
    temperature: number | null | undefined;
  };
  humidity: {
    actual: number | null | undefined;
  };
  airPressure: {
    actual: number | null | undefined;
  };
  radiation: {
    actual: number | null | undefined;
  };
  airTemperature: {
    actual: number | null | undefined;
  };
  windSpeed: {
    actual: number | null | undefined;
  };
  lastUpdate: undefined | null | string;
}

export interface UseWeatherDataProps {
  interval?: number;
}

export interface UseWeatherDataReturn extends WeatherData {
  data: NodeResponse | null;
  error: string | null;
  isLoading: boolean;
}

export const useWeatherData = ({ interval = 30000 }: UseWeatherDataProps = {}): UseWeatherDataReturn => {
  const [data, setData] = useState<NodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    evaporation: {
      evapoTranspiration: null,
      temperature: null,
    },
    humidity: {
      actual: null,
    },
    airPressure: {
      actual: null,
    },
    radiation: {
      actual: null,
    },
    airTemperature: {
      actual: null,
    },
    windSpeed: {
      actual: null,
    },
    lastUpdate: null
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AwsService.getWeatherData();
        setData(response);
        setError(null);

        // Extract all weather metrics in a single call
        const metrics = AwsService.getAllWeatherMetrics(response);
        setWeatherData(metrics);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    data,
    error,
    isLoading,
    ...weatherData
  };
};

export default useWeatherData;