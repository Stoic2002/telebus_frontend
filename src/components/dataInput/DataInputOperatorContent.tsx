import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoWaterOutline, IoSpeedometerOutline, IoStatsChartOutline } from 'react-icons/io5';
import DataInputSpillway from './dataInputSpillway';
import DataInputDdc from './dataInputDdc';

const DataInputOperatorContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Main Content Tabs */}
        <Tabs defaultValue="ddc" className="w-full">
          <div className="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <IoStatsChartOutline className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Operational Data Input</h2>
                  <p className="text-blue-100">Control and monitoring system</p>
                </div>
              </div>
              
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md p-1 gap-2 rounded-xl h-14">
                <TabsTrigger 
                  value="ddc"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg transition-all duration-300 border-0 rounded-lg hover:bg-white/20 flex items-center justify-center space-x-2 py-4 font-semibold text-white"
                >
                  <IoWaterOutline className="w-5 h-5" />
                  <span>DDC Control</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="spillway"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg transition-all duration-300 border-0 rounded-lg hover:bg-white/20 flex items-center justify-center space-x-2 py-4 font-semibold text-white"
                >
                  <IoSpeedometerOutline className="w-5 h-5" />
                  <span>Spillway Control</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-blue-50">
              <TabsContent value="ddc" className="mt-0 p-0">
                <DataInputDdc />
              </TabsContent>
              <TabsContent value="spillway" className="mt-0 p-0">
                <DataInputSpillway />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DataInputOperatorContent;