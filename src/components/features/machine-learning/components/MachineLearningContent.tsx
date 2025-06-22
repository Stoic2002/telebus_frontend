import React from 'react';
import { PredictionChart } from './PredictionChart';

// Machine Learning main content component
export const MachineLearningContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
          <h1 className="text-3xl font-bold text-gray-900">Machine Learning Predictions</h1>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 leading-relaxed">
            Sistem prediksi berbasis machine learning untuk parameter INFLOW, OUTFLOW, TMA, dan BEBAN. 
            Data prediksi menampilkan perbandingan dengan data aktual kemarin dan memberikan prediksi 
            untuk 7 hari kedepan dengan tingkat akurasi yang dapat dipantau secara real-time.
          </p>
        </div>

        {/* INFLOW Prediction Chart */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">INFLOW Predictions</h2>
          </div>
          <PredictionChart selectedParameter="INFLOW" />
        </div>

        {/* OUTFLOW Prediction Chart */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-green-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">OUTFLOW Predictions</h2>
          </div>
          <PredictionChart selectedParameter="OUTFLOW" />
        </div>

        {/* TMA Prediction Chart */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-yellow-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">TMA Predictions</h2>
          </div>
          <PredictionChart selectedParameter="TMA" />
        </div>

        {/* BEBAN Prediction Chart */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800">BEBAN Predictions</h2>
          </div>
          <PredictionChart selectedParameter="BEBAN" />
        </div>
      </div>
    </div>
  );
}; 