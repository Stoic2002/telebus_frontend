// Common Types that are used across multiple features

// Base API Response structure
export interface BaseAPIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp?: string;
  errors?: string[];
}

// Common data value structure for sensor readings
export interface SensorReading {
  value: number | null;
  timestamp: string;
  statusCode?: number;
  quality?: 'good' | 'bad' | 'uncertain';
  unit?: string;
}

// Time series data point
export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
  label?: string;
}

// Chart data structure
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
}

// Table column definition
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

// Filter options
export interface FilterOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Date range filter
export interface DateRange {
  startDate: string;
  endDate: string;
}

// Station/Node common properties
export interface BaseStation {
  id: string;
  name: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  status?: 'online' | 'offline' | 'maintenance';
  lastUpdate?: string;
}

// Color theme for status indicators
export interface StatusTheme {
  color: string;
  backgroundColor: string;
  borderColor?: string;
  textColor?: string;
}

// Generic form field
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: FilterOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
} 