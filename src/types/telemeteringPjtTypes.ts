export interface WaterLevelData {
  datetime: string;
  wl: string;
}

export interface RainfallData {
  datetime: string;
  rf: string;
}

export interface StationData {
  header: {
    name: string;
    x: string;
    y: string;
  };
  data: WaterLevelData[] | RainfallData[];
}

export interface TelemeterData {
  Waterlevel?: StationData[];
  Rainfall?: StationData[];
}