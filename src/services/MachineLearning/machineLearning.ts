// src/services/pLast24HDataService.ts
import { RawLast24HDataItem, TransformedLast24HData, Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import axios from 'axios';


export const last24HDataService = {
  async fetchLast24HData(): Promise<TransformedLast24HData[]> {
    try {
      const response = await axios.get('http://192.168.105.90/data-combined-7-days-before');
      console.log('Data fetched:', response.data);
      return this.transformData(response.data);
    } catch (error) {
      console.error('Error fetching PBS data:', error);
      throw error;
    }
  },

  transformData(rawData: RawLast24HDataItem[]): TransformedLast24HData[] {
    // Create a map to store hourly data
    const hourlyDataMap = new Map<string, TransformedLast24HData>();

    // Process each data item
    rawData.forEach(item => {
      // Extract hour from timestamp
      const hourKey = item.timestamp.slice(0, 13); // YYYY-MM-DD HH:00

      // Initialize hourly data if not exists
      if (!hourlyDataMap.has(hourKey)) {
        hourlyDataMap.set(hourKey, {
          INFLOW: 0,
          OUTFLOW: 0,
          TMA: 0,
          BEBAN: 0,
          datetime: hourKey
        });
      }

      // Get the existing or newly created hourly data
      const hourlyData = hourlyDataMap.get(hourKey)!;

      // Update data based on source table
      switch(item.source_table) {
        case 'inflow_cal_h':
          hourlyData.INFLOW = parseFloat(parseFloat(item.value).toFixed(2));
          break;
        case 'pbs_outflow_h':
          hourlyData.OUTFLOW = parseFloat(parseFloat(item.value).toFixed(2));
          break;
        case 'pbs_tma_h':
          hourlyData.TMA = parseFloat(parseFloat(item.value).toFixed(2));
          break;
        case 'pbs_beban':
          // Sum all BEBAN values for the hour
          hourlyData.BEBAN += parseFloat(parseFloat(item.value).toFixed(2));
          break;
      }
    });

    // Convert map to sorted array
    return Array.from(hourlyDataMap.values())
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
  }
};

export const predictionService = {
  // Fetch prediction data and actual data
  async fetchPredictionData(parameter: PredictionParameter): Promise<{
    actualData: Prediction[],
    predictionData: Prediction[],
    accuracy: number
  }> {
    try {
      // In a real scenario, these would be separate API calls
      // For now, we'll simulate with a mock implementation
      
      // Fetch actual data (1 day)
      const actualResponse = await axios.get(`http://192.168.105.90/actual-data/${parameter.toLowerCase()}`);
      
      // Fetch prediction data (7 days)
      const predictionResponse = await axios.get(`http://192.168.105.90/prediction/${parameter.toLowerCase()}`);
      
      const actualData = this.transformActualData(actualResponse.data, parameter);
      const predictionData = this.transformPredictionData(predictionResponse.data, parameter);
      
      // Calculate accuracy between actual and prediction data
      const accuracy = this.calculateAccuracy(actualData, predictionData);
      
      // Transform and return the data
      return {
        actualData,
        predictionData,
        accuracy
      };
    } catch (error) {
      console.error(`Error fetching ${parameter} prediction data:`, error);
      
      // Return mock data for development purposes
      return this.getMockData(parameter);
    }
  },
  
  // Transform actual data from API
  transformActualData(rawData: any[], parameter: PredictionParameter): Prediction[] {
    // Implementation would depend on the actual API response format
    // This is a placeholder implementation
    return rawData.map(item => ({
      datetime: item.timestamp,
      value: parseFloat(item.value)
    }));
  },
  
  // Transform prediction data from API
  transformPredictionData(rawData: any[], parameter: PredictionParameter): Prediction[] {
    // Implementation would depend on the actual API response format
    // This is a placeholder implementation
    return rawData.map(item => ({
      datetime: item.timestamp,
      value: parseFloat(item.predicted_value)
    }));
  },
  
  // Calculate accuracy between actual and prediction for the same time periods
  calculateAccuracy(actualData: Prediction[], predictionData: Prediction[]): number {
    // Create a map of actual data with datetime as key
    const actualMap = new Map<string, number>();
    actualData.forEach(item => {
      actualMap.set(new Date(item.datetime).toISOString(), item.value);
    });
    
    // Find matching prediction points
    let totalError = 0;
    let count = 0;
    
    predictionData.forEach(item => {
      const key = new Date(item.datetime).toISOString();
      if (actualMap.has(key)) {
        const actualValue = actualMap.get(key) || 0;
        const predValue = item.value;
        
        // Calculate percentage error for this point
        const error = Math.abs((actualValue - predValue) / actualValue);
        totalError += error;
        count++;
      }
    });
    
    // If no matching points, return 0
    if (count === 0) return 0;
    
    // Return accuracy as a percentage (100 - average percentage error)
    const avgError = (totalError / count) * 100;
    return Math.max(0, Math.min(100, 100 - avgError));
  },
  
  // Generate mock data for development
  getMockData(parameter: PredictionParameter): {
    actualData: Prediction[],
    predictionData: Prediction[],
    accuracy: number
  } {
    const now = new Date();
    const actualData: Prediction[] = [];
    const predictionData: Prediction[] = [];
    
    // Generate 24 hours of actual data (1 day) - hourly data
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - 24 + i);
      date.setMinutes(0, 0, 0); // Set to exact hour
      
      const actualValue = this.generateValueForParameter(parameter, i);
      actualData.push({
        datetime: date.toISOString(),
        value: actualValue
      });
    }
    
    // Generate 7 days of prediction data (starting from today) - hourly data
    for (let i = 0; i < 24 * 7; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - 24 + i); // Start from yesterday (to overlap with actual)
      date.setMinutes(0, 0, 0); // Set to exact hour
      
      // Add some bias to prediction data to simulate prediction errors
      const basePredValue = this.generateValueForParameter(parameter, i);
      const predBias = (Math.random() * 0.2 - 0.1); // -10% to +10% prediction error
      const predValue = parseFloat((basePredValue * (1 + predBias)).toFixed(2));
      
      predictionData.push({
        datetime: date.toISOString(),
        value: predValue
      });
    }
    
    // Calculate accuracy
    const accuracy = this.calculateAccuracy(actualData, predictionData);
    
    return { actualData, predictionData, accuracy };
  },
  
  // Generate mock values based on parameter
  generateValueForParameter(parameter: PredictionParameter, hourOffset: number): number {
    const baseValue = {
      'INFLOW': 150,
      'OUTFLOW': 120,
      'TMA': 228.5,
      'BEBAN': 40
    }[parameter];
    
    // Add some randomness and a sine wave pattern
    const randomFactor = Math.random() * 0.4 - 0.2; // -0.2 to 0.2
    const sineWave = Math.sin(hourOffset / 12 * Math.PI) * 0.15; // Sine wave with period of 24h
    
    return parseFloat((baseValue * (1 + randomFactor + sineWave)).toFixed(2));
  }
};

