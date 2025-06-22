import React from 'react';
import { IoWaterOutline, IoRainyOutline } from 'react-icons/io5';
import { StationCard, StationData } from './StationCard';

interface StationGridProps {
  stations: StationData[] | null;
  type: 'waterlevel' | 'rainfall';
  isLoading?: boolean;
  className?: string;
}

export const StationGrid: React.FC<StationGridProps> = ({ 
  stations, 
  type, 
  isLoading = false,
  className 
}) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className || ''}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stations || stations.length === 0) {
    const Icon = type === 'waterlevel' ? IoWaterOutline : IoRainyOutline;
    const message = type === 'waterlevel' 
      ? 'No water level data available'
      : 'No rainfall data available';

    return (
      <div className={`flex items-center justify-center py-12 ${className || ''}`}>
        <div className="text-center space-y-4">
          <Icon className="w-16 h-16 text-gray-400 mx-auto" />
          <div>
            <p className="text-gray-600 font-medium">{message}</p>
            <p className="text-gray-500 text-sm">Please check back later or refresh the data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className || ''}`}>
      {stations.map((station, index) => (
        <StationCard
          key={station.header.name}
          station={station}
          type={type}
        />
      ))}
    </div>
  );
};

export default StationGrid; 