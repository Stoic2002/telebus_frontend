import React from 'react';
import { MLInflowSection } from './MLInflowSection';

// Machine Learning main content component - INFLOW focused
export const MachineLearningContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">Inflow Predictions</h1>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold">Sistem Prediksi Inflow Berbasis AI</h2>
              </div>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-600 leading-relaxed">
                Sistem prediksi berbasis machine learning untuk parameter INFLOW. 
                Data prediksi menampilkan perbandingan dengan data aktual kemarin dan memberikan prediksi 
                untuk 7 hari kedepan dengan tingkat akurasi yang dapat dipantau secara real-time.
              </p>
            </div>
          </div>
        </div>

        {/* INFLOW Prediction Section */}
        <MLInflowSection />
      </div>
    </div>
  );
}; 