import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconType } from 'react-icons';
import { cn } from '@/lib/utils';

// Types
export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: IconType;
  gradient: string;
  bgColor: string;
  textColor: string;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  showProgress?: boolean;
  progressValue?: number;
}

export interface MetricCardSkeletonProps {
  count?: number;
  className?: string;
}

// Shimmer/Skeleton component for loading state
export const MetricCardSkeleton: React.FC<MetricCardSkeletonProps> = ({ 
  count = 1, 
  className 
}) => (
  <>
    {Array.from({ length: count }).map((_, index) => (
      <Card 
        key={index} 
        className={cn("animate-pulse border-0 shadow-lg overflow-hidden", className)}
      >
        <CardHeader className="bg-gray-200 h-16">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-gray-50">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </CardContent>
      </Card>
    ))}
  </>
);

// Main MetricCard component
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  bgColor,
  textColor,
  isLoading = false,
  className,
  onClick,
  showProgress = false,
  progressValue = 0
}) => {
  if (isLoading) {
    return <MetricCardSkeleton count={1} className={className} />;
  }

  return (
    <Card 
      className={cn(
        "group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden",
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={`bg-gradient-to-r ${gradient} text-white p-4`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <Icon className="text-2xl opacity-80" />
        </div>
      </CardHeader>
      <CardContent className={`${bgColor} p-4`}>
        <div className={`text-2xl font-bold ${textColor} mb-1`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}
        
        {/* Progress bar if enabled */}
        {showProgress && (
          <div className="mt-3">
            <div className="w-full bg-white/50 rounded-full h-1">
              <div 
                className={`bg-gradient-to-r ${gradient} h-1 rounded-full transition-all duration-1000`} 
                style={{ width: `${Math.min(progressValue, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Factory function for creating metric cards with consistent configuration
export const createMetricCard = (config: Omit<MetricCardProps, 'value'>) => 
  (props: Pick<MetricCardProps, 'value' | 'isLoading' | 'onClick'>) => 
    <MetricCard {...config} {...props} />;

export default MetricCard; 