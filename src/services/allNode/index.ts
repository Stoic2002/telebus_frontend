// Node Services Index
export { default as StationsService } from './stationsService';
export { default as Stations2Service } from './station2Service';
export { default as Stations3Service } from './stations3Service';
export { default as Stations4Service } from './stations4Service';
export { default as PbsService } from './pbsServices';
export { default as ArrService } from './arrServices';
export { default as AwsService } from './awsService';
export { default as NodeBatch1Service } from './nodeBatch1';

// Common base service class for all node services
export abstract class BaseNodeService {
  protected static readonly BASE_API_URL = 'http://192.168.105.90';
  protected static readonly OPC_ENDPOINT = '/readOPCTags';
  
  protected static async makeOPCRequest(nodeIds: string[]) {
    try {
      const response = await fetch(`${this.BASE_API_URL}${this.OPC_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching OPC node data:', error);
      throw error;
    }
  }
  
  protected static getNodeValueById(nodeId: string, data: any): number | null {
    const nodeIndex = data.data.nodeIds.indexOf(nodeId);
    if (nodeIndex === -1) return null;
    
    return data.data.dataValues[nodeIndex].value.value;
  }
  
  protected static formatTimestamp(dataValue: any): string {
    return new Date(dataValue.sourceTimestamp).toLocaleString();
  }
} 