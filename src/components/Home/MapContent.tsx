import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import MarkerIcon2X from 'leaflet/dist/images/marker-icon-2x.png';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useSensorData } from '../../hooks/useSensorData';
import { MapMarker } from './MapMarker';
import { formatLoadValue, calculateTotalLoad, getDefaultLocations } from '../../lib/mapUtils';
import { Location } from '../../types/mapTypes';
import 'leaflet/dist/leaflet.css';
import { fetchKedungomboLoadValue } from '@/services/loadUnit/kedungomboLoadUnit';
import { fetchSoedirmanLoadSecondValue, fetchSoedirmanLoadThirdValue, fetchSoedirmanLoadValue } from '@/services/loadUnit/soedirmanLoadUnit';
import { fetchSoedirmanWaterLevel } from '@/services/waterLevel/soedirmanWaterLevel';
import { fetchGunungWugulLoadSecondValue, fetchGunungWugulLoadValue } from '@/services/loadUnit/gunungWugulLoadUnit';
import { fetchGunungWugulWaterLevel } from '@/services/waterLevel/gunungWugulWaterLevel';
import { fetchTapenLoadValue } from '@/services/loadUnit/tapenLoadUnit';
import { fetchTapenWaterLevel } from '@/services/waterLevel/tapenWaterLevel';
import { fetchKedungomboWaterLevel } from '@/services/waterLevel/kedungomboWaterLevel';
import { fetchKlambuLoadValue } from '@/services/loadUnit/klambuLoadUnit';
import { fetchKlambuWaterLevelAo } from '@/services/waterLevel/klambuWaterLevel';
import { fetchSidorejoLoadValue } from '@/services/loadUnit/sidorejoLoadUnit';
import { fetchSidorejoWaterLevel } from '@/services/waterLevel/sidorejoWaterLevel';
import { fetchKetengerLoadFourthValue, fetchKetengerLoadSecondValue, fetchKetengerLoadThirdValue, fetchKetengerLoadValue } from '@/services/loadUnit/ketengerLoadUnit';
import { fetchGarungLoadSecondValue, fetchGarungLoadValue } from '@/services/loadUnit/garungLoadUnit';
import { fetchJelokLoadFourthValue, fetchJelokLoadSecondValue, fetchJelokLoadThirdValue, fetchJelokLoadValue } from '@/services/loadUnit/jelokLoadUnit';
import { fetchPejengkolanLoadValue } from '@/services/loadUnit/pejengkolanLoadUnit';
import { fetchPlumbunganLoadValue } from '@/services/loadUnit/plumbunganLoadUnit';
import { fetchSemporLoadValue } from '@/services/loadUnit/semporLoadUnit';
import { fetchSitekiLoadValue } from '@/services/loadUnit/sitekiLoadUnit';
import { fetchTimoLoadSecondValue, fetchTimoLoadThirdValue, fetchTimoLoadValue } from '@/services/loadUnit/timoLoadUnit';
import { fetchTulisLoadSecondValue, fetchTulisLoadValue } from '@/services/loadUnit/tulisLoadUnit';
import { fetchWadaslintangLoadSecondValue, fetchWadaslintangLoadValue } from '@/services/loadUnit/wadaslintangLoadUnit';
import { fetchWonogiriLoadSecondValue, fetchWonogiriLoadValue } from '@/services/loadUnit/wonogiriLoadUnit';
import useStationsNodeData from '@/hooks/useStationsNodeData';
import usePbsNodeData from '@/hooks/usePbsNodeData';


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
    soedirman,
  } = usePbsNodeData({ interval: 10000 });

  // Update locations with sensor data
  useEffect(() => {
    const updatedLocations = locations.map(location => {
      switch (location.name) {
        case 'PLTA Tapen':
          return {
            ...location,
            waterLevel: stations.tapenWaterLevel?.toFixed(2) ?? 0,
            loadUnit: stations.tapenActivePower?.toFixed(2) ?? 0
          };
        case 'PLTA Soedirman':
          return {
            ...location,
            waterLevel: soedirman.levels.elevation?.toFixed(2) ?? 0,
            loadUnit: soedirman.activeLoads.total.toFixed(2) ?? 0
          };
        case 'PLTA Gunung wugul':
          return {
            ...location,
            waterLevel: stations.gunungWugulHead?.toFixed(2) ?? 0,
            loadUnit: ((stations.gunungWugul1 ?? 0) + (stations.gunungWugul2 ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Sidorejo':
          return {
            ...location,
            waterLevel:  stations.sidorejoWaterLevel?.toFixed(2) ?? 0,
            loadUnit:  stations.sidorejoActivePower?.toFixed(2) ?? 0,
          };
        case 'PLTA Klambu':
          return {
            ...location,
            waterLevel:  stations.klambuWaterLevel?.toFixed(2) ?? 0,
            loadUnit:  stations.klambuActivePower?.toFixed(2) ?? 0,
          };
        case 'PLTA Kedungombo':
          return {
            ...location,
            waterLevel:  stations.kedungomboLevel?.toFixed(2) ?? 0,
            loadUnit:  stations.kedungomboUnit?.toFixed(2) ?? 0,
          };
        case 'PLTA Ketenger':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.ketengerActivePower ?? 0) + (stations.ketengerBruto ?? 0) + (stations.ketengerRealPowerU3 ?? 0) + (stations.ketengerScaledU4 ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Garung':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.garungUnit1 ?? 0) + (stations.garungUnit2 ?? 0 )).toFixed(2)
          };
        case 'PLTA Jelok':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.jelokNetto1 ?? 0) + (stations.jelokNetto2 ?? 0) + (stations.jelokNetto3 ?? 0) + (stations.jelokNetto4 ?? 0)).toFixed(2)
          };
        case 'PLTA Pejengkolan':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations.pejengkolanMeter?.toFixed(2) ?? 0
          };
        case 'PLTA Plumbungan':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations.plumbunganAI?.toFixed(2) ?? 0
          };
        case 'PLTA Sempor':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations.semporActualMW?.toFixed(2) ?? 0
          };
        case 'PLTA Siteki':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: stations.sitekiAI?.toFixed(2) ?? 0
          };
        case 'PLTA Timo':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.timoNetto1 ?? 0) + (stations.timoNetto2 ?? 0) + (stations.timoNetto3 ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Tulis':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.tulisActivePowerU1 ?? 0) + (stations.tulisActivePowerU2 ?? 0 )).toFixed(2) ?? 0
          };
        case 'PLTA Wadaslintang':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.wadaslintangRealPower ?? 0) + (stations.wadaslintangRealPowerTotal ?? 0)).toFixed(2) ?? 0
          };
        case 'PLTA Wonogiri':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: ((stations.wonogiriGenPowerU1 ?? 0) + (stations.wonogiriGenPowerU2 ?? 0)).toFixed(2) ?? 0
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
    stations.tapenActivePower, stations.tapenWaterLevel,
    stations.kedungomboLevel, stations.kedungomboUnit,
    stations.klambuActivePower, stations.klambuWaterLevel,
    stations.sidorejoActivePower, stations.sidorejoWaterLevel,
    stations.ketengerActivePower, stations.ketengerBruto, stations.ketengerRealPowerU3, stations.ketengerScaledU4,
    stations.garungUnit1,stations.garungUnit2,
    stations.jelokNetto1,stations.jelokNetto2,stations.jelokNetto3,stations.jelokNetto4,
    stations.pejengkolanMeter,
    stations.plumbunganAI,
    stations.semporActualMW,
    stations.sitekiAI,
    stations.timoNetto1,stations.timoNetto2,stations.timoNetto3,
    stations.tulisActivePowerU1,stations.tulisActivePowerU2,
    stations.wadaslintangRealPower,stations.wadaslintangRealPowerTotal,
    stations.wonogiriGenPowerU1,stations.wonogiriGenPowerU2
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