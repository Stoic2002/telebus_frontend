import { API_BASE_URL_AWLR } from "@/constants/apiKey";
import { AWLRData, AWLRPerHourData } from "@/types/awlrTypes";

// Kelas untuk mengelola service AWLR
export class AWLRService {
    // Mendapatkan semua data AWLR
    async getAllAWLRData(): Promise<AWLRData[]> {
        try {
            const response = await fetch(`${API_BASE_URL_AWLR}/db-awlr`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data as AWLRData[];
        } catch (error) {
            console.error('Error fetching AWLR data:', error);
            throw error;
        }
    }

    async  getLatestAWLRById(sensorId: number): Promise<AWLRPerHourData | null> {
        try {
          const response = await fetch(`${API_BASE_URL_AWLR}/db-awlr-hour`);
          const data: AWLRPerHourData[] = await response.json();
          
          // Filter berdasarkan sensor ID dan ambil data terbaru
          const latestData = data
            .filter(item => item.id_sensor_tide === sensorId)
            .sort((a, b) => new Date(b.kWaktu).getTime() - new Date(a.kWaktu).getTime())[0];
          
          return latestData;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }

    // Mendapatkan data AWLR berdasarkan ID sensor
    async getAWLRById(sensorId: number): Promise<AWLRData | null> {
        try {
            const allData = await this.getAllAWLRData();
            return allData.find(data => data.id_sensor_tide === sensorId) || null;
        } catch (error) {
            console.error(`Error fetching AWLR data for sensor ${sensorId}:`, error);
            throw error;
        }
    }

    // Mendapatkan status alert berdasarkan water level
    getAlertStatus(waterLevel: number, alertWaspada: number, alertAwas: number): string {
        if (waterLevel >= alertAwas) {
            return 'AWAS';
        } else if (waterLevel >= alertWaspada) {
            return 'WASPADA';
        }
        return 'NORMAL';
    }

    // Mendapatkan semua sensor yang dalam status waspada atau awas
    async getAlertingSensors(): Promise<AWLRData[]> {
        try {
            const allData = await this.getAllAWLRData();
            return allData.filter(data => data.alert_status > 0);
        } catch (error) {
            console.error('Error fetching alerting sensors:', error);
            throw error;
        }
    }

    // Mendapatkan data sensor berdasarkan nama sungai
    async getSensorByRiver(riverName: string): Promise<AWLRData | null> {
        try {
            const allData = await this.getAllAWLRData();
            return allData.find(data => 
                data.nama_sensor.toLowerCase().includes(riverName.toLowerCase())
            ) || null;
        } catch (error) {
            console.error(`Error fetching data for river ${riverName}:`, error);
            throw error;
        }
    }

    // Mendapatkan ringkasan status semua sensor
    async getSensorsSummary(): Promise<{
        total: number,
        alerting: number,
        normal: number,
        offline: number
    }> {
        try {
            const allData = await this.getAllAWLRData();
            return {
                total: allData.length,
                alerting: allData.filter(data => data.alert_status > 0).length,
                normal: allData.filter(data => data.alert_status === 0).length,
                offline: allData.filter(data => data.battery === 0).length
            };
        } catch (error) {
            console.error('Error generating sensors summary:', error);
            throw error;
        }
    }
}
