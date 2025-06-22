import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { IoDocumentTextOutline, IoInformationCircleOutline, IoCloudDownloadOutline, IoCalendarOutline } from 'react-icons/io5';

interface RTOWData {
  bulan: string;
  hari: number;
  targetElevasi: number;
}

interface RtowUploadFormProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formData: RTOWData[];
}

const RtowUploadForm: React.FC<RtowUploadFormProps> = ({
  selectedYear,
  onYearChange,
  onFileChange,
  formData
}) => {
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear + 5 - 2000 + 1 }, 
      (_, index) => 2000 + index
    );
  };

  const downloadCsvTemplate = () => {
    const link = document.createElement("a");
    link.href = "/rtow_format.csv";
    link.setAttribute("download", "rtow_format.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <CardTitle className="text-xl flex items-center space-x-3">
          <IoDocumentTextOutline className="w-6 h-6" />
          <span>RTOW Data Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-8 bg-white">
        <Alert variant="default" className="bg-blue-50 border-blue-200 rounded-xl">
          <IoInformationCircleOutline className="h-6 w-6 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="font-semibold mb-3 text-lg">Format file CSV yang didukung:</div>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              <li>Pemisah kolom menggunakan titik koma (;)</li>
              <li>Format angka menggunakan titik (.) sebagai pemisah ribuan</li>
              <li>Format desimal menggunakan koma (,)</li>
              <li>Kolom: Bulan (1-12); Hari (1-31); Target Elevasi</li>
              <li>Untuk lebih jelasnya bisa mendownload template csv di bawah ini</li>
            </ul>
          </AlertDescription>
        </Alert>

        <button 
          onClick={downloadCsvTemplate} 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl flex items-center justify-center space-x-3 transition-all shadow-lg transform hover:scale-[1.02] text-lg font-semibold"
        >
          <IoCloudDownloadOutline className="w-6 h-6" />
          <span>Unduh Template CSV</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
              <IoCalendarOutline className="w-5 h-5 text-blue-600" />
              <span>Pilih Tahun</span>
            </label>
            <Select 
              value={selectedYear.toString()} 
              onValueChange={(value) => onYearChange(Number(value))}
            >
              <SelectTrigger className="h-12 bg-gray-50 hover:bg-white border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg">
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

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 flex items-center space-x-2">
              <IoDocumentTextOutline className="w-5 h-5 text-blue-600" />
              <span>Unggah File CSV</span>
            </label>
            <input 
              type="file" 
              accept=".csv" 
              onChange={onFileChange} 
              className="w-full border-2 border-gray-200 p-4 rounded-xl bg-gray-50 hover:bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <span>💡</span>
              <span>File CSV berisi rencana tahunan operasi waduk</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RtowUploadForm; 