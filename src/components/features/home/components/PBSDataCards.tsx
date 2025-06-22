import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GRADIENTS } from '@/constants/colors';
import { 
  IoFlashOutline, 
  IoWaterOutline, 
  IoArrowDownOutline, 
  IoLayersOutline, 
  IoArrowUpOutline 
} from 'react-icons/io5';

// Types for the component props (preserving original data structure)
interface PBSDataCardsProps {
  soedirman: {
    activeLoads: {
      pb01?: number;
      pb02?: number;
      pb03?: number;
      total: number;
    };
    flows: {
      turbine: {
        total: number;
      };
    };
    levels: {
      elevation?: number;
      sediment?: number;
      waterDepth?: number;
    };
  };
  soedirman2: {
    flows: {
      turbine: {
        pb01?: number;
        pb02?: number;
        pb03?: number;
      };
      irigasi?: number;
      ddc?: number;
      spillway: {
        total: number;
      };
    };
  };
  awlrData: {
    serayu?: { debit: number } | null;
    merawu?: { debit: number } | null;
    lumajang?: { debit: number } | null;
  };
}

export const PBSDataCards: React.FC<PBSDataCardsProps> = ({
  soedirman,
  soedirman2,
  awlrData
}) => {
  // PBS Data configuration (preserved from original)
  const pbsData = [
    {
      name: "Unit Load",
      icon: IoFlashOutline,
      gradient: "from-purple-500 to-indigo-600",
      item: [
        { id: 'PBS 1', value: soedirman.activeLoads.pb01?.toFixed(2) ?? 0},
        { id: "PBS 2", value: soedirman.activeLoads.pb02?.toFixed(2) ?? 0},
        { id: 'PBS 3', value: soedirman.activeLoads.pb03?.toFixed(2) ?? 0}
      ],
      total: soedirman.activeLoads.total.toFixed(2) ?? 0,
      unit: "MW"
    },
    {
      name: "Unit Outflow",
      icon: IoWaterOutline,
      gradient: "from-blue-500 to-cyan-600",
      item: [
        { id: 'PBS 1', value: soedirman2.flows.turbine.pb01?.toFixed(2) ?? 0},
        { id: 'PBS 2', value: soedirman2.flows.turbine.pb02?.toFixed(2) ?? 0},
        { id: 'PBS 3', value: soedirman2.flows.turbine.pb03?.toFixed(2) ?? 0}
      ],
      total: soedirman.flows.turbine.total ?? 0,
      unit: "m³/s"
    },
    {
      name: "Inflow",
      icon: IoArrowDownOutline,
      gradient: "from-emerald-500 to-teal-600",
      item: [
        { id: 'Serayu', value: awlrData.serayu?.debit ?? 0},
        { id: 'Merawu', value: awlrData.merawu?.debit ?? 0 },
        { id: 'Lumajang', value: awlrData.lumajang?.debit ?? 0 }
      ],
      total: awlrData.serayu && awlrData.merawu && awlrData.lumajang 
        ? (awlrData.serayu.debit + awlrData.merawu.debit + awlrData.lumajang.debit).toFixed(2) 
        : 'N/A',
      unit: "m³/s"
    },
    {
      name: "DAM",
      icon: IoLayersOutline,
      gradient: "from-slate-500 to-gray-600",
      item: [
        { id: 'TMA', value: soedirman.levels.elevation?.toFixed(2) ?? 0 },
        { id: 'Sedimen lvl', value: soedirman.levels.sediment?.toFixed(2) ?? 0},
        { id: 'Water Depth', value: soedirman.levels.waterDepth?.toFixed(2) ?? 0}
      ],
      unit: "m"
    },
    {
      name: "Outflow",
      icon: IoArrowUpOutline,
      gradient: "from-orange-500 to-red-600",
      item: [
        { id: 'irigasi', value: soedirman2.flows.irigasi?.toFixed(2) ?? 0},
        { id: 'ddc', value: soedirman2.flows.ddc?.toFixed(2) ?? 0},
        { id: 'spillway', value: soedirman2.flows.spillway.total.toFixed(2) ?? 0}
      ],
      total: ((soedirman2.flows.ddc ?? 0) + (soedirman2.flows.spillway.total)).toFixed(2) ?? 0,
      unit: "m³/s"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {pbsData.map((item, index) => (
        <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${item.gradient} text-white p-4`}>
            <div className="flex items-center space-x-3">
              <item.icon className="text-2xl" />
              <h3 className="font-semibold text-sm">{item.name}</h3>
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-gray-50">
            <div className="space-y-3">
              {item.item.map((subItem) => (
                <div key={subItem.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-medium text-gray-700">{subItem.id}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {subItem.value !== "N/A" ? `${subItem.value} ${item.unit || ""}` : subItem.value}
                  </span>
                </div>
              ))}
              
              {/* Total Section - preserved logic */}
              {item.name !== "DAM" && (
                <div className="mt-4 pt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {item.total !== "N/A" ? `${item.total} ${item.unit || ""}` : item.total}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PBSDataCards; 