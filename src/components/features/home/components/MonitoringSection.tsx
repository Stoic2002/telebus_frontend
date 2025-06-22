import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import usePbsNodeData from '@/hooks/usePbsNodeData';
import { useNodeBatch1 } from '@/hooks/useNodeBatch1';
import { 
  IoFlashOutline, 
  IoWaterOutline, 
  IoArrowDownOutline, 
  IoLayersOutline, 
  IoArrowUpOutline 
} from 'react-icons/io5';

// Simplified MonitoringSection without shimmer loading and refresh
export const MonitoringSection: React.FC = () => {
  // PBS data from hook (with interval)
  const { soedirman, error: pbsError, lastUpdate } = usePbsNodeData({ interval: 30000 });
  // Additional data for outflow from nodeBatch1
  const { soedirman2, error: batch1Error } = useNodeBatch1({ interval: 30000 });

  if (pbsError || batch1Error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error loading PBS data: {pbsError || batch1Error}</p>
        </div>
      </div>
    );
  }

  // Enhanced metric cards with Unit Outflow and Outflow
  const metrics = [
    {
      name: "Unit Load",
      icon: IoFlashOutline,
      gradient: "from-purple-500 to-indigo-600",
      values: [
        { label: 'PBS 1', value: soedirman?.activeLoads?.pb01?.toFixed(2) ?? 'N/A' },
        { label: 'PBS 2', value: soedirman?.activeLoads?.pb02?.toFixed(2) ?? 'N/A' },
        { label: 'PBS 3', value: soedirman?.activeLoads?.pb03?.toFixed(2) ?? 'N/A' }
      ],
      total: soedirman?.activeLoads?.total?.toFixed(2) ?? 'N/A',
      unit: "MW"
    },
    {
      name: "Unit Outflow",
      icon: IoWaterOutline,
      gradient: "from-blue-500 to-cyan-600",
      values: [
        { label: 'PBS 1', value: soedirman2?.flows?.turbine?.pb01?.toFixed(2) ?? 'N/A' },
        { label: 'PBS 2', value: soedirman2?.flows?.turbine?.pb02?.toFixed(2) ?? 'N/A' },
        { label: 'PBS 3', value: soedirman2?.flows?.turbine?.pb03?.toFixed(2) ?? 'N/A' }
      ],
      total: soedirman?.flows?.turbine?.total?.toFixed(2) ?? 'N/A',
      unit: "m³/s"
    },
    {
      name: "Water Levels",
      icon: IoLayersOutline,
      gradient: "from-slate-500 to-gray-600",
      values: [
        { label: 'TMA', value: soedirman?.levels?.elevation?.toFixed(2) ?? 'N/A' },
        { label: 'Sedimen', value: soedirman?.levels?.sediment?.toFixed(2) ?? 'N/A' },
        { label: 'Water Depth', value: soedirman?.levels?.waterDepth?.toFixed(2) ?? 'N/A' }
      ],
      unit: "m"
    },
    {
      name: "Inflow",
      icon: IoArrowDownOutline,
      gradient: "from-emerald-500 to-teal-600",
      values: [
        { label: 'Inflow Waduk', value: soedirman?.flows?.inflow?.toFixed(2) ?? 'N/A' },
        { label: 'Inflow 1H', value: soedirman?.additionalData?.inflow1h?.toFixed(2) ?? 'N/A' },
        { label: 'Total Turbine', value: soedirman?.flows?.turbine?.total?.toFixed(2) ?? 'N/A' }
      ],
      unit: "m³/s"
    },
    {
      name: "Outflow",
      icon: IoArrowUpOutline,
      gradient: "from-orange-500 to-red-600",
      values: [
        { label: 'Irigasi', value: soedirman2?.flows?.irigasi?.toFixed(2) ?? 'N/A' },
        { label: 'DDC', value: soedirman2?.flows?.ddc?.toFixed(2) ?? 'N/A' },
        { label: 'Spillway', value: soedirman2?.flows?.spillway?.total?.toFixed(2) ?? 'N/A' }
      ],
      total: ((soedirman2?.flows?.ddc ?? 0) + (soedirman2?.flows?.spillway?.total ?? 0) + (soedirman2?.flows?.irigasi ?? 0)).toFixed(2),
      unit: "m³/s"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-800">Monitoring PBS Soedirman</h2>
        {lastUpdate && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Last Update: {new Date(lastUpdate).toLocaleTimeString('id-ID')}
          </span>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${metric.gradient} text-white p-4`}>
              <div className="flex items-center space-x-3">
                <metric.icon className="text-2xl" />
                <CardTitle className="font-semibold text-lg">{metric.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50">
              <div className="space-y-3">
                {metric.values.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.value !== 'N/A' ? `${item.value} ${metric.unit}` : item.value}
                    </span>
                  </div>
                ))}
                
                {/* Total Section if available */}
                {metric.total && (
                  <div className="mt-4 pt-3 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-800">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {metric.total !== 'N/A' ? `${metric.total} ${metric.unit}` : metric.total}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 