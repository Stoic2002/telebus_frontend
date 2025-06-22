import React from 'react';
import { useMachineLearningStore } from '@/store/machineLearningStore';
import { formatDateTime } from '../utils/chartUtils';
import { downloadCSV } from '../utils/downloadUtils';
import { PredictionParameter } from '@/types/machineLearningTypes';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { 
  IoWaterOutline,
  IoFlashOutline,
  IoStatsChartOutline,
  IoTrendingUpOutline
} from 'react-icons/io5';

export const MLParameterSection: React.FC = () => {
  const { 
    predictions, 
    historicalData, 
    loading,
    fetchPredictions,
    selectedParameter
  } = useMachineLearningStore();

  const parameters = [
    { 
      key: 'INFLOW' as PredictionParameter, 
      name: 'Inflow', 
      icon: IoWaterOutline, 
      unit: 'm³/s',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      key: 'OUTFLOW' as PredictionParameter, 
      name: 'Outflow', 
      icon: IoFlashOutline, 
      unit: 'm³/s',
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      key: 'TMA' as PredictionParameter, 
      name: 'TMA', 
      icon: IoStatsChartOutline, 
      unit: 'm',
      color: 'from-amber-500 to-amber-600'
    },
    { 
      key: 'BEBAN' as PredictionParameter, 
      name: 'Beban', 
      icon: IoTrendingUpOutline, 
      unit: 'MW',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleDownload = (parameterKey: PredictionParameter) => {
    const paramPredictions = predictions[parameterKey] || [];
    if (paramPredictions.length > 0) {
      downloadCSV(paramPredictions, parameterKey);
    }
  };

  const handleRefresh = () => {
    fetchPredictions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-semibold text-gray-800">Parameter Details</h2>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Parameter Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {parameters.map((param) => {
          const Icon = param.icon;
          const paramPredictions = predictions[param.key] || [];
          const paramHistorical = historicalData[param.key] || [];
          
          const stats = {
            predictionCount: paramPredictions.length,
            historicalCount: paramHistorical.length,
            avgValue: paramPredictions.length > 0 ? 
              paramPredictions.reduce((sum, item) => sum + item.value, 0) / paramPredictions.length : 0,
            maxValue: paramPredictions.length > 0 ? 
              Math.max(...paramPredictions.map(item => item.value)) : 0
          };

          return (
            <div 
              key={param.key}
              className={`bg-white rounded-xl shadow-xl border-0 overflow-hidden ${
                selectedParameter === param.key ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className={`bg-gradient-to-r ${param.color} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{param.name}</span>
                  </div>
                  <Button
                    onClick={() => handleDownload(param.key)}
                    disabled={stats.predictionCount === 0}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 h-auto"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Predictions:</span>
                    <div className="font-semibold text-gray-900">{stats.predictionCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Historical:</span>
                    <div className="font-semibold text-gray-900">{stats.historicalCount}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Average Value</div>
                  <div className="text-lg font-bold text-gray-900">
                    {stats.avgValue.toFixed(2)} {param.unit}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Peak Value</div>
                  <div className="text-lg font-bold text-gray-900">
                    {stats.maxValue.toFixed(2)} {param.unit}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-semibold">Prediction Data Table - {selectedParameter}</h3>
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Predicted Value</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Historical Data */}
                {(historicalData[selectedParameter] || []).map((item, index) => (
                  <tr key={`hist-${index}`} className="border-b hover:bg-yellow-50 bg-yellow-25">
                    <td className="px-4 py-3 font-medium">{formatDateTime(item.datetime)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">
                          Predicted: {item.predictedValue?.toFixed(2) || 'N/A'}
                        </span>
                        <span className="text-amber-600 font-medium">
                          Actual: {item.actualValue?.toFixed(2) || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Historical
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.actualValue !== null && item.predictedValue !== null ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Complete
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          Missing Data
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Future Predictions */}
                {(predictions[selectedParameter] || []).slice(0, 20).map((item, index) => (
                  <tr key={`pred-${index}`} className="border-b hover:bg-blue-50">
                    <td className="px-4 py-3 font-medium">{formatDateTime(item.datetime)}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {item.value.toFixed(2)} {selectedParameter === 'TMA' ? 'm' : selectedParameter === 'BEBAN' ? 'MW' : 'm³/s'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Future Prediction
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Predicted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Show more button if there are more predictions */}
          {(predictions[selectedParameter] || []).length > 20 && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Showing first 20 of {(predictions[selectedParameter] || []).length} predictions.
                <br />
                Download CSV to view all data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 