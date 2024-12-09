import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, Search } from "lucide-react";

interface GHWData {
  [elevation: number]: {
    volume: string;
    area: string;
  };
}

const DataInputGhwContent: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: string; message: string }>({ type: '', message: '' });
  const [searchElevation, setSearchElevation] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Generate elevation range from 224.50 to 231.50 with 0.01 intervals
  const elevations: number[] = useMemo(() => {
    const result: number[] = [];
    for (let i = 224.50; i <= 231.50; i += 0.01) {
      result.push(Number(i.toFixed(2)));
    }
    return result;
  }, []);

  // Initialize form data structure
  const [formData, setFormData] = useState<GHWData>(
    elevations.reduce((acc, elevation) => ({
      ...acc,
      [elevation]: { volume: '', area: '' }
    }), {})
  );

  const handleChange = (elevation: number, field: 'volume' | 'area', value: string) => {
    setFormData(prev => ({
      ...prev,
      [elevation]: {
        ...prev[elevation],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setStatus({ type: '', message: '' });
  
    try {
      const submissionData = {
        year,
        data: Object.entries(formData).map(([elevation, data]) => ({
          elevation: Number(elevation),
          volume: Number(data.volume) || 0,
          area: Number(data.area) || 0
        }))
      };
  
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
      console.log(response);
  
      const result = await response.json();
      setStatus({
        type: 'success',
        message: result.message
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

  const handleReset = () => {
    setFormData(
      elevations.reduce((acc, elevation) => ({
        ...acc,
        [elevation]: { volume: '', area: '' }
      }), {})
    );
    setStatus({ type: '', message: '' });
    setSearchElevation("");
    setCurrentPage(1);
  };

  // Filter and pagination logic
  const filteredElevations = useMemo(() => {
    return elevations.filter(elevation => 
      elevation.toString().includes(searchElevation)
    );
  }, [elevations, searchElevation]);

  const totalPages = Math.ceil(filteredElevations.length / itemsPerPage);
  const currentElevations = filteredElevations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg mt-6 mb-10">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800">
        <CardTitle className="text-center text-white text-xl">
          Input Data GHW (Geohidrologi Waduk Volumetrik) {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {status.message && (
          <Alert className={`mb-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="w-48">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tahun
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="2000"
              max="2100"
            />
          </div>
          
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cari Elevasi
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchElevation}
                onChange={(e) => {
                  setSearchElevation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Cari elevasi..."
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors mt-auto"
          >
            Reset Form
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left font-semibold border-b">Elevasi (mdpl)</th>
                <th className="p-3 text-left font-semibold border-b">Volume (m³)</th>
                <th className="p-3 text-left font-semibold border-b">Luas (m²)</th>
              </tr>
            </thead>
            <tbody>
              {currentElevations.map((elevation, index) => (
                <tr 
                  key={elevation} 
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50 transition-colors
                  `}
                >
                  <td className="p-3 border-b font-medium">{elevation.toFixed(2)}</td>
                  <td className="p-3 border-b">
                    <input
                      type="number"
                      value={formData[elevation].volume}
                      onChange={(e) => handleChange(elevation, 'volume', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan volume"
                      step="0.01"
                      required
                    />
                  </td>
                  <td className="p-3 border-b">
                    <input
                      type="number"
                      value={formData[elevation].area}
                      onChange={(e) => handleChange(elevation, 'area', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan luas"
                      step="0.01"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredElevations.length)} dari {filteredElevations.length} data
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            <span>{loading ? 'Menyimpan...' : 'Simpan Data GHW'}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataInputGhwContent;