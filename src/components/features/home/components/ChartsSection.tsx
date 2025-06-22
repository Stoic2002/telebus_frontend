import React from 'react';
import { InflowChart as InflowChartComponent } from '@/components/features/home/legacy';

interface ChartsSectionProps {
  className?: string;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ className }) => {
  return (
    <div className={`space-y-8 ${className || ''}`}>
      <InflowChartComponent />
    </div>
  );
};

export default ChartsSection; 