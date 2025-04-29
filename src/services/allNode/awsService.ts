import { DataValue, NodeResponse } from "@/types/nodeTypes";

// Weather-specific node IDs
const nodeIds = [
  // Evaporation
  'ns=2;s=MRC_TELEMETERING.Evap_ETo',
  'ns=2;s=MRC_TELEMETERING.Evap_Temp',
  // Humidity
  'ns=2;s=MRC_TELEMETERING.RH_Act',
  // Air Pressure
  'ns=2;s=MRC_TELEMETERING.AirPress_Act',
  // Radiation
  'ns=2;s=MRC_TELEMETERING.G_Rad_Act',
  // Air Temperature
  'ns=2;s=MRC_TELEMETERING.Air_Temp_Act',
  // Wind Speed
  'ns=2;s=MRC_TELEMETERING.Wind_Speed_Act',
];

export class AwsService {
  private static readonly API_URL = 'http://192.168.105.90/readOPCTags';

  /**
   * Fetches weather node data from the API
   * @returns Promise<NodeResponse>
   */
  static async getWeatherData(): Promise<NodeResponse> {
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
      console.error('Error fetching weather data:', error);
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
   * Gets the evaporation ETo value
   * @param data - The full node response data
   * @returns The evaporation ETo value or null if not found
   */
  static getEvapETo(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.Evap_ETo', data);
  }

  /**
   * Gets the evaporation temperature value
   * @param data - The full node response data
   * @returns The evaporation temperature value or null if not found
   */
  static getEvapTemp(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.Evap_Temp', data);
  }

  /**
   * Gets the relative humidity actual value
   * @param data - The full node response data
   * @returns The relative humidity actual value or null if not found
   */
  static getHumidityActual(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.RH_Act', data);
  }

  /**
   * Gets the air pressure actual value
   * @param data - The full node response data
   * @returns The air pressure actual value or null if not found
   */
  static getAirPressureActual(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.AirPress_Act', data);
  }

  /**
   * Gets the radiation actual value
   * @param data - The full node response data
   * @returns The radiation actual value or null if not found
   */
  static getRadiationActual(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.G_Rad_Act', data);
  }

  /**
   * Gets the air temperature actual value
   * @param data - The full node response data
   * @returns The air temperature actual value or null if not found
   */
  static getAirTempActual(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.Air_Temp_Act', data);
  }

  /**
   * Gets the wind speed actual value
   * @param data - The full node response data
   * @returns The wind speed actual value or null if not found
   */
  static getWindSpeedActual(data: NodeResponse): number | null {
    return this.getNodeValueById('ns=2;s=MRC_TELEMETERING.Wind_Speed_Act', data);
  }

  /**
   * Gets all weather metrics as a structured object
   * @param data - The full node response data
   * @returns Object containing all weather metrics
   */
  static getAllWeatherMetrics(data: NodeResponse): {
    evaporation: { evapoTranspiration: number | null, temperature: number | null },
    humidity: { actual: number | null },
    airPressure: { actual: number | null },
    radiation: { actual: number | null },
    airTemperature: { actual: number | null },
    windSpeed: { actual: number | null },
    lastUpdate: string | null
  } {
    return {
      evaporation: {
        evapoTranspiration: this.getEvapETo(data),
        temperature: this.getEvapTemp(data)
      },
      humidity: {
        actual: this.getHumidityActual(data)
      },
      airPressure: {
        actual: this.getAirPressureActual(data)
      },
      radiation: {
        actual: this.getRadiationActual(data)
      },
      airTemperature: {
        actual: this.getAirTempActual(data)
      },
      windSpeed: {
        actual: this.getWindSpeedActual(data)
      },
      lastUpdate: data.data.dataValues[0]?.sourceTimestamp
        ? new Date(data.data.dataValues[0].sourceTimestamp).toLocaleString()
        : null
    };
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

export default AwsService;