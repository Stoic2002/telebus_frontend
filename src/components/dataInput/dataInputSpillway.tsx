import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { IoWaterOutline, IoSaveOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';
import { fetchWithRetry } from '@/hooks/fetchWithRetry';
import axios from 'axios';

interface FormData {
  tanggal: string;
  jam: string;
  targetLevel: string;
  outflowSpillwayJam: string;
  outflowSpillwayM3s: string;
}

interface StatusMessage {
  type: string;
  message: string;
}

const DataInputSpillway: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    tanggal: '',
    jam: '',
    targetLevel: '0',
    outflowSpillwayJam: '1',
    outflowSpillwayM3s: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusMessage>({ type: '', message: '' });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Combine date and time into the required format
      const combinedDateTime = `${formData.tanggal} ${formData.jam}:00`;

      // console.log(combinedDateTime);

      // Prepare request body
      const requestBody = {
        tanggal: combinedDateTime,
        target_level: parseFloat(formData.targetLevel) || 0,
        outflow_spillway_jam: parseInt(formData.outflowSpillwayJam, 10) || 0,
        outflow_spillway_m3s: parseFloat(formData.outflowSpillwayM3s) || 0,
      };

     const response = await fetchWithRetry(
              () => axios.post('http://192.168.105.90/input-spillway', requestBody),
              3, // max attempts
              1000 // delay in ms
            );

    //   const response = await fetch('http://192.168.105.90/input-spillway', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
      
    //     body: JSON.stringify(requestBody),
    //   });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

      console.log(requestBody);

      setStatus({
        type: 'success',
        message: 'Data berhasil disimpan!',
      });

      // Reset form after successful submission
      setFormData({
        tanggal: '',
        jam: '',
        targetLevel: '0',
        outflowSpillwayJam: '1',
        outflowSpillwayM3s: '',
      });
    } catch (error) {
      console.error(error);
      setStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat menyimpan data',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate hour options from 00:00 to 23:00
  const hourOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 py-8 px-4">
      <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
          <CardTitle className="text-center text-xl flex items-center justify-center space-x-3">
            <IoWaterOutline className="w-8 h-8" />
            <span>Form Input Target Operasi Harian Spillway</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {status.message && (
            <Alert className={`mb-6 ${status.type === 'success' ? 'bg-green-50/80 text-green-700 border-green-200' : 'bg-red-50/80 text-red-700 border-red-200'} backdrop-blur-sm`}>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <span>Tanggal</span>
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/90 backdrop-blur-sm shadow-sm"
                  required
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <span>Jam</span>
                </label>
                <select
                  name="jam"
                  value={formData.jam}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/90 backdrop-blur-sm shadow-sm"
                  required
                >
                  <option value="">Pilih Jam</option>
                  {hourOptions.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <IoWaterOutline className="w-4 h-4 text-purple-500" />
                <span>Outflow Spillway (m³/s)</span>
              </label>
              <input
                type="number"
                name="outflowSpillwayM3s"
                value={formData.outflowSpillwayM3s}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white/90 backdrop-blur-sm shadow-sm"
                step="0.01"
                required
                placeholder="Debit Spillway"
              />
            </div>
          {/* </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-105 disabled:hover:scale-100"
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
        </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataInputSpillway;