import React, { useState } from 'react';
import { PredictionChart } from './PredictionChart';
import { PredictionParameter } from '@/types/machineLearningTypes';
import { Button } from '@/components/ui/button';
import { 
  IoWaterOutline,
  IoFlashOutline,
  IoStatsChartOutline,
  IoTrendingUpOutline
} from 'react-icons/io5';

export const MLChartsSection: React.FC = () => {
  const [selectedParameter, setSelectedParameter] = useState<PredictionParameter>('INFLOW');

  const parameters = [
    { 
      value: 'INFLOW' as PredictionParameter, 
      label: 'Inflow', 
      icon: IoWaterOutline,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      value: 'OUTFLOW' as PredictionParameter, 
      label: 'Outflow', 
      icon: IoFlashOutline,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50', 
      textColor: 'text-emerald-700'
    },
    { 
      value: 'TMA' as PredictionParameter, 
      label: 'TMA', 
      icon: IoStatsChartOutline,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    { 
      value: 'BEBAN' as PredictionParameter, 
      label: 'Beban', 
      icon: IoTrendingUpOutline,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  const currentParam = parameters.find(p => p.value === selectedParameter);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
        <h2 className="text-xl font-semibold text-gray-800">Prediction Charts</h2>
      </div>

      {/* Parameter Selection */}
      <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-semibold">Parameter Selection</h3>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parameters.map((param) => {
              const Icon = param.icon;
              const isSelected = selectedParameter === param.value;
              
              return (
                <Button
                  key={param.value}
                  onClick={() => setSelectedParameter(param.value)}
                  className={`
                    h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300
                    ${isSelected 
                      ? `bg-gradient-to-r ${param.color} text-white shadow-lg transform scale-105` 
                      : `bg-gray-50 hover:${param.bgColor} ${param.textColor} hover:shadow-md`
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium">{param.label}</span>
                  <span className="text-xs opacity-75">
                    {param.value === 'TMA' ? 'Water Level' : 
                     param.value === 'BEBAN' ? 'Load' : param.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className={`bg-gradient-to-r ${currentParam?.color || 'from-blue-500 to-blue-600'} text-white p-6`}>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-semibold">
              {selectedParameter} Predictions - 7 Day Forecast
            </h3>
          </div>
        </div>
        <div className="p-6 bg-white">
          <PredictionChart selectedParameter={selectedParameter} />
        </div>
      </div>
    </div>
  );
}; 