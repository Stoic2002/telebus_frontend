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
  const { data: pbsLoad1 } = useSensorData({ fetchFunction: fetchSoedirmanLoadValue});
  const { data: pbsLoad2 } = useSensorData({ fetchFunction: fetchSoedirmanLoadSecondValue });
  const { data: pbsLoad3 } = useSensorData({ fetchFunction: fetchSoedirmanLoadThirdValue });
  const { data: pbsWaterLevel } = useSensorData({ fetchFunction: fetchSoedirmanWaterLevel });
  const { data: gunungWugulLoad1 } = useSensorData({ fetchFunction: fetchGunungWugulLoadValue });
  const { data: gunungWugulLoad2 } = useSensorData({ fetchFunction: fetchGunungWugulLoadSecondValue });
  const { data: gunungWugulWaterLevel } = useSensorData({ fetchFunction: fetchGunungWugulWaterLevel });
  const { data: tapenLoad } = useSensorData({ fetchFunction: fetchTapenLoadValue });
  const { data: tapenWaterLevel } = useSensorData({ fetchFunction: fetchTapenWaterLevel });
  const { data: kedungomboLoad } = useSensorData({ fetchFunction: fetchKedungomboLoadValue });
  const { data: kedungomboWaterLevel } = useSensorData({ fetchFunction: fetchKedungomboWaterLevel });
  const { data: klambuLoad } = useSensorData({ fetchFunction: fetchKlambuLoadValue });
  const { data: klambuWaterLevel } = useSensorData({ fetchFunction: fetchKlambuWaterLevelAo });
  const { data: sidorejoLoad } = useSensorData({ fetchFunction: fetchSidorejoLoadValue });
  const { data: sidorejoWaterLevel } = useSensorData({ fetchFunction: fetchSidorejoWaterLevel });
  const { data: ketengerLoad1 } = useSensorData({ fetchFunction: fetchKetengerLoadValue });
  const { data: ketengerLoad2 } = useSensorData({ fetchFunction: fetchKetengerLoadSecondValue });
  const { data: ketengerLoad3 } = useSensorData({ fetchFunction: fetchKetengerLoadThirdValue });
  const { data: ketengerLoad4 } = useSensorData({ fetchFunction: fetchKetengerLoadFourthValue });
  const { data: garungLoad1 } = useSensorData({ fetchFunction: fetchGarungLoadValue });
  const { data: garungLoad2} = useSensorData({ fetchFunction: fetchGarungLoadSecondValue });
  const { data: jelokLoad1} = useSensorData({ fetchFunction: fetchJelokLoadValue });
  const { data: jelokLoad2} = useSensorData({ fetchFunction: fetchJelokLoadSecondValue });
  const { data: jelokLoad3} = useSensorData({ fetchFunction: fetchJelokLoadThirdValue });
  const { data: jelokLoad4} = useSensorData({ fetchFunction: fetchJelokLoadFourthValue });
  const { data: pejengkolanLoad} = useSensorData({ fetchFunction: fetchPejengkolanLoadValue });
  const { data: plumbunganLoad} = useSensorData({ fetchFunction: fetchPlumbunganLoadValue });
  const { data: semporLoad} = useSensorData({ fetchFunction: fetchSemporLoadValue });
  const { data: sitekiLoad} = useSensorData({ fetchFunction: fetchSitekiLoadValue });
  const { data: timoLoad1} = useSensorData({ fetchFunction: fetchTimoLoadValue });
  const { data: timoLoad2} = useSensorData({ fetchFunction: fetchTimoLoadSecondValue });
  const { data: timoLoad3} = useSensorData({ fetchFunction: fetchTimoLoadThirdValue });
  const { data: tulisLoad1} = useSensorData({ fetchFunction: fetchTulisLoadValue });
  const { data: tulisLoad2} = useSensorData({ fetchFunction: fetchTulisLoadSecondValue });
  const { data: wadaslintangLoad1} = useSensorData({ fetchFunction: fetchWadaslintangLoadValue });
  const { data: wadaslintangLoad2} = useSensorData({ fetchFunction: fetchWadaslintangLoadSecondValue });
  const { data: wonogiriLoad1} = useSensorData({ fetchFunction: fetchWonogiriLoadValue });
  const { data: wonogiriLoad2} = useSensorData({ fetchFunction: fetchWonogiriLoadSecondValue });

  // Update locations with sensor data
  useEffect(() => {
    const updatedLocations = locations.map(location => {
      switch (location.name) {
        case 'PLTA Tapen':
          return {
            ...location,
            waterLevel: formatLoadValue(tapenWaterLevel),
            loadUnit: formatLoadValue(tapenLoad)
          };
        case 'PLTA Soedirman':
          return {
            ...location,
            waterLevel: formatLoadValue(pbsWaterLevel),
            loadUnit: calculateTotalLoad([pbsLoad1, pbsLoad2, pbsLoad3]).toFixed(2)
          };
        case 'PLTA Gunung wugul':
          return {
            ...location,
            waterLevel: formatLoadValue(gunungWugulWaterLevel),
            loadUnit: calculateTotalLoad([gunungWugulLoad1, gunungWugulLoad2],true).toFixed(2)
          };
        case 'PLTA Sidorejo':
          return {
            ...location,
            waterLevel: formatLoadValue(sidorejoWaterLevel),
            loadUnit: calculateTotalLoad([sidorejoLoad],true).toFixed(2)
          };
        case 'PLTA Klambu':
          return {
            ...location,
            waterLevel: formatLoadValue(klambuWaterLevel),
            loadUnit: calculateTotalLoad([klambuLoad]).toFixed(2)
          };
        case 'PLTA Kedungombo':
          return {
            ...location,
            waterLevel: formatLoadValue(kedungomboWaterLevel),
            loadUnit: formatLoadValue(kedungomboLoad)
          };
        case 'PLTA Ketenger':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: (calculateTotalLoad([ketengerLoad3,ketengerLoad4],true) + calculateTotalLoad([ketengerLoad1,ketengerLoad2])).toFixed(2)
          };
        case 'PLTA Garung':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([garungLoad1, garungLoad2])
          };
        case 'PLTA Jelok':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([jelokLoad1,jelokLoad2,jelokLoad3,jelokLoad4],true).toFixed(2)
          };
        case 'PLTA Pejengkolan':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([pejengkolanLoad],true)
          };
        case 'PLTA Plumbungan':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([plumbunganLoad])
          };
        case 'PLTA Sempor':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([semporLoad],true).toFixed(2)
          };
        case 'PLTA Siteki':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([sitekiLoad])
          };
        case 'PLTA Timo':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([timoLoad1,timoLoad2,timoLoad3],true).toFixed(2)
          };
        case 'PLTA Tulis':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([tulisLoad1, tulisLoad2],true)
          };
        case 'PLTA Wadaslintang':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([wadaslintangLoad1,wadaslintangLoad2],true).toFixed(2)
          };
        case 'PLTA Wonogiri':
          return {
            ...location,
            waterLevel: 'N/A',
            loadUnit: calculateTotalLoad([wonogiriLoad1,wonogiriLoad2])
          };
        // ... handle other locations
        default:
          return location;
      }
    });
    setLocations(updatedLocations);
  }, [
    pbsLoad1, pbsLoad2, pbsLoad3, pbsWaterLevel,
    gunungWugulLoad1, gunungWugulLoad2, gunungWugulWaterLevel,
    tapenLoad, tapenWaterLevel,
    kedungomboLoad, kedungomboWaterLevel,
    klambuLoad, klambuWaterLevel,
    sidorejoLoad, sidorejoWaterLevel,
    ketengerLoad1, ketengerLoad2, ketengerLoad3, ketengerLoad4,
    garungLoad1,garungLoad2,
    jelokLoad1,jelokLoad2,jelokLoad3,jelokLoad4,
    pejengkolanLoad,
    plumbunganLoad,
    semporLoad,
    sitekiLoad,
    timoLoad1,timoLoad2,timoLoad3,
    tulisLoad1,tulisLoad2,
    wadaslintangLoad1,wadaslintangLoad2,
    wonogiriLoad1,wonogiriLoad2
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