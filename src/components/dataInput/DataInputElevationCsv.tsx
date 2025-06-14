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
import { Loader2, Save, Info, Download } from "lucide-react";
import { IoLayersOutline, IoSaveOutline, IoInformationCircleOutline, IoCloudDownloadOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import axios from 'axios';

interface GHWData {
  [elevation: number]: {
    volume: string;
    area: string;
  };
}

const MIN_ELEVATION = 224.50;
const MAX_ELEVATION = 231.50;

//generate elevation
const generateValidElevations = () => {
  const elevations = [];
  for (let elevation = MIN_ELEVATION; elevation <= MAX_ELEVATION; elevation += 0.01) {
    elevations.push(parseFloat(elevation.toFixed(2)));
  }
  return elevations;
};


const DataInputElevationCsv: React.FC = () => {
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear + 5 - 2000 + 1 }, 
      (_, index) => 2000 + index
    );
  };

  const downloadCsvTemplate = () => {
    const link = document.createElement("a");
    link.href = "/volume_efektif_format.csv"; // Path ke file di public/
    link.setAttribute("download", "volume_efektif_format.csv"); // Nama file saat diunduh
    document.body.appendChild(link); // Tambahkan link ke DOM sementara
    link.click(); // Trigger klik untuk download
    document.body.removeChild(link); // Hapus link dari DOM setelah selesai
  };
  

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [formData, setFormData] = useState<GHWData>({});

  // Fungsi untuk mengkonversi string angka dengan format Indonesia ke float
  const parseLocalFloat = (value: string): number => {
    try {
      // Bersihkan string dari karakter yang tidak diinginkan
      const cleanValue = value.trim();
      
      // Hilangkan titik sebagai pemisah ribuan dan ganti koma dengan titik untuk desimal
      const normalizedValue = cleanValue
        .replace(/[.,]/g, ""); // Ganti koma desimal dengan titik
      
      const calc = (parseFloat(normalizedValue)/ 100).toFixed(2)
      
      return parseFloat(calc);
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
        // console.log('Raw CSV content:', text);
        
        // Split berdasarkan newline dan filter baris kosong
        const rows = text.split('\n').filter(row => row.trim());
        // console.log('CSV rows:', rows);
        
        const results: any[] = [];
        const invalidElevations: number[] = [];
        const validElevations = generateValidElevations();
        const parsedElevations: number[] = [];

        // Skip the header row and parse the CSV
        rows.slice(1).forEach((row, index) => {
          // Split berdasarkan titik koma dan bersihkan extra semicolons
          const columns = row.split(/[;,]/).filter(col => col.trim());
          
          if (columns.length >= 3) {
            const [elevation, volume, area] = columns;
            // Parse elevation
            const elevationNum = parseLocalFloat(elevation);
            // console.log(elevationNum)
            const parsedVolume = parseLocalFloat(volume);
            const parsedArea = parseLocalFloat(area);
            
            // Validasi rentang elevasi
            if (elevationNum < MIN_ELEVATION || elevationNum > MAX_ELEVATION) {
              invalidElevations.push(elevationNum);
            } else {
              
              results.push({
                elevation: elevationNum,
                volume: parsedVolume,
                area: parsedArea,
              });
            }
          }
        });
        // console.log(results)
        // console.log(invalidElevations);

        // // Cek apakah ada elevasi yang tidak valid
        // if (invalidElevations.length > 0) {
        //   setStatus({ 
        //     type: 'error', 
        //     message: `Elevasi tidak valid: ${invalidElevations.join(', ')}. Rentang elevasi harus antara ${MIN_ELEVATION} dan ${MAX_ELEVATION}.` 
        //   });
        //   return;
        // }

        const missingElevations = validElevations.filter(elevation => !parsedElevations.includes(elevation));

      if (results.length !== 701) {
        setStatus({
          type: 'error',
         message: `Elevasi tidak valid: ${invalidElevations.join(', ')}. Rentang elevasi harus antara ${MIN_ELEVATION} sampai ${MAX_ELEVATION}.`
        });
        return;
      }

        // Validasi dan set data form
        const newFormData: GHWData = {};
        results.forEach(({ elevation, volume, area }) => {
          if (!isNaN(elevation) && !isNaN(volume) && !isNaN(area)) {
            newFormData[elevation] = {
              volume: volume.toFixed(2),
              area: area.toFixed(2),
            };
          }
        });
        console.log('object keys',Object.keys(formData).length);
        console.log('Final formData:', newFormData);
        setFormData(newFormData);
        setStatus({ type: 'success', message: 'Data berhasil dimuat!' });
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setStatus({ type: 'error', message: 'Kesalahan membaca file.' });
      };

      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    // Validasi sebelum submit
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
      const submissionData = {
        year: selectedYear,
        data: Object.entries(formData).map(([elevation, data]) => ({
          elevation: Number(elevation),
          volume: Number(data.volume),
          area: Number(data.area)
        }))
      };
  
      console.log('Submitting data:', submissionData);

      const response = await fetchWithRetry(
                          () => axios.post('http://192.168.105.90/elevation', submissionData),
                          3, // max attempts
                          1000 // delay in ms
                        );
  
      // const response = await fetch('http://192.168.105.90/elevation', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(submissionData)
      // });
  
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.error || 'Network response was not ok');
      // }
  
      // const result = await response.json();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-6">
          <CardTitle className="text-center text-xl flex items-center justify-center space-x-3">
            <IoLayersOutline className="w-8 h-8" />
            <span>Input Data GHW (Geohidrologi Waduk Volumetrik)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <Alert variant="default" className="bg-blue-50/80 backdrop-blur-sm border-blue-200">
          <IoInformationCircleOutline className="h-5 w-5 text-blue-500" />
          <AlertDescription className="text-blue-800">
            <div className="font-medium mb-2">Format file CSV yang didukung:</div>
            <ul className="list-disc pl-4 space-y-1">
              <li>Pemisah kolom menggunakan titik koma (;)</li>
              <li>Format angka menggunakan titik (.) sebagai pemisah ribuan</li>
              <li>Format desimal menggunakan koma (,)</li>
              <li>Rentang elevasi valid: {MIN_ELEVATION} - {MAX_ELEVATION} mdpl</li>
              <li>Untuk lebih jelasnya bisa mendownload template csv di bawah ini</li>
            </ul>
          </AlertDescription>
        </Alert>


{/* Tombol Download Template */}
        <button 
          onClick={downloadCsvTemplate} 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center justify-center space-x-3 transition-all shadow-lg transform hover:scale-105"
        >
          <IoCloudDownloadOutline className="w-5 h-5" />
          <span>Unduh Template CSV</span>
        </button>

        
         {/* Pilih Tahun */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-slate-700">Pilih Tahun</label>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-300">
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

        {/* Upload File */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-slate-700">Unggah File CSV</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="w-full border border-gray-300 p-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Status Alert */}
        {status.message && (
          <Alert 
            variant={status.type === 'error' ? 'destructive' : 'default'}
            className="bg-white/80 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              {status.type === 'success' ? (
                <IoCheckmarkCircleOutline className="w-5 h-5 text-green-500" />
              ) : (
                <IoWarningOutline className="w-5 h-5 text-red-500" />
              )}
              <AlertDescription className="font-medium">{status.message}</AlertDescription>
            </div>
          </Alert>
        )}

{/* Debug Info */}
{/* <div className="mt-4 p-4 bg-gray-100 rounded">
 <pre className="text-xs overflow-auto">
   {Object.keys(formData).length > 0 && JSON.stringify(formData, null, 2)}
 </pre>
</div> */}

 

{/* Tombol Simpan */}
        <button 
          onClick={handleSubmit} 
          disabled={loading || Object.keys(formData).length === 0}
          className="w-full bg-gradient-to-r from-teal-600 to-teal-800 text-white p-3 rounded-lg hover:from-teal-700 hover:to-teal-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 transition-all shadow-lg transform hover:scale-105 disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <IoSaveOutline className="w-5 h-5" />
              <span>Simpan Data</span>
            </>
          )}
        </button>

        {/* ... rest of the JSX remains the same ... */}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataInputElevationCsv;






