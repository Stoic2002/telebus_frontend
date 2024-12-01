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
  
      const response = await fetch('http://localhost:8000/v1/ghw', {
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
        message: result.message
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
          Input Data GHW (Geohidrologi Waduk Volumetrik)
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
              <li>Rentang elevasi valid: {MIN_ELEVATION} - {MAX_ELEVATION} mdpl</li>
            </ul>
          </AlertDescription>
        </Alert>
         {/* Pilih Tahun */}
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

{/* Upload File */}
<div className="flex flex-col space-y-2">
 <label className="text-sm font-medium">Unggah File CSV</label>
 <input 
   type="file" 
   accept=".csv" 
   onChange={handleFileChange} 
   className="w-full border p-2 rounded"
 />
</div>

{/* Status Alert */}
{status.message && (
 <Alert 
   variant={status.type === 'error' ? 'destructive' : 'default'}
   className="mt-4"
 >
   <AlertDescription>{status.message}</AlertDescription>
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
 className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center 
          justify-center space-x-2"
>
 {loading ? <Loader2 className="animate-spin" /> : <Save />}
 <span>Simpan Data</span>
</button>

        {/* ... rest of the JSX remains the same ... */}
      </CardContent>
    </Card>
  );
};

export default DataInputElevationCsv;






