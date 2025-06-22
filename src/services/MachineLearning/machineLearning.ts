import { RawLast24HDataItem, TransformedLast24HData, Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import axios from 'axios';

export const last24HDataService = {
  async fetchLast24HData(): Promise<TransformedLast24HData[]> {
    try {
      const response = await axios.get('http://192.168.105.90/data-combined-7-days-before');
      
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
    let dataArray = Array.from(hourlyDataMap.values())
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
    
    // Replace negative values with median of adjacent values
    dataArray = this.replaceNegativeValues(dataArray);
    
    // Detect and fill missing datetime gaps with median values
    dataArray = this.fillMissingHours(dataArray);
    
    return dataArray;
  },
  
  replaceNegativeValues(sortedData: TransformedLast24HData[]): TransformedLast24HData[] {
    if (sortedData.length <= 1) return sortedData;
    
    // Create a copy of the array to avoid modifying the original
    const result = [...sortedData];
    
    // Get all valid (non-negative) values for each parameter to use as fallback
    const validValues = {
      INFLOW: sortedData.map(item => item.INFLOW).filter(val => val >= 0),
      OUTFLOW: sortedData.map(item => item.OUTFLOW).filter(val => val >= 0),
      TMA: sortedData.map(item => item.TMA).filter(val => val >= 0),
      BEBAN: sortedData.map(item => item.BEBAN).filter(val => val >= 0)
    };
    
    // Calculate fallback medians
    const fallbackMedians = {
      INFLOW: this.getMedian(validValues.INFLOW.sort((a, b) => a - b)),
      OUTFLOW: this.getMedian(validValues.OUTFLOW.sort((a, b) => a - b)),
      TMA: this.getMedian(validValues.TMA.sort((a, b) => a - b)),
      BEBAN: this.getMedian(validValues.BEBAN.sort((a, b) => a - b))
    };
    
    // Check each data point for negative values
    for (let i = 0; i < result.length; i++) {
      // Check and replace negative INFLOW
      if (result[i].INFLOW < 0) {
        const prevValue = i > 0 ? result[i-1].INFLOW : null;
        const nextValue = i < result.length - 1 ? result[i+1].INFLOW : null;
        
        const neighbors = [];
        if (prevValue !== null && prevValue >= 0) neighbors.push(prevValue);
        if (nextValue !== null && nextValue >= 0) neighbors.push(nextValue);
        
        if (neighbors.length > 0) {
          // Calculate median of neighbors
          result[i].INFLOW = this.getMedian(neighbors.sort((a, b) => a - b));
        } else {
          // Use fallback median if no valid neighbors
          result[i].INFLOW = fallbackMedians.INFLOW;
        }
      }
      
      // Check and replace negative OUTFLOW
      if (result[i].OUTFLOW < 0) {
        const prevValue = i > 0 ? result[i-1].OUTFLOW : null;
        const nextValue = i < result.length - 1 ? result[i+1].OUTFLOW : null;
        
        const neighbors = [];
        if (prevValue !== null && prevValue >= 0) neighbors.push(prevValue);
        if (nextValue !== null && nextValue >= 0) neighbors.push(nextValue);
        
        if (neighbors.length > 0) {
          // Calculate median of neighbors
          result[i].OUTFLOW = this.getMedian(neighbors.sort((a, b) => a - b));
        } else {
          // Use fallback median if no valid neighbors
          result[i].OUTFLOW = fallbackMedians.OUTFLOW;
        }
      }
      
      // Check and replace negative TMA
      if (result[i].TMA < 0) {
        const prevValue = i > 0 ? result[i-1].TMA : null;
        const nextValue = i < result.length - 1 ? result[i+1].TMA : null;
        
        const neighbors = [];
        if (prevValue !== null && prevValue >= 0) neighbors.push(prevValue);
        if (nextValue !== null && nextValue >= 0) neighbors.push(nextValue);
        
        if (neighbors.length > 0) {
          // Calculate median of neighbors
          result[i].TMA = this.getMedian(neighbors.sort((a, b) => a - b));
        } else {
          // Use fallback median if no valid neighbors
          result[i].TMA = fallbackMedians.TMA;
        }
      }
      
      // Check and replace negative BEBAN
      if (result[i].BEBAN < 0) {
        const prevValue = i > 0 ? result[i-1].BEBAN : null;
        const nextValue = i < result.length - 1 ? result[i+1].BEBAN : null;
        
        const neighbors = [];
        if (prevValue !== null && prevValue >= 0) neighbors.push(prevValue);
        if (nextValue !== null && nextValue >= 0) neighbors.push(nextValue);
        
        if (neighbors.length > 0) {
          // Calculate median of neighbors
          result[i].BEBAN = this.getMedian(neighbors.sort((a, b) => a - b));
        } else {
          // Use fallback median if no valid neighbors
          result[i].BEBAN = fallbackMedians.BEBAN;
        }
      }
    }
    
    return result;
  },
  
  fillMissingHours(sortedData: TransformedLast24HData[]): TransformedLast24HData[] {
    if (sortedData.length <= 1) return sortedData;
    
    const result: TransformedLast24HData[] = [];
    const medians = this.calculateMedians(sortedData);
    
    // Add first entry
    result.push(sortedData[0]);
    
    // Check for gaps between entries
    for (let i = 0; i < sortedData.length - 1; i++) {
      const current = sortedData[i];
      const next = sortedData[i + 1];
      
      // Parse current datetime
      const [currentDate, currentHour] = current.datetime.split(' ');
      const currentDateTime = new Date(`${currentDate}T${currentHour}:00:00`);
      
      // Parse next datetime
      const [nextDate, nextHour] = next.datetime.split(' ');
      const nextDateTime = new Date(`${nextDate}T${nextHour}:00:00`);
      
      // Calculate expected hours between
      const hoursDiff = (nextDateTime.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60);
      
      // If there's a gap (more than 1 hour difference)
      if (hoursDiff > 1) {
        // Fill in the missing hours
        for (let h = 1; h < hoursDiff; h++) {
          const missingDateTime = new Date(currentDateTime.getTime() + h * 60 * 60 * 1000);
          const missingDateStr = missingDateTime.toISOString().slice(0, 10);
          const missingHourStr = missingDateTime.getHours().toString().padStart(2, '0');
          const missingDatetimeStr = `${missingDateStr} ${missingHourStr}`;
          
          // Create new entry with median values
          result.push({
            INFLOW: medians.INFLOW,
            OUTFLOW: medians.OUTFLOW,
            TMA: medians.TMA,
            BEBAN: medians.BEBAN,
            datetime: missingDatetimeStr
          });
        }
      }
      
      // Add the next entry if it's not the last iteration (last entry will be added after the loop)
      if (i < sortedData.length - 2) {
        result.push(next);
      }
    }
    
    // Add last entry
    result.push(sortedData[sortedData.length - 1]);
    
    return result;
  },
  
  calculateMedians(data: TransformedLast24HData[]): { INFLOW: number, OUTFLOW: number, TMA: number, BEBAN: number } {
    // Extract all values for each parameter
    const inflowValues = data.map(item => item.INFLOW).sort((a, b) => a - b);
    const outflowValues = data.map(item => item.OUTFLOW).sort((a, b) => a - b);
    const tmaValues = data.map(item => item.TMA).sort((a, b) => a - b);
    const bebanValues = data.map(item => item.BEBAN).sort((a, b) => a - b);
    
    // Calculate median for each parameter
    return {
      INFLOW: this.getMedian(inflowValues),
      OUTFLOW: this.getMedian(outflowValues),
      TMA: this.getMedian(tmaValues),
      BEBAN: this.getMedian(bebanValues)
    };
  },
  
  getMedian(sortedValues: number[]): number {
    const mid = Math.floor(sortedValues.length / 2);
    
    if (sortedValues.length === 0) return 0;
    
    if (sortedValues.length % 2 === 0) {
      return parseFloat(((sortedValues[mid - 1] + sortedValues[mid]) / 2).toFixed(2));
    } else {
      return parseFloat(sortedValues[mid].toFixed(2));
    }
  }
};

// Add the missing predictionService export
export const predictionService = {
  async fetchPredictions(parameter: PredictionParameter, steps: number): Promise<Prediction[]> {
    try {
      // For now, return mock predictions until the actual API endpoint is available
      return this.generateMockPredictions(parameter, steps);
    } catch (error) {
      console.error(`Error fetching ${parameter} predictions:`, error);
      throw error;
    }
  },

  async fetchPrevDayPrediction(parameter: PredictionParameter): Promise<{
    actualData: Prediction[];
    predictionData: Prediction[];
    accuracy: number;
  } | null> {
    try {
      // Mock previous day data
      const actualData = this.generateMockPredictions(parameter, 24);
      const predictionData = this.generateMockPredictions(parameter, 24);
      
      // Calculate a mock accuracy (between 70-95%)
      const accuracy = 70 + Math.random() * 25;
      
      return {
        actualData,
        predictionData,
        accuracy: parseFloat(accuracy.toFixed(2))
      };
    } catch (error) {
      console.error(`Error fetching ${parameter} previous day prediction:`, error);
      return null;
    }
  },

  async fetchPredictionData(parameter: PredictionParameter): Promise<{
    actualData: Prediction[];
    predictionData: Prediction[];
    accuracy: number;
  }> {
    try {
      // Mock actual data (last 24 hours)
      const actualData = this.generateMockPredictions(parameter, 24);
      
      // Mock prediction data (next 24 hours)
      const predictionData = this.generateMockPredictions(parameter, 24);
      
      // Calculate a mock accuracy (between 70-95%)
      const accuracy = 70 + Math.random() * 25;
      
      return {
        actualData,
        predictionData,
        accuracy: parseFloat(accuracy.toFixed(2))
      };
    } catch (error) {
      console.error(`Error fetching ${parameter} prediction data:`, error);
      throw error;
    }
  },

  generateMockPredictions(parameter: PredictionParameter, steps: number): Prediction[] {
    const predictions: Prediction[] = [];
    const now = new Date();
    
    // Generate predictions for the requested number of steps
    for (let i = 0; i < steps; i++) {
      const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000); // Add hours
      
      // Generate a prediction value based on parameter
      let value = 0;
      switch (parameter) {
        case 'INFLOW':
          value = 100 + Math.random() * 50; // Random value between 100-150
          break;
        case 'OUTFLOW':
          value = 80 + Math.random() * 40; // Random value between 80-120
          break;
        case 'TMA':
          value = 200 + Math.random() * 20; // Random value between 200-220
          break;
        case 'BEBAN':
          value = 300 + Math.random() * 100; // Random value between 300-400
          break;
      }
      
      predictions.push({
        datetime: futureTime.toISOString(),
        value: parseFloat(value.toFixed(2)),
        predictedValue: parseFloat(value.toFixed(2)),
        actualValue: undefined
      });
    }
    
    return predictions;
  }
};