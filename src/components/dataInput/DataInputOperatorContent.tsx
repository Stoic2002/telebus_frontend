import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const DataInputOperator = () => {
  const [formData, setFormData] = useState({
    tanggal: '',
    targetLevel: '',
    outflowIrigasi: '',
    outflowDDCJam: '',
    outflowDDCM3s: '',
    outflowSpillwayJam: '',
    outflowSpillwayM3s: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const requestBody = {
      tanggal: formData.tanggal,
      target_level: parseFloat(formData.targetLevel) || 0,
      outflow_irigasi: parseFloat(formData.outflowIrigasi) || 0,
      outflow_ddc_jam: parseFloat(formData.outflowDDCJam) || 0,
      outflow_ddc_m3s: parseFloat(formData.outflowDDCM3s) || 0,
      outflow_spillway_jam: parseFloat(formData.outflowSpillwayJam) || 0,
      outflow_spillway_m3s: parseFloat(formData.outflowSpillwayM3s) || 0
    };

    try {
      const response = await fetch('http://192.168.105.90/api-target-harian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

      setStatus({
        type: 'success',
        message: 'Data berhasil disimpan!'
      });
      
      // Reset form after successful submission
      setFormData({
        tanggal: '',
        targetLevel: '',
        outflowIrigasi: '',
        outflowDDCJam: '',
        outflowDDCM3s: '',
        outflowSpillwayJam: '',
        outflowSpillwayM3s: ''
      });

    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat menyimpan data'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg mt-6 mb-24">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800">
        <CardTitle className="text-center text-white text-xl">
          Form Input Target Operasi Harian
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {status.message && (
          <Alert className={`mb-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Target Level (mdpl)
            </label>
            <input
              type="number"
              name="targetLevel"
              value={formData.targetLevel}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              step="0.01"
              required
              placeholder="Contoh: 228.50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Outflow Irigasi (m³/s)
            </label>
            <input
              type="number"
              name="outflowIrigasi"
              value={formData.outflowIrigasi}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              step="0.01"
              required
              placeholder="Masukkan nilai outflow irigasi"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Outflow DDC
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="outflowDDCJam"
                  value={formData.outflowDDCJam}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  step="0.01"
                  required
                  placeholder="Jam"
                />
                <span className="text-xs text-gray-500 mt-1 block">Jam</span>
              </div>
              <div>
                <input
                  type="number"
                  name="outflowDDCM3s"
                  value={formData.outflowDDCM3s}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  step="0.01"
                  required
                  placeholder="m³/s"
                />
                <span className="text-xs text-gray-500 mt-1 block">m³/s</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Outflow Spillway
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="outflowSpillwayJam"
                  value={formData.outflowSpillwayJam}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  step="0.01"
                  required
                  placeholder="Jam"
                />
                <span className="text-xs text-gray-500 mt-1 block">Jam</span>
              </div>
              <div>
                <input
                  type="number"
                  name="outflowSpillwayM3s"
                  value={formData.outflowSpillwayM3s}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  step="0.01"
                  required
                  placeholder="m³/s"
                />
                <span className="text-xs text-gray-500 mt-1 block">m³/s</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{loading ? 'Menyimpan...' : 'Simpan Data'}</span>
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataInputOperator;