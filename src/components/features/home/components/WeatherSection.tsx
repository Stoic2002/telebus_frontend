import React from 'react';
import { AwsComponent } from '@/components/features/home/legacy';

interface WeatherSectionProps {
  className?: string;
}

export const WeatherSection: React.FC<WeatherSectionProps> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800">Weather Station</h2>
      </div>
      <AwsComponent />
    </div>
  );
};

export default WeatherSection; 