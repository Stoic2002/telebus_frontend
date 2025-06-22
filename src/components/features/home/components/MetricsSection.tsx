import React from 'react';
import { MetricCard } from '@/components/common/cards/MetricCard';
import { CARD_THEMES } from '@/constants/colors';
import { formatNumber } from '@/lib/utils/formatNumber';
import { 
  IoWaterOutline, 
  IoFlashOutline, 
  IoBulbOutline, 
  IoFlagOutline, 
  IoLayersOutline
} from 'react-icons/io5';

interface MetricsSectionProps {
  tmaData: {
    tmaValue: number;
    volume: number;
  };
  targetElevasi: number | null;
  rohData: Array<{
    content?: {
      totalDaya?: number;
    };
  }>;
  soedirman: {
    activeLoads: {
      total: number;
    };
    levels: {
      sediment?: number;
    };
  };
  isLoading?: boolean;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  tmaData,
  targetElevasi,
  rohData,
  soedirman,
  isLoading = false
}) => {
  // Metric cards configuration
  const metricCards = [
    {
      title: "Water Level",
      value: `${tmaData.tmaValue.toFixed(2)} mdpl`,
      subtitle: "per hour",
      icon: IoWaterOutline,
      ...CARD_THEMES.waterLevel
    },
    {
      title: "Volume Effective",
      value: `${formatNumber(tmaData.volume)} m³`,
      subtitle: "per hour",
      icon: IoFlashOutline,
      ...CARD_THEMES.volumeEffective
    },
    {
      title: "Total Load",
      value: `${soedirman.activeLoads.total.toFixed(2) ?? 0} MW`,
      subtitle: "current condition",
      icon: IoFlashOutline,
      ...CARD_THEMES.totalLoad
    },
    {
      title: "Prediksi ROH",
      value: `${formatNumber(rohData[0]?.content?.totalDaya || 0)} MW`,
      subtitle: "today",
      icon: IoBulbOutline,
      ...CARD_THEMES.prediction
    },
    {
      title: "Target Water Level",
      value: targetElevasi !== null ? `${targetElevasi.toFixed(2)} mdpl` : 'Loading...',
      subtitle: "per day",
      icon: IoFlagOutline,
      ...CARD_THEMES.targetLevel
    },
    {
      title: "Level Sedimen",
      value: `${soedirman.levels.sediment?.toFixed(2) ?? 0} mdpl`,
      subtitle: "current condition",
      icon: IoLayersOutline,
      ...CARD_THEMES.sedimentLevel
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {metricCards.map((card, index) => (
        <MetricCard
          key={index}
          title={card.title}
          value={card.value}
          subtitle={card.subtitle}
          icon={card.icon}
          gradient={card.gradient}
          bgColor={card.bgColor}
          textColor={card.textColor}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default MetricsSection; 