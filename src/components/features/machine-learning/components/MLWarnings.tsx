import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface MLWarningsProps {
  // Loading states
  isLoadingYesterdayData: boolean;
  isLoadingYesterdayPredictions: boolean;
  
  // Error states
  yesterdayDataError: string | null;
  yesterdayPredictionsError: string | null;
  
  // Data state
  hasYesterdayPredictions: boolean;
  missingActualDataPoints: number;
  missingPredictionDataPoints: number;
  
  // Retry functions
  onRetryYesterdayData: () => void;
  onRetryYesterdayPredictions: () => void;
}

export const MLWarnings: React.FC<MLWarningsProps> = ({
  isLoadingYesterdayData,
  isLoadingYesterdayPredictions,
  yesterdayDataError,
  yesterdayPredictionsError,
  hasYesterdayPredictions,
  missingActualDataPoints,
  missingPredictionDataPoints,
  onRetryYesterdayData,
  onRetryYesterdayPredictions
}) => {
  const renderYesterdayDataWarning = () => {
    if (isLoadingYesterdayData) {
      return (
        <div className="mb-2 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <span>Loading yesterday's actual data...</span>
          </div>
        </div>
      );
    }
    
    if (yesterdayDataError) {
      return (
        <div className="mb-2 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">Using mock data for yesterday (API connection failed)</span>
            <button 
              onClick={onRetryYesterdayData}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderYesterdayPredictionsWarning = () => {
    if (isLoadingYesterdayPredictions) {
      return (
        <div className="mb-2 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center">
            <Loader2 className="w-5 h-5 text-blue-500 mr-2 animate-spin" />
            <span>Loading yesterday's prediction data...</span>
          </div>
        </div>
      );
    }
    
    if (yesterdayPredictionsError) {
      return (
        <div className="mb-2 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-amber-700">
              {hasYesterdayPredictions 
                ? 'Using incomplete prediction data from yesterday' 
                : 'No prediction data available for yesterday'}
            </span>
            <button 
              onClick={onRetryYesterdayPredictions}
              className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderMissingDataWarning = () => {
    if (missingActualDataPoints > 0 || missingPredictionDataPoints > 0) {
      return (
        <div className="mb-2 bg-amber-50 p-3 rounded-md border-l-4 border-amber-400">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-amber-700">
              Data gaps detected: {missingActualDataPoints > 0 ? `${missingActualDataPoints} missing actual values` : ''}
              {missingActualDataPoints > 0 && missingPredictionDataPoints > 0 ? ' and ' : ''}
              {missingPredictionDataPoints > 0 ? `${missingPredictionDataPoints} missing prediction values` : ''}
            </span>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <>
      {renderYesterdayDataWarning()}
      {renderYesterdayPredictionsWarning()}
      {renderMissingDataWarning()}
    </>
  );
}; 