import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Base shimmer animation component
const ShimmerBox: React.FC<{
  className?: string;
  width?: string;
  height?: string;
}> = ({ className, width, height }) => (
  <div
    className={cn(
      'animate-pulse bg-gray-200 rounded',
      className
    )}
    style={{ width, height }}
  />
);

// Card shimmer variants
const ShimmerCard: React.FC<{
  variant?: 'metric' | 'data' | 'weather' | 'chart';
  className?: string;
}> = ({ variant = 'metric', className }) => {
  if (variant === 'metric') {
    return (
      <Card className={cn("animate-pulse border-0 shadow-lg overflow-hidden", className)}>
        <CardHeader className="bg-gray-200 h-16">
          <div className="flex items-center justify-between">
            <ShimmerBox className="h-4 w-24" />
            <ShimmerBox className="w-8 h-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-gray-50">
          <ShimmerBox className="h-8 w-full mb-2" />
          <ShimmerBox className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'weather') {
    return (
      <Card className={cn("animate-pulse border-0 shadow-lg overflow-hidden", className)}>
        <CardHeader className="bg-gray-200 h-20">
          <div className="flex items-center space-x-3">
            <ShimmerBox className="w-10 h-10 rounded-lg" />
            <ShimmerBox className="h-4 w-28" />
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-gray-50">
          <ShimmerBox className="h-10 w-full mb-2" />
          <ShimmerBox className="h-1 w-full rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'chart') {
    return (
      <Card className={cn("animate-pulse border-0 shadow-lg", className)}>
        <CardHeader className="bg-gray-200 h-16">
          <div className="flex items-center justify-between">
            <ShimmerBox className="h-5 w-40" />
            <ShimmerBox className="h-8 w-24 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ShimmerBox className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Default data variant
  return (
    <Card className={cn("animate-pulse border-0 shadow-lg", className)}>
      <CardHeader className="bg-gray-200 h-14">
        <ShimmerBox className="h-5 w-32" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <ShimmerBox className="h-4 w-full" />
        <ShimmerBox className="h-4 w-3/4" />
        <ShimmerBox className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
};

// Table shimmer loader
const ShimmerTable: React.FC<{
  rows?: number;
  cols?: number;
  hasHeader?: boolean;
  className?: string;
}> = ({ rows = 5, cols = 4, hasHeader = true, className }) => (
  <div className={cn("overflow-hidden border border-gray-200 rounded-lg", className)}>
    <table className="w-full">
      {hasHeader && (
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-3">
                <ShimmerBox className="h-4 w-full" />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <ShimmerBox className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Grid shimmer loader
const ShimmerGrid: React.FC<{
  items?: number;
  variant?: 'metric' | 'data' | 'weather';
  cols?: string;
  className?: string;
}> = ({ items = 6, variant = 'metric', cols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6', className }) => (
  <div className={cn(`grid ${cols} gap-6`, className)}>
    {Array.from({ length: items }).map((_, index) => (
      <ShimmerCard key={index} variant={variant} />
    ))}
  </div>
);

// Page shimmer loader
const ShimmerPage: React.FC<{
  hasMetrics?: boolean;
  hasCharts?: boolean;
  hasTables?: boolean;
  className?: string;
}> = ({ hasMetrics = true, hasCharts = true, hasTables = true, className }) => (
  <div className={cn("min-h-screen bg-gradient-to-br from-gray-50 to-blue-50", className)}>
    <div className="p-6 space-y-8">
      {hasMetrics && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <ShimmerBox className="w-1 h-8 rounded-full" />
            <ShimmerBox className="h-8 w-48" />
          </div>
          <ShimmerGrid items={6} variant="metric" />
        </div>
      )}
      
      {hasCharts && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <ShimmerBox className="w-1 h-8 rounded-full" />
            <ShimmerBox className="h-8 w-48" />
          </div>
          <ShimmerCard variant="chart" />
        </div>
      )}
      
      {hasTables && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <ShimmerBox className="w-1 h-8 rounded-full" />
            <ShimmerBox className="h-8 w-48" />
          </div>
          <ShimmerTable rows={8} cols={7} />
        </div>
      )}
    </div>
  </div>
);

// Export all components
export { 
  ShimmerBox, 
  ShimmerCard, 
  ShimmerTable, 
  ShimmerGrid, 
  ShimmerPage 
};

export default ShimmerPage; 