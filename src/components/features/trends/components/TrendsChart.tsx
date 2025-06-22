import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoFlashOutline, IoWaterOutline, IoStatsChartOutline, IoTrendingUpOutline } from 'react-icons/io5';

interface TrendsChartProps {
  data: any[];
  activeTab: 'trends1' | 'trends2' | 'trends3';
  className?: string;
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ data, activeTab, className }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold mb-2 text-gray-800">{`Time: ${label}`}</p>
          {payload.map((pld: any) => (
            <p key={pld.name} style={{ color: pld.color }} className="font-medium">
              {`${pld.name}: ${pld.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getChartConfig = () => {
    let lines: JSX.Element, legend: any[], yAxisLabel: string;

    switch (activeTab) {
      case 'trends1':
        lines = (
          <>
            <Line 
              type="monotone" 
              dataKey="totalBeban" 
              name="Total Beban"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="inflow" 
              name="Inflow"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="tma" 
              name="TMA"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#f59e0b' }}
            />
            <Line 
              type="monotone" 
              dataKey="outflow" 
              name="Outflow"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#ef4444' }}
            />
          </>
        );
        legend = [
          { name: 'Total Beban', color: '#3b82f6', icon: IoFlashOutline },
          { name: 'Inflow', color: '#10b981', icon: IoWaterOutline },
          { name: 'TMA', color: '#f59e0b', icon: IoStatsChartOutline },
          { name: 'Outflow', color: '#ef4444', icon: IoWaterOutline }
        ];
        yAxisLabel = 'Values';
        break;

      case 'trends2':
        lines = (
          <>
            <Line 
              type="monotone" 
              dataKey="arrST01" 
              name="ARR ST01"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }}
            />
            <Line 
              type="monotone" 
              dataKey="arrST02" 
              name="ARR ST02"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#10b981' }}
            />
            <Line 
              type="monotone" 
              dataKey="arrST03" 
              name="ARR ST03"
              stroke="#ef4444"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8, strokeWidth: 2, fill: '#ef4444' }}
            />
          </>
        );
        legend = [
          { name: 'ARR ST01', color: '#3b82f6', icon: IoStatsChartOutline },
          { name: 'ARR ST02', color: '#10b981', icon: IoStatsChartOutline },
          { name: 'ARR ST03', color: '#ef4444', icon: IoStatsChartOutline }
        ];
        yAxisLabel = 'Values';
        break;

      case 'trends3':
        lines = (
          <Line 
            type="monotone" 
            dataKey="inflow" 
            name="Inflow"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, strokeWidth: 2, fill: '#3b82f6' }}
          />
        );
        legend = [
          { name: 'Inflow', color: '#3b82f6', icon: IoWaterOutline }
        ];
        yAxisLabel = 'Value';
        break;

      default:
        lines = <></>;
        legend = [];
        yAxisLabel = 'Values';
    }

    return { lines, legend, yAxisLabel };
  };

  const { lines, legend, yAxisLabel } = getChartConfig();

  if (data.length === 0) {
    const emptyStateIcons = {
      trends1: IoTrendingUpOutline,
      trends2: IoStatsChartOutline,
      trends3: IoWaterOutline
    };
    
    const EmptyIcon = emptyStateIcons[activeTab];
    const emptyMessages = {
      trends1: 'No trends data available',
      trends2: 'No ARR station data available',
      trends3: 'No inflow data available'
    };

    return (
      <div className={`flex items-center justify-center py-20 ${className || ''}`}>
        <div className="text-center space-y-4">
          <EmptyIcon className="w-16 h-16 text-gray-400 mx-auto" />
          <div>
            <p className="text-gray-600 font-medium">{emptyMessages[activeTab]}</p>
            <p className="text-gray-500 text-sm">Please check back later or refresh the data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Legend */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {legend.map((item) => (
          <div key={item.name} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <item.icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 40,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280' }
              }}
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {lines}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart; 