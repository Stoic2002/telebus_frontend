import React from 'react';
import { IoCalendarOutline } from 'react-icons/io5';
import { formatNumber } from '@/lib/utils/formatNumber';

interface RohInflowTableProps {
  data: {
    content: {
      hariOrTanggal: string;
      estimasiInflow: number;
      targetELevasiHariIni: number;
      volumeTargetELevasiHariIni: number;
      realisasiElevasi: number;
      volumeRealisasiElevasi: number;
      estimasiIrigasi: number;
      ddcJam: number;
      estimasiDdcXTotalJamPembukaan: number;
      spillwayJam: number;
      estimasiSpillwayTotalJamPembukaan: number;
    };
  };
}

const RohInflowTable: React.FC<RohInflowTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
        <h2 className="text-xl font-semibold text-center">
          ESTIMASI INFLOW UNTUK ESTIMASI PEMBEBANAN PLTA PBS
        </h2>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {/* Date Row */}
            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700 w-1/2">
                <div className="flex items-center space-x-2">
                  <IoCalendarOutline className="w-5 h-5" />
                  <span>TANGGAL</span>
                </div>
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-slate-900" colSpan={4}>
                {data.content.hariOrTanggal}
              </td>
            </tr>

            {/* Estimasi Inflow */}
            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI INFLOW
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-blue-600">
                {formatNumber(data.content.estimasiInflow)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                m³/s
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-blue-600">
                {formatNumber(data.content.estimasiInflow * 24 * 3600)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                m³
              </td>
            </tr>

            {/* Target Elevasi */}
            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                TARGET ELEVASI HARI INI
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-green-600">
                {data.content.targetELevasiHariIni.toFixed(2)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                Mdpl
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-green-600">
                {formatNumber(data.content.volumeTargetELevasiHariIni)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                m³
              </td>
            </tr>

            {/* Realisasi Elevasi */}
            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                REALISASI ELEVASI H-1 PUKUL 09.00
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-orange-600">
                {data.content.realisasiElevasi.toFixed(2)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                Mdpl
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-orange-600">
                {formatNumber(data.content.volumeRealisasiElevasi)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                m³
              </td>
            </tr>

            {/* Estimasi Irigasi */}
            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI IRIGASI
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-cyan-600">
                {data.content.estimasiIrigasi.toFixed(2)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                m³/s
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-cyan-600">
                {formatNumber(data.content.estimasiIrigasi * 24 * 3600)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600">
                m³
              </td>
            </tr>

            {/* DDC Row */}
            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI DDC X TOTAL JAM PEMBUKAAN
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-purple-600">
                {data.content.ddcJam} jam
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-purple-600">
                {data.content.estimasiDdcXTotalJamPembukaan} m³/s
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-purple-600" colSpan={2}>
                {formatNumber(data.content.estimasiDdcXTotalJamPembukaan * 3600 * data.content.ddcJam)} m³
              </td>
            </tr>

            {/* Spillway Row */}
            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI SPILLWAY X TOTAL JAM PEMBUKAAN
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-indigo-600">
                {data.content.spillwayJam} jam
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-indigo-600">
                {data.content.estimasiSpillwayTotalJamPembukaan} m³/s
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-indigo-600" colSpan={2}>
                {formatNumber(data.content.estimasiSpillwayTotalJamPembukaan * 3600 * data.content.spillwayJam)} m³
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RohInflowTable; 