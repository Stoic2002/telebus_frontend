import React, { useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import usePbsNodeData from '@/hooks/usePbsNodeData';
import { useDataStore } from '@/store';
import { IoWarningOutline } from 'react-icons/io5';
import { 
  MetricsSection,
  MonitoringSection,
  WeatherSection,
  RainfallSection,
  ChartsSection
} from '@/components/features/home/components';

const HomeContent: React.FC = () => {
  // Zustand store for centralized data management
  const { 
    tmaData,
    targetElevasi,
    rohData,
    loading,
    error,
    fetchTmaData,
    fetchTargetElevasi,
    fetchRohData,
    clearError
  } = useDataStore();

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initial data fetching and interval setup
  useEffect(() => {
    const initializeData = async () => {
      const dateNow = new Date(Date.now());
      const formattedDate = dateNow.toISOString().split('T')[0];
      
      // Fetch all data in parallel
      await Promise.all([
        fetchRohData(formattedDate),
        fetchTmaData(),
        fetchTargetElevasi()
      ]);
    };

    // Initial fetch
    initializeData();

    // Set interval for fetching data every 1 hour (3600000 ms)
    const intervalId = setInterval(() => {
      fetchTmaData();
      fetchTargetElevasi();
    }, 3600000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const { soedirman } = usePbsNodeData({ interval: 30000 });

  // Loading state
  if (loading.tma || loading.targetElevasi || loading.roh) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loading size="lg" />
              <p className="text-gray-600 font-medium">Loading dashboard data...</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className={loading.tma ? "text-blue-600" : "text-green-600"}>
                  {loading.tma ? "Loading TMA data..." : "✓ TMA data loaded"}
                </span>
                <span className={loading.targetElevasi ? "text-blue-600" : "text-green-600"}>
                  {loading.targetElevasi ? "Loading target elevation..." : "✓ Target elevation loaded"}
                </span>
                <span className={loading.roh ? "text-blue-600" : "text-green-600"}>
                  {loading.roh ? "Loading ROH data..." : "✓ ROH data loaded"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="p-6 space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <IoWarningOutline className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Data Loading Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <MetricsSection 
          tmaData={tmaData}
          targetElevasi={targetElevasi}
          rohData={rohData}
          soedirman={soedirman as any}
        />

        {/* Charts Section */}
        <div className="space-y-8">
          <ChartsSection />

          {/* Monitoring Section */}
          <div className="bg-white border-0 shadow-xl overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold">Telemetering PB Soedirman</h2>
              </div>
            </div>
            <div className="p-6 bg-white">
              <MonitoringSection />
            </div>
          </div>

          {/* Rainfall Section */}
          <RainfallSection />

          {/* Weather Section */}
          <WeatherSection />
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
