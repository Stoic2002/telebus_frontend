import React, { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface FormData {
  tanggal: string;
  jam: string;
  targetLevel: string;
  outflowIrigasi: string;
  outflowDdcJam: string;
  outflowDdcM3s: string;
  outflowSpillwayJam: string;
  outflowSpillwayM3s: string;
}

interface StatusMessage {
  type: string;
  message: string;
}

const DataInputOperator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    tanggal: '',
    jam: '',
    targetLevel: '0',
    outflowIrigasi: '',
    outflowDdcJam: '1',
    outflowDdcM3s: '',
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
        outflow_irigasi: parseFloat(formData.outflowIrigasi) || 0,
        outflow_ddc_jam: parseInt(formData.outflowDdcJam, 10) || 0,
        outflow_ddc_m3s: parseFloat(formData.outflowDdcM3s) || 0,
        outflow_spillway_jam: parseInt(formData.outflowSpillwayJam, 10) || 0,
        outflow_spillway_m3s: parseFloat(formData.outflowSpillwayM3s) || 0,
      };

      const response = await fetch('http://192.168.105.90/api-target-harian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      
        body: JSON.stringify(requestBody),
      });

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
        outflowIrigasi: '',
        outflowDdcJam: '1',
        outflowDdcM3s: '',
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
    <Card className="w-full max-w-2xl mx-auto shadow-lg mt-6 mb-24">
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
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Jam
              </label>
              <select
                name="jam"
                value={formData.jam}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Pilih Jam</option>
                {hourOptions.map(hour => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Target Level (mdpl)
            </label>
            <input
              type="number"
              name="targetLevel"
              value={formData.targetLevel}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              step="0.01"
              required
              placeholder="Contoh: 228.50"
            />
          </div> */}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Outflow Irigasi (m³/s)
            </label>
            <input
              type="number"
              name="outflowIrigasi"
              value={formData.outflowIrigasi}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              step="0.01"
              required
              placeholder="Masukkan nilai outflow irigasi"
            />
          </div>

          {/* <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Outflow DDC (Jam)
              </label>
              <input
                type="number"
                name="outflowDdcJam"
                value={formData.outflowDdcJam}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                placeholder="Jam outflow DDC"
              />
            </div> */}
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Outflow DDC (m³/s)
              </label>
              <input
                type="number"
                name="outflowDdcM3s"
                value={formData.outflowDdcM3s}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                step="0.01"
                required
                placeholder="Debit DDC"
              />
            </div>
          {/* </div> */}

          {/* <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Outflow Spillway (Jam)
              </label>
              <input
                type="number"
                name="outflowSpillwayJam"
                value={formData.outflowSpillwayJam}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                placeholder="Jam outflow Spillway"
              />
            </div> */}
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Outflow Spillway (m³/s)
              </label>
              <input
                type="number"
                name="outflowSpillwayM3s"
                value={formData.outflowSpillwayM3s}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                step="0.01"
                required
                placeholder="Debit Spillway"
              />
            </div>
          {/* </div> */}

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