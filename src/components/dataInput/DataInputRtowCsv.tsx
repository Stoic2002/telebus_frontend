import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Save, Info } from "lucide-react";

interface RTOWData {
  bulan: string;
  hari: number;
  targetElevasi: number;
}

const validMonths = [
  'januari', 'februari', 'maret', 'april', 'mei', 'juni',
  'juli', 'agustus', 'september', 'oktober', 'november', 'desember',
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
]

const DataInputRtowCsv: React.FC = () => {
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear + 5 - 2000 + 1 }, 
      (_, index) => 2000 + index
    );
  };

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [formData, setFormData] = useState<RTOWData[]>([]);

  // Fungsi untuk mengkonversi string angka dengan format Indonesia ke float
  const parseLocalFloat = (value: string): number => {
    try {
      const cleanValue = value.trim();
      const normalizedValue = cleanValue
        .replace(/[,]/g, "");
      
      // const calc = (parseFloat(normalizedValue)/100).toFixed(2);
      return parseFloat(normalizedValue);
    } catch (error) {
      console.error('Error parsing value:', value, error);
      return 0;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;
        console.log(text);
        const rows = text.split('\n').filter(row => row.trim());
        console.log(rows)
        
        const results: RTOWData[] = [];

        // Skip header row and parse CSV
        rows.slice(1).forEach((row) => {
          const columns = row.split(/[;,]/).filter(col => col.trim());
          // console.log(columns)
          
          if (columns.length >= 3) {
            const [bulan, hari, targetElevasi] = columns;
            
            const dayNumber = parseInt(hari);
            const elevationValue = parseLocalFloat(targetElevasi);
            // console.log(elevationValue)
            // console.log(dayNumber)
            // console.log(monthNumber)
            
            // Pastikan bulan ada dalam mapping
            // const monthName = MONTH_MAPPING[Math.floor(monthNumber).toString()];
            const normalizedMonth = bulan.toLocaleLowerCase();

            if (validMonths.includes(normalizedMonth)) {
              results.push({
                bulan: bulan,
                hari: Math.floor(dayNumber),
                targetElevasi: elevationValue
              });
            }
          }
        });

        if (results.length === 0){
          setStatus({type : 'error', message: 'data tidak valid'})
        }else{
          setFormData(results);
        console.log('data valid', results);
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
  
      const response = await fetch('http://192.168.105.90/rtow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
  
      const result = await response.json();
      setStatus({
        type: 'success',
        message: result.message || 'Data berhasil disimpan'
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
    <Card className="w-full max-w-4xl mx-auto shadow-lg mt-6 mb-10">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800">
        <CardTitle className="text-center text-white text-xl">
          Input Data RTOW (Rencana Tahunan Operasi Waduk)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="bg-blue-50 mt-3">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800">
            Format file CSV yang didukung:
            <ul className="list-disc pl-4 mt-2">
              <li>Pemisah kolom menggunakan titik koma (;)</li>
              <li>Format angka menggunakan titik (.) sebagai pemisah ribuan</li>
              <li>Format desimal menggunakan koma (,)</li>
              <li>Kolom: Bulan (1-12); Hari (1-31); Target Elevasi</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Pilih Tahun</label>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Unggah File CSV</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="w-full border p-2 rounded"
          />
        </div>

        {status.message && (
          <Alert 
            variant={status.type === 'error' ? 'destructive' : 'default'}
            className="mt-4"
          >
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={loading || formData.length === 0}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
                   justify-center space-x-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save />}
          <span>Simpan Data</span>
        </button>
      </CardContent>
    </Card>
  );
};

export default DataInputRtowCsv;