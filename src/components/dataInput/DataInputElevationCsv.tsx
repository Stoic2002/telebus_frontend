import React, { useState } from 'react';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import axios from 'axios';
import { 
  ElevationUploadForm, 
  ElevationStatusAlert, 
  ElevationSubmitButton 
} from '@/components/features/data-input/elevation/components';
import { 
  GHWData, 
  processElevationCSV, 
  prepareSubmissionData,
  MIN_ELEVATION,
  MAX_ELEVATION 
} from '@/components/features/data-input/elevation/utils/elevationProcessor';

const DataInputElevationCsv: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [formData, setFormData] = useState<GHWData>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;
        const result = processElevationCSV(text);
        
        if (result.success) {
          setFormData(result.data);
          setStatus({ type: 'success', message: 'Data berhasil dimuat!' });
        } else {
          setStatus({ type: 'error', message: result.error || 'Error processing file' });
        }
      };

      reader.onerror = () => {
        setStatus({ type: 'error', message: 'Kesalahan membaca file.' });
      };

      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(formData).length === 0) {
      setStatus({ 
        type: 'error', 
        message: 'Silakan unggah file CSV terlebih dahulu' 
      });
      return;
    }
  
    setLoading(true);
    setStatus({ type: '', message: '' });
  
    try {
      const submissionData = prepareSubmissionData(formData, selectedYear);
      
      await fetchWithRetry(
        () => axios.post('http://192.168.105.90/elevation', submissionData),
        3,
        1000
      );
  
      setStatus({
        type: 'success',
        message: 'Data berhasil disimpan'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Data untuk tahun ini sudah tersedia'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ElevationUploadForm
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onFileChange={handleFileChange}
          minElevation={MIN_ELEVATION}
          maxElevation={MAX_ELEVATION}
        />
        
        <ElevationStatusAlert status={status} />
        
        <ElevationSubmitButton
          onSubmit={handleSubmit}
          loading={loading}
          disabled={Object.keys(formData).length === 0}
        />
      </div>
    </div>
  );
};

export default DataInputElevationCsv;






