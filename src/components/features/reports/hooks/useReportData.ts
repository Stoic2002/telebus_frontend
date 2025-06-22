import { useState } from 'react';
import axios from 'axios';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import { ApiElevationData, ApiReportData, RohData } from '@/types/reportTypes';

interface ApiData {
  id: number;
  name: string;
  value: string;
  timestamp: string;
}

export const useReportData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);
  
  // Process API data helpers
  const processApiDataTma = (apiData: ApiData[]) => {
    const groupedByDate: { [key: string]: { tanggal: number, item: { jam: number, tma: number }[] } } = {};

    apiData.forEach(item => {
      const date = new Date(item.timestamp);
      const tanggal = date.getDate();
      const jam = date.getHours();

      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = { tanggal, item: [] };
      }
      const filteredValue = parseFloat(item.value).toFixed(2);
      groupedByDate[tanggal].item.push({
        jam,
        tma: parseFloat(filteredValue)
      });
    });

    return Object.values(groupedByDate);
  };

  const processApiDataInflow = (apiData: ApiData[]) => {
    const groupedByDate: { [key: string]: { tanggal: number, item: { jam: number, inflow: number }[] } } = {};

    apiData.forEach(item => {
      const date = new Date(item.timestamp);
      const tanggal = date.getDate();
      const jam = date.getHours();

      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = { tanggal, item: [] };
      }
      const parsedValue = parseFloat(item.value);
      const absoluteValue = Math.abs(parsedValue);
      const filteredValue = absoluteValue.toFixed(2);
      
      groupedByDate[tanggal].item.push({
        jam,
        inflow: parseFloat(filteredValue)
      });
    });

    return Object.values(groupedByDate);
  };

  const processApiDataOutflow = (apiData: ApiData[]) => {
    const groupedByDate: { [key: string]: { tanggal: number, item: { jam: number, outflow: number }[] } } = {};

    apiData.forEach(item => {
      const date = new Date(item.timestamp);
      const tanggal = date.getDate();
      const jam = date.getHours();

      if (!groupedByDate[tanggal]) {
        groupedByDate[tanggal] = { tanggal, item: [] };
      }
      const filteredValue = parseFloat(item.value).toFixed(2);
      groupedByDate[tanggal].item.push({
        jam,
        outflow: parseFloat(filteredValue)
      });
    });

    return Object.values(groupedByDate);
  };

  // Fetch functions
  const fetchTmaData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get('http://192.168.105.90/pbs-tma-h-date', {
          params: { startDate: start, endDate: end }
        }),
        3,
        1000
      );

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        return null;
      }

      const transformedData = {
        header: {
          logo: '/assets/ip-mrica-logo2.png',
          judul: 'LAPORAN TINGGI MUKA ARI WADUK (MDPL)',
          unit: 'UNIT PEMBANGKITAN MRICA',
          periode: `${start} - ${end}`,
          lokasi: 'WADUK PLTA PB SOEDIRMAN'
        },
        content: processApiDataTma(response.data)
      };

      return { content: [transformedData] };
    } catch (error) {
      setHasError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchInflowData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get('http://192.168.105.90/pbs-inflow-h-date', {
          params: { startDate: start, endDate: end }
        }),
        3,
        1000
      );

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        return null;
      }

      const transformedData = {
        header: {
          logo: '/assets/ip-mrica-logo2.png',
          judul: 'LAPORAN DATA INFLOW (m3/s)',
          unit: 'UNIT PEMBANGKITAN MRICA',
          periode: `${start} - ${end}`,
          lokasi: 'WADUK PLTA PB SOEDIRMAN',
        },
        content: processApiDataInflow(response.data),
      };

      return { content: [transformedData] };
    } catch (error) {
      setHasError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchOutflowData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get('http://192.168.105.90/pbs-outflow-h-date', {
          params: { startDate: start, endDate: end }
        }),
        3,
        1000
      );

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        return null;
      }

      const transformedData = {
        header: {
          logo: '/assets/ip-mrica-logo2.png',
          judul: 'LAPORAN DATA OUTFLOW (m3/s)',
          unit: 'UNIT PEMBANGKITAN MRICA',
          periode: `${start} - ${end}`,
          lokasi: 'WADUK PLTA PB SOEDIRMAN',
        },
        content: processApiDataOutflow(response.data),
      };

      return { content: [transformedData] };
    } catch (error) {
      setHasError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchElevationData = async (year: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get(`http://192.168.105.90/elevation/${year}`),
        3,
        1000
      );

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        return null;
      }

      return {
        id: response.data.id,
        year: response.data.year,
        status: response.data.status,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        elevationData: response.data.elevationData.map((item: any) => ({
          id: item.id,
          ghwDataId: item.ghwDataId,
          elevation: item.elevation,
          volume: item.volume,
          area: item.area,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
    } catch (error) {
      setHasError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchRtowData = async (year: string) => {
    try {
      setLoading(true);
      setHasError(false);
      const response = await fetchWithRetry(
        () => axios.get(`http://192.168.105.90/rtow/${year}`),
        3,
        1000
      );

      if (!response.data || response.data.length === 0) {
        setHasError(true);
        return null;
      }

      return {
        id: response.data.id,
        tahun: response.data.tahun,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        data: response.data.data.map((item: any) => ({
          id: item.id,
          bulan: item.bulan,
          hari: item.hari,
          targetElevasi: item.targetElevasi,
          rtowId: item.rtowId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      };
    } catch (error) {
      setHasError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDataRoh = async (date: string, initialRohData: RohData[]) => {
    try {
      setLoading(true);
      setHasError(false);
      
      console.log('fetchDataRoh: Starting fetch for date:', date);
      console.log('fetchDataRoh: initialRohData:', initialRohData);
      
      const reportResponse = await fetchWithRetry(
        () => axios.post<ApiReportData>('http://192.168.105.90/report-data', { date }),
        3,
        1000
      );
      
      console.log('fetchDataRoh: API response:', reportResponse.data);
      
      if (!reportResponse.data || Object.keys(reportResponse.data).length === 0) {
        console.log('fetchDataRoh: No data or empty response');
        setHasError(true);
        return null;
      }

      const totalOutflow = (reportResponse.data.outflow.average_outflow_irigasi * 24 * 3600) + 
          (reportResponse.data.outflow.total_outflow_ddc_m3s * 3600 * reportResponse.data.outflow.total_outflow_ddc_jam) + 
          (reportResponse.data.outflow.total_outflow_spillway_m3s * 3600 * reportResponse.data.outflow.total_outflow_spillway_jam);

      const estimasiVolumeWaduk = parseFloat(reportResponse.data.realisasiElv.volume) +
          ((parseFloat(reportResponse.data.estimationInflow.inflow_estimation)) * 3600 * 24) - 
          parseFloat(reportResponse.data.targetElv.volume) - totalOutflow;

      const totalDaya = ((estimasiVolumeWaduk - (reportResponse.data.outflow.average_outflow_irigasi * 24 * 3600))/4080) - 50;
      const estimasiOutflow = (totalDaya * 4080) + reportResponse.data.outflow.average_outflow_irigasi * 3600 * 24;
      const volumeAfterOperation = parseFloat(reportResponse.data.realisasiElv.volume) + 
          ((parseFloat(reportResponse.data.estimationInflow.inflow_estimation))* 24 * 3600) - 
          estimasiOutflow - totalOutflow;

      console.log('fetchDataRoh: Calculated values:', {
        totalOutflow,
        estimasiVolumeWaduk,
        totalDaya,
        estimasiOutflow,
        volumeAfterOperation
      });

      const year = date.split('-')[0];
      const elevationResponse = await axios.post<ApiElevationData>('http://192.168.105.90/elevation-after', {
          volume: volumeAfterOperation.toString(),
          year: year
      });

      console.log('fetchDataRoh: Elevation response:', elevationResponse.data);

      const finalData = [{
          ...initialRohData[0],
          content: {
              ...initialRohData[0].content,
              hariOrTanggal: new Date(date).toLocaleDateString('id-ID',{day:"2-digit",month:"long",year:"numeric"}),
              estimasiInflow: parseFloat(reportResponse.data.estimationInflow.inflow_estimation),
              targetELevasiHariIni: parseFloat(reportResponse.data.targetElv.targetElevasi),
              volumeTargetELevasiHariIni: parseFloat(reportResponse.data.targetElv.volume),
              realisasiElevasi: parseFloat(reportResponse.data.realisasiElv.tma_value),
              volumeRealisasiElevasi: parseFloat(reportResponse.data.realisasiElv.volume),
              estimasiIrigasi: reportResponse.data.outflow.average_outflow_irigasi,
              estimasiDdcXTotalJamPembukaan: reportResponse.data.outflow.total_outflow_ddc_m3s,
              ddcJam: reportResponse.data.outflow.total_outflow_ddc_jam,
              estimasiSpillwayTotalJamPembukaan: reportResponse.data.outflow.total_outflow_spillway_m3s,
              spillwayJam: reportResponse.data.outflow.total_outflow_spillway_jam,
              estimasiElevasiWadukSetelahOperasi: parseFloat(elevationResponse.data.interpolated_elevation),
              estimasiVolumeWadukSetelahOperasi: volumeAfterOperation,
              totalDaya: totalDaya,
              estimasiOutflow: estimasiOutflow,
              estimasiVolumeWaduk: estimasiVolumeWaduk,
          }
      }];

      console.log('fetchDataRoh: Final processed data:', finalData);
      return finalData;
    } catch (error) {
      console.error('fetchDataRoh: Error occurred:', error);
      setHasError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    hasError,
    fetchTmaData,
    fetchInflowData,
    fetchOutflowData,
    fetchElevationData,
    fetchRtowData,
    fetchDataRoh
  };
}; 