import { LatLng } from 'leaflet';

export interface SensorValueResponse {
  data: {
    value: {
      value: number;
    };
  };
}

export interface Location {
  position: LatLng;
  name: string;
  waterLevel: string;
  loadUnit: number | string;
}
