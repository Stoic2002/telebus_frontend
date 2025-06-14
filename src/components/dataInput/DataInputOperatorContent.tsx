import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoWaterOutline, IoSpeedometerOutline } from 'react-icons/io5';
import DataInputSpillway from './dataInputSpillway';
import DataInputDdc from './dataInputDdc';

const DataInputOperatorContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <Tabs defaultValue="elevation" className="w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-100 to-purple-100 p-2 gap-2">
              <TabsTrigger 
                value="elevation"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-2 py-3"
              >
                <IoWaterOutline className="w-5 h-5" />
                <span className="font-medium">Data Input DDC</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rtow"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 border border-purple-200 rounded-lg hover:bg-purple-50 flex items-center justify-center space-x-2 py-3"
              >
                <IoSpeedometerOutline className="w-5 h-5" />
                <span className="font-medium">Data Input Spillway</span>
              </TabsTrigger>
              {/* <TabsTrigger 
                value="test"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 border border-blue-200 rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-2 py-3"
              >
                CSV Reader
              </TabsTrigger> */}
            </TabsList>
          </div>
          <TabsContent value="elevation" className="mt-0">
            <DataInputDdc />
          </TabsContent>
          <TabsContent value="rtow" className="mt-0">
            <DataInputSpillway />
          </TabsContent>
          {/* <TabsContent value="test" className="mt-0">
            <CSVReader />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default DataInputOperatorContent;