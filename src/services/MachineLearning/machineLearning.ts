// src/services/pLast24HDataService.ts
import { RawLast24HDataItem, TransformedLast24HData, Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import axios from 'axios';

// Constants for localStorage keys
const LS_PREDICTION_DATA_KEY = 'telebus_prediction_data';
const LS_PREDICTION_DATE_KEY = 'telebus_prediction_date';
const LS_DAY_BEFORE_DATA_KEY = 'telebus_day_before_data';

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
  // Sample prediction data for development
  samplePredictionData: {
    "target_column": "BEBAN",
    "look_back": 168,
    "data": [
      {"INFLOW":160.56,"OUTFLOW":84.74,"TMA":230.04,"BEBAN":74.77000000000001,"datetime":"2025-04-19 00"},
      {"INFLOW":140.05,"OUTFLOW":79.92,"TMA":230.07,"BEBAN":70.52,"datetime":"2025-04-19 01"},
      {"INFLOW":168.26,"OUTFLOW":124.25,"TMA":230.09,"BEBAN":109.63,"datetime":"2025-04-19 02"},
      {"INFLOW":124.19,"OUTFLOW":113.09,"TMA":230.09,"BEBAN":99.78999999999999,"datetime":"2025-04-19 03"},
      {"INFLOW":91.32,"OUTFLOW":96.69,"TMA":230.08,"BEBAN":85.32,"datetime":"2025-04-19 04"},
      {"INFLOW":137.8,"OUTFLOW":143.13,"TMA":230.07,"BEBAN":126.29,"datetime":"2025-04-19 05"},
      {"INFLOW":146.22,"OUTFLOW":151.53,"TMA":230.05,"BEBAN":133.74,"datetime":"2025-04-19 06"},
      {"INFLOW":125.32,"OUTFLOW":130.02,"TMA":230.03,"BEBAN":114.73,"datetime":"2025-04-19 07"},
      {"INFLOW":99.75,"OUTFLOW":109.35,"TMA":230.01,"BEBAN":96.47,"datetime":"2025-04-19 08"},
      {"INFLOW":114.92,"OUTFLOW":102.09,"TMA":229.99,"BEBAN":90.04,"datetime":"2025-04-19 09"},
      {"INFLOW":117.68,"OUTFLOW":96.88,"TMA":229.98,"BEBAN":85.46,"datetime":"2025-04-19 10"},
      {"INFLOW":148.81,"OUTFLOW":134.11,"TMA":229.98,"BEBAN":118.33,"datetime":"2025-04-19 11"},
      {"INFLOW":144.75,"OUTFLOW":140.08,"TMA":229.97,"BEBAN":123.57,"datetime":"2025-04-19 12"},
      {"INFLOW":121.1,"OUTFLOW":119.32,"TMA":229.96,"BEBAN":105.28,"datetime":"2025-04-19 13"},
      {"INFLOW":166.66,"OUTFLOW":155.56,"TMA":229.96,"BEBAN":137.27,"datetime":"2025-04-19 14"},
      {"INFLOW":131.15,"OUTFLOW":147.71,"TMA":229.95,"BEBAN":130.33,"datetime":"2025-04-19 15"},
      {"INFLOW":107.19,"OUTFLOW":106.75,"TMA":229.93,"BEBAN":94.15,"datetime":"2025-04-19 16"},
      {"INFLOW":140.46,"OUTFLOW":109.36,"TMA":229.93,"BEBAN":96.48,"datetime":"2025-04-19 17"},
      {"INFLOW":166.5,"OUTFLOW":146.51,"TMA":229.94,"BEBAN":129.29,"datetime":"2025-04-19 18"},
      {"INFLOW":162.44,"OUTFLOW":136.07,"TMA":229.95,"BEBAN":120.03,"datetime":"2025-04-19 19"},
      {"INFLOW":127.72,"OUTFLOW":123.73,"TMA":229.96,"BEBAN":109.17,"datetime":"2025-04-19 20"},
      {"INFLOW":155.85,"OUTFLOW":145.35,"TMA":229.96,"BEBAN":128.26,"datetime":"2025-04-19 21"},
      {"INFLOW":132.85,"OUTFLOW":106.75,"TMA":229.97,"BEBAN":94.15,"datetime":"2025-04-19 22"},
      {"INFLOW":128.91,"OUTFLOW":102.08,"TMA":229.99,"BEBAN":90.03,"datetime":"2025-04-19 23"}
    ]
  },
  
  // Check if we need to fetch new data (different day)
  needsNewData(): boolean {
    if (typeof window === 'undefined') return true;
    
    const savedDate = localStorage.getItem(LS_PREDICTION_DATE_KEY);
    if (!savedDate) return true;
    
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return savedDate !== currentDate;
  },
  
  // Save prediction data to localStorage
  savePredictionData(data: any, parameter: PredictionParameter): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Store the current date
      const currentDate = new Date().toISOString().split('T')[0];
      localStorage.setItem(LS_PREDICTION_DATE_KEY, currentDate);
      
      // Get existing data object or create new one
      const existingDataStr = localStorage.getItem(LS_PREDICTION_DATA_KEY);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      
      // Update parameter data and save
      existingData[parameter] = data;
      localStorage.setItem(LS_PREDICTION_DATA_KEY, JSON.stringify(existingData));
      
      // Save a copy as day-before data when day changes
      this.saveDayBeforeData(data, parameter);
    } catch (err) {
      console.error('Error saving prediction data to localStorage:', err);
    }
  },
  
  // Save day-before prediction data
  saveDayBeforeData(data: any, parameter: PredictionParameter): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Get existing day-before data or create new object
      const existingDataStr = localStorage.getItem(LS_DAY_BEFORE_DATA_KEY);
      const existingData = existingDataStr ? JSON.parse(existingDataStr) : {};
      
      // Update parameter data and save
      existingData[parameter] = data;
      localStorage.setItem(LS_DAY_BEFORE_DATA_KEY, JSON.stringify(existingData));
    } catch (err) {
      console.error('Error saving day-before data to localStorage:', err);
    }
  },
  
  // Get saved prediction data
  getSavedPredictionData(parameter: PredictionParameter): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const dataStr = localStorage.getItem(LS_PREDICTION_DATA_KEY);
      if (!dataStr) return null;
      
      const data = JSON.parse(dataStr);
      return data[parameter] || null;
    } catch (err) {
      console.error('Error retrieving prediction data from localStorage:', err);
      return null;
    }
  },
  
  // Get saved day-before data
  getDayBeforeData(parameter: PredictionParameter): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const dataStr = localStorage.getItem(LS_DAY_BEFORE_DATA_KEY);
      if (!dataStr) return null;
      
      const data = JSON.parse(dataStr);
      return data[parameter] || null;
    } catch (err) {
      console.error('Error retrieving day-before data from localStorage:', err);
      return null;
    }
  },

  // Fetch prediction data and actual data (7-day forecast)
  async fetchPredictionData(parameter: PredictionParameter): Promise<{
    actualData: Prediction[],
    predictionData: Prediction[],
    accuracy: number
  }> {
    try {
      // Check if we have saved data for today
      if (!this.needsNewData()) {
        const savedData = this.getSavedPredictionData(parameter);
        if (savedData) {
          console.log('Using cached prediction data');
          return savedData;
        }
      }
      
      // Fetch prediction data from API (7 days)
      const predictionResponse = await axios.get(`http://192.168.105.90/prediction/${parameter.toLowerCase()}`);
      const predictionData = this.transformPredictionData(predictionResponse.data, parameter);
      
      // Generate mock actual data for comparison (1 day)
      const actualData = this.generateMockActualData(parameter);
      
      // Calculate accuracy between actual and prediction data
      const accuracy = this.calculateAccuracy(actualData, predictionData);
      
      // Save to localStorage
      const result = { actualData, predictionData, accuracy };
      this.savePredictionData(result, parameter);
      
      return result;
    } catch (error) {
      console.error(`Error fetching ${parameter} prediction data:`, error);
      
      // Return mock data for development
      return this.getMockData(parameter);
    }
  },
  
  // Fetch day-before prediction data
  async fetchDayBeforePrediction(parameter: PredictionParameter): Promise<{
    actualData: Prediction[],
    predictionData: Prediction[],
    accuracy: number
  }> {
    try {
      // Try to get saved day-before data
      const savedData = this.getDayBeforeData(parameter);
      if (savedData) {
        console.log('Using saved day-before data');
        return savedData;
      }
      
      // If no saved data, generate mock data for day-before
      console.log('No saved day-before data, generating mock');
      const mockDayBefore = this.getMockDayBeforeData(parameter);
      
      // Save for future use
      this.saveDayBeforeData(mockDayBefore, parameter);
      
      return mockDayBefore;
    } catch (error) {
      console.error(`Error fetching day-before ${parameter} data:`, error);
      return this.getMockDayBeforeData(parameter);
    }
  },
  
  // Generate mock actual data based on sample data
  generateMockActualData(parameter: PredictionParameter): Prediction[] {
    const sampleData = this.samplePredictionData.data;
    const actualData: Prediction[] = [];
    
    // Base date for actual data (today)
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();
    
    // Generate 24 hours of actual data
    for (let hour = 0; hour < 24; hour++) {
      const sampleIndex = hour % sampleData.length;
      const samplePoint = sampleData[sampleIndex];
      
      // Format date as "YYYY-MM-DD HH"
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      const datetime = `${year}-${formattedMonth}-${formattedDay} ${formattedHour}`;
      
      // Add random variation to actual data (±15%)
      const variation = (Math.random() * 0.3) - 0.15;
      const actualValue = samplePoint[parameter] * (1 + variation);
      
      actualData.push({
        datetime: datetime,
        value: parseFloat(actualValue.toFixed(2))
      });
    }
    
    return actualData;
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
      actualMap.set(item.datetime, item.value);
    });
    
    // Find matching prediction points
    let totalError = 0;
    let count = 0;
    
    predictionData.forEach(item => {
      if (actualMap.has(item.datetime)) {
        const actualValue = actualMap.get(item.datetime) || 0;
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
  
  // Generate mock data for 7-day forecast
  getMockData(parameter: PredictionParameter): {
    actualData: Prediction[],
    predictionData: Prediction[],
    accuracy: number
  } {
    // Get first day of sample data points for the specified parameter
    const sampleData = this.samplePredictionData.data;
    
    // Generate prediction data for 7 days
    const predictionData: Prediction[] = [];
    
    // Base date for our prediction - we'll use today
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1-12
    const startDay = today.getDate(); // Today
    
    // Generate prediction data for 7 days (reusing the 1-day sample)
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const sampleIndex = hour % sampleData.length;
        const samplePoint = sampleData[sampleIndex];
        
        // Format date as "YYYY-MM-DD HH"
        const currentDay = startDay + day;
        const formattedDay = currentDay.toString().padStart(2, '0');
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMonth = month.toString().padStart(2, '0');
        const datetime = `${year}-${formattedMonth}-${formattedDay} ${formattedHour}`;
        
        // Add to prediction data
        predictionData.push({
          datetime: datetime,
          value: samplePoint[parameter]
        });
      }
    }
    
    // Create actual data for just the first day (today)
    const actualData = this.generateMockActualData(parameter);
    
    // Calculate accuracy
    const accuracy = this.calculateAccuracy(actualData, predictionData.slice(0, 24));
    
    return { actualData, predictionData, accuracy };
  },
  
  // Generate mock data for day-before prediction
  getMockDayBeforeData(parameter: PredictionParameter): {
    actualData: Prediction[],
    predictionData: Prediction[],
    accuracy: number
  } {
    // Get sample data points
    const sampleData = this.samplePredictionData.data;
    
    // Base date for yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = yesterday.getMonth() + 1; // 1-12
    const day = yesterday.getDate();
    
    // Generate 24 hours of prediction data for yesterday
    const predictionData: Prediction[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const sampleIndex = hour % sampleData.length;
      const samplePoint = sampleData[sampleIndex];
      
      // Format date as "YYYY-MM-DD HH"
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      const datetime = `${year}-${formattedMonth}-${formattedDay} ${formattedHour}`;
      
      // Add small bias to prediction 
      const predBias = (Math.random() * 0.2 - 0.1); // -10% to +10%
      const predValue = parseFloat((samplePoint[parameter] * (1 + predBias)).toFixed(2));
      
      predictionData.push({
        datetime: datetime,
        value: predValue
      });
    }
    
    // Generate actual data for yesterday (with more variation to show difference)
    const actualData: Prediction[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const sampleIndex = hour % sampleData.length;
      const samplePoint = sampleData[sampleIndex];
      
      // Format date as "YYYY-MM-DD HH"
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      const datetime = `${year}-${formattedMonth}-${formattedDay} ${formattedHour}`;
      
      // Add more random variation to actual data (±20%)
      const variation = (Math.random() * 0.4) - 0.2;
      const actualValue = samplePoint[parameter] * (1 + variation);
      
      actualData.push({
        datetime: datetime,
        value: parseFloat(actualValue.toFixed(2))
      });
    }
    
    // Calculate accuracy (generally lower for day-before to show difference)
    const accuracy = this.calculateAccuracy(actualData, predictionData);
    
    return { actualData, predictionData, accuracy };
  }
};

