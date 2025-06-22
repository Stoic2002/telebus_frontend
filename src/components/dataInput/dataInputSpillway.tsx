import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { IoWaterOutline, IoSaveOutline, IoCheckmarkCircleOutline, IoWarningOutline, IoCalendarOutline, IoTimeOutline, IoSpeedometerOutline } from 'react-icons/io5';
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

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

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
    <div className="p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Status Alert */}
        {status.message && (
          <Alert className={`mb-8 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'} rounded-xl shadow-lg`}>
            <div className="flex items-center space-x-3">
              {status.type === 'success' ? (
                <IoCheckmarkCircleOutline className="w-6 h-6 text-emerald-500" />
              ) : (
                <IoWarningOutline className="w-6 h-6 text-red-500" />
              )}
              <AlertDescription className="font-semibold text-lg">{status.message}</AlertDescription>
            </div>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <CardTitle className="text-xl flex items-center space-x-3">
              <IoSpeedometerOutline className="w-6 h-6" />
              <span>Spillway Control Parameters</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <IoCalendarOutline className="w-5 h-5 text-blue-600" />
                    <span>Tanggal Operasi</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white shadow-sm text-lg"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                    <IoTimeOutline className="w-5 h-5 text-blue-600" />
                    <span>Jam Operasi</span>
                  </label>
                  <select
                    name="jam"
                    value={formData.jam}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white shadow-sm text-lg"
                    required
                  >
                    <option value="">Pilih Jam Operasi</option>
                    {hourOptions.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Outflow Spillway Input */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center space-x-2">
                  <IoWaterOutline className="w-5 h-5 text-blue-600" />
                  <span>Outflow Spillway (m³/s)</span>
                </label>
                <input
                  type="number"
                  name="outflowSpillwayM3s"
                  value={formData.outflowSpillwayM3s}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white shadow-sm text-lg"
                  step="0.01"
                  required
                  placeholder="Masukkan debit spillway dalam m³/s"
                />
                <p className="text-sm text-gray-500 flex items-center space-x-1">
                  <span>💡</span>
                  <span>Debit spillway untuk kontrol banjir dan pengaturan level waduk</span>
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl transition-all focus:ring-4 focus:ring-blue-300 disabled:opacity-70 flex items-center justify-center space-x-3 shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Menyimpan Data...</span>
                    </>
                  ) : (
                    <>
                      <IoSaveOutline className="w-6 h-6" />
                      <span>Simpan Data Spillway</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center space-x-2">
            <IoSpeedometerOutline className="w-5 h-5" />
            <span>Informasi Spillway</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p><strong>Spillway Control</strong></p>
              <p>Mengatur aliran air untuk kontrol banjir dan menjaga level waduk</p>
            </div>
            <div>
              <p><strong>Parameter Input:</strong></p>
              <p>Debit air dalam satuan meter kubik per detik (m³/s)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputSpillway;