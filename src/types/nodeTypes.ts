// Types for the API response
export interface NodeValue {
    dataType: string;
    arrayType: string;
    value: number;
  }
  
  export interface DataValue {
    value: NodeValue;
    statusCode: {
      value: number;
    };
    sourceTimestamp: string;
    sourcePicoseconds: number;
    serverTimestamp: string;
    serverPicoseconds: number;
  }
  
 export interface NodeResponse {
    data: {
      nodeIds: string[];
      dataValues: DataValue[];
    };
  }

  export interface UseNodeDataProps {
    interval?: number;
  }
  
  export interface UseNodeDataReturn {
    data: NodeResponse | null;
    error: string | null;
    soedirman: {
      activeLoads: {
        pb01: number | null;
        pb02: number | null;
        pb03: number | null;
        total: number; // Should be a number
      };
      flows: {
        inflow: number | null;
        turbine: {
          pb01: number | null;
          pb02: number | null;
          pb03: number | null;
          total: number; // Should be a number
        };
        ddc: number | null;
        spillway: {
          g1: number | null;
          g2: number | null;
          g3: number | null;
          g4: number | null;
          total: number; // Should be a number
        };
      };
      levels: {
        sediment: number | null;
        elevation: number | null;
        waterDepth : number | null;
        waterDepthCalc : number | null;
      };
      additionalData: {
        inflow1h: number | null;
      };
    };
    garungArr: {
      day: number | null;
      realTime: number | null;
    };
    mricaArr: {
      perDay: number | null;
      realTime: number | null;
    };
    singomertoArr: {
      perDay: number | null;
      realTime: number | null;
    };
    tulisArr: {
      perDay: number | null;
      realTime: number | null;
    };
    stations: {
      garungUnit1: number| null,
              garungUnit2: number | null,
              gunungWugul1: number | null,
              gunungWugul2: number | null,
              gunungWugulHead: number | null,
              jelokNetto1: number | null,
              jelokNetto2: number | null,
              jelokNetto3: number | null,
              jelokNetto4: number | null,
              kedungomboUnit: number | null,
              kedungomboLevel: number | null,
              ketengerBruto: number | null,
              ketengerActivePower: number | null,
              ketengerRealPowerU3: number | null,
              ketengerScaledU4: number | null,
              klambuActivePower: number | null,
              klambuWaterLevel: number | null,
              pejengkolanMeter: number | null,
              plumbunganAI: number | null,
              semporActualMW: number | null,
              sidorejoActivePower: number | null,
              sidorejoWaterLevel: number | null,
              sitekiAI: number | null,
              tapenActivePower: number | null,
              tapenWaterLevel: number | null,
              timoNetto1: number | null,
              timoNetto2: number | null,
              timoNetto3: number | null,
              tulisActivePowerU1: number | null,
              tulisActivePowerU2: number | null,
              wadaslintangRealPowerTotal: number | null,
              wadaslintangRealPower: number | null,
              wonogiriGenPowerU1: number | null,
              wonogiriGenPowerU2: number | null,
    }
    lastUpdate: string | null;
  }

  export interface WeatherData {
    humidity: {
      min: number | null;
      max: number | null;
      avg: number | null;
      act: number | null;
      absAct: number | null;
    };
    windSpeed: {
      min: number | null;
      max: number | null;
      kmh: number | null;
      avg: number | null;
      act: number | null;
    };
    evaporation: {
      temp: number | null;
      kPan: number | null;
      eTo: number | null;
      waterLevelEvap: number | null;
    };
    airTemperature: {
      min: number | null;
      max: number | null;
      avg: number | null;
      act: number | null;
    };
    radiation: {
      min: number | null;
      max: number | null;
      avg: number | null;
      act: number | null;
    };
    airPressure: {
      min: number | null;
      max: number | null;
      avg: number | null;
      act: number | null;
    };
  }
  
  export interface UseAwsNodeDataReturn {
    data: NodeResponse | null;
    error: string | null;
    weather: WeatherData;
    lastUpdate: string | null;
  }