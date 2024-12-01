import { useEffect, useState } from "react";
import { SensorValueResponse } from "@/types/sensorTypes";
import { fetchGarungArrPerDay, fetchGarungArrPerSec } from "@/services/ARR/garungArr";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { fetchSingomertoArrPerDay, fetchSingomertoArrPerSec } from "@/services/ARR/singomertoArr";
import { fetchTulisArrPerDay, fetchTulisArrPerSec } from "@/services/ARR/tulisArr";
import { fetchMricaArrPerDay, fetchMricaArrPerSec } from "@/services/ARR/mricaArr";
import { fetchSoedirmanLevelSedimen } from "@/services/levelSedimen/soedirmanLevelSedimen";
import { fetchSoedirmanWaterDepth, fetchSoedirmanWaterDepthCalculation } from "@/services/waterDepth/soedirmanWaterDepth";
import { fetchSoedirmanInflowPerSec } from "@/services/inflow/soedirmanInflow";
import { fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue, fetchSoedirmanLoadValue } from "@/services/loadUnit/soedirmanLoadUnit";
import { fetchSoedirmanWaterLevel } from "@/services/waterLevel/soedirmanWaterLevel";
import { fetchSoedirmanOutflowDdcValue, fetchSoedirmanOutflowFourthSpillwayValue, fetchSoedirmanOutflowSecondSpillwayValue, fetchSoedirmanOutflowSecondValue, fetchSoedirmanOutflowSpillwayValue, fetchSoedirmanOutflowThirdSpillwayValue, fetchSoedirmanOutflowThirdValue, fetchSoedirmanOutflowValue } from "@/services/outflow/soedirmanOutflow";
import { AWLRService } from "@/services/AWLR/awlr";
import { AWLRData, AWLRPerHourData } from "@/types/awlrTypes";
import { formatDate } from "@/lib/dateFormatter";
import { cn } from "@/lib/utils";
import { useSensorData } from "@/hooks/useSensorData";
import { calculateTotalValue, formatValue } from "@/lib/sensorValueHelper";
import usePbsNodeData from "@/hooks/usePbsNodeData";
import useNodeBatch1 from "@/hooks/useNodeBatch1";

const MonitoringPbsComponent = () => {
    const [serayuValue, setSerayuValue] = useState<AWLRData | null>(null);
    const [merawuValue, setMerawuValue] = useState<AWLRData | null>(null);
    const [lumajangValue, setLumajangValue] = useState<AWLRData | null>(null);
    const [serayuPerHourValue, setSerayuPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [merayuPerHourValue, setMerawuPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [lumajangPerHourValue, setLumajangPerHourValue] = useState<AWLRPerHourData | null>(null);

    // const { data : pbsLevelSedimen} = useSensorData( {fetchFunction: fetchSoedirmanLevelSedimen});
    // const { data: pbsLoad1 } = useSensorData({ fetchFunction: fetchSoedirmanLoadValue});
    // const { data: pbsLoad2 } = useSensorData({ fetchFunction: fetchSoedirmanLoadSecondValue });
    // const { data: pbsLoad3 } = useSensorData({ fetchFunction: fetchSoedirmanLoadThirdValue });
    // const { data: pbsWaterLevel } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });
    // // const { data: pbsInflow } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });
    // const { data: pbsWaterDepth } = useSensorData({ fetchFunction: fetchSoedirmanWaterDepth });
    // // const { data: pbsWaterDepthCalc } = useSensorData({ fetchFunction: fetchSoedirmanWaterDepthCalculation});
    // const { data: pbsOutflow1 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowValue});
    // const { data: pbsOutflow2 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowSecondValue});
    // const { data: pbsOutflow3 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowThirdValue});
    // const { data: pbsOutflowDdc } = useSensorData({ fetchFunction: fetchSoedirmanOutflowDdcValue});
    // const { data: pbsOutflowSpillway1 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowSpillwayValue});
    // const { data: pbsOutflowSpillway2 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowSecondSpillwayValue});
    // const { data: pbsOutflowSpillway3 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowThirdSpillwayValue});
    // const { data: pbsOutflowSpillway4 } = useSensorData({ fetchFunction: fetchSoedirmanOutflowFourthSpillwayValue});

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
        return 'bg-green-300 text-white-800';
      case 'WASPADA':
        return 'bg-amber-300 text-white-800';
      case 'AWAS':
        return 'bg-red-400 text-white-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const StatusCell: React.FC<{ status: string }> = ({ status }) => (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      getStatusColor(status)
    )}>
      {status}
    </span>
  );
   
  
    const pbsData = [
        {
          name: "Unit Load",
          item: [
            { id: 'PBS 1', value: soedirman.activeLoads.pb01?.toFixed(2) ?? 0},
            { id: "PBS 2", value:  soedirman.activeLoads.pb02?.toFixed(2) ?? 0},
            { id: 'PBS 3', value:  soedirman.activeLoads.pb03?.toFixed(2) ?? 0}
          ],
          total : soedirman.activeLoads.total.toFixed(2) ?? 0
        },
        {
          name: "Unit Outflow",
          item: [
            { id: 'PBS 1', value: soedirman2.flows.turbine.pb01?.toFixed(2) ?? 0},
            { id: 'PBS 2', value: soedirman2.flows.turbine.pb02?.toFixed(2) ?? 0},
            { id: 'PBS 3', value: soedirman2.flows.turbine.pb03?.toFixed(2) ?? 0}
          ],
          total :  soedirman.flows.turbine.total.toFixed(2) ?? 0
        },
        {
          name: "Inflow",
          item: [
            { id: 'Serayu', value: serayuValue !== null ? serayuValue.debit : 0},
            { id: 'Lumajang', value: merawuValue !== null ? merawuValue.debit : 0 },
            { id: 'Merawu', value: lumajangValue !== null ? lumajangValue.debit : 0 }
          ],
          total :  serayuValue && merawuValue && lumajangValue !== null ? (serayuValue.debit + merawuValue.debit + lumajangValue.debit).toFixed(2) : 'N/A'
        },
        {
          name: "DAM",
          item: [
            { id: 'TMA', value: soedirman.levels.elevation?.toFixed(2)?? 0 },
            { id: 'Sedimen lvl', value:soedirman.levels.sediment?.toFixed(2) ?? 0},
            { id: 'Water Depth', value: soedirman.levels.waterDepth?.toFixed(2) ?? 0}
          ]
        },
        {
          name: "Outflow",
          item: [
            { id: 'irigasi', value: 0 },
            { id: 'ddc', value: soedirman2.flows.ddc?.toFixed(2) ?? 0},
            { id: 'spillway', value:soedirman2.flows.spillway.total.toFixed(2) ?? 0}
          ],
          total : ((soedirman2.flows.ddc ?? 0) + (soedirman2.flows.spillway.total)).toFixed(2) ?? 0
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
    <div>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
  {pbsData.map((item, index) => (
    <Card key={index} className="w-full">
      <CardHeader className="bg-blue-900 py-2">
        <div className="flex justify-between items-center">
          <p className="font-bold text-white">{item.name}</p>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <table className="w-full">
          <tbody>
            {item.item.map((subItem) => (
              <tr key={subItem.id} className="border-b last:border-b-0">
                <th className="py-2 font-bold text-gray-700 text-left">{subItem.id}</th>
                <td className="py-2 text-right font-medium text-gray-600">
                  {subItem.value !== "N/A"
                    ? `${subItem.value} ${
                        item.name === "Unit Load"
                          ? "MW"
                          : item.name === "Inflow" || item.name === "Unit Outflow" || item.name === "Outflow"
                          ? "m³/s"
                          : item.name === "DAM"
                          ? "m"
                          : "" // Default tanpa satuan
                      }`
                    : subItem.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Kondisi untuk menampilkan total */}
        {item.name !== "DAM" && (
        <div className="mt-4 border-t pt-2 text-right font-bold text-gray-800">
            <table className="w-full">
            <tbody>
                <tr>
                <th className="text-left py-2">Total</th>
                <td className="text-right py-2">
                    {item.total !== "N/A"
                    ? `${item.total} ${
                        item.name === "Unit Load"
                            ? "MW"
                            : item.name === "Inflow" || item.name === "Unit Outflow" || item.name === "Outflow"
                            ? "m³/s"
                            : "" // Default tanpa satuan
                        }`
                    : item.total}
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        )}

      </CardContent>
    </Card>
  ))}
</div>



  <Card>
        <CardHeader>
          <CardTitle>Inflow Air Sungai AWLR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Level (m)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit (m3/s)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit 1 jam (m3/h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery (v)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data diterima</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {riverFlowData.map((reading, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reading.sensor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.waterLevel} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.inflowPerSec} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.inflowPerHour} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white"><StatusCell status={reading.status} /> </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.battery} </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reading.receiveData} </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700" colSpan={1}>Total</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{serayuValue && merawuValue && lumajangValue !== null ? (serayuValue.water_level + merawuValue.water_level + lumajangValue.water_level).toFixed(2) : "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{serayuValue && merawuValue && lumajangValue  !== null ? (serayuValue.debit + merawuValue.debit + lumajangValue.debit).toFixed(2) : "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{serayuValue && merawuValue && lumajangValue  !== null ? (serayuValue.water_level + merawuValue.water_level + lumajangValue.water_level).toFixed(2) : "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white"><StatusCell status="NORMAL" /></td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700" colSpan={3}></td> {/* Kosongkan untuk kolom Status, Battery, dan Data diterima */}
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