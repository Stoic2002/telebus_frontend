import { SensorValueResponse } from '../../types/sensorTypes';

const API_BASE_URL = 'http://192.168.105.75';

export const fetchKetengerWaterLevel = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_TCP.KT03.Water_Level_KTH_U3' }),
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
export const fetchKetengerWaterLevelTrailrace = async (): Promise<SensorValueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readOPCTag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeId: 'ns=2;s=MRC_TCP.KT04.tailrace_water_level_U4' }),
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
