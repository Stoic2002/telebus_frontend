import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OperatorInputForm = () => {
  const [formData, setFormData] = useState({
    tanggal: '',
    targetLevel: '',
    outflowIrigasi: '',
    outflowDDC: '',
    outflowSpillway: ''
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Data yang disubmit:', formData);
    // Di sini Anda bisa menambahkan logika untuk mengirim data ke server
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Form Input Target Operasi Harian</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Target Level (mdpl)
            </label>
            <input
              type="number"
              name="targetLevel"
              value={formData.targetLevel}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              step="0.01"
              required
              placeholder="Masukkan target level"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Outflow Irigasi (m³/s)
            </label>
            <input
              type="number"
              name="outflowIrigasi"
              value={formData.outflowIrigasi}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              step="0.01"
              required
              placeholder="Masukkan outflow irigasi"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Outflow DDC (m³/s)
            </label>
            <input
              type="number"
              name="outflowDDC"
              value={formData.outflowDDC}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              step="0.01"
              required
              placeholder="Masukkan outflow DDC"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Outflow Spillway (m³/s)
            </label>
            <input
              type="number"
              name="outflowSpillway"
              value={formData.outflowSpillway}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              step="0.01"
              required
              placeholder="Masukkan outflow spillway"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Simpan Data
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default OperatorInputForm;