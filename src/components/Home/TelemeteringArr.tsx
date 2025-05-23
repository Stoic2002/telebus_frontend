import { Card, CardContent, CardHeader } from "../ui/card";
import { useArrNodeData } from "@/hooks/useArrNodeData";

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
      arr: [
        { id: 'per sec', rainfall: garungArr.realTime?.toFixed(2) ?? 0},
        { id: 'per day', rainfall: garungArr.day?.toFixed(2) ?? 0},
      ],
    },
    {
      name: 'Singomerto',
      arr: [
        { id: 'per sec', rainfall: singomertoArr.realTime?.toFixed(2) ?? 0 },
        { id: 'per day', rainfall: singomertoArr.perDay?.toFixed(2) ?? 0 },
      ],
    },
    {
      name: 'Tulis',
      arr: [
        { id: 'per sec', rainfall: tulisArr.realTime?.toFixed(2) ?? 0 },
        { id: 'per day', rainfall: tulisArr.perDay?.toFixed(2) ?? 0 }
      ],
    },
    {
      name: 'GI Mrica',
      arr: [
        { id: 'per sec', rainfall: mricaArr.realTime?.toFixed(2) ?? 0},
        { id: 'per day', rainfall: mricaArr.realTime?.toFixed(2) ?? 0 }
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
    {rainfallData.map((location, index) => (
      <Card key={index} className="w-full">
        <CardHeader className="bg-blue-900 py-2">
          <div className="flex justify-between items-center">
            <p className="font-bold text-white">{location.name}</p>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <table className="w-full">
            <tbody>
              {location.arr.map(arr => (
                <tr key={arr.id} className="border-b last:border-b-0">
                  <th className="py-2 font-bold text-gray-700 text-left">ARR {arr.id}</th>
                  <td className="py-2 text-right font-medium text-gray-600">{arr.rainfall} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    ))}
  </div>
  );
};

export default RainfallComponent;