import React, { useState } from 'react';
import PredictionChart from '@/components/PredictionChart';
import { PredictionMode } from '@/hooks/useMachineLearningData';
import { PredictionParameter } from '@/types/machineLearningTypes';

const MachineLearningPage = () => {
  const [mode, setMode] = useState<PredictionMode>('7day');
  
  // Toggle between 7-day forecast and day-before prediction
  const toggleMode = () => {
    setMode(mode === '7day' ? 'day-before' : '7day');
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Machine Learning Prediction
        </h1>
        
        <div className="flex space-x-4">
          <button
            onClick={toggleMode}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === '7day' 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {mode === '7day' ? 'Tampilkan Prediksi Kemarin' : 'Tampilkan Prediksi 7 Hari'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700">
          {mode === '7day' 
            ? 'Menampilkan prediksi untuk 7 hari ke depan dibandingkan dengan data aktual hari ini.' 
            : 'Menampilkan prediksi kemarin dibandingkan dengan data aktual kemarin.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionChartWithMode parameter="INFLOW" mode={mode} />
        <PredictionChartWithMode parameter="OUTFLOW" mode={mode} />
        <PredictionChartWithMode parameter="TMA" mode={mode} />
        <PredictionChartWithMode parameter="BEBAN" mode={mode} />
      </div>
    </div>
  );
};

// Component wrapper to pass mode to PredictionChart
const PredictionChartWithMode = ({ 
  parameter, 
  mode 
}: { 
  parameter: PredictionParameter; 
  mode: PredictionMode 
}) => {
  const title = mode === '7day'
    ? `Prediksi ${parameter} (7 Hari)`
    : `Prediksi ${parameter} (Kemarin)`;
    
  return (
    <PredictionChart 
      parameter={parameter} 
      title={title} 
      mode={mode}
    />
  );
};

export default MachineLearningPage; 