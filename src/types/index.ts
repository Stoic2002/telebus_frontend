// Main Types Index - Centralized type exports

// Core Types
export * from './nodeTypes';
export * from './sensorTypes';
export * from './commonTypes';

// Feature-specific Types  
export * from './awlrTypes';
export * from './machineLearningTypes';
export * from './reportTypes';
export * from './trendsTypes';
export * from './userTypes';

// Geographic and mapping types
export * from './mapTypes';
export * from './telemeteringPjtTypes';

// Common interfaces that might be used across multiple features
export interface APIResponse<T = any> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: string;
  statusCode: number;
  message: string;
}

// Common status types
export type StatusType = 'success' | 'error' | 'warning' | 'info';

// Common loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

// File upload types
export interface FileUploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
} 