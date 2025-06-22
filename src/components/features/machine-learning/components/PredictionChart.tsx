import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, Label } from 'recharts';
import { BarChart2, Download } from 'lucide-react';
import { PARAMETER_COLORS, Prediction, PredictionParameter, Y_AXIS_DOMAIN } from '@/types/machineLearningTypes';
import { useMachineLearning } from '../hooks/useMachineLearning';
import { 
  processChartData, 
  formatDateTime, 
  formatXAxisTick, 
  calculateStats, 
  calculateAccuracy,
  getYesterdayBounds,
  getMissingDataCounts
} from '../utils/chartUtils';
import { downloadCSV } from '../utils/downloadUtils';
import { MLWarnings } from './MLWarnings';
import { ShimmerPage } from '@/components/common/loading';

// Modified chart colors
const CHART_COLORS = {
  actual: '#FFB800',    // Yellow for actual data
  yesterdayPrediction: '#93C5FD', // Light blue for yesterday's predictions
  futurePrediction: '#2563EB' // Dark blue for future predictions
};

interface PredictionChartProps {
  selectedParameter?: PredictionParameter;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ 
  selectedParameter = 'INFLOW' 
}) => {
  const {
    predictions,
    historicalData,
    actualYesterdayData,
    yesterdayPredictions,
    loading,
    isLoadingYesterdayData,
    isLoadingYesterdayPredictions,
    error,
    yesterdayDataError,
    yesterdayPredictionsError,
    hasYesterdayPredictions,
    fetchYesterdayData,
    fetchYesterdayPredictions
  } = useMachineLearning(selectedParameter);

  // Get appropriate X-axis interval for 7-day
  const getXAxisInterval = (): number => 23; // Show every 24th hour (once a day)

  const handleDownload = () => {
    downloadCSV(
      predictions[selectedParameter] || [],
      selectedParameter
    );
  };

  const renderChartLabels = () => {
    const historical = historicalData[selectedParameter] || [];
    const yesterdayBounds = getYesterdayBounds(historical);
    if (!yesterdayBounds.start || !yesterdayBounds.end) return null;

    return (
      <>
        <text 
          x="15%" 
          y="15%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize={12} 
          fill="#6B7280"
          fontWeight="600"
        >
          Kemarin
        </text>
        <text 
          x="70%" 
          y="15%" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize={12} 
          fill="#6B7280"
          fontWeight="600"
        >
          Prediksi 7 Hari Kedepan
        </text>
      </>
    );
  };

  if (loading) {
    return (
      <ShimmerPage hasMetrics={true} hasCharts={true} hasTables={false} />
    );
  }

  if (error) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Machine Learning - {selectedParameter}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = processChartData(
    historicalData[selectedParameter] || [],
    predictions[selectedParameter] || []
  );

  const historical = historicalData[selectedParameter] || [];
  const stats = calculateStats(historical);
  const accuracyData = calculateAccuracy(historical);
  const yesterdayBounds = getYesterdayBounds(historical);
  const missingDataCounts = getMissingDataCounts(historical);

  return (
    <div className="space-y-4">
      {/* Warnings */}
      <MLWarnings 
        yesterdayDataError={yesterdayDataError}
        yesterdayPredictionsError={yesterdayPredictionsError}
        hasYesterdayPredictions={hasYesterdayPredictions}
        missingActualDataPoints={missingDataCounts.missingActualDataPoints}
        missingPredictionDataPoints={missingDataCounts.missingPredictionDataPoints}
        isLoadingYesterdayData={isLoadingYesterdayData}
        isLoadingYesterdayPredictions={isLoadingYesterdayPredictions}
        onRetryYesterdayData={fetchYesterdayData}
        onRetryYesterdayPredictions={fetchYesterdayPredictions}
      />

      {/* Main Chart */}
      <Card className="h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Machine Learning - {selectedParameter}
            </CardTitle>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Rata-rata Kemarin</div>
              <div className="text-lg font-bold text-gray-900">
                {stats.average.toFixed(2)} {selectedParameter === 'TMA' ? 'm' : 'm³/s'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Total Kemarin</div>
              <div className="text-lg font-bold text-gray-900">
                {stats.total.toFixed(2)} {selectedParameter === 'TMA' ? 'm' : 'm³/s'}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Akurasi Prediksi</div>
              <div className="text-lg font-bold text-gray-900">
                {accuracyData.accuracy.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 40, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                
                <XAxis 
                  dataKey="datetime"
                  tickFormatter={formatXAxisTick}
                  interval={getXAxisInterval()}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                
                <YAxis domain={Y_AXIS_DOMAIN[selectedParameter]} />
                
                <Tooltip 
                  labelFormatter={formatDateTime}
                  formatter={(value: any, name: string) => [
                    value ? `${Number(value).toFixed(2)} ${selectedParameter === 'TMA' ? 'm' : 'm³/s'}` : 'No data',
                    name === 'actualValue' ? 'Actual' : 
                    name === 'predictedValue' ? 'Prediction' : 
                    name === 'value' ? 'Future Prediction' : name
                  ]}
                />
                
                <Legend />
                
                {/* Reference area for yesterday */}
                {yesterdayBounds.start && yesterdayBounds.end && (
                  <ReferenceArea 
                    x1={yesterdayBounds.start} 
                    x2={yesterdayBounds.end} 
                    fill="#f3f4f6" 
                    fillOpacity={0.3}
                  />
                )}
                
                {/* Actual values (yesterday) */}
                <Line 
                  type="monotone" 
                  dataKey="actualValue" 
                  stroke={CHART_COLORS.actual}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.actual, strokeWidth: 2, r: 3 }}
                  connectNulls={false}
                  name="Actual Values"
                />
                
                {/* Predicted values (yesterday) */}
                {hasYesterdayPredictions && (
                  <Line 
                    type="monotone" 
                    dataKey="predictedValue" 
                    stroke={CHART_COLORS.yesterdayPrediction}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: CHART_COLORS.yesterdayPrediction, strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                    name="Yesterday's Predictions"
                  />
                )}
                
                {/* Future predictions */}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={CHART_COLORS.futurePrediction}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.futurePrediction, strokeWidth: 2, r: 4 }}
                  connectNulls={false}
                  name="Future Predictions"
                />

                {renderChartLabels()}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionChart; 