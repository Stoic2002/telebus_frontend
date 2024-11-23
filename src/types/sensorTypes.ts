  export interface ValueData {
    dataType: string;
    arrayType: string;
    value: number;
  }
  
  export interface StatusCode {
    value: number;
  }
  
  export interface SensorValueData {
    value: ValueData;
    statusCode: StatusCode;
    sourceTimestamp: string;
    sourcePicoseconds: number;
    serverTimestamp: string;
    serverPicoseconds: number;
  }
  
  export interface SensorValueResponse {
    data: SensorValueData;
  }