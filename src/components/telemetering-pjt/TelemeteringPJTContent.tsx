import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loading } from '@/components/ui/loading';
import { IoWaterOutline, IoRainyOutline, IoRefreshOutline } from 'react-icons/io5';
import { useDataStore } from '@/store';
import { StationGrid } from '@/components/features/telemetering/components';
import { ErrorAlert } from '@/components/common/feedback/ErrorAlert';
import dynamic from 'next/dynamic';

const MapPJTContent = dynamic(() => import('@/components/telemetering-pjt/MapPJTContent'), {
  ssr: false, // Menonaktifkan server-side rendering untuk komponen ini
});

const TelemeteringPJTContent: React.FC = () => {
  // Zustand store for centralized telemetering data management
  const { 
    telemeterData,
    loading,
    error,
    activeTab,
    fetchTelemeterData,
    setActiveTelemeteringTab,
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
    fetchTelemeterData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(() => {
      fetchTelemeterData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchTelemeterData]);

  // Loading state
  if (loading.telemetering) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loading size="lg" />
              <p className="text-gray-600 font-medium">Loading telemetry data...</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="text-blue-600">
                  Loading water level and rainfall data...
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
          <ErrorAlert
            error={error}
            onDismiss={clearError}
            onRetry={fetchTelemeterData}
            showRetry={true}
            variant="error"
          />
        )}

        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
              <h1 className="text-3xl font-bold text-gray-800">Telemetering Perum Jasa Tirta</h1>
            </div>
          </div>
        </div>

        {/* Map Component */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <CardTitle className="text-xl font-semibold">Station Locations Map</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <MapPJTContent />
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <Tabs 
              value={activeTab.telemetering} 
              onValueChange={(value) => setActiveTelemeteringTab(value as 'waterlevel' | 'rainfall')}
              className="space-y-6"
            >
              <TabsList className="bg-gray-100 p-1 rounded-xl w-full justify-start">
                <TabsTrigger 
                  value="waterlevel" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoWaterOutline className="w-5 h-5 mr-2" />
                  Water Level
                  {telemeterData.Waterlevel && (
                    <span className="ml-2 px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold">
                      {telemeterData.Waterlevel.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="rainfall" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg px-6 py-3 font-medium transition-all duration-300"
                >
                  <IoRainyOutline className="w-5 h-5 mr-2" />
                  Rainfall
                  {telemeterData.Rainfall && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {telemeterData.Rainfall.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="waterlevel">
                <StationGrid
                  stations={telemeterData.Waterlevel || null}
                  type="waterlevel"
                  isLoading={loading.telemetering}
                />
              </TabsContent>

              <TabsContent value="rainfall">
                <StationGrid
                  stations={telemeterData.Rainfall || null}
                  type="rainfall"
                  isLoading={loading.telemetering}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelemeteringPJTContent;