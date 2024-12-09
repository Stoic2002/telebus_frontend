// src/services/pLast24HDataService.ts
import { RawLast24HDataItem, TransformedLast24HData } from '@/types/machineLearningTypes';
import axios from 'axios';


export const last24HDataService = {
  async fetchLast24HData(): Promise<TransformedLast24HData[]> {
    try {
      const response = await axios.get('http://192.168.105.90/data-combined-24-h');
      console.log('Data fetched:', response.data);
      return this.transformData(response.data);
    } catch (error) {
      console.error('Error fetching PBS data:', error);
      throw error;
    }
  },

  transformData(rawData: RawLast24HDataItem[]): TransformedLast24HData[] {
    // Create a map to store hourly data
    const hourlyDataMap = new Map<string, TransformedLast24HData>();

    // Process each data item
    rawData.forEach(item => {
      // Extract hour from timestamp
      const hourKey = item.timestamp.slice(0, 13); // YYYY-MM-DD HH:00

      // Initialize hourly data if not exists
      if (!hourlyDataMap.has(hourKey)) {
        hourlyDataMap.set(hourKey, {
          INFLOW: 0,
          OUTFLOW: 0,
          TMA: 0,
          BEBAN: 0,
          datetime: hourKey
        });
      }

      // Get the existing or newly created hourly data
      const hourlyData = hourlyDataMap.get(hourKey)!;

      // Update data based on source table
      switch(item.source_table) {
        case 'pbs_inflow_h':
          hourlyData.INFLOW = parseFloat(parseFloat(item.value).toFixed(2));
          break;
        case 'pbs_outflow_h':
          hourlyData.OUTFLOW = parseFloat(parseFloat(item.value).toFixed(2));
          break;
        case 'pbs_tma_h':
          hourlyData.TMA = parseFloat(parseFloat(item.value).toFixed(2));
          break;
        case 'pbs_beban':
          // Sum all BEBAN values for the hour
          hourlyData.BEBAN += parseFloat(parseFloat(item.value).toFixed(2));
          break;
      }
    });

    // Convert map to sorted array
    return Array.from(hourlyDataMap.values())
      .sort((a, b) => a.datetime.localeCompare(b.datetime));
  }
};

