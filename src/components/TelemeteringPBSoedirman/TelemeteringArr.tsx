import { useEffect, useState } from "react";
import { SensorValueResponse } from "@/types/sensorTypes";
import { fetchGarungArrPerDay, fetchGarungArrPerSec } from "@/services/ARR/garungArr";
import { Card, CardContent, CardHeader } from "../ui/card";
import { fetchSingomertoArrPerDay, fetchSingomertoArrPerSec } from "@/services/ARR/singomertoArr";
import { fetchTulisArrPerDay, fetchTulisArrPerSec } from "@/services/ARR/tulisArr";
import { fetchMricaArrPerDay, fetchMricaArrPerSec } from "@/services/ARR/mricaArr";

const RainfallComponent = () => {
  const [garungArrPerSecValue, setGarungArrPerSecValue] = useState<SensorValueResponse | null>(null);
  const [garungArrPerDayValue, setGarungArrPerDayValue] = useState<SensorValueResponse | null>(null);
  const [singomertoArrPerSecValue, setSingomertoArrPerSecValue] = useState<SensorValueResponse | null>(null);
  const [singomertoArrPerDayValue, setSingomertoArrPerDayValue] = useState<SensorValueResponse | null>(null);
  const [tulisArrPerSecValue, setTulisArrPerSecValue] = useState<SensorValueResponse | null>(null);
  const [tulisArrPerDayValue, setTulisArrPerDayValue] = useState<SensorValueResponse | null>(null);
  const [mricaArrPerSecValue, setMricaArrPerSecValue] = useState<SensorValueResponse | null>(null);
  const [mricaArrPerDayValue, setMricaArrPerDayValue] = useState<SensorValueResponse | null>(null);

  //garung per sec
  useEffect(() => {
    const getGarungArr = async () => {
      const data = await fetchGarungArrPerSec();
      setGarungArrPerSecValue(data);
    };

    getGarungArr();
    const intervalId = setInterval(getGarungArr, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //garung per day
  useEffect(() => {
    const getGarungArr = async () => {
      const data = await fetchGarungArrPerDay();
      setGarungArrPerDayValue(data);
    };

    getGarungArr();
    const intervalId = setInterval(getGarungArr, 23 * 3600);

    return () => clearInterval(intervalId);
  }, []);
  //singomerto per sec
  useEffect(() => {
    const getSingomertoArr = async () => {
      const data = await fetchSingomertoArrPerSec();
      setSingomertoArrPerSecValue(data);
    };

    getSingomertoArr();
    const intervalId = setInterval(getSingomertoArr, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //singomerto per day
  useEffect(() => {
    const getSingomertoArr = async () => {
      const data = await fetchSingomertoArrPerDay();
      setSingomertoArrPerDayValue(data);
    };

    getSingomertoArr();
    const intervalId = setInterval(getSingomertoArr, 23 * 3600);

    return () => clearInterval(intervalId);
  }, []);

//tulis per sec
  useEffect(() => {
    const getTulisArr = async () => {
      const data = await fetchTulisArrPerSec();
      setTulisArrPerSecValue(data);
    };

    getTulisArr();
    const intervalId = setInterval(getTulisArr, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //tulis per day
  useEffect(() => {
    const getTulisArr = async () => {
      const data = await fetchTulisArrPerDay();
      setTulisArrPerDayValue(data);
    };

    getTulisArr();
    const intervalId = setInterval(getTulisArr, 23 * 3600);

    return () => clearInterval(intervalId);
  }, []);

  //mrica per sec
  useEffect(() => {
    const getMricaArr = async () => {
      const data = await fetchMricaArrPerSec();
      setMricaArrPerSecValue(data);
    };

    getMricaArr();
    const intervalId = setInterval(getMricaArr, 1000);

    return () => clearInterval(intervalId);
  }, []);

  //mrica per day
  useEffect(() => {
    const getMricaArr = async () => {
      const data = await fetchMricaArrPerDay();
      setMricaArrPerDayValue(data);
    };

    getMricaArr();
    const intervalId = setInterval(getMricaArr, 23 * 3600);

    return () => clearInterval(intervalId);
  }, []);

  const rainfallData = [
    {
      name: 'Garung',
      arr: [
        { id: 'per sec', rainfall: garungArrPerSecValue !== null ? garungArrPerSecValue.data.value.value.toFixed(2) : 'N/A' },
        { id: 'per day', rainfall: garungArrPerDayValue !== null ? garungArrPerDayValue.data.value.value.toFixed(2) : 'N/A' },
      ],
    },
    {
      name: 'Singomerto',
      arr: [
        { id: 'per sec', rainfall: singomertoArrPerSecValue !== null ? singomertoArrPerSecValue.data.value.value.toFixed(2) : 'N/A' },
        { id: 'per day', rainfall: singomertoArrPerDayValue !== null ? singomertoArrPerDayValue.data.value.value.toFixed(2) : 'N/A' },
      ],
    },
    {
      name: 'Tulis',
      arr: [
        { id: 'per sec', rainfall: tulisArrPerSecValue !== null ? tulisArrPerSecValue.data.value.value.toFixed(2) : 'N/A' },
        { id: 'per day', rainfall: tulisArrPerDayValue !== null ? tulisArrPerDayValue.data.value.value.toFixed(2) : 'N/A' }
      ],
    },
    {
      name: 'GI Mrica',
      arr: [
        { id: 'per sec', rainfall: mricaArrPerSecValue !== null ? mricaArrPerSecValue.data.value.value.toFixed(2) : 'N/A' },
        { id: 'per day', rainfall: mricaArrPerDayValue !== null ? mricaArrPerDayValue.data.value.value.toFixed(2) : 'N/A' }
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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