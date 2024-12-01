import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import MarkerIcon2X from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapMarker } from './MapMarker';
import { formatLoadValue, calculateTotalLoad, getDefaultLocations } from '../../lib/mapUtils';
import { Location } from '../../types/mapTypes';
import 'leaflet/dist/leaflet.css';
import useStationsNodeData from '@/hooks/useStationsNodeData';
import usePbsNodeData from '@/hooks/usePbsNodeData';
import useStations2NodeData from '@/hooks/useStations2NodeData';
import useStations3NodeData from '@/hooks/useStations3NodeData';
import useStations4NodeData from '@/hooks/useStations4NodeData';


const MapContent: React.FC = () => {
  const [mapReady, setMapReady] = useState(false);
  const [locations, setLocations] = useState<Location[]>(getDefaultLocations());

  // Initialize Leaflet icon settings
  useEffect(() => {
    Icon.Default.mergeOptions({
      iconRetinaUrl: MarkerIcon2X.src,
      iconUrl: MarkerIcon.src,
      shadowUrl: MarkerShadow.src,
    });
    setMapReady(true);
  }, []);

  // Fetch sensor data using custom hook
  // const { data: pbsLoad1 } = useSensorData({ fetchFunction: fetchSoedirmanLoadValue});
  // const { data: pbsLoad2 } = useSensorData({ fetchFunction: fetchSoedirmanLoadSecondValue });
  // const { data: pbsLoad3 } = useSensorData({ fetchFunction: fetchSoedirmanLoadThirdValue });
  // const { data: pbsWaterLevel } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });
  // const { data: gunungWugulLoad1 } = useSensorData({ fetchFunction: fetchGunungWugulLoadValue });
  // const { data: gunungWugulLoad2 } = useSensorData({ fetchFunction: fetchGunungWugulLoadSecondValue });
  // const { data: gunungWugulWaterLevel } = useSensorData({ fetchFunction: fetchGunungWugulWaterLevel });
  // const { data: tapenLoad } = useSensorData({ fetchFunction: fetchTapenLoadValue });
  // const { data: tapenWaterLevel } = useSensorData({ fetchFunction: fetchTapenWaterLevel });
  // const { data: kedungomboLoad } = useSensorData({ fetchFunction: fetchKedungomboLoadValue });
  // const { data: kedungomboWaterLevel } = useSensorData({ fetchFunction: fetchKedungomboWaterLevel });
  // const { data: klambuLoad } = useSensorData({ fetchFunction: fetchKlambuLoadValue });
  // const { data: klambuWaterLevel } = useSensorData({ fetchFunction: fetchKlambuWaterLevelAo });
  // const { data: sidorejoLoad } = useSensorData({ fetchFunction: fetchSidorejoLoadValue });
  // const { data: sidorejoWaterLevel } = useSensorData({ fetchFunction: fetchSidorejoWaterLevel });
  // const { data: ketengerLoad1 } = useSensorData({ fetchFunction: fetchKetengerLoadValue });
  // const { data: ketengerLoad2 } = useSensorData({ fetchFunction: fetchKetengerLoadSecondValue });
  // const { data: ketengerLoad3 } = useSensorData({ fetchFunction: fetchKetengerLoadThirdValue });
  // const { data: ketengerLoad4 } = useSensorData({ fetchFunction: fetchKetengerLoadFourthValue });
  // const { data: garungLoad1 } = useSensorData({ fetchFunction: fetchGarungLoadValue });
  // const { data: garungLoad2} = useSensorData({ fetchFunction: fetchGarungLoadSecondValue });
  // const { data: jelokLoad1} = useSensorData({ fetchFunction: fetchJelokLoadValue });
  // const { data: jelokLoad2} = useSensorData({ fetchFunction: fetchJelokLoadSecondValue });
  // const { data: jelokLoad3} = useSensorData({ fetchFunction: fetchJelokLoadThirdValue });
  // const { data: jelokLoad4} = useSensorData({ fetchFunction: fetchJelokLoadFourthValue });
  // const { data: pejengkolanLoad} = useSensorData({ fetchFunction: fetchPejengkolanLoadValue });
  // // const { data: plumbunganLoad} = useSensorData({ fetchFunction: fetchPlumbunganLoadValue });
  // const { data: semporLoad} = useSensorData({ fetchFunction: fetchSemporLoadValue });
  // const { data: sitekiLoad} = useSensorData({ fetchFunction: fetchSitekiLoadValue });
  // const { data: timoLoad1} = useSensorData({ fetchFunction: fetchTimoLoadValue });
  // const { data: timoLoad2} = useSensorData({ fetchFunction: fetchTimoLoadSecondValue });
  // const { data: timoLoad3} = useSensorData({ fetchFunction: fetchTimoLoadThirdValue });
  // const { data: tulisLoad1} = useSensorData({ fetchFunction: fetchTulisLoadValue });
  // const { data: tulisLoad2} = useSensorData({ fetchFunction: fetchTulisLoadSecondValue });
  // const { data: wadaslintangLoad1} = useSensorData({ fetchFunction: fetchWadaslintangLoadValue });
  // const { data: wadaslintangLoad2} = useSensorData({ fetchFunction: fetchWadaslintangLoadSecondValue });
  // const { data: wonogiriLoad1} = useSensorData({ fetchFunction: fetchWonogiriLoadValue });
  // const { data: wonogiriLoad2} = useSensorData({ fetchFunction: fetchWonogiriLoadSecondValue });

  const { 
    stations,
  } = useStationsNodeData({ interval: 10000 });
  const { 
    stations2,
  } = useStations2NodeData({ interval: 10000 });
  const { 
    stations3,
  } = useStations3NodeData({ interval: 10000 });
  const { 
    stations4,
  } = useStations4NodeData({ interval: 10000 });
  const { 
    soedirman,
  } = usePbsNodeData({ interval: 10000 });

  // Update locations with sensor data
  useEffect(() => {
    const updatedLocations = locations.map(location => {
      switch (location.name) {
        case 'PLTA Tapen'://3
          return {
            ...location,
            waterLevel: stations3.tapenWaterLevel?.toFixed(2) ?? 0,
            loadUnit: stations3.tapenActivePower?.toFixed(2) ?? 0
          };
        case 'PLTA Soedirman':
          return {
            ...location,
            waterLevel: soedirman.levels.elevation?.toFixed(2) ?? 0,
            loadUnit: soedirman.activeLoads.total.toFixed(2) ?? 0
          };
        case 'PLTA Gunung wugul'://1
          return {
            ...location,
            waterLevel: stations.gunungWugulHead?.toFixed(2) ?? 0,
            loadUnit: ((stations.gunungWugul1 ?? 0) + (stations.gunungWugul2 ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Sidorejo'://3
          return {
            ...location,
            waterLevel:  stations3.sidorejoWaterLevel?.toFixed(2) ?? 0,
            loadUnit:  stations3.sidorejoActivePower?.toFixed(2) ?? 0,
          };
        case 'PLTA Klambu'://2
          return {
            ...location,
            waterLevel:  stations2.klambuWaterLevel?.toFixed(2) ?? 0,
            loadUnit:  stations2.klambuActivePower?.toFixed(2) ?? 0,
          };
        case 'PLTA Kedungombo'://2
          return {
            ...location,
            waterLevel:  stations2.kedungomboLevel?.toFixed(2) ?? 0,
            loadUnit:  stations2.kedungomboUnit?.toFixed(2) ?? 0,
          };
        case 'PLTA Ketenger'://2
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations2.ketengerActivePower ?? 0) + (stations2.ketengerBruto ?? 0) + (stations2.ketengerRealPowerU3 ?? 0) + (stations2.ketengerScaledU4 ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Garung': //1
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.garungUnit1 ?? 0) + (stations.garungUnit2 ?? 0 )).toFixed(2)
          };
        case 'PLTA Jelok'://1
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.jelokNetto1 ?? 0) + (stations.jelokNetto2 ?? 0) + (stations.jelokNetto3 ?? 0) + (stations.jelokNetto4 ?? 0)).toFixed(2)
          };
        case 'PLTA Pejengkolan'://2
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations2.pejengkolanMeter?.toFixed(2) ?? 0
          };
        case 'PLTA Plumbungan'://3
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations3.plumbunganAI?.toFixed(2) ?? 0
          };
        case 'PLTA Sempor'://3
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations3.semporActualMW?.toFixed(2) ?? 0
          };
        case 'PLTA Siteki'://3
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations3.sitekiAI?.toFixed(2) ?? 0
          };
        case 'PLTA Timo'://4
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations4.timoNetto1 ?? 0) + (stations4.timoNetto2 ?? 0) + (stations4.timoNetto3 ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Tulis'://4
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations4.tulisActivePowerU1 ?? 0) + (stations4.tulisActivePowerU2 ?? 0 )).toFixed(2) ?? 0
          };
        case 'PLTA Wadaslintang'://4
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations4.wadaslintangRealPower ?? 0) + (stations4.wadaslintangRealPowerTotal ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Wonogiri'://4
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations4.wonogiriGenPowerU1 ?? 0) + (stations4.wonogiriGenPowerU2 ?? 0)).toFixed(2) ?? 0
          };
        // ... handle other locations
        default:
          return location;
      }
    });
    setLocations(updatedLocations);
  }, [
    soedirman.activeLoads.pb01, soedirman.activeLoads.pb02, soedirman.activeLoads.pb03, soedirman.levels.elevation,
    stations.gunungWugul1, stations.gunungWugul2, stations.gunungWugulHead,
    stations3.tapenActivePower, stations3.tapenWaterLevel,
    stations2.kedungomboLevel, stations2.kedungomboUnit,
    stations2.klambuActivePower, stations2.klambuWaterLevel,
    stations3.sidorejoActivePower, stations3.sidorejoWaterLevel,
    stations2.ketengerActivePower, stations2.ketengerBruto, stations.ketengerRealPowerU3, stations.ketengerScaledU4,
    stations.garungUnit1,stations.garungUnit2,
    stations.jelokNetto1,stations.jelokNetto2,stations.jelokNetto3,stations.jelokNetto4,
    stations2.pejengkolanMeter,
    stations3.plumbunganAI,
    stations3.semporActualMW,
    stations3.sitekiAI,
    stations4.timoNetto1,stations4.timoNetto2,stations4.timoNetto3,
    stations4.tulisActivePowerU1,stations4.tulisActivePowerU2,
    stations4.wadaslintangRealPower,stations4.wadaslintangRealPowerTotal,
    stations4.wonogiriGenPowerU1,stations4.wonogiriGenPowerU2
  ]);

  if (!mapReady) return null;

  return (
    <MapContainer 
      className="z-0" 
      center={new LatLng(-7.5400, 110.4460)} 
      zoom={8} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locations.map((location, index) => (
        <MapMarker key={`${location.name}-${index}`} location={location} />
      ))}
    </MapContainer>
  );
};

export default MapContent;