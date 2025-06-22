import React, { useEffect } from 'react';
import { IoTrendingUpOutline, IoRefreshOutline, IoStatsChartOutline, IoWaterOutline, IoFlashOutline, IoAnalyticsOutline } from 'react-icons/io5';
import { Loading } from '@/components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataStore } from '@/store';
import { TrendsChart } from '@/components/features/trends/components';
import { ErrorAlert } from '@/components/common/feedback/ErrorAlert';
import { MetricCard } from '@/components/common/cards';

const TrendsContent = () => {
  // Zustand store for centralized trends data management
  const { 
    trendsData,
    loading,
    error,
    activeTab,
    fetchTrendsData,
    setActiveTrendsTab,
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
  }, [error, clearError]);

  // Initial data fetching and interval setup
  useEffect(() => {
    // Initial fetch
    fetchTrendsData();

    // Set up interval to refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchTrendsData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchTrendsData]);

  // Loading state
  if (loading.trends) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loading size="lg" />
              <p className="text-gray-600 font-medium">Loading trends data...</p>
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
          <ErrorAlert
            error={error}
            onDismiss={clearError}
            variant="error"
          />
        )}

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <h1 className="text-3xl font-bold text-gray-800">Trends Analysis</h1>
            </div>
          </div>
        </div>

        {/* Trends Chart Section */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <Tabs 
              value={activeTab.trends} 
              onValueChange={(value) => setActiveTrendsTab(value as 'trends1' | 'trends2' | 'trends3')}
              className="space-y-6"
            >
              <TabsList className="bg-gray-100 p-1 rounded-xl w-full justify-start">
                <TabsTrigger 
                  value="trends1" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoTrendingUpOutline className="w-5 h-5 mr-2" />
                  Overview Trends
                </TabsTrigger>
                <TabsTrigger 
                  value="trends2" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoStatsChartOutline className="w-5 h-5 mr-2" />
                  ARR Stations
                </TabsTrigger>
                <TabsTrigger 
                  value="trends3" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoWaterOutline className="w-5 h-5 mr-2" />
                  Inflow Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trends1">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <CardTitle className="text-xl font-semibold">Overview Trends Chart</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <TrendsChart data={trendsData} activeTab="trends1" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends2">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <CardTitle className="text-xl font-semibold">ARR Stations Analysis</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <TrendsChart data={trendsData} activeTab="trends2" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends3">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <CardTitle className="text-xl font-semibold">Inflow Analysis Chart</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <TrendsChart data={trendsData} activeTab="trends3" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendsContent;