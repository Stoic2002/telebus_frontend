import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng } from 'leaflet';
import { Icon } from "leaflet";
import MarkerIcon2X from "leaflet/dist/images/marker-icon-2x.png";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import MarkerShadow from "leaflet/dist/images/marker-shadow.png";
import { SensorValueResponse } from '@/types/sensorTypes';
import { fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue, fetchSoedirmanLoadValue } from '@/services/loadUnit/soedirmanLoadUnit';
import { fetchSoedirmanWaterLevel } from '@/services/waterLevel/soedirmanWaterLevel';
import { fetchGunungWugulLoadSecondValue, fetchGunungWugulLoadValue } from '@/services/loadUnit/gunungWugulLoadUnit';
import { fetchGunungWugulWaterLevel } from '@/services/waterLevel/gunungWugulWaterLevel';
import { fetchTapenLoadValue } from '@/services/loadUnit/tapenLoadUnit';
import { fetchTapenWaterLevel } from '@/services/waterLevel/tapenWaterLevel';
import { fetchKedungomboLoadValue } from '@/services/loadUnit/kedungomboLoadUnit';
import { fetchKedungomboWaterLevel } from '@/services/waterLevel/kedungomboWaterLevel';
import { fetchKlambuLoadValue } from '@/services/loadUnit/klambuLoadUnit';
import { fetchKlambuWaterLevelAo } from '@/services/waterLevel/klambuWaterLevel';
import { fetchSidorejoLoadValue } from '@/services/loadUnit/sidorejoLoadUnit';
import { fetchSoedirmanInflowPerSec } from '@/services/inflow/soedirmanInflow';
import { fetchSidorejoWaterLevel } from '@/services/waterLevel/sidorejoWaterLevel';
import { fetchKetengerLoadFourthValue, fetchKetengerLoadSecondValue, fetchKetengerLoadThirdValue, fetchKetengerLoadValue } from '@/services/loadUnit/ketengerLoadUnit';
import { fetchKetengerWaterLevel } from '@/services/waterLevel/ketengerWaterLevel';

const MapContent = () => {
  const [mapReady, setMapReady] = useState(false);
  const [pbsLoadValue, setPbsLoadValue] = useState<SensorValueResponse | null>(null);
  const [pbsLoadSecondValue, setPbsLoadSecondValue] = useState<SensorValueResponse | null>(null);
  const [pbsLoadThirdValue, setPbsLoadThirdValue] = useState<SensorValueResponse | null>(null);
  const [pbsWaterLevelValue, setPbsWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [gunungWugulLoadValue, setGunungWugulLoadValue] = useState<SensorValueResponse | null>(null);
  const [gunungWugulLoadSecondValue, setGunungWugulLoadSecondValue] = useState<SensorValueResponse | null>(null);
  const [gunungWugulWaterLevelValue, setGunungWugulWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [tapenLoadValue, setTapenLoadValue] = useState<SensorValueResponse | null>(null);
  const [tapenWaterLevelValue, setTapenWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [kedungomboLoadValue, setKedungomboLoadValue] = useState<SensorValueResponse | null>(null);
  const [kedungomboWaterLevelValue, setKedungomboWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [klambuLoadValue, setKlambuLoadValue] = useState<SensorValueResponse | null>(null);
  const [klambuWaterLevelValue, setKlambuWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [sidorejoLoadValue, setSidorejoLoadValue] = useState<SensorValueResponse | null>(null);
  const [sidorejoWaterLevelValue, setSidorejoWaterLevelValue] = useState<SensorValueResponse | null>(null);
  const [ketengerLoadValue, setKetengerLoadValue] = useState<SensorValueResponse | null>(null);
  const [ketengerLoadSecondValue, setKetengerLoadSecondValue] = useState<SensorValueResponse | null>(null);
  const [ketengerLoadThirdValue, setKetengerLoadThirdValue] = useState<SensorValueResponse | null>(null);
  const [ketengerLoadFourthValue, setKetengerLoadFourthValue] = useState<SensorValueResponse | null>(null);
  const [ketengerWaterLevelValue, setKetengerWaterLevelValue] = useState<SensorValueResponse | null>(null);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const position = new LatLng(-7.5400, 110.4460);
  const locations = [
    { position: new LatLng(-7.386563238230246, 109.60085899477103), name: 'PLTA Tapen',waterLevel: tapenWaterLevelValue !== null ? tapenWaterLevelValue.data.value.value.toFixed(2) : "N/A",loadUnit : tapenLoadValue !== null ? (tapenLoadValue.data.value.value).toFixed(2) : 'N/A'},
    { position: new LatLng(-7.403447747900593, 109.56813461938899), name: 'PLTA Siteki',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.39494911212742, 109.60532545434796), name: 'PLTA Soedirman',waterLevel: pbsWaterLevelValue !== null ? pbsWaterLevelValue.data.value.value.toFixed(2) : "N/A",loadUnit : pbsLoadValue && pbsLoadSecondValue && pbsLoadThirdValue !== null ? (pbsLoadValue.data.value.value + pbsLoadSecondValue.data.value.value + pbsLoadThirdValue.data.value.value).toFixed(2) : 'N/A'},
    { position: new LatLng(-7.40963131897961, 109.56792235776204), name: 'PLTA Plumbungan',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.314167297132545, 109.71852123771501), name: 'PLTA Gunung wugul',waterLevel: gunungWugulWaterLevelValue !== null ? gunungWugulWaterLevelValue.data.value.value.toFixed(2) : "N/A",loadUnit : gunungWugulLoadValue && gunungWugulLoadSecondValue !== null ? ((gunungWugulLoadValue.data.value.value / 1000) + (gunungWugulLoadSecondValue.data.value.value / 1000)).toFixed(2) : 'N/A'},
    { position: new LatLng(-7.3205022492692144, 109.22344528175903), name: 'PLTA Ketenger',waterLevel: "N/A",loadUnit : ketengerLoadValue && ketengerLoadSecondValue && ketengerLoadThirdValue && ketengerLoadFourthValue !== null ? (ketengerLoadValue.data.value.value + ketengerLoadSecondValue.data.value.value + (ketengerLoadThirdValue.data.value.value / 1000) + (ketengerLoadFourthValue.data.value.value / 1000)).toFixed(2) : 'N/A'},
    { position: new LatLng(-7.309125894063505, 109.76976569969263), name: 'PLTA Tulis',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.286172601473982, 109.92031631561362), name: 'PLTA Garung',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.596274775273336, 109.77912085081293), name: 'PLTA Wadaslintang',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.659905648323142, 109.7724663410396), name: 'PLTA Pejengkolan',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.547181384353519, 109.48519257113237), name: 'PLTA Sempor',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.8371339130071895, 110.9263176603235), name: 'PLTA Wonogiri',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.214825581112301, 110.50210658754585), name: 'PLTA Timo',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.214362144100243, 110.84650561162269), name: 'PLTA Sidorejo',waterLevel: sidorejoWaterLevelValue !== null ? sidorejoWaterLevelValue.data.value.value.toFixed(2) : "N/A",loadUnit : sidorejoLoadValue !== null ? (sidorejoLoadValue.data.value.value).toFixed(2) : 'N/A'},
    { position: new LatLng(-7.017677610744967, 110.80358004674133), name: 'PLTA Klambu',waterLevel: klambuWaterLevelValue !== null ? klambuWaterLevelValue.data.value.value.toFixed(2) : "N/A",loadUnit : klambuLoadValue !== null ? (klambuLoadValue.data.value.value).toFixed(2) : 'N/A'},
    { position: new LatLng(-7.243739514612452, 110.48112101052733), name: 'PLTA Jelok',waterLevel: 'N/A',loadUnit : 50 },
    { position: new LatLng(-7.255866755384077, 110.83785488284785), name: 'PLTA Kedungombo',waterLevel: kedungomboWaterLevelValue !== null ? kedungomboWaterLevelValue.data.value.value.toFixed(2) : "N/A",loadUnit : kedungomboLoadValue !== null ? (kedungomboLoadValue.data.value.value).toFixed(2) : 'N/A'},
  ];

  Icon.Default.mergeOptions({
    iconRetinaUrl: MarkerIcon2X.src,
    iconUrl: MarkerIcon.src,
    shadowUrl: MarkerShadow.src,
  });

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

   //beban unit 1 gunung wugul
  useEffect(() => {

    const getGunungWugulLoad = async () => {
      try {
        const response = await fetchGunungWugulLoadValue();
        if (response?.data) {
          setGunungWugulLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getGunungWugulLoad();

    const intervalId = setInterval(getGunungWugulLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  //beban unit 2 gunung wugul
  useEffect(() => {
  
    const getGunungWugulSecondLoad = async () => {
      try {
        const response = await fetchGunungWugulLoadSecondValue();
        if (response?.data) {
          setGunungWugulLoadSecondValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };
    getGunungWugulSecondLoad();

    const intervalId = setInterval(getGunungWugulSecondLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

   // water level gunung wugul
   useEffect(() => {
  
    const getGunungWugulWaterLevel = async () => {
      try {
        const response = await fetchGunungWugulWaterLevel();
        if (response?.data) {
          setGunungWugulWaterLevelValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getGunungWugulWaterLevel();
 
    const intervalId = setInterval(getGunungWugulWaterLevel, 10000);

    return () => clearInterval(intervalId);
  }, []);  


  //beban unit 1 tapen
  useEffect(() => {

    const getTapenLoad = async () => {
      try {
        const response = await fetchTapenLoadValue();
        if (response?.data) {
          setTapenLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getTapenLoad();

    const intervalId = setInterval(getTapenLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  // water level tapen
   useEffect(() => {
  
    const getTapenWaterLevel = async () => {
      try {
        const response = await fetchTapenWaterLevel();
        if (response?.data) {
          setTapenWaterLevelValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getTapenWaterLevel();
 
    const intervalId = setInterval(getTapenWaterLevel, 10000);

    return () => clearInterval(intervalId);
  }, []);  

  //beban unit 1 kedungombo
  useEffect(() => {

    const getKedungomboLoad = async () => {
      try {
        const response = await fetchKedungomboLoadValue();
        if (response?.data) {
          setKedungomboLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getKedungomboLoad();

    const intervalId = setInterval(getKedungomboLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  // water level kedungombo
   useEffect(() => {
  
    const getKedungomboWaterLevel = async () => {
      try {
        const response = await fetchKedungomboWaterLevel();
        if (response?.data) {
          setKedungomboWaterLevelValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getKedungomboWaterLevel();
 
    const intervalId = setInterval(getKedungomboWaterLevel, 10000);

    return () => clearInterval(intervalId);
  }, []);  

  //beban unit 1 klambu
  useEffect(() => {

    const getKlambuLoad = async () => {
      try {
        const response = await fetchKlambuLoadValue();
        if (response?.data) {
          setKlambuLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getKlambuLoad();

    const intervalId = setInterval(getKlambuLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  // water level Klambu
   useEffect(() => {
  
    const getKlambuWaterLevel = async () => {
      try {
        const response = await fetchKlambuWaterLevelAo();
        if (response?.data) {
          setKlambuWaterLevelValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getKlambuWaterLevel();
 
    const intervalId = setInterval(getKlambuWaterLevel, 10000);

    return () => clearInterval(intervalId);
  }, []);  
  //beban unit 1 Sidorejo
  useEffect(() => {

    const getSidorejoLoad = async () => {
      try {
        const response = await fetchSidorejoLoadValue();
        if (response?.data) {
          setSidorejoLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getSidorejoLoad();

    const intervalId = setInterval(getSidorejoLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  // water level Sidorejo
   useEffect(() => {
  
    const getSidorejoWaterLevel = async () => {
      try {
        const response = await fetchSidorejoWaterLevel();
        if (response?.data) {
          setSidorejoWaterLevelValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getSidorejoWaterLevel();
 
    const intervalId = setInterval(getSidorejoWaterLevel, 10000);

    return () => clearInterval(intervalId);
  }, []);  

  //beban unit 1 Ketenger
  useEffect(() => {
    const getKetengerLoad = async () => {
      try {
        const response = await fetchKetengerLoadValue();
        if (response?.data) {
          setKetengerLoadValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };
    getKetengerLoad();
    
    const intervalId = setInterval(getKetengerLoad, 10000);

    return () => clearInterval(intervalId);
  
  }, []);

   //beban unit 2 Ketenger
  useEffect(() => {

    const getKetengerSecondLoad = async () => {
      try {
        const response = await fetchKetengerLoadSecondValue();
        if (response?.data) {
          setKetengerLoadSecondValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };

    getKetengerSecondLoad();

    const intervalId = setInterval(getKetengerSecondLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  //beban unit 3 Ketenger
  useEffect(() => {
  
    const getKetengerThirdLoad = async () => {
      try {
        const response = await fetchKetengerLoadThirdValue();
        if (response?.data) {
          setKetengerLoadThirdValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };
    getKetengerThirdLoad();

    const intervalId = setInterval(getKetengerThirdLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);
  //beban unit 4 Ketenger
  useEffect(() => {
  
    const getKetengerFourthLoad = async () => {
      try {
        const response = await fetchKetengerLoadFourthValue();
        if (response?.data) {
          setKetengerLoadFourthValue(response);
        }
      } catch (error) {
        console.error('Error in getData:', error);
      }
    };
    getKetengerFourthLoad();

    const intervalId = setInterval(getKetengerFourthLoad, 10000);
 
    return () => clearInterval(intervalId);
  }, []);

  //  water level Ketenger
  //  useEffect(() => {
  
  //   const getKetengerWaterLevel = async () => {
  //     try {
  //       const response = await fetchKetengerWaterLevel();
  //       if (response?.data) {
  //         setKetengerWaterLevelValue(response);
  //       }
  //     } catch (error) {
  //       console.error('Error in getData:', error);
  //     }
  //   };

  //   getKetengerWaterLevel();
 
  //   const intervalId = setInterval(getKetengerWaterLevel, 10000);

  //   return () => clearInterval(intervalId);
  // }, []);  


  return (

    <MapContainer className='z-0' center={position} zoom={8} style={{ height: '100%', width: '100%' }}>
    <TileLayer
      url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    {locations.map((location, index) => (
      <Marker key={index} position={location.position}>
        <Popup>
          <div className="p-2">
            <h3 className="text-lg font-bold text-center mb-2">{location.name}</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1 font-medium">TMA</td>
                  <td className="py-1">: {location.waterLevel} mdpl</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Load</td>
                  <td className="py-1">: {location.loadUnit} WH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Popup>
      </Marker>
    ))}
  </MapContainer>

  );
};

export default MapContent;