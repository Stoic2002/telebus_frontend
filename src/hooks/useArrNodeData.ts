// hooks/useNodeData.ts

import { useState, useEffect } from 'react';
import { NodeResponse, UseNodeDataProps, UseNodeDataReturn } from '@/types/nodeTypes';
import arrService from '@/services/allNode/arrServices';

export const useArrNodeData = ({ interval = 30000 }: UseNodeDataProps = {}): UseNodeDataReturn => {
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
    stations: {
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
        const response = await arrService.getAllNodes();
        setData(response);
        setError(null);

        const soedirman = {
          activeLoads: {
            pb01: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB01.ACTIVE_LOAD", response),
            pb02: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB02.ACTIVE_LOAD", response),
            pb03: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB03.ACTIVE_LOAD", response),
            total: 0 // Placeholder
          },
          flows: {
            inflow: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00.inflow_waduk", response),
            turbine: {
              pb01: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB01.flow_turbin", response),
              pb02: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB02.flow_turbin", response),
              pb03: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB03.flow_turbin", response),
              total: 0 // Placeholder
            },
            ddc: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00.flow_ddc", response),
            spillway: {
              g1: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G1", response),
              g2: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G2", response),
              g3: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G3", response),
              g4: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G4", response),
              total: 0 // Placeholder
            }
          },
          levels: {
            sediment: arrService.getNodeValueById("ns=2;s=MRC_TELEMETERING.ARR.Level_Sedimen", response),
            elevation: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.ELV", response),
            waterDepth: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR1.water_depth', response),
            waterDepthCalc: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.Water_Depth_Calc', response)
          },
          additionalData: {
            inflow1h: arrService.getNodeValueById("ns=2;s=MRC_TCP.PB00SW.INFLOW_1H", response)
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
            day: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST03_DAY', response),
            realTime: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST03_RT', response)
          },
          mricaArr: {
            perDay: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_PERDAY', response),
            realTime: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_REALTIME', response)
          },
          singomertoArr: {
            perDay: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST01_DAY', response),
            realTime: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST01_RT', response)
          },
          tulisArr: {
            perDay: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST02_DAY', response),
            realTime: arrService.getNodeValueById('ns=2;s=MRC_TELEMETERING.ARR.ARR_ST02_RT', response)
          },
          stations: {
            garungUnit1: arrService.getNodeValueById('ns=2;s=MRC_TCP.GR01.UNIT_1_ACTUAL_MW_TRANSDUCER', response),
            garungUnit2: arrService.getNodeValueById('ns=2;s=MRC_TCP.GR02.UNIT1_ACTUAL_MW_TRANSDUCER', response),
            gunungWugul1: arrService.getNodeValueById('ns=2;s=MRC_S7.GW01.ACTIVE_POWER', response),
            gunungWugul2: arrService.getNodeValueById('ns=2;s=MRC_S7.GW02.ACTIVE_POWER', response),
            gunungWugulHead: arrService.getNodeValueById('ns=2;s=MRC_S7.GW00.Head_Water', response),
            jelokNetto1: arrService.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO1.kW', response),
            jelokNetto2: arrService.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO2.kW', response),
            jelokNetto3: arrService.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO3.kW', response),
            jelokNetto4: arrService.getNodeValueById('ns=2;s=MRC_KWH.JL_NETTO4.kW', response),
            kedungomboUnit: arrService.getNodeValueById('ns=2;s=MRC_GE.KD01.UNIT ACTIVE POWER', response),
            kedungomboLevel: arrService.getNodeValueById('ns=2;s=MRC_GE.KD01.KEDUNG OMBO WATER LEVEL', response),
            ketengerActivePower: arrService.getNodeValueById('ns=2;s=MRC_TCP.KT01.U1_AI_ACTIVE_POWER', response),
            ketengerBruto: arrService.getNodeValueById('ns=2;s=MRC_KWH.KT_BRUTO2.kW', response),
            ketengerRealPowerU3: arrService.getNodeValueById('ns=2;s=MRC_TCP.KT03.Real_Power_Total_U3', response),
            ketengerScaledU4: arrService.getNodeValueById('ns=2;s=MRC_TCP.KT04.kW_tot_scaled_U4', response),
            klambuActivePower: arrService.getNodeValueById('ns=2;s=MRC_TCP.KL01.KLB_AI_ACTIVE_POWER_MW', response),
            klambuWaterLevel: arrService.getNodeValueById('ns=2;s=MRC_TCP.KL01.KLB_AO_WATER_LEVEL_DISPLAY', response),
            pejengkolanMeter: arrService.getNodeValueById('ns=2;s=MRC_TCP.PJ01.A40004_METER_KW', response),
            plumbunganAI: arrService.getNodeValueById('ns=2;s=MRC_TCP.PU01.AI_MW', response),
            semporActualMW: arrService.getNodeValueById('ns=2;s=MRC_TCP.SP01.Actual_MW', response),
            sidorejoActivePower: arrService.getNodeValueById('ns=2;s=MRC_TCP.SD01.AI_ACTIVE_POWER_MW', response),
            sidorejoWaterLevel: arrService.getNodeValueById('ns=2;s=MRC_TCP.SD01.AO_WATER_LEVEL_DISPLAY', response),
            sitekiAI: arrService.getNodeValueById('ns=2;s=MRC_TCP.SK01.AI_MW_STK', response),
            tapenActivePower: arrService.getNodeValueById('ns=2;s=MRC_TCP.TP01.A41303_power_active_total', response),
            tapenWaterLevel: arrService.getNodeValueById('ns=2;s=MRC_TCP.TP01.A30043_downstream_water_level', response),
            timoNetto1: arrService.getNodeValueById('ns=2;s=MRC_KWH.TM_NETTO1.kW', response),
            timoNetto2: arrService.getNodeValueById('ns=2;s=MRC_KWH.TM_NETTO2.kW', response),
            timoNetto3: arrService.getNodeValueById('ns=2;s=MRC_KWH.TM_NETTO3.kW', response),
            tulisActivePowerU1: arrService.getNodeValueById('ns=2;s=MRC_TCP.TL01.tls_u1_gen_active_power', response),
            tulisActivePowerU2: arrService.getNodeValueById('ns=2;s=MRC_TCP.TL02.tls_u2_gen_active_power', response),
            wadaslintangRealPowerTotal: arrService.getNodeValueById('ns=2;s=MRC_TCP.WD01.Real_Power_TOTAL', response),
            wadaslintangRealPower: arrService.getNodeValueById('ns=2;s=MRC_TCP.WD02.Real_Power', response),
            wonogiriGenPowerU1: arrService.getNodeValueById('ns=2;s=MRC_TCP.WG01.WNG_U1_GEN_POWER_ACTIVE', response),
            wonogiriGenPowerU2: arrService.getNodeValueById('ns=2;s=MRC_TCP.WG02.WNG_U2_GEN_POWER_ACTIVE', response),
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

export default useArrNodeData