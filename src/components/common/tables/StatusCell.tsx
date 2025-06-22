import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_COLORS } from '@/constants/colors';

interface StatusCellProps {
  status: string;
  className?: string;
}

// Function to determine status color (preserved from original)
const getStatusColor = (status: string) => {
  const normalizedStatus = status.toUpperCase();
  
  if (normalizedStatus === 'NORMAL') {
    return STATUS_COLORS.normal;
  } else if (normalizedStatus === 'WASPADA') {
    return STATUS_COLORS.waspada;
  } else if (normalizedStatus === 'AWAS') {
    return STATUS_COLORS.awas;
  } else {
    return STATUS_COLORS.default;
  }
};

export const StatusCell: React.FC<StatusCellProps> = ({ status, className }) => {
  const colors = getStatusColor(status);
  
  return (
    <span 
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold border',
        `${colors.bg} ${colors.text} ${colors.border}`,
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusCell; 