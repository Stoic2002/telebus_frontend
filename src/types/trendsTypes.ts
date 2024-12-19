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