import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataInputElevationCsv from './DataInputElevationCsv';
import DataInputRtowCsv from './DataInputRtowCsv';
import CSVReader from './DataInputReader';

const DataInputGhwContent = () => {
  return (
    <div className="w-full p-4 space-y-6">
      <Tabs defaultValue="elevation" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger 
            value="elevation"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200  border border-black"
          >
            Data Input Volume Efektif CSV
          </TabsTrigger>
          <TabsTrigger 
            value="rtow"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 border border-black"
          >
            Data Input RTOW CSV
          </TabsTrigger>
          {/* <TabsTrigger 
            value="test"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors duration-200 border border-black"
          >
            CSV Reader
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="elevation">
          <DataInputElevationCsv />
        </TabsContent>
        <TabsContent value="rtow">
          <DataInputRtowCsv />
        </TabsContent>
        {/* <TabsContent value="test">
          <CSVReader />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default DataInputGhwContent;