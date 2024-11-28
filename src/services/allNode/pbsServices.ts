import { DataValue, NodeResponse } from "@/types/nodeTypes";

const nodeIds = [
    // //soedirman pbs
    "ns=2;s=MRC_TCP.PB01.ACTIVE_LOAD",
     "ns=2;s=MRC_TCP.PB02.ACTIVE_LOAD", 
     "ns=2;s=MRC_TCP.PB03.ACTIVE_LOAD",
     "ns=2;s=MRC_TCP.PB00.inflow_waduk",
     "ns=2;s=MRC_TELEMETERING.ARR.Level_Sedimen",
      "ns=2;s=MRC_TCP.PB00SW.ELV",
      "ns=2;s=MRC_TCP.PB01.flow_turbin",
      "ns=2;s=MRC_TCP.PB02.flow_turbin",
      "ns=2;s=MRC_TCP.PB03.flow_turbin",
       "ns=2;s=MRC_TCP.PB00.flow_ddc",
       "ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G1",
       "ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G2",
       "ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G3",
       "ns=2;s=MRC_TCP.PB00SW.FLOW_SPW_G4",
       'ns=2;s=MRC_TCP.PB00SW.INFLOW_1H',
       'ns=2;s=MRC_TELEMETERING.ARR1.water_depth',
       'ns=2;s=MRC_TELEMETERING.ARR.Water_Depth_Calc',

]   

// services/allNode/allNode.ts
  
  
  export class pbsService {
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
  
  export default pbsService;

