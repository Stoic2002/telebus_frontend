// Define the prediction data type
export interface Prediction {
    datetime: string;
    value: number;
    actualValue?: number;
    predictedValue?: number;
  }
  
  // Input data type
export interface InputData {
    INFLOW: number;
    OUTFLOW: number;
    TMA: number;
    BEBAN: number;
    datetime: string;
  }
  
  // Prediction parameters
export type PredictionParameter = 'INFLOW' |'OUTFLOW' |'TMA' | 'BEBAN';


// Color mapping for different parameters
export const PARAMETER_COLORS: Record<PredictionParameter, string> = {
  INFLOW: '#3B82F6',
  OUTFLOW: '#10B981',
  TMA: '#F59E0B',
  BEBAN: '#EC4899'
};

// Y-axis domain configuration
export const Y_AXIS_DOMAIN: Record<PredictionParameter, [number, number]> = {
  INFLOW: [0, 200],
  OUTFLOW: [0, 150],
  TMA: [224.50, 231.50],
  BEBAN: [0, 1000]
};


export interface RawLast24HDataItem {
  source_table: string;
  id: number;
  name: string;
  value: string;
  timestamp: string;
}

export interface TransformedLast24HData {
  INFLOW: number;
  OUTFLOW: number;
  TMA: number;
  BEBAN: number;
  datetime: string;
}