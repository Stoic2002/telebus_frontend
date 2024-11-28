import { API_BASE_URL_OPC } from '@/constants/apiKey';
import { SensorValueResponse } from '../../types/sensorTypes';


export const fetchKedungomboWaterLevel = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL_OPC}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_GE.KD01.KEDUNG OMBO WATER LEVEL' }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: SensorValueResponse = await response.json();
    
    if (!data?.data || !data.data.value || typeof data.data.value.value !== 'number') {
        throw new Error('Invalid response structure');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching water level value:', error);
    throw error;
  }
};
