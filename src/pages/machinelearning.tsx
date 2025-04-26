import React, { useState } from 'react';
import PredictionChart from '@/components/PredictionChart';

const MachineLearningPage = () => {
  const [showPrevDay, setShowPrevDay] = useState<boolean>(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Prediksi Machine Learning
        </h1>
        
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              !showPrevDay 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setShowPrevDay(false)}
          >
            7-Day Forecast
          </button>
          
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              showPrevDay 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setShowPrevDay(true)}
          >
            Prediction Day Before
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionChart 
          parameter="INFLOW" 
          title={`Prediksi Inflow (${showPrevDay ? 'Hari Sebelumnya' : '7 Hari'})`} 
          usePrevDay={showPrevDay}
        />
        <PredictionChart 
          parameter="OUTFLOW" 
          title={`Prediksi Outflow (${showPrevDay ? 'Hari Sebelumnya' : '7 Hari'})`} 
          usePrevDay={showPrevDay}
        />
        <PredictionChart 
          parameter="TMA" 
          title={`Prediksi TMA (${showPrevDay ? 'Hari Sebelumnya' : '7 Hari'})`} 
          usePrevDay={showPrevDay}
        />
        <PredictionChart 
          parameter="BEBAN" 
          title={`Prediksi Beban (${showPrevDay ? 'Hari Sebelumnya' : '7 Hari'})`} 
          usePrevDay={showPrevDay}
        />
      </div>
    </div>
  );
};

export default MachineLearningPage; 