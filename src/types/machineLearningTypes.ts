// Define the prediction data type
export interface Prediction {
    datetime: string;
    value: number;
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
export type PredictionParameter = 'INFLOW' | 'OUTFLOW' | 'TMA' | 'BEBAN';


// Color mapping for different parameters
export const PARAMETER_COLORS: Record<PredictionParameter, string> = {
  INFLOW: '#6366f1', // Indigo
  OUTFLOW: '#10b981', // Emerald
  TMA: '#f43f5e', // Rose
  BEBAN: '#f97316' // Orange
};

// Y-axis domain configuration
export const Y_AXIS_DOMAIN: Record<PredictionParameter, [number, number] | undefined> = {
  INFLOW: undefined,
  OUTFLOW: undefined,
  TMA: [224.50, 231.50], // Specific range for TMA
  BEBAN: undefined
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