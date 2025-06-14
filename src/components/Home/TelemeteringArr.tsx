import { Card, CardContent, CardHeader } from "../ui/card";
import { useArrNodeData } from "@/hooks/useArrNodeData";
import { 
  IoRainyOutline, 
  IoWaterOutline, 
  IoCloudyOutline, 
  IoThunderstormOutline 
} from 'react-icons/io5';

const RainfallComponent = () => {


  const { 
    garungArr,
    singomertoArr,
    tulisArr,
    mricaArr,
  } = useArrNodeData({ interval: 10000 });


  const rainfallData = [
    {
      name: 'Garung',
      icon: IoRainyOutline,
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      arr: [
        { id: 'per sec', rainfall: garungArr.realTime?.toFixed(2) ?? 0},
        { id: 'per day', rainfall: garungArr.day?.toFixed(2) ?? 0},
      ],
    },
    {
      name: 'Singomerto',
      icon: IoWaterOutline,
      gradient: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      arr: [
        { id: 'per sec', rainfall: singomertoArr.realTime?.toFixed(2) ?? 0 },
        { id: 'per day', rainfall: singomertoArr.perDay?.toFixed(2) ?? 0 },
      ],
    },
    {
      name: 'Tulis',
      icon: IoCloudyOutline,
      gradient: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      arr: [
        { id: 'per sec', rainfall: tulisArr.realTime?.toFixed(2) ?? 0 },
        { id: 'per day', rainfall: tulisArr.perDay?.toFixed(2) ?? 0 }
      ],
    },
    {
      name: 'GI Mrica',
      icon: IoThunderstormOutline,
      gradient: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      arr: [
        { id: 'per sec', rainfall: mricaArr.realTime?.toFixed(2) ?? 0},
        { id: 'per day', rainfall: mricaArr.realTime?.toFixed(2) ?? 0 }
      ],
    },
  ];

  return (
    <div className="space-y-6">

      {/* Rainfall Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rainfallData.map((location, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${location.gradient} text-white p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <location.icon className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{location.name}</h3>
                    <p className="text-xs opacity-80">Weather Station</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent className={`${location.bgColor} p-4`}>
              <div className="space-y-4">
                {location.arr.map(arr => (
                  <div key={arr.id} className="flex justify-between items-center py-3 border-b border-white/50 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                      <span className="text-sm font-medium text-gray-700">ARR {arr.id}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${location.textColor}`}>{arr.rainfall}</span>
                      <span className="text-xs text-gray-500 ml-1">mm</span>
                    </div>
                  </div>
                ))}
                
                {/* Performance Indicator */}
                <div className="mt-4 pt-3 border-t border-white/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default RainfallComponent;