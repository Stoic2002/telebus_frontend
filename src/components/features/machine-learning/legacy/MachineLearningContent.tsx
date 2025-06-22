import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IoHardwareChipOutline, IoCloudDownloadOutline, IoAnalyticsOutline } from 'react-icons/io5';
import { BarChart2, Clock } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { useMachineLearningStore } from '@/store';
import { PredictionChart } from '@/components/features/machine-learning/components';
import { ErrorAlert } from '@/components/common/feedback/ErrorAlert';
import { MetricCard } from '@/components/common/cards';

const MachineLearningContent: React.FC = () => {
  // Zustand store - centralized ML state management
  const { 
    predictions,
    actualYesterdayData,
    predictionsLoading,
    isLoadingYesterdayData,
    predictionsError,
    selectedParameter,
    fetchPredictions,
    fetchYesterdayData,
    clearErrors
  } = useMachineLearningStore();

  // Auto-clear errors
  useEffect(() => {
    if (predictionsError) {
      const timer = setTimeout(() => {
        clearErrors();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [predictionsError, clearErrors]);

  // Initial data fetching
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchPredictions(selectedParameter),
        fetchYesterdayData(selectedParameter)
      ]);
    };
    
    initializeData();
  }, [selectedParameter, fetchPredictions, fetchYesterdayData]);

  // Get data from store
  const currentPredictions = predictions[selectedParameter] || [];
  const currentHistorical = actualYesterdayData;
  
  // Calculate stats
  const total = currentPredictions.reduce((sum, p) => sum + (p.value || 0), 0);
  const average = currentPredictions.length > 0 ? total / currentPredictions.length : 0;
  
  // Process chart data - simplified version
  const processedData = [
    ...currentHistorical.map(d => ({
      datetime: d.datetime,
      actualValue: d.value,
      predictedValue: null
    })),
    ...currentPredictions.map(p => ({
      datetime: p.datetime,
      actualValue: null,
      predictedValue: p.value
    }))
  ];

  const handleDownload = () => {
    if (processedData.length === 0) return;
    
    const csvContent = processedData.map(row => 
      `${row.datetime},${row.actualValue || ''},${row.predictedValue || ''}`
    ).join('\n');
    
    const blob = new Blob([`DateTime,Actual,Predicted\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedParameter}_predictions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Loading state
  if (predictionsLoading || isLoadingYesterdayData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loading size="lg" />
              <p className="text-gray-600 font-medium">Loading machine learning data...</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className={predictionsLoading ? "text-blue-600" : "text-green-600"}>
                  {predictionsLoading ? "Loading predictions..." : "✓ Predictions loaded"}
                </span>
                <span className={isLoadingYesterdayData ? "text-blue-600" : "text-green-600"}>
                  {isLoadingYesterdayData ? "Loading historical data..." : "✓ Historical data loaded"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-8">
        {/* Error Alert */}
        {predictionsError && (
          <ErrorAlert
            error={predictionsError}
            onDismiss={clearErrors}
            variant="error"
          />
        )}

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
              <h1 className="text-3xl font-bold text-gray-800">Machine Learning Predictions</h1>
            </div>
            <button
              onClick={handleDownload}
              disabled={processedData.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-lg"
            >
              <IoCloudDownloadOutline className="w-5 h-5" />
              <span className="text-sm font-medium">Export Data</span>
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <CardTitle className="text-xl font-semibold">Prediction Analysis Chart</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <PredictionChart 
              data={processedData}
              isLoading={predictionsLoading || isLoadingYesterdayData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MachineLearningContent; 