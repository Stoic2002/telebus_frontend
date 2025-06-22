import { Prediction, PredictionParameter } from '@/types/machineLearningTypes';
import { formatDateTimeForCSV, calculateStats } from './chartUtils';

// Properly escape CSV values
export const escapeCsvValue = (value: string): string => {
  // If value contains commas, quotes, or newlines, wrap in quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

// Download CSV functionality
export const downloadCSV = (
  predictions: Prediction[],
  selectedParameter: PredictionParameter
): void => {
  if (predictions.length === 0) return;

  // Create CSV content with proper formatting
  const csvRows = [
    // Header row
    [`DateTime,${selectedParameter}_Predicted_Value`],
    // Data rows
    ...predictions.map((prediction: Prediction) => 
      `${escapeCsvValue(formatDateTimeForCSV(prediction.datetime))},${prediction.value.toFixed(2)}`
    ),
    // Summary rows
    `Total,${calculateStats(predictions).total.toFixed(2)}`,
    `Average,${calculateStats(predictions).average.toFixed(2)}`
  ];

  const csvContent = csvRows.join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${selectedParameter}_predictions_7-day_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up the URL object
}; 