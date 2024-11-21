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

const MonitoringPbsComponent = () => {
    const [pbsLoadValue, setPbsLoadValue] = useState<SensorValueResponse | null>(null);
    const [pbsLoadSecondValue, setPbsLoadSecondValue] = useState<SensorValueResponse | null>(null);
    const [pbsLoadThirdValue, setPbsLoadThirdValue] = useState<SensorValueResponse | null>(null);
    const [pbsWaterLevelValue, setPbsWaterLevelValue] = useState<SensorValueResponse | null>(null);
    const [pbsInflowValue, setPbsInflowValue] = useState<SensorValueResponse | null>(null);
    const [pbsWaterDepthValue, setPbsWaterDepthValue] = useState<SensorValueResponse | null>(null);
    const [pbsWaterDepthCalcValue, setPbsWaterDepthCalcValue] = useState<SensorValueResponse | null>(null);
    const [pbsLevelSedimenValue, setPbsLevelSedimenValue] = useState<SensorValueResponse | null>(null);
    const [pbsOutflowValue, setPbsOutflowValue] = useState<SensorValueResponse | null>(null);
    const [pbsOutflowSecondValue, setPbsOutflowSecondValue] = useState<SensorValueResponse | null>(null);
    const [pbsOutflowThirdValue, setPbsOutflowThirdValue] = useState<SensorValueResponse | null>(null);
    const [pbsOutflowDdcValue, setPbsOutflowDdcValue] = useState<SensorValueResponse | null>(null);
    const [pbsSpillwayValue, setPbsSpillwayValue] = useState<SensorValueResponse | null>(null);
    const [pbsSpillwaySecondValue, setPbsSpillwaySecondValue] = useState<SensorValueResponse | null>(null);
    const [pbsSpillwayThirdValue, setPbsSpillwayThirdValue] = useState<SensorValueResponse | null>(null);
    const [pbsSpillwayFourthValue, setPbsSpillwayFourthValue] = useState<SensorValueResponse | null>(null);
    const [serayuValue, setSerayuValue] = useState<AWLRData | null>(null);
    const [merawuValue, setMerawuValue] = useState<AWLRData | null>(null);
    const [lumajangValue, setLumajangValue] = useState<AWLRData | null>(null);
    const [serayuPerHourValue, setSerayuPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [merayuPerHourValue, setMerawuPerHourValue] = useState<AWLRPerHourData | null>(null);
    const [lumajangPerHourValue, setLumajangPerHourValue] = useState<AWLRPerHourData | null>(null);

    const awlrService = new AWLRService();

    //beban unit 1 pbs
    useEffect(() => {
      const getPbsLoad = async () => {
        try {
          const response = await fetchSoedirmanLoadValue();
          if (response?.data) {
            setPbsLoadValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
      getPbsLoad();
      
      const intervalId = setInterval(getPbsLoad, 10000);
  
      return () => clearInterval(intervalId);
    
    }, []);
  
     //beban unit 2 pbs
    useEffect(() => {
  
      const getPbsSecondLoad = async () => {
        try {
          const response = await fetchSoedirmanLoadSecondValue();
          if (response?.data) {
            setPbsLoadSecondValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsSecondLoad();
  
      const intervalId = setInterval(getPbsSecondLoad, 10000);
   
      return () => clearInterval(intervalId);
    }, []);
  
    //beban unit 3 pbs
    useEffect(() => {
    
      const getPbsThirdLoad = async () => {
        try {
          const response = await fetchSoedirmanLoadThirdValue();
          if (response?.data) {
            setPbsLoadThirdValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
  
      getPbsThirdLoad();
   
      const intervalId = setInterval(getPbsThirdLoad, 10000);
  
      return () => clearInterval(intervalId);
    }, []);  
  
    // water level pbs
    useEffect(() => {
    
      const getPbsWaterLevel = async () => {
        try {
          const response = await fetchSoedirmanWaterLevel();
          if (response?.data) {
            setPbsWaterLevelValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsWaterLevel();
   
      const intervalId = setInterval(getPbsWaterLevel, 10000);
  
      return () => clearInterval(intervalId);
    }, []);  
  
    //inflow pbs
    useEffect(() => {
    
      const getPbsInflow = async () => {
        try {
          const response = await fetchSoedirmanInflowPerSec();
          if (response?.data) {
            setPbsInflowValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsInflow();
      
      const intervalId = setInterval(getPbsInflow, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
  
    //water depth pbs
    useEffect(() => {
    
      const getPbsWaterDepth = async () => {
        try {
          const response = await fetchSoedirmanWaterDepth();
          if (response?.data) {
            setPbsWaterDepthValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsWaterDepth();
      
      const intervalId = setInterval(getPbsWaterDepth, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
  
    //water depth calculation pbs
    useEffect(() => {
    
      const getPbsWaterDepthCalc = async () => {
        try {
          const response = await fetchSoedirmanWaterDepthCalculation();
          if (response?.data) {
            setPbsWaterDepthCalcValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsWaterDepthCalc();
      
      const intervalId = setInterval(getPbsWaterDepthCalc, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
  
    //level sedimen  pbs
    useEffect(() => {
    
      const getPbsLevelSedimen = async () => {
        try {
          const response = await fetchSoedirmanLevelSedimen();
          if (response?.data) {
            setPbsLevelSedimenValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsLevelSedimen();
      
      const intervalId = setInterval(getPbsLevelSedimen, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow turbin 1 pbs
    useEffect(() => {
    
      const getPbsOutflow = async () => {
        try {
          const response = await fetchSoedirmanOutflowValue();
          if (response?.data) {
            setPbsOutflowValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsOutflow();
      
      const intervalId = setInterval(getPbsOutflow, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  

    //outflow turbin 2 pbs
    useEffect(() => {
    
      const getPbsSecondOutflow = async () => {
        try {
          const response = await fetchSoedirmanOutflowSecondValue();
          if (response?.data) {
            setPbsOutflowSecondValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsSecondOutflow();
      
      const intervalId = setInterval(getPbsSecondOutflow, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow turbin 3 pbs
    useEffect(() => {
    
      const getPbsThirdOutflow = async () => {
        try {
          const response = await fetchSoedirmanOutflowThirdValue();
          if (response?.data) {
            setPbsOutflowThirdValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsThirdOutflow();
      
      const intervalId = setInterval(getPbsThirdOutflow, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow ddc pbs
    useEffect(() => {
    
      const getPbsOutflowDdc = async () => {
        try {
          const response = await fetchSoedirmanOutflowDdcValue();
          if (response?.data) {
            setPbsOutflowDdcValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsOutflowDdc();
      
      const intervalId = setInterval(getPbsOutflowDdc, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow spillway 1 pbs
    useEffect(() => {
    
      const getPbsSpillway = async () => {
        try {
          const response = await fetchSoedirmanOutflowSpillwayValue();
          if (response?.data) {
            setPbsSpillwayValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsSpillway();
      
      const intervalId = setInterval(getPbsSpillway, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow spillway 2 pbs
    useEffect(() => {
    
      const getPbsSecondSpillway = async () => {
        try {
          const response = await fetchSoedirmanOutflowSecondSpillwayValue();
          if (response?.data) {
            setPbsSpillwaySecondValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsSecondSpillway();
      
      const intervalId = setInterval(getPbsSecondSpillway, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow spillway 3 pbs
    useEffect(() => {
    
      const getPbsThirdSpillway = async () => {
        try {
          const response = await fetchSoedirmanOutflowThirdSpillwayValue();
          if (response?.data) {
            setPbsSpillwayThirdValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsThirdSpillway();
      
      const intervalId = setInterval(getPbsThirdSpillway, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
    //outflow spillway 4 pbs
    useEffect(() => {
    
      const getPbsFourtSpillway = async () => {
        try {
          const response = await fetchSoedirmanOutflowFourthSpillwayValue();
          if (response?.data) {
            setPbsSpillwayFourthValue(response);
          }
        } catch (error) {
          console.error('Error in getData:', error);
        }
      };
  
      getPbsFourtSpillway();
      
      const intervalId = setInterval(getPbsFourtSpillway, 10000); 
  
      return () => clearInterval(intervalId);
    }, []);  
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


    var ddcValue = pbsOutflowDdcValue !== null ? pbsOutflowDdcValue.data.value.value : 0
    var ddcValue2 = pbsOutflowDdcValue !== null ? pbsOutflowDdcValue.data.value.value.toFixed(2) : 0
    var spilwayValue = pbsSpillwayValue && 
    pbsSpillwaySecondValue && 
    pbsSpillwayThirdValue && 
    pbsSpillwayFourthValue !== null
? ((pbsSpillwayValue.data.value.value >= 6652 
    ? 0 
    : pbsSpillwayValue.data.value.value ) +
    (pbsSpillwaySecondValue.data.value.value >= 6652 
    ? 0 :
      pbsSpillwaySecondValue.data.value.value) +
      (pbsSpillwayThirdValue.data.value.value >= 6652 
    ? 0 :
      pbsSpillwayThirdValue.data.value.value) +
      (pbsSpillwayFourthValue.data.value.value >= 6652 
    ? 0 :
      pbsSpillwayFourthValue.data.value.value))
: 0
    
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
            { id: 'PBS 1', value: pbsLoadValue !== null ? pbsLoadValue.data.value.value.toFixed(2) : "N/A" },
            { id: "PBS 2", value: pbsLoadSecondValue !== null ? pbsLoadSecondValue.data.value.value.toFixed(2) : "N/A" },
            { id: 'PBS 3', value: pbsLoadThirdValue !== null ? pbsLoadThirdValue.data.value.value.toFixed(2) : "N/A" }
          ],
          total :  pbsLoadValue && pbsLoadSecondValue && pbsLoadThirdValue !== null ? (pbsLoadValue.data.value.value + pbsLoadSecondValue.data.value.value + pbsLoadThirdValue.data.value.value).toFixed(2) : 'N/A'
        },
        {
          name: "Unit Outflow",
          item: [
            { id: 'PBS 1', value: pbsOutflowValue !== null ? pbsOutflowValue.data.value.value.toFixed(2) : "N/A"  },
            { id: 'PBS 2', value: pbsOutflowSecondValue !== null ? pbsOutflowSecondValue.data.value.value.toFixed(2) : "N/A"  },
            { id: 'PBS 3', value: pbsOutflowThirdValue !== null ? pbsOutflowThirdValue.data.value.value.toFixed(2) : "N/A"  }
          ],
          total :  pbsOutflowValue && pbsOutflowSecondValue && pbsOutflowThirdValue !== null ? (pbsOutflowValue.data.value.value + pbsOutflowSecondValue.data.value.value + pbsOutflowThirdValue.data.value.value).toFixed(2) : 'N/A'
        },
        {
          name: "Inflow",
          item: [
            { id: 'Serayu', value: serayuValue !== null ? serayuValue.debit : "N/A"},
            { id: 'Lumajang', value: merawuValue !== null ? merawuValue.debit : "N/A" },
            { id: 'Merawu', value: lumajangValue !== null ? lumajangValue.debit : "N/A" }
          ],
          total :  serayuValue && merawuValue && lumajangValue !== null ? (serayuValue.debit + merawuValue.debit + lumajangValue.debit).toFixed(2) : 'N/A'
        },
        {
          name: "DAM",
          item: [
            { id: 'TMA', value: pbsWaterLevelValue !== null ? pbsWaterLevelValue.data.value.value.toFixed(2) : "N/A"  },
            { id: 'Sedimen lvl', value: pbsLevelSedimenValue !== null ? pbsLevelSedimenValue.data.value.value.toFixed(2) : "N/A"  },
            { id: 'Water Depth', value: pbsWaterDepthValue !== null ? pbsWaterDepthValue.data.value.value.toFixed(2) : "N/A"  }
          ]
        },
        {
          name: "Outflow",
          item: [
            { id: 'irigasi', value: 0 },
            { id: 'ddc', value: ddcValue2},
            { id: 'spillway', value:spilwayValue}
          ],
          total : (ddcValue + spilwayValue).toFixed(2) ?? 'N/A'
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