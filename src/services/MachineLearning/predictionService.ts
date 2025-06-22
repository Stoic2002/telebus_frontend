import { Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import axios from 'axios';

export class PredictionService {
  private static readonly API_BASE_URL = 'http://192.168.105.90';

  /**
   * Fetch predictions from API
   */
  static async fetchPredictions(parameter: PredictionParameter, steps: number): Promise<Prediction[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/predict-${parameter}`, {
        params: { steps }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return this.generateMockPredictions(parameter, steps);
    }
  }

  /**
   * Fetch previous day prediction for comparison
   */
  static async fetchPrevDayPrediction(parameter: PredictionParameter): Promise<{
    actualData: Prediction[];
    predictionData: Prediction[];
    accuracy: number;
  } | null> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/prev-day-prediction-${parameter}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching previous day prediction:', error);
      return null;
    }
  }

  /**
   * Fetch combined prediction data (current predictions + previous day comparison)
   */
  static async fetchPredictionData(parameter: PredictionParameter): Promise<{
    actualData: Prediction[];
    predictionData: Prediction[];
    accuracy: number;
  }> {
    try {
      // Try to get previous day comparison first
      const prevDayData = await this.fetchPrevDayPrediction(parameter);
      
      if (prevDayData) {
        return prevDayData;
      }
      
      // Fallback to current predictions if no previous day data
      const predictions = await this.fetchPredictions(parameter, 24);
      
      return {
        actualData: [],
        predictionData: predictions,
        accuracy: 0 // No accuracy data available without actual comparison
      };
    } catch (error) {
      console.error('Error fetching prediction data:', error);
      
      // Generate mock data as final fallback
      const mockPredictions = this.generateMockPredictions(parameter, 24);
      return {
        actualData: [],
        predictionData: mockPredictions,
        accuracy: 0
      };
    }
  }

  /**
   * Generate mock predictions for testing/fallback
   */
  static generateMockPredictions(parameter: PredictionParameter, steps: number): Prediction[] {
    const now = new Date();
    const predictions: Prediction[] = [];
    
    // Base values for different parameters
    const baseValues = {
      INFLOW: 50,
      OUTFLOW: 45,
      TMA: 223.5,
      BEBAN: 75
    };
    
    const baseValue = baseValues[parameter];
    
    for (let i = 0; i < steps; i++) {
      const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
      
      // Generate realistic variations
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const trendFactor = Math.sin((i / steps) * Math.PI * 2) * 0.1; // Cyclical trend
      
      const value = baseValue * (1 + variation + trendFactor);
      
      predictions.push({
        datetime: timestamp.toISOString(),
        value: Math.max(0, Number(value.toFixed(2))) // Ensure non-negative
      });
    }
    
    return predictions;
  }

  /**
   * Calculate prediction accuracy
   */
  static calculateAccuracy(actual: Prediction[], predicted: Prediction[]): number {
    if (actual.length === 0 || predicted.length === 0) return 0;
    
    // Match predictions by timestamp (or index if timestamps don't match exactly)
    const minLength = Math.min(actual.length, predicted.length);
    let totalError = 0;
    let totalActual = 0;
    
    for (let i = 0; i < minLength; i++) {
      const actualValue = actual[i].value;
      const predictedValue = predicted[i].value;
      
      totalError += Math.abs(actualValue - predictedValue);
      totalActual += actualValue;
    }
    
    if (totalActual === 0) return 0;
    
    // Calculate MAPE (Mean Absolute Percentage Error) and convert to accuracy
    const mape = (totalError / totalActual) * 100;
    const accuracy = Math.max(0, 100 - mape);
    
    return Number(accuracy.toFixed(2));
  }

  /**
   * Format prediction data for chart display
   */
  static formatForChart(predictions: Prediction[]): {
    labels: string[];
    data: number[];
  } {
    return {
      labels: predictions.map(p => new Date(p.datetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })),
      data: predictions.map(p => p.value)
    };
  }

  /**
   * Get latest prediction value
   */
  static getLatestPrediction(predictions: Prediction[]): number | null {
    if (predictions.length === 0) return null;
    return predictions[predictions.length - 1].value;
  }

  /**
   * Get prediction trend (increasing/decreasing/stable)
   */
  static getPredictionTrend(predictions: Prediction[]): 'increasing' | 'decreasing' | 'stable' {
    if (predictions.length < 2) return 'stable';
    
    const start = predictions[0].value;
    const end = predictions[predictions.length - 1].value;
    const threshold = Math.abs(start) * 0.05; // 5% threshold
    
    if (end - start > threshold) return 'increasing';
    if (start - end > threshold) return 'decreasing';
    return 'stable';
  }
} 