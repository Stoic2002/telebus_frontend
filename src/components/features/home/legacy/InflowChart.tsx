import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDataStore } from '@/store/dataStore';
import ContentLoader from 'react-content-loader'

const InflowChartComponent = () => {
  const { 
    inflowChartData: data, 
    loading: { inflowChart: loading }, 
    error,
    fetchInflowChartData,
    clearError 
  } = useDataStore();

  useEffect(() => {
    fetchInflowChartData();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchInflowChartData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold text-white">Debit Air per Jam</h2>
          </div>
        </div>
        <div className="p-6">
          <ContentLoader
            speed={2}
            width="100%"
            height={400}
            viewBox="0 0 400 160"
            backgroundColor="#f3f4f6"
            foregroundColor="#e5e7eb"
            className="w-full"
          >
            <rect x="0" y="10" rx="8" ry="8" width="100" height="20" />
            <rect x="0" y="40" rx="8" ry="8" width="300" height="20" />
            <rect x="0" y="70" rx="8" ry="8" width="400" height="20" />
            <rect x="0" y="100" rx="8" ry="8" width="200" height="20" />
          </ContentLoader>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
          <h2 className="text-xl font-bold text-white">Debit Air per Jam</h2>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Chart Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              clearError();
              fetchInflowChartData();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg p-4 border border-gray-200 rounded-xl shadow-2xl">
          <p className="font-bold mb-3 text-gray-800 border-b pb-2">{`Waktu: ${label}`}</p>
          <div className="space-y-2">
            {payload.map((pld: any) => (
              <div key={pld.name} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pld.color }}
                  />
                  <span className="font-medium text-gray-700">{pld.name}:</span>
                </div>
                <span className="font-bold" style={{ color: pld.color }}>
                  {pld.value.toFixed(2)} m³/s
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Legend dengan styling yang lebih baik
  const CustomLegend = () => (
    <div className="flex justify-center gap-8 mb-6 p-4 bg-gray-50 rounded-xl">
      {[
        { name: 'Serayu', color: '#3b82f6', icon: '🌊' },
        { name: 'Merawu', color: '#10b981', icon: '💧' },
        { name: 'Lumajang', color: '#ef4444', icon: '🏔️' }
      ].map((item) => (
        <div key={item.name} className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm">
          <span className="text-lg">{item.icon}</span>
          <div 
            className="w-4 h-4 rounded-full shadow-sm" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm font-semibold text-gray-700">{item.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold text-white">Debit Air per Jam</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full">
              Real-time Data ({data.length} points)
            </div>
            <button
              onClick={() => fetchInflowChartData()}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        <CustomLegend />
        <div className="h-96 relative">
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
                interval={0}
                height={40}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#9ca3af"
              />
              <YAxis 
                label={{ 
                  value: 'Debit (m³/s)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -30,
                  style: { textAnchor: 'middle', fill: '#6b7280' }
                }}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#9ca3af"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="serayu" 
                name="Serayu"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                filter="url(#shadow)"
              />
              <Line 
                type="monotone" 
                dataKey="merawu" 
                name="Merawu"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="lumajang" 
                name="Lumajang"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Serayu', value: data.length > 0 ? data[data.length - 1]?.serayu : 0, color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { name: 'Merawu', value: data.length > 0 ? data[data.length - 1]?.merawu : 0, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { name: 'Lumajang', value: data.length > 0 ? data[data.length - 1]?.lumajang : 0, color: 'bg-red-50 text-red-700 border-red-200' }
          ].map((item, index) => (
            <div key={index} className={`p-4 rounded-xl border-2 ${item.color}`}>
              <div className="text-sm font-medium opacity-70">{item.name} (Latest)</div>
              <div className="text-2xl font-bold">{item.value?.toFixed(2) || '0.00'} m³/s</div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {data.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Chart Data Available</h3>
            <p className="text-gray-500 mb-4">Data debit air tidak tersedia saat ini.</p>
            <button
              onClick={() => fetchInflowChartData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Muat Ulang Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InflowChartComponent;