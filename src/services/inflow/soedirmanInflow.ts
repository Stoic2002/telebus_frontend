import { API_BASE_URL_OPC } from '@/constants/apiKey';
import { SensorValueResponse } from '../../types/sensorTypes';


export const fetchSoedirmanInflowPerHour = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL_OPC}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_TCP.PB00SW.INFLOW_1H' }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: SensorValueResponse = await response.json();
    
    if (!data|| typeof data.data.value.value !== 'number') {
        throw new Error('Invalid response structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching inflow value:', error);
    throw error;
  }
};
export const fetchSoedirmanInflowPerSec = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL_OPC}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_TCP.PB00.inflow_waduk' }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: SensorValueResponse = await response.json();
    
    if (!data || typeof data.data.value.value !== 'number') {
        throw new Error('Invalid response structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching inflow value:', error);
    throw error;
  }
};
