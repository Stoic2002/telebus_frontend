import React from 'react';
import PredictionChart from '@/components/PredictionChart';

const PredictionDemo = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Dashboard Prediksi Machine Learning
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionChart parameter="INFLOW" title="Prediksi Inflow (7 Hari)" />
        <PredictionChart parameter="OUTFLOW" title="Prediksi Outflow (7 Hari)" />
        <PredictionChart parameter="TMA" title="Prediksi TMA (7 Hari)" />
        <PredictionChart parameter="BEBAN" title="Prediksi Beban (7 Hari)" />
      </div>
    </div>
  );
};

export default PredictionDemo; 