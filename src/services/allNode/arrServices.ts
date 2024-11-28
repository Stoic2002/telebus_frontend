import { DataValue, NodeResponse } from "@/types/nodeTypes";

const nodeIds = [
    //garungArr
    'ns=2;s=MRC_TELEMETERING.ARR.ARR_ST03_DAY',
    'ns=2;s=MRC_TELEMETERING.ARR.ARR_ST03_RT',
    //mricaArr
    'ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_PERDAY',
    'ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_REALTIME',
    //singomerto
     'ns=2;s=MRC_TELEMETERING.ARR.ARR_ST01_DAY',
     'ns=2;s=MRC_TELEMETERING.ARR.ARR_ST01_RT',
     //tulis
     'ns=2;s=MRC_TELEMETERING.ARR.ARR_ST02_DAY',
     'ns=2;s=MRC_TELEMETERING.ARR.ARR_ST02_RT',
]   

  
  export class arrService {
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
  
  export default arrService;

