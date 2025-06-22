import React from 'react';
import { MetricCard } from '@/components/common/cards/MetricCard';
import { CARD_THEMES } from '@/constants/colors';
import { formatNumber } from '@/lib/utils/formatNumber';
import { useMachineLearningStore } from '@/store/machineLearningStore';
import { 
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoSpeedometerOutline,
  IoFlashOutline,
  IoWaterOutline,
  IoAnalyticsOutline
} from 'react-icons/io5';

export const MLMetricsSection: React.FC = () => {
  const { 
    predictions, 
    historicalData, 
    loading, 
    error,
    selectedParameter
  } = useMachineLearningStore();

  // Calculate metrics for all parameters
  const calculateMetrics = () => {
    const metrics = {
      totalPredictions: 0,
      avgAccuracy: 0,
      activeParameters: 0,
      totalDataPoints: 0
    };

    const parameters = ['INFLOW', 'OUTFLOW', 'TMA', 'BEBAN'] as const;
    let totalAccuracy = 0;
    let accuracyCount = 0;

    parameters.forEach(param => {
      const predData = predictions[param] || [];
      const histData = historicalData[param] || [];
      
      if (predData.length > 0) {
        metrics.activeParameters++;
        metrics.totalPredictions += predData.length;
        metrics.totalDataPoints += histData.length + predData.length;

        // Calculate accuracy for this parameter
        let parameterAccuracy = 0;
        let validPoints = 0;
        
        histData.forEach(item => {
          if (item.actualValue !== undefined && item.predictedValue !== undefined && 
              item.actualValue !== null && item.predictedValue !== null) {
            const error = Math.abs(item.actualValue - item.predictedValue);
            const accuracy = item.actualValue !== 0 ? 
              Math.max(0, 100 - (error / Math.abs(item.actualValue)) * 100) : 100;
            parameterAccuracy += accuracy;
            validPoints++;
          }
        });
        
        if (validPoints > 0) {
          totalAccuracy += parameterAccuracy / validPoints;
          accuracyCount++;
        }
      }
    });

    metrics.avgAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 0;

    return metrics;
  };

  const metrics = calculateMetrics();

  // Get current parameter specific metrics
  const currentPredictions = predictions[selectedParameter] || [];
  const currentHistorical = historicalData[selectedParameter] || [];
  
  const currentStats = {
    totalValue: currentPredictions.reduce((sum, item) => sum + item.value, 0),
    avgValue: currentPredictions.length > 0 ? 
      currentPredictions.reduce((sum, item) => sum + item.value, 0) / currentPredictions.length : 0,
    maxValue: currentPredictions.length > 0 ? 
      Math.max(...currentPredictions.map(item => item.value)) : 0
  };

  // Metric cards configuration
  const metricCards = [
    {
      title: "Active Parameters",
      value: `${metrics.activeParameters}/4`,
      subtitle: "parameters running",
      icon: IoStatsChartOutline,
      ...CARD_THEMES.prediction
    },
    {
      title: "Average Accuracy",
      value: `${metrics.avgAccuracy.toFixed(1)}%`,
      subtitle: "across all parameters",
      icon: IoAnalyticsOutline,
      ...CARD_THEMES.waterLevel
    },
    {
      title: "Total Predictions",
      value: formatNumber(metrics.totalPredictions),
      subtitle: "7-day forecast points",
      icon: IoTrendingUpOutline,
      ...CARD_THEMES.volumeEffective
    },
    {
      title: `${selectedParameter} Average`,
      value: `${currentStats.avgValue.toFixed(2)} ${selectedParameter === 'TMA' ? 'm' : 'm³/s'}`,
      subtitle: "predicted value",
      icon: selectedParameter === 'TMA' ? IoWaterOutline : IoFlashOutline,
      ...CARD_THEMES.totalLoad
    },
    {
      title: `${selectedParameter} Peak`,
      value: `${currentStats.maxValue.toFixed(2)} ${selectedParameter === 'TMA' ? 'm' : 'm³/s'}`,
      subtitle: "maximum predicted",
      icon: IoSpeedometerOutline,
      ...CARD_THEMES.targetLevel
    },
    {
      title: "Total Data Points",
      value: formatNumber(metrics.totalDataPoints),
      subtitle: "historical + predicted",
      icon: IoAnalyticsOutline,
      ...CARD_THEMES.sedimentLevel
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-semibold text-gray-800">Machine Learning Metrics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metricCards.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            gradient={card.gradient}
            bgColor={card.bgColor}
            textColor={card.textColor}
            isLoading={loading}
          />
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="text-red-700">
            <p className="font-medium">Error loading machine learning data:</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 