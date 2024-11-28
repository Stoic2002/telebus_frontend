export interface BebanData {
    id: number;
    name: string;
    value: string;
    timestamp: string;
  }
  
 export  interface OutflowData {
    id: number;
    name: string;
    value: string;
    timestamp: string;
  }
  
 export  interface TMAData {
    id: number;
    name: string;
    value: string;
    timestamp: string;
  }
  
 export  interface ARRData {
    id: number;
    name: string;
    value: string;
    timestamp: string;
  }
  
 export  interface InflowData {
    id: number;
    name: string;
    value: string;
    timestamp: string;
  }
  
 export  interface riverFlow {
      id_sensor_tide_jam: number;
      id_sensor_tide: number;
      kWaktu: string;
      water_level: number;
      battery: number;
      debit: string;
      month: number;
      created_by: string;
      date_created: string
  }
  
 export  interface FormattedData {
    time: string;
    originalTime: Date;
    debitSerayu?: number;
    debitMerawu?: number;
    debitLumajang?:number;
    totalDebit?:number;
    bebanPB01?: number;
    bebanPB02?: number;
    bebanPB03?: number;
    totalBeban?: number;
    inflow?: number;
    tma?: number;
    outflow?: number;
    arrST01?: number;
    arrST02?: number;
    arrST03?: number;
    inflowSeparate?: number;
  }