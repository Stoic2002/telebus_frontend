import L from 'leaflet';
import { SensorValueResponse } from '@/types/sensorTypes';

export const formatLoadValue = (value: SensorValueResponse | null): string => {
  return value?.data?.value?.value.toFixed(2) || 'N/A';
};

export const calculateTotalLoad = (values: (SensorValueResponse | null)[], divideBy1000: boolean = false): number => {
    const validValues = values.filter((v): v is SensorValueResponse => v !== null);
    if (validValues.length === 0) return 0;
    
    const total = validValues.reduce((sum, v) => sum + v.data.value.value, 0);
    
    // Divide by 1000 if the flag is true
    return (divideBy1000 ? total / 1000 : total)
  };

export const getDefaultLocations  = () => [
    { position: new L.LatLng(-7.386563238230246, 109.60085899477103), name: 'PLTA Tapen',waterLevel: "N/A",loadUnit : 'N/A'},
    { position: new L.LatLng(-7.403447747900593, 109.56813461938899), name: 'PLTA Siteki',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.39494911212742, 109.60532545434796), name: 'PLTA Soedirman',waterLevel:  "N/A",loadUnit :'N/A'},
    { position: new L.LatLng(-7.40963131897961, 109.56792235776204), name: 'PLTA Plumbungan',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.314167297132545, 109.71852123771501), name: 'PLTA Gunung wugul',waterLevel:   "N/A",loadUnit :'N/A'},
    { position: new L.LatLng(-7.3205022492692144, 109.22344528175903), name: 'PLTA Ketenger',waterLevel: "N/A",loadUnit : 'N/A'},
    { position: new L.LatLng(-7.309125894063505, 109.76976569969263), name: 'PLTA Tulis',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.286172601473982, 109.92031631561362), name: 'PLTA Garung',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.596274775273336, 109.77912085081293), name: 'PLTA Wadaslintang',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.659905648323142, 109.7724663410396), name: 'PLTA Pejengkolan',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.547181384353519, 109.48519257113237), name: 'PLTA Sempor',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.8371339130071895, 110.9263176603235), name: 'PLTA Wonogiri',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.214825581112301, 110.50210658754585), name: 'PLTA Timo',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.214362144100243, 110.84650561162269), name: 'PLTA Sidorejo',waterLevel:  "N/A",loadUnit :  'N/A'},
    { position: new L.LatLng(-7.017677610744967, 110.80358004674133), name: 'PLTA Klambu',waterLevel: "N/A",loadUnit : 'N/A'},
    { position: new L.LatLng(-7.243739514612452, 110.48112101052733), name: 'PLTA Jelok',waterLevel: 'N/A',loadUnit : 'N/A' },
    { position: new L.LatLng(-7.255866755384077, 110.83785488284785), name: 'PLTA Kedungombo',waterLevel: "N/A",loadUnit :  'N/A'},
  ];
