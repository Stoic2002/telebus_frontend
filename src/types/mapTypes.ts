import { LatLng } from 'leaflet';

export interface MapSensorValueResponse {
  data: {
    value: {
      value: number;
    };
  };
}

export interface Location {
  position: LatLng;
  name: string;
  waterLevel: number | string;
  loadUnit: number | string;
}
