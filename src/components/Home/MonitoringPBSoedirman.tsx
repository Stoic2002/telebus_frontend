import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { AWLRData, AWLRPerHourData } from "@/types/awlrTypes";
import { formatDate } from "@/lib/dateFormatter";
import { cn } from "@/lib/utils";

import usePbsNodeData from "@/hooks/usePbsNodeData";
import useNodeBatch1 from "@/hooks/useNodeBatch1";
import { AWLRService } from "@/services/AWLR/awlr";
import { 
  IoFlashOutline, 
  IoWaterOutline, 
  IoArrowDownOutline, 
  IoLayersOutline, 
  IoArrowUpOutline 
} from 'react-icons/io5';

const MonitoringPbsComponent = () => {
    const [serayuValue, setSerayuValue] = useState<AWLRData | null>(null);
    const [merawuValue, setMerawuValue] = useState<AWLRData | null>(null);
    const [lumajangValue, setLumajangValue] = useState<AWLRData | null>(null);
    const [serayuPerHourValue, setSerayuPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [merayuPerHourValue, setMerawuPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [lumajangPerHourValue, setLumajangPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const { 
      soedirman
    } = usePbsNodeData({ interval: 10000 });

    const { 
      soedirman2
    } = useNodeBatch1({ interval: 10000 });
    

    const awlrService = new AWLRService();

    // serayu
    useEffect(() => {
    
      const getSerayu = async () => {
        try {
          const response = await awlrService.getAWLRById(1);
          if (response) {
            setSerayuValue(response)
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getSerayu();
      
      const intervalId = setInterval(getSerayu, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //merawu
    useEffect(() => {
    
      const getMerawu = async () => {
        try {
          const response = await awlrService.getAWLRById(2);
          if (response) {
            setMerawuValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getMerawu();
      
      const intervalId = setInterval(getMerawu, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //lumajang
    useEffect(() => {
    
      const getLumajang = async () => {
        try {
          const response = await awlrService.getAWLRById(3);
          if (response) {
            setLumajangValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getLumajang();
      
      const intervalId = setInterval(getLumajang, 10000); 
  
      return () => clearInterval(intervalId);
    }, []); 

    //serayu per hour
    useEffect(() => {
    
      const getMerawuPerHour = async () => {
        try {
          const response = await awlrService.getLatestAWLRById(1);
          if (response) {
            setSerayuPerHourValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getMerawuPerHour();
      
      const intervalId = setInterval(getMerawuPerHour, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  

    //lumajang perhour
    useEffect(() => {
    
      const getLumajangPerHour = async () => {
        try {
          const response = await awlrService.getLatestAWLRById(3);
          if (response) {
            setLumajangPerHourValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getLumajangPerHour();
      
      const intervalId = setInterval(getLumajangPerHour, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  


    // var spilwayValue = ((soedirman.flows. >= 6652 
    // ? 0 
    // : pbsOutflowSpillway1.data.value.value ) +
    // (pbsOutflowSpillway2.data.value.value >= 6652 
    // ? 0 :
    // pbsOutflowSpillway2.data.value.value) +
    //   (pbsOutflowSpillway3.data.value.value >= 6652 
    // ? 0 :
    // pbsOutflowSpillway3.data.value.value) +
    //   (pbsOutflowSpillway4.data.value.value >= 6652 
    // ? 0 :
    // pbsOutflowSpillway4.data.value.value))

    
// Fungsi untuk menentukan warna status
const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NORMAL':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'WASPADA':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'AWAS':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const StatusCell: React.FC<{ status: string }> = ({ status }) => (
    <span className={cn(
      'px-3 py-1 rounded-full text-xs font-semibold border',
      getStatusColor(status)
    )}>
      {status}
    </span>
  );
   
  
    const pbsData = [
        {
          name: "Unit Load",
          icon: IoFlashOutline,
          gradient: "from-purple-500 to-indigo-600",
          item: [
            { id: 'PBS 1', value: soedirman.activeLoads.pb01?.toFixed(2) ?? 0},
            { id: "PBS 2", value:  soedirman.activeLoads.pb02?.toFixed(2) ?? 0},
            { id: 'PBS 3', value:  soedirman.activeLoads.pb03?.toFixed(2) ?? 0}
          ],
          total : soedirman.activeLoads.total.toFixed(2) ?? 0,
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
          total :  soedirman.flows.turbine.total ?? 0,
          unit: "m³/s"
        },
        {
          name: "Inflow",
          icon: IoArrowDownOutline,
          gradient: "from-emerald-500 to-teal-600",
          item: [
            { id: 'Serayu', value: serayuValue !== null ? serayuValue.debit : 0},
            { id: 'Merawu', value: merawuValue !== null ? merawuValue.debit : 0 },
            { id: 'Lumajang', value: lumajangValue !== null ? lumajangValue.debit : 0 }
          ],
          total :  serayuValue && merawuValue && lumajangValue !== null ? (serayuValue.debit + merawuValue.debit + lumajangValue.debit).toFixed(2) : 'N/A',
          unit: "m³/s"
        },
        {
          name: "DAM",
          icon: IoLayersOutline,
          gradient: "from-slate-500 to-gray-600",
          item: [
            { id: 'TMA', value: soedirman.levels.elevation?.toFixed(2)?? 0 },
            { id: 'Sedimen lvl', value:soedirman.levels.sediment?.toFixed(2) ?? 0},
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
            { id: 'spillway', value:soedirman2.flows.spillway.total.toFixed(2) ?? 0}
          ],
          total : ((soedirman2.flows.ddc ?? 0) + (soedirman2.flows.spillway.total)).toFixed(2) ?? 0,
          unit: "m³/s"
        },
      ];

      var alertStatusSerayuValue = awlrService.getAlertStatus(serayuValue?.water_level ?? 0,serayuValue?.alert_waspada ?? 0, serayuValue?.alert_awas ?? 0);
      var alertStatusMerawuValue = awlrService.getAlertStatus(merawuValue?.water_level ?? 0,merawuValue?.alert_waspada ?? 0, merawuValue?.alert_awas ?? 0);
      var alertStatusLumajangValue = awlrService.getAlertStatus(lumajangValue?.water_level ?? 0,lumajangValue?.alert_waspada ?? 0, lumajangValue?.alert_awas ?? 0);


       const riverFlowData = [
        { sensor: 'Sungai Serayu',
            waterLevel: serayuValue !== null ? serayuValue.water_level : "N/A", 
            inflowPerSec: serayuValue !== null ? serayuValue.debit : "N/A", 
            inflowPerHour : serayuPerHourValue !== null ? serayuPerHourValue.debit : "N/A", 
            status: alertStatusSerayuValue !== null ? alertStatusSerayuValue: "N/A",
            battery: serayuValue !== null ? serayuValue.battery : "N/A", 
            receiveData: serayuValue !== null ? formatDate(serayuValue.kWaktu) : "N/A" },
        { sensor: 'Sungai Merawu', 
            waterLevel: merawuValue !== null ? merawuValue.water_level : "N/A", 
            inflowPerSec : merawuValue !== null ? merawuValue.debit : "N/A", 
            inflowPerHour : 0, 
            status: alertStatusMerawuValue ?? "N/A",  
            battery:merawuValue !== null ? merawuValue.battery : "N/A",
            receiveData: merawuValue !== null ? formatDate(merawuValue.kWaktu) : "N/A" },
        { sensor: 'Sungai Lumajang', 
            waterLevel: lumajangValue !== null ? lumajangValue.water_level : "N/A", 
            inflowPerSec: lumajangValue !== null ? lumajangValue.debit : "N/A", 
            inflowPerHour : lumajangPerHourValue !== null ? lumajangPerHourValue.debit : "N/A", 
            status: alertStatusLumajangValue ?? "N/A",
            battery:lumajangValue !== null ? lumajangValue.battery : "N/A", 
            receiveData: lumajangValue !== null ? formatDate(lumajangValue.kWaktu) : "N/A" },
      ];

  return (
    <div className="space-y-8">
      {/* PBS Data Cards */}
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
                
                {/* Total Section */}
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

      {/* River Flow Table */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <CardTitle className="text-xl font-semibold">Inflow Air Sungai AWLR</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Sensor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Water Level (m)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Debit (m³/s)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Debit 1 jam (m³/h)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Battery (v)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Data diterima</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riverFlowData.map((reading, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-900">{reading.sensor}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.waterLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.inflowPerSec}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reading.inflowPerHour}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusCell status={reading.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.battery}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.receiveData}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    <div className="flex items-center space-x-2">
                      <IoLayersOutline className="text-lg" />
                      <span>Total</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">
                    {serayuValue && merawuValue && lumajangValue !== null ? (serayuValue.water_level + merawuValue.water_level + lumajangValue.water_level).toFixed(2) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">
                    {serayuValue && merawuValue && lumajangValue  !== null ? (serayuValue.debit + merawuValue.debit + lumajangValue.debit).toFixed(2) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">
                    {serayuValue && merawuValue && lumajangValue  !== null ? (serayuValue.water_level + merawuValue.water_level + lumajangValue.water_level).toFixed(2) : "N/A"}
                  </td>
                  <td className="px-6 py-4"><StatusCell status="NORMAL" /></td>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={2}>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Aggregated Data</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPbsComponent;