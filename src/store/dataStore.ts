import { create } from 'zustand';
import { TelemeterData } from '@/types/telemeteringPjtTypes';
import { AWLRData, AWLRPerHourData } from '@/types/awlrTypes';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import axios from 'axios';
import { ApiReportData, RohData } from '@/types/reportTypes';
import { ARRData, BebanData, FormattedData, TrendsInflowData, OutflowData, TMAData } from '@/types/trendsTypes';

interface TmaData {
  tmaValue: number;
  volume: number;
}

interface MonitoringData {
  tmaValue: number;
  volume: number;
  targetElevasi: number | null;
}

interface InflowChartData {
  time: string;
  originalTime: Date;
  serayu: number;
  merawu: number;
  lumajang: number;
}

interface LoadingStates {
  tma: boolean;
  targetElevasi: boolean;
  roh: boolean;
  telemetering: boolean;
  awlr: boolean;
  monitoring: boolean;
  trends: boolean;
  inflowChart: boolean;
}

export interface DataState {
  // TMA data for HomeContent
  tmaData: TmaData;
  targetElevasi: number | null;
  rohData: RohData[];
  
  // Trends data
  trendsData: FormattedData[];
  
  // Inflow chart data
  inflowChartData: InflowChartData[];
  
  // Loading states
  loading: LoadingStates;
  error: string | null;
  
  // Telemetering data
  telemeterData: TelemeterData;
  telemeterError: string | null;
  
  // AWLR data
  awlrData: {
    serayu: AWLRData | null;
    merawu: AWLRData | null;
    lumajang: AWLRData | null;
  };
  awlrPerHourData: {
    serayu: AWLRPerHourData | null;
    merawu: AWLRPerHourData | null;
    lumajang: AWLRPerHourData | null;
  };
  awlrError: string | null;
  
  // Monitoring data
  monitoringData: MonitoringData;
  monitoringError: string | null;
  
  // Active tabs
  activeTab: {
    telemetering: 'waterlevel' | 'rainfall';
    trends: 'trends1' | 'trends2' | 'trends3';
  };
}

export interface DataActions {
  // HomeContent specific actions
  fetchTmaData: () => Promise<void>;
  fetchTargetElevasi: () => Promise<void>;
  fetchRohData: (date: string) => Promise<void>;
  
  // Trends specific actions
  fetchTrendsData: () => Promise<void>;
  
  // InflowChart specific actions
  fetchInflowChartData: () => Promise<void>;
  
  // Telemetering actions
  fetchTelemeterData: () => Promise<void>;
  setActiveTelemeteringTab: (tab: 'waterlevel' | 'rainfall') => void;
  
  // AWLR actions
  fetchAWLRData: () => Promise<void>;
  fetchAWLRDataById: (id: number) => Promise<AWLRData | null>;
  fetchLatestAWLRById: (id: number) => Promise<AWLRPerHourData | null>;
  
  // Monitoring actions
  fetchMonitoringData: () => Promise<void>;
  setTargetElevasi: (elevation: number | null) => void;
  
  // Trends actions
  setActiveTrendsTab: (tab: 'trends1' | 'trends2' | 'trends3') => void;
  
  // General actions
  clearError: () => void;
  clearErrors: () => void;
  reset: () => void;
}

export const useDataStore = create<DataState & DataActions>((set, get) => ({
  // State
  tmaData: {
    tmaValue: 0,
    volume: 0,
  },
  targetElevasi: null,
  rohData: [{
    header: {
      logo: '/assets/ip-mrica-logo.png',
      judul: 'PT. PLN INDONESIA POWER'
    },
    content: {
      hariOrTanggal: '',
      estimasiInflow: 0,
      targetELevasiHariIni: 0,
      volumeTargetELevasiHariIni: 0,
      realisasiElevasi: 0,
      volumeRealisasiElevasi: 0,
      estimasiIrigasi: 0,
      estimasiDdcXTotalJamPembukaan: 0,
      ddcJam: 0,
      estimasiSpillwayTotalJamPembukaan: 0,
      spillwayJam: 0,
      totalOutflow: 0,
      estimasiVolumeWaduk: 0,
      estimasiOutflow: 0,
      estimasiElevasiWadukSetelahOperasi: 0,
      estimasiVolumeWadukSetelahOperasi: 0,
      totalDaya: 0
    }
  }],
  
  trendsData: [],
  inflowChartData: [],
  
  loading: {
    tma: false,
    targetElevasi: false,
    roh: false,
    telemetering: false,
    awlr: false,
    monitoring: false,
    trends: false,
    inflowChart: false,
  },
  error: null,
  
  telemeterData: {},
  telemeterError: null,
  
  awlrData: {
    serayu: null,
    merawu: null,
    lumajang: null,
  },
  awlrPerHourData: {
    serayu: null,
    merawu: null,
    lumajang: null,
  },
  awlrError: null,
  
  monitoringData: {
    tmaValue: 0,
    volume: 0,
    targetElevasi: null,
  },
  monitoringError: null,
  
  activeTab: {
    telemetering: 'waterlevel',
    trends: 'trends1',
  },

  // Actions
  fetchTmaData: async () => {
    set((state) => ({ 
      loading: { ...state.loading, tma: true }, 
      error: null 
    }));
    
    try {
      const response = await fetch('http://192.168.105.90/last-tma');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.length > 0) {
        set((state) => ({
          tmaData: {
            tmaValue: parseFloat(data[0].tma_value),
            volume: parseFloat(data[0].volume),
          },
          loading: { ...state.loading, tma: false }
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch TMA data';
      set((state) => ({ 
        error: errorMessage, 
        loading: { ...state.loading, tma: false }
      }));
    }
  },

  fetchTargetElevasi: async () => {
    set((state) => ({ 
      loading: { ...state.loading, targetElevasi: true }, 
      error: null 
    }));
    
    try {
      const response = await fetch('http://192.168.105.90/rtow-by-today');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.targetElevasi) {
        set((state) => ({
          targetElevasi: parseFloat(data.targetElevasi),
          loading: { ...state.loading, targetElevasi: false }
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch target elevation data';
      set((state) => ({ 
        error: errorMessage, 
        loading: { ...state.loading, targetElevasi: false }
      }));
    }
  },

  fetchRohData: async (date: string) => {
    set((state) => ({ 
      loading: { ...state.loading, roh: true }, 
      error: null 
    }));
    
    try {
      // Fetch report data
      const reportResponse = await fetchWithRetry(
        () => axios.post<ApiReportData>('http://192.168.105.90/report-data', {
          date: date
        }),
        3, // max attempts
        1000 // delay in ms
      );
      
      if (!reportResponse.data || Object.keys(reportResponse.data).length === 0) {
        throw new Error('No report data available');
      }

      const reportData = reportResponse.data;
      
      // Calculate derived values
      const totalOutflow = (reportData.outflow.average_outflow_irigasi * 24 * 3600) + 
        (reportData.outflow.total_outflow_ddc_m3s * 3600 * reportData.outflow.total_outflow_ddc_jam) + 
        (reportData.outflow.total_outflow_spillway_m3s * 3600 * reportData.outflow.total_outflow_spillway_jam);

      const estimasiVolumeWaduk = parseFloat(reportData.realisasiElv.volume) +
        ((parseFloat(reportData.estimationInflow.inflow_estimation)) * 3600 * 24) - 
        parseFloat(reportData.targetElv.volume) - totalOutflow;

      const totalDaya = ((estimasiVolumeWaduk - (reportData.outflow.average_outflow_irigasi * 24 * 3600)) / 4080) - 50;
      const estimasiOutflow = (totalDaya * 4080) + reportData.outflow.average_outflow_irigasi * 3600 * 24;
      const volumeAfterOperation = parseFloat(reportData.realisasiElv.volume) + 
        ((parseFloat(reportData.estimationInflow.inflow_estimation)) * 24 * 3600) - 
        estimasiOutflow - totalOutflow;

      // Update ROH data
      const currentRohData = get().rohData;
      set((state) => ({
        rohData: [{
          ...currentRohData[0],
          content: {
            ...currentRohData[0].content,
            hariOrTanggal: new Date(date).toLocaleDateString('id-ID', {
              day: "2-digit",
              month: "long", 
              year: "numeric"
            }),
            estimasiInflow: parseFloat(reportData.estimationInflow.inflow_estimation),
            targetELevasiHariIni: parseFloat(reportData.targetElv.targetElevasi),
            volumeTargetELevasiHariIni: parseFloat(reportData.targetElv.volume),
            realisasiElevasi: parseFloat(reportData.realisasiElv.tma_value),
            volumeRealisasiElevasi: parseFloat(reportData.realisasiElv.volume),
            estimasiIrigasi: reportData.outflow.average_outflow_irigasi,
            estimasiDdcXTotalJamPembukaan: reportData.outflow.total_outflow_ddc_m3s,
            ddcJam: reportData.outflow.total_outflow_ddc_jam,
            estimasiSpillwayTotalJamPembukaan: reportData.outflow.total_outflow_spillway_m3s,
            spillwayJam: reportData.outflow.total_outflow_spillway_jam,
            estimasiElevasiWadukSetelahOperasi: 0,
            estimasiVolumeWadukSetelahOperasi: volumeAfterOperation,
            totalDaya: totalDaya,
            estimasiOutflow: estimasiOutflow,
            estimasiVolumeWaduk: estimasiVolumeWaduk,
          }
        }],
        loading: { ...state.loading, roh: false }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ROH data';
      set((state) => ({ 
        error: errorMessage, 
        loading: { ...state.loading, roh: false }
      }));
    }
  },

  fetchTrendsData: async () => {
    set((state) => ({ 
      loading: { ...state.loading, trends: true }, 
      error: null 
    }));
    
    try {
      const [
        bebanResponse, 
        outflowResponse, 
        tmaResponse, 
        arrResponse, 
        inflowResponse,
      ] = await Promise.all([
        axios.get<BebanData[]>('http://192.168.105.90/pbs-beban-last-24-h'),
        axios.get<OutflowData[]>('http://192.168.105.90/pbs-outflow-last-24-h'),
        axios.get<TMAData[]>('http://192.168.105.90/pbs-tma-last-24-h'),
        axios.get<ARRData[]>('http://192.168.105.90/arr-st01-h'),
        axios.get<TrendsInflowData[]>('http://192.168.105.90/pbs-inflow-last-24-h')
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const groupedData: { [key: string]: FormattedData } = {};

      const isToday = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getTime() >= today.getTime() && date.getTime() < today.getTime() + 24 * 60 * 60 * 1000;
      };

      // Process Beban data
      bebanResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: BebanData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
          });

          if (!groupedData[timeKey]) {
            groupedData[timeKey] = {
              time: timeKey,
              originalTime: originalTime
            };
          }

          if (curr.name.includes('PB01.ACTIVE_LOAD')) {
            groupedData[timeKey].bebanPB01 = parseFloat(curr.value);
          } else if (curr.name.includes('PB02.ACTIVE_LOAD')) {
            groupedData[timeKey].bebanPB02 = parseFloat(curr.value);
          } else if (curr.name.includes('PB03.ACTIVE_LOAD')) {
            groupedData[timeKey].bebanPB03 = parseFloat(curr.value);
          }
        });

      // Process Outflow data
      outflowResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: OutflowData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
          });

          if (groupedData[timeKey]) {
            groupedData[timeKey].outflow = parseFloat(curr.value);
          }
        });

      // Process TMA data
      tmaResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: TMAData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
          });

          if (groupedData[timeKey]) {
            groupedData[timeKey].tma = parseFloat(curr.value);
          }
        });

      // Process Inflow data
      inflowResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: TrendsInflowData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
          });

          if (groupedData[timeKey]) {
            groupedData[timeKey].inflow = parseFloat(curr.value);
          }
        });
      
      // Process ARR data
      arrResponse.data
        .filter(item => isToday(item.timestamp))
        .forEach((curr: ARRData) => {
          const originalTime = new Date(curr.timestamp);
          const timeKey = originalTime.toLocaleTimeString('id-ID', {
            hour: '2-digit',
          });

          if (groupedData[timeKey]) {
            if (curr.name.includes('ARR_ST01_RT')) {
              groupedData[timeKey].arrST01 = parseFloat(curr.value);
            } else if (curr.name.includes('ARR_ST02_RT')) {
              groupedData[timeKey].arrST02 = parseFloat(curr.value);
            } else if (curr.name.includes('ARR_ST03_RT')) {
              groupedData[timeKey].arrST03 = parseFloat(curr.value);
            }
          }
        });

      // Calculate total beban
      Object.values(groupedData).forEach(item => {
        const beban1 = item.bebanPB01 || 0;
        const beban2 = item.bebanPB02 || 0;
        const beban3 = item.bebanPB03 || 0;
        item.totalBeban = beban1 + beban2 + beban3;
      });

      // Convert to array and sort by time
      const formattedData = Object.values(groupedData)
        .sort((a, b) => a.originalTime.getTime() - b.originalTime.getTime());

      set((state) => ({
        trendsData: formattedData,
        loading: { ...state.loading, trends: false }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trends data';
      set((state) => ({ 
        error: errorMessage, 
        loading: { ...state.loading, trends: false }
      }));
    }
  },

  fetchInflowChartData: async () => {
    set((state) => ({ 
      loading: { ...state.loading, inflowChart: true }, 
      error: null 
    }));
    
    try {
      const response = await axios.get<AWLRPerHourData[]>('http://192.168.105.90/db-awlr-hour');
      const rawData = response.data;

      // Kelompokkan data berdasarkan waktu
      const groupedData = rawData.reduce((acc: { [key: string]: InflowChartData }, curr) => {
        const originalTime = new Date(curr.kWaktu);
        const timeKey = originalTime.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        });

        if (!acc[timeKey]) {
          acc[timeKey] = {
            time: timeKey,
            originalTime: originalTime,
            serayu: 0,
            merawu: 0,
            lumajang: 0
          };
        }

        // Map sensor IDs to river names
        switch (curr.id_sensor_tide) {
          case 1: // Serayu
            acc[timeKey].serayu = curr.debit;
            break;
          case 2: // Merawu
            acc[timeKey].merawu = curr.debit;
            break;
          case 3: // Lumajang
            acc[timeKey].lumajang = curr.debit;
            break;
        }

        return acc;
      }, {});

      // Convert to array and sort by time (oldest to newest)
      const formattedData = Object.values(groupedData)
        .sort((a, b) => a.originalTime.getTime() - b.originalTime.getTime());

      set((state) => ({
        inflowChartData: formattedData,
        loading: { ...state.loading, inflowChart: false }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch inflow chart data';
      set((state) => ({ 
        error: errorMessage, 
        loading: { ...state.loading, inflowChart: false }
      }));
    }
  },

  fetchTelemeterData: async () => {
    set((state) => ({ 
      loading: { ...state.loading, telemetering: true }, 
      telemeterError: null 
    }));
    
    try {
      const [waterLevelRes, rainfallRes] = await Promise.all([
        fetch('/api/pjt-wl'),
        fetch('/api/pjt-rf')
      ]);

      if (!waterLevelRes.ok || !rainfallRes.ok) {
        throw new Error('Failed to fetch telemetering data');
      }

      const [waterLevelData, rainfallData] = await Promise.all([
        waterLevelRes.json(),
        rainfallRes.json()
      ]);

      set((state) => ({ 
        telemeterData: {
          Waterlevel: waterLevelData.Waterlevel,
          Rainfall: rainfallData.Rainfall
        }, 
        loading: { ...state.loading, telemetering: false }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch telemetering data';
      set((state) => ({ 
        telemeterError: errorMessage, 
        loading: { ...state.loading, telemetering: false }
      }));
    }
  },

  setActiveTelemeteringTab: (tab) => {
    set((state) => ({
      activeTab: {
        ...state.activeTab,
        telemetering: tab
      }
    }));
  },

  fetchAWLRData: async () => {
    set((state) => ({ 
      loading: { ...state.loading, awlr: true }, 
      awlrError: null 
    }));
    
    try {
      // Import AWLRService dynamically
      const { AWLRService } = await import('@/services/AWLR/awlr');
      const awlrService = new AWLRService();

      // Fetch all AWLR data in parallel
      const [serayuRes, merawuRes, lumajangRes, serayuHourRes, merawuHourRes, lumajangHourRes] = await Promise.all([
        awlrService.getAWLRById(1), // Serayu
        awlrService.getAWLRById(2), // Merawu  
        awlrService.getAWLRById(3), // Lumajang
        awlrService.getLatestAWLRById(1), // Serayu per hour
        awlrService.getLatestAWLRById(2), // Merawu per hour  
        awlrService.getLatestAWLRById(3), // Lumajang per hour
      ]);

      set((state) => ({
        awlrData: {
          serayu: serayuRes,
          merawu: merawuRes,
          lumajang: lumajangRes,
        },
        awlrPerHourData: {
          serayu: serayuHourRes,
          merawu: null, // Not available for Merawu
          lumajang: lumajangHourRes,
        },
        loading: { ...state.loading, awlr: false }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch AWLR data';
      set((state) => ({ 
        awlrError: errorMessage, 
        loading: { ...state.loading, awlr: false }
      }));
    }
  },

  fetchAWLRDataById: async (id: number) => {
    try {
      const { AWLRService } = await import('@/services/AWLR/awlr');
      const awlrService = new AWLRService();
      return await awlrService.getAWLRById(id);
    } catch (error) {
      console.error(`Error fetching AWLR data for ID ${id}:`, error);
      return null;
    }
  },

  fetchLatestAWLRById: async (id: number) => {
    try {
      const { AWLRService } = await import('@/services/AWLR/awlr');
      const awlrService = new AWLRService();
      return await awlrService.getLatestAWLRById(id);
    } catch (error) {
      console.error(`Error fetching latest AWLR data for ID ${id}:`, error);
      return null;
    }
  },

  fetchMonitoringData: async () => {
    set((state) => ({ 
      loading: { ...state.loading, monitoring: true }, 
      monitoringError: null 
    }));
    
    try {
      const response = await fetch('/api/monitoring');
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      const data = await response.json();
      set((state) => ({ 
        monitoringData: {
          tmaValue: data.tmaValue || 0,
          volume: data.volume || 0,
          targetElevasi: data.targetElevasi || null,
        },
        loading: { ...state.loading, monitoring: false }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch monitoring data';
      set((state) => ({ 
        monitoringError: errorMessage, 
        loading: { ...state.loading, monitoring: false }
      }));
    }
  },

  setTargetElevasi: (elevation) => {
    set((state) => ({
      targetElevasi: elevation,
      monitoringData: {
        ...state.monitoringData,
        targetElevasi: elevation
      }
    }));
  },

  setActiveTrendsTab: (tab) => {
    set((state) => ({
      activeTab: {
        ...state.activeTab,
        trends: tab
      }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  clearErrors: () => {
    set({
      error: null,
      telemeterError: null,
      awlrError: null,
      monitoringError: null
    });
  },

  reset: () => {
    set({
      tmaData: {
        tmaValue: 0,
        volume: 0,
      },
      targetElevasi: null,
      rohData: [{
        header: {
          logo: '/assets/ip-mrica-logo.png',
          judul: 'PT. PLN INDONESIA POWER'
        },
        content: {
          hariOrTanggal: '',
          estimasiInflow: 0,
          targetELevasiHariIni: 0,
          volumeTargetELevasiHariIni: 0,
          realisasiElevasi: 0,
          volumeRealisasiElevasi: 0,
          estimasiIrigasi: 0,
          estimasiDdcXTotalJamPembukaan: 0,
          ddcJam: 0,
          estimasiSpillwayTotalJamPembukaan: 0,
          spillwayJam: 0,
          totalOutflow: 0,
          estimasiVolumeWaduk: 0,
          estimasiOutflow: 0,
          estimasiElevasiWadukSetelahOperasi: 0,
          estimasiVolumeWadukSetelahOperasi: 0,
          totalDaya: 0
        }
      }],
      
      trendsData: [],
      inflowChartData: [],
      
      loading: {
        tma: false,
        targetElevasi: false,
        roh: false,
        telemetering: false,
        awlr: false,
        monitoring: false,
        trends: false,
        inflowChart: false,
      },
      error: null,
      
      telemeterData: {},
      telemeterError: null,
      
      awlrData: {
        serayu: null,
        merawu: null,
        lumajang: null,
      },
      awlrPerHourData: {
        serayu: null,
        merawu: null,
        lumajang: null,
      },
      awlrError: null,
      
      monitoringData: {
        tmaValue: 0,
        volume: 0,
        targetElevasi: null,
      },
      monitoringError: null,
      
      activeTab: {
        telemetering: 'waterlevel',
        trends: 'trends1',
      },
    });
  }
})); 