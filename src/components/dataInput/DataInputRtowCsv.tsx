import React, { useState } from 'react';
import axios from 'axios';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import { 
  RtowUploadForm, 
  RtowStatusAlert, 
  RtowSubmitButton 
} from '@/components/features/data-input/rtow/components';
import { 
  RTOWData, 
  processRtowCsv, 
  validateRtowData 
} from '@/components/features/data-input/rtow/utils';

const DataInputRtowCsv: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [formData, setFormData] = useState<RTOWData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;
        const results = processRtowCsv(text);

        if (!validateRtowData(results)) {
          setStatus({ type: 'error', message: 'Data tidak valid' });
        } else {
          setFormData(results);
          setStatus({ type: 'success', message: 'Data berhasil dimuat!' });
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setStatus({ type: 'error', message: 'Kesalahan membaca file.' });
      };

      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (formData.length === 0) {
      setStatus({ 
        type: 'error', 
        message: 'Silakan unggah file CSV terlebih dahulu' 
      });
      return;
    }
  
    setLoading(true);
    setStatus({ type: '', message: '' });
  
    try {
      const submissionData = {
        tahun: selectedYear.toString(),
        data: formData
      };

      await fetchWithRetry(
        () => axios.post('http://192.168.105.90/rtow', submissionData),
        3,
        1000
      );
  
      setStatus({
        type: 'success',
        message: 'Data berhasil disimpan'
      });
    } catch (error) {
      console.error('Submit error:', error);
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
        <RtowUploadForm
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onFileChange={handleFileChange}
          formData={formData}
        />
        
        <RtowStatusAlert status={status} />
        <RtowSubmitButton
          loading={loading}
          formData={formData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default DataInputRtowCsv;