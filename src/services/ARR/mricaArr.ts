import { SensorValueResponse } from '../../types/sensorTypes';

const API_BASE_URL = 'http://192.168.105.75';

export const fetchMricaArrPerDay = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_PERDAY' }),
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
    console.error('Error fetching load value:', error);
    throw error;
  }
};
export const fetchMricaArrPerSec = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_TELEMETERING.ARR.ARR_GI_REALTIME' }),
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
    console.error('Error fetching load value:', error);
    throw error;
  }
};
