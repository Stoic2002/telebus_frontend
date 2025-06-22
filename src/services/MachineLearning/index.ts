// Machine Learning Services Index

// Main service for last 24h data (keeping original export name for compatibility)
export { last24HDataService } from './machineLearning';

// New decomposed services
export { DataTransformer } from './dataTransformer';
export { PredictionService } from './predictionService';

// Original service for backwards compatibility
export * from './machineLearningService';

// Re-export types for convenience
export type { 
  Prediction, 
  PredictionParameter, 
  RawLast24HDataItem, 
  TransformedLast24HData,
  InputData 
} from '@/types/machineLearningTypes'; 