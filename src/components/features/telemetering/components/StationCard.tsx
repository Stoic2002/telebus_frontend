import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IoWaterOutline, IoRainyOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5';

export interface StationData {
  header: {
    name: string;
    x: string;
    y: string;
  };
  data: Array<{
    datetime: string;
    wl?: string | number;
    rf?: string | number;
  }>;
}

interface StationCardProps {
  station: StationData;
  type: 'waterlevel' | 'rainfall';
  className?: string;
}

export const StationCard: React.FC<StationCardProps> = ({ station, type, className }) => {
  const getLatestValidReading = (data: any[], key: 'wl' | 'rf') => {
    // Sort data by datetime in descending order (most recent first)
    const sortedData = [...data].sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    
    // Find the first valid reading
    const validReading = sortedData.find(reading => reading[key] !== '-');
    return validReading ? validReading[key] : '-';
  };

  const getLatestDateTime = (data: any[]) => {
    // Sort data by datetime in descending order and get the most recent
    const sortedData = [...data].sort((a, b) => 
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );
    return sortedData[0]?.datetime || '-';
  };

  const getTotalRainfall = (data: any[]) => {
    // Get today's date at start of day for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return data
      .filter(reading => {
        // Only include readings from today
        const readingDate = new Date(reading.datetime);
        return readingDate >= today && reading.rf !== '-';
      })
      .reduce((sum, reading) => sum + parseFloat(reading.rf || '0'), 0)
      .toFixed(2);
  };

  const formatDateTime = (datetime: string) => {
    if (datetime === '-') return datetime;
    return new Date(datetime).toLocaleString();
  };

  const isWaterLevel = type === 'waterlevel';
  const primaryValue = isWaterLevel 
    ? `${getLatestValidReading(station.data, 'wl')} m` 
    : `${getTotalRainfall(station.data)} mm`;
  const primaryLabel = isWaterLevel ? 'Current water level' : 'Total rainfall today';
  
  const secondaryValue = !isWaterLevel 
    ? `${getLatestValidReading(station.data, 'rf')} mm/h`
    : null;
  const secondaryLabel = !isWaterLevel ? 'Current intensity' : null;

  const headerColor = isWaterLevel ? 'from-cyan-500 to-cyan-600' : 'from-blue-500 to-blue-600';
  const contentColor = isWaterLevel ? 'bg-cyan-50' : 'bg-blue-50';
  const valueColor = isWaterLevel ? 'text-cyan-700' : 'text-blue-700';
  const borderColor = isWaterLevel ? 'border-cyan-200' : 'border-blue-200';
  const Icon = isWaterLevel ? IoWaterOutline : IoRainyOutline;

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden ${className || ''}`}>
      <CardHeader className={`bg-gradient-to-r ${headerColor} text-white p-4`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{station.header.name}</CardTitle>
          <Icon className="text-2xl opacity-80" />
        </div>
      </CardHeader>
      <CardContent className={`${contentColor} p-4`}>
        <div className="space-y-3">
          {/* Primary Value */}
          <div>
            <div className={`text-2xl font-bold ${valueColor} mb-1`}>
              {primaryValue}
            </div>
            <p className="text-gray-500 text-sm">{primaryLabel}</p>
          </div>
          
          {/* Secondary Value (only for rainfall) */}
          {secondaryValue && secondaryLabel && (
            <div>
              <div className={`text-lg font-semibold text-blue-600`}>
                {secondaryValue}
              </div>
              <p className="text-gray-500 text-sm">{secondaryLabel}</p>
            </div>
          )}
          
          {/* Location and Time Info */}
          <div className={`pt-2 border-t ${borderColor}`}>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <IoLocationOutline className="w-4 h-4" />
              <span>Lat: {station.header.y}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <IoLocationOutline className="w-4 h-4" />
              <span>Lng: {station.header.x}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <IoTimeOutline className="w-4 h-4" />
              <span>{formatDateTime(getLatestDateTime(station.data))}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationCard; 