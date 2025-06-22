import { create } from 'zustand';

interface ReportData {
  elevationData: any;
  rtowData: any;
  tmaData: { content: any[] };
  inflowData: { content: any[] };
  outflowData: { content: any[] };
}

interface RohData {
  id: number;
  value: number;
  label: string;
  date: string;
  time: string;
}

export interface ReportState {
  // Report selection
  selectedReport: string;
  startDate: string;
  endDate: string;
  
  // Report data
  reportData: ReportData;
  rohData: RohData[];
  
  // UI state
  showReport: boolean;
  
  // Loading states
  loading: boolean;
  
  // Error state
  hasError: boolean;
  error: string | null;
}

export interface ReportActions {
  // Report selection
  setSelectedReport: (report: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  
  // Data fetching
  fetchReportData: () => Promise<void>;
  fetchElevationData: () => Promise<void>;
  fetchRtowData: () => Promise<void>;
  fetchTmaData: () => Promise<void>;
  fetchInflowData: () => Promise<void>;
  fetchOutflowData: () => Promise<void>;
  fetchRohData: () => Promise<void>;
  
  // ROH data management
  updateRohData: (data: RohData[]) => void;
  
  // UI actions
  setShowReport: (show: boolean) => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Reset
  reset: () => void;
}

export const useReportStore = create<ReportState & ReportActions>((set, get) => ({
  // State
  selectedReport: '',
  startDate: '',
  endDate: '',
  
  reportData: {
    elevationData: null,
    rtowData: null,
    tmaData: { content: [] },
    inflowData: { content: [] },
    outflowData: { content: [] }
  },
  rohData: [],
  
  showReport: false,
  loading: false,
  hasError: false,
  error: null,

  // Actions
  setSelectedReport: (report) => {
    set({ selectedReport: report });
  },

  setStartDate: (date) => {
    set({ startDate: date });
  },

  setEndDate: (date) => {
    set({ endDate: date });
  },

  setDateRange: (startDate, endDate) => {
    set({ startDate, endDate });
  },

  fetchReportData: async () => {
    const { selectedReport, startDate, endDate } = get();
    
    if (!selectedReport || !startDate || !endDate) {
      set({ error: 'Please select report type and date range' });
      return;
    }

    set({ loading: true, hasError: false, error: null });
    
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: selectedReport,
          startDate,
          endDate
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();
      
      set({
        reportData: {
          elevationData: data.elevationData || null,
          rtowData: data.rtowData || null,
          tmaData: data.tmaData || { content: [] },
          inflowData: data.inflowData || { content: [] },
          outflowData: data.outflowData || { content: [] }
        },
        showReport: true,
        loading: false
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch report data';
      set({ 
        error: errorMessage, 
        hasError: true, 
        loading: false 
      });
    }
  },

  fetchElevationData: async () => {
    const { startDate, endDate } = get();
    
    try {
      const response = await fetch(`/api/reports/elevation?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch elevation data');
      }
      
      const data = await response.json();
      set((state) => ({
        reportData: {
          ...state.reportData,
          elevationData: data
        }
      }));
    } catch (error) {
      console.error('Error fetching elevation data:', error);
    }
  },

  fetchRtowData: async () => {
    const { startDate, endDate } = get();
    
    try {
      const response = await fetch(`/api/reports/rtow?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch RTOW data');
      }
      
      const data = await response.json();
      set((state) => ({
        reportData: {
          ...state.reportData,
          rtowData: data
        }
      }));
    } catch (error) {
      console.error('Error fetching RTOW data:', error);
    }
  },

  fetchTmaData: async () => {
    const { startDate, endDate } = get();
    
    try {
      const response = await fetch(`/api/reports/tma?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch TMA data');
      }
      
      const data = await response.json();
      set((state) => ({
        reportData: {
          ...state.reportData,
          tmaData: data
        }
      }));
    } catch (error) {
      console.error('Error fetching TMA data:', error);
    }
  },

  fetchInflowData: async () => {
    const { startDate, endDate } = get();
    
    try {
      const response = await fetch(`/api/reports/inflow?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inflow data');
      }
      
      const data = await response.json();
      set((state) => ({
        reportData: {
          ...state.reportData,
          inflowData: data
        }
      }));
    } catch (error) {
      console.error('Error fetching inflow data:', error);
    }
  },

  fetchOutflowData: async () => {
    const { startDate, endDate } = get();
    
    try {
      const response = await fetch(`/api/reports/outflow?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch outflow data');
      }
      
      const data = await response.json();
      set((state) => ({
        reportData: {
          ...state.reportData,
          outflowData: data
        }
      }));
    } catch (error) {
      console.error('Error fetching outflow data:', error);
    }
  },

  fetchRohData: async () => {
    try {
      const response = await fetch('/api/reports/roh');
      if (!response.ok) {
        throw new Error('Failed to fetch ROH data');
      }
      
      const data = await response.json();
      set({ rohData: data });
    } catch (error) {
      console.error('Error fetching ROH data:', error);
    }
  },

  updateRohData: (data) => {
    set({ rohData: data });
  },

  setShowReport: (show) => {
    set({ showReport: show });
  },

  setError: (error) => {
    set({ error, hasError: !!error });
  },

  clearError: () => {
    set({ error: null, hasError: false });
  },

  reset: () => {
    set({
      selectedReport: '',
      startDate: '',
      endDate: '',
      
      reportData: {
        elevationData: null,
        rtowData: null,
        tmaData: { content: [] },
        inflowData: { content: [] },
        outflowData: { content: [] }
      },
      rohData: [],
      
      showReport: false,
      loading: false,
      hasError: false,
      error: null
    });
  }
})); 