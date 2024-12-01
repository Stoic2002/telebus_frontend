import { useState, useEffect } from 'react';
import { NodeResponse } from '@/types/nodeTypes';
import stations4Service from '@/services/allNode/stations4Service';

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
    stations4: {
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

export const useStationsNodeData = ({ interval = 30000 }: UseNodeDataProps = {}): UseNodeDataReturn => {
  const [data, setData] = useState<NodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formattedData, setFormattedData] = useState<Omit<UseNodeDataReturn, 'data' | 'error'>>({
    soedirman: {
      activeLoads: {
        pb01: null,
        pb02: null,
        pb03: null,
        total: 0
      },
      flows: {
        inflow: null,
        turbine: {
          pb01: null,
          pb02: null,
          pb03: null,
          total: 0
        },
        ddc: null,
        spillway: {
          g1: null,
          g2: null,
          g3: null,
          g4: null,
          total: 0
        }
      },
      levels: {
        sediment: null,
        elevation: null,
        waterDepth :  null,
      waterDepthCalc : null
      },
      additionalData: {
        inflow1h: null
      }
    },
    garungArr: {
      day: null,
      realTime: null
    },
    mricaArr: {
      perDay: null,
      realTime: null
    },
    singomertoArr:{
        perDay: null,
        realTime:null
    },
    tulisArr:{
        perDay: null,
        realTime:null
    },
    stations4: {
         garungUnit1: null,
            garungUnit2: null,
            gunungWugul1: null,
            gunungWugul2: null,
            gunungWugulHead: null,
            jelokNetto1: null,
            jelokNetto2: null,
            jelokNetto3: null,
            jelokNetto4: null,
            kedungomboUnit: null,
            kedungomboLevel: null,
            ketengerActivePower: null,
            ketengerBruto: null,
            ketengerRealPowerU3: null,
            ketengerScaledU4: null,
            klambuActivePower: null,
            klambuWaterLevel: null,
            pejengkolanMeter: null,
            plumbunganAI: null,
            semporActualMW: null,
            sidorejoActivePower: null,
            sidorejoWaterLevel: null,
            sitekiAI: null,
            tapenActivePower: null,
            tapenWaterLevel: null,
            timoNetto1: null,
            timoNetto2: null,
            timoNetto3: null,
            tulisActivePowerU1: null,
            tulisActivePowerU2: null,
            wadaslintangRealPowerTotal: null,
            wadaslintangRealPower: null,
            wonogiriGenPowerU1: null,
            wonogiriGenPowerU2: null,
    },
    lastUpdate: null
  });

  const calculateTotal = (values: (number | null)[]): number => {
    return values.filter((value): value is number => value !== null).reduce((sum, current) => sum + current, 0);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stations4Service.getAllNodes();
        setData(response);
        setError(null);

        const soedirman = {
          activeLoads: {
            pb01: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB01.ACTIVE_LOAD", response),
            pb02: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB02.ACTIVE_LOAD", response),
            pb03: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB03.ACTIVE_LOAD", response),
            total: 0 // Placeholder
          },
          flows: {
            inflow: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00.inflow_waduk", response),
            turbine: {
              pb01: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB01.flow_turbin", response),
              pb02: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB02.flow_turbin", response),
              pb03: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB03.flow_turbin", response),
              total: 0 // Placeholder
            },
            ddc: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00.flow_ddc", response),
            spillway: {
              g1: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G1", response),
              g2: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G2", response),
              g3: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G3", response),
              g4: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G4", response),
              total: 0 // Placeholder
            }
          },
          levels: {
            sediment: stations4Service.getNodeValueById("ns=2;s=MRC_TELEMETERING.ARR.Level_Sedimen", response),
            elevation: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.ELV", response),
            waterDepth: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR1.water_depth', response),
            waterDepthCalc: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.Water_Depth_Calc', response)
          },
          additionalData: {
            inflow1h: stations4Service.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.INFLOW_1H", response)
          }
        };

        // Calculate totals for Soedirman data
        soedirman.activeLoads.total = calculateTotal([
          soedirman.activeLoads.pb01,
          soedirman.activeLoads.pb02,
          soedirman.activeLoads.pb03
        ]);
        soedirman.flows.turbine.total = calculateTotal([
          soedirman.flows.turbine.pb01,
          soedirman.flows.turbine.pb02,
          soedirman.flows.turbine.pb03
        ]);
        soedirman.flows.spillway.total = calculateTotal([
          soedirman.flows.spillway.g1,
          soedirman.flows.spillway.g2,
          soedirman.flows.spillway.g3,
          soedirman.flows.spillway.g4
        ]);
     
     

        const newFormattedData = {
          soedirman,
          garungArr: {
            day: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST03_DAY', response),
            realTime: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST03_RT', response)
          },
          mricaArr: {
            perDay: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_PERDAY', response),
            realTime: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_REALTIME', response)
          },
          singomertoArr: {
            perDay: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST01_DAY', response),
            realTime: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST01_RT', response)
          },
          tulisArr: {
            perDay: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST02_DAY', response),
            realTime: stations4Service.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST02_RT', response)
          },
          stations4: {
            garungUnit1: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.GR01.UNIT_1_ACTUAL_MW_TRANSDUCER', response),
            garungUnit2: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.GR02.UNIT1_ACTUAL_MW_TRANSDUCER', response),
            gunungWugul1: stations4Service.getNodeValueById('ns=2;s=MRC_S7.GW01.ACTIVE_POWER', response),
            gunungWugul2: stations4Service.getNodeValueById('ns=2;s=MRC_S7.GW02.ACTIVE_POWER', response),
            gunungWugulHead: stations4Service.getNodeValueById('ns=2;s=MRC_S7.GW00.Head_Water', response),
            jelokNetto1: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO1.kW', response),
            jelokNetto2: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO2.kW', response),
            jelokNetto3: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO3.kW', response),
            jelokNetto4: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO4.kW', response),
            kedungomboUnit: stations4Service.getNodeValueById('ns=2;s=MRC_GE.KD01.UNIT ACTIVE POWER', response),
            kedungomboLevel: stations4Service.getNodeValueById('ns=2;s=MRC_GE.KD01.KEDUNG OMBO WATER LEVEL', response),
            ketengerActivePower: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.KT01.U1_AI_ACTIVE_POWER', response),
            ketengerBruto: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.KT_BRUTO2.kW', response),
            ketengerRealPowerU3: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.KT03.Real_Power_Total_U3', response),
            ketengerScaledU4: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.KT04.kW_tot_scaled_U4', response),
            klambuActivePower: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.KL01.KLB_AI_ACTIVE_POWER_MW', response),
            klambuWaterLevel: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.KL01.KLB_AO_WATER_LEVEL_DISPLAY', response),
            pejengkolanMeter: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.PJ01.A40004_METER_KW', response),
            plumbunganAI: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.PU01.AI_MW', response),
            semporActualMW: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.SP01.Actual_MW', response),
            sidorejoActivePower: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.SD01.AI_ACTIVE_POWER_MW', response),
            sidorejoWaterLevel: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.SD01.AO_WATER_LEVEL_DISPLAY', response),
            sitekiAI: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.SK01.AI_MW_STK', response),
            tapenActivePower: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.TP01.A41303_power_active_total', response),
            tapenWaterLevel: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.TP01.A30043_downstream_water_level', response),
            timoNetto1: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.TM_NETTO1.kW', response),
            timoNetto2: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.TM_NETTO2.kW', response),
            timoNetto3: stations4Service.getNodeValueById('ns=2;s=MRC_KWH.TM_NETTO3.kW', response),
            tulisActivePowerU1: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.TL01.tls_u1_gen_active_power', response),
            tulisActivePowerU2: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.TL02.tls_u2_gen_active_power', response),
            wadaslintangRealPowerTotal: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.WD01.Real_Power_TOTAL', response),
            wadaslintangRealPower: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.WD02.Real_Power', response),
            wonogiriGenPowerU1: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.WG01.WNG_U1_GEN_POWER_ACTIVE', response),
            wonogiriGenPowerU2: stations4Service.getNodeValueById('ns=2;s=MRC_TCP.WG02.WNG_U2_GEN_POWER_ACTIVE', response),
          },
          lastUpdate: response.data.dataValues[0]?.sourceTimestamp
            ? new Date(response.data.dataValues[0].sourceTimestamp).toLocaleString()
            : null
        };

        setFormattedData(newFormattedData);
      } catch (err) {
        console.error('Error fetching node data:', err);
        setError('Failed to fetch node data');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    data,
    error,
    ...formattedData
  };
};

export default useStationsNodeData