import { DataValue, NodeResponse } from "@/types/nodeTypes";

const nodeIds = [
    //  //garung
    //  'ns=2;s=MRC_TCP.GR01.UNIT_1_ACTUAL_MW_TRANSDUCER',
    //  'ns=2;s=MRC_TCP.GR02.UNIT1_ACTUAL_MW_TRANSDUCER' ,
    //  //gunung wugul
    //  'ns=2;s=MRC_S7.GW01.ACTIVE_POWER',
    //  'ns=2;s=MRC_S7.GW02.ACTIVE_POWER',
    //  'ns=2;s=MRC_S7.GW00.Head_Water',
    //  //jelok
    //  'ns=2;s=MRC_KWH.JL_NETTO1.kW',
    //  'ns=2;s=MRC_KWH.JL_NETTO2.kW',
    //  'ns=2;s=MRC_KWH.JL_NETTO3.kW',
    //  'ns=2;s=MRC_KWH.JL_NETTO4.kW',
    //  //kedungombo
    //  'ns=2;s=MRC_GE.KD01.UNIT ACTIVE POWER',
    //  'ns=2;s=MRC_GE.KD01.KEDUNG OMBO WATER LEVEL',
    //  //ketenger
    //  'ns=2;s=MRC_KWH.KT_BRUTO2.kW',
    //  'ns=2;s=MRC_TCP.KT03.Real_Power_Total_U3',
    //  'ns=2;s=MRC_TCP.KT04.kW_tot_scaled_U4',
    //  //klambu
    //  'ns=2;s=MRC_TCP.KL01.KLB_AI_ACTIVE_POWER_MW',
    //  'ns=2;s=MRC_TCP.KL01.KLB_AO_WATER_LEVEL_DISPLAY',
    //  //pejengkolan
    //  'ns=2;s=MRC_TCP.PJ01.A40004_METER_KW',
    //  //plumbungan
    //  'ns=2;s=MRC_TCP.PU01.AI_MW',
    //  //sempor
    // 'ns=2;s=MRC_TCP.SP01.Actual_MW',
    // //sidorejo
    // 'ns=2;s=MRC_TCP.SD01.AI_ACTIVE_POWER_MW',
    // 'ns=2;s=MRC_TCP.SD01.AO_WATER_LEVEL_DISPLAY',
    // //siteki
    // 'ns=2;s=MRC_TCP.SK01.AI_MW_STK',
    // //tapen
    // 'ns=2;s=MRC_TCP.TP01.A41303_power_active_total',
    // 'ns=2;s=MRC_TCP.TP01.A30043_downstream_water_level',
    //timo
    'ns=2;s=MRC_KWH.TM_NETTO1.kW',
    'ns=2;s=MRC_KWH.TM_NETTO2.kW',
    'ns=2;s=MRC_KWH.TM_NETTO3.kW',
    //tulis
    'ns=2;s=MRC_TCP.TL01.tls_u1_gen_active_power',
    'ns=2;s=MRC_TCP.TL02.tls_u2_gen_active_power',
    //wadaslintang
    'ns=2;s=MRC_TCP.WD01.Real_Power_TOTAL',
    'ns=2;s=MRC_TCP.WD02.Real_Power',
    //wonogiri
    'ns=2;s=MRC_TCP.WG01.WNG_U1_GEN_POWER_ACTIVE',
    'ns=2;s=MRC_TCP.WG02.WNG_U2_GEN_POWER_ACTIVE',

]   

// services/allNode/allNode.ts
  
  
  export class Stations4Service {
    private static readonly API_URL = 'http://192.168.105.90/readOPCTags';
  
    /**
     * Fetches all node data from the API
     * @returns Promise<NodeResponse>
     */
    static async getAllNodes(): Promise<NodeResponse> {
      try {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodeIds: nodeIds
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching node data:', error);
        throw error;
      }
    }
  
    /**
     * Gets a specific node value by its ID
     * @param nodeId - The ID of the node to find
     * @param data - The full node response data
     * @returns The value of the specified node or null if not found
     */
    static getNodeValueById(nodeId: string, data: NodeResponse): number | null {
      const nodeIndex = data.data.nodeIds.indexOf(nodeId);
      if (nodeIndex === -1) return null;
      
      return data.data.dataValues[nodeIndex].value.value;
    }
  
    /**
     * Formats the timestamp from a data value
     * @param dataValue - The data value containing timestamp information
     * @returns Formatted timestamp string
     */
    static formatTimestamp(dataValue: DataValue): string {
      return new Date(dataValue.sourceTimestamp).toLocaleString();
    }
  }
  
  export default Stations4Service;

