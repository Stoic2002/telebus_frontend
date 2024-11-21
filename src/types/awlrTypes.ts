export interface AWLRData {
    id_sensor_tide: number;
    nama_sensor: string;
    kWaktu: string;
    water_level: number;
    battery: number;
    debit: number;
    alert_status: number;
    alert_waspada: number;
    alert_awas: number;
    id_tide_alert_history: number;
    Latitude: number;
    Longitude: number;
    popup_info: string;
    jarak: string;
    estimasi_jarak: string;
    alert_data_diterima: number;
    report: string;
    created_by: number | null;
    date_created: string | null;
    modified_by: number | null;
    date_modified: string | null;
}

export interface AWLRPerHourData {
    id_sensor_tide_jam: number;
    id_sensor_tide: number;
    kWaktu: string;
    water_level: number;
    battery: number;
    debit: number;
    month: number;
    created_by: string;
    date_created: string;
  }
export interface AWLRPerHourData2 {
    id: number;
    name: string;
    value: number;
    timestamp: string;
  }