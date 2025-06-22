import React from 'react';
import { formatNumber } from '@/lib/utils/formatNumber';

interface RohPowerTableProps {
  data: {
    content: {
      estimasiVolumeWaduk: number;
      estimasiIrigasi: number;
      estimasiVolumeWadukSetelahOperasi: number;
      estimasiElevasiWadukSetelahOperasi: number;
      totalDaya: number;
    };
  };
}

const RohPowerTable: React.FC<RohPowerTableProps> = ({ data }) => {
  return (
    <>
      {/* Power Generation Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 mt-8">
        <h2 className="text-xl font-semibold text-center">
          ESTIMASI INFLOW S/D Target Elevasi
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {/* Volume Calculations */}
            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI VOLUME WADUK
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-blue-600" colSpan={2}>
                {formatNumber(data.content.estimasiVolumeWaduk)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600" colSpan={2}>
                m³
              </td>
            </tr>

            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI TOTAL DAYA YANG DIHASILKAN (GROSS)
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-emerald-600" colSpan={2}>
                {formatNumber((data.content.estimasiVolumeWaduk - (data.content.estimasiIrigasi * 24 * 3600))/4080)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600" colSpan={2}>
                MW
              </td>
            </tr>

            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI DAYA PER JAM
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-teal-600" colSpan={2}>
                {(((data.content.estimasiVolumeWaduk - (data.content.estimasiIrigasi * 24 * 3600))/4080)/24).toFixed(2)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600" colSpan={2}>
                MW
              </td>
            </tr>

            {/* Constants and Final Results */}
            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                WATER CONSUMPTION 1 MW
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-slate-600" colSpan={4}>
                1.13
              </td>
            </tr>

            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                WATER CONSUMPTION 1 MW TO 1 HOUR
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-slate-600" colSpan={4}>
                4,080
              </td>
            </tr>

            <tr className="bg-slate-50">
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI VOLUME WADUK SETELAH UNIT BEROPERASI
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-indigo-600" colSpan={2}>
                {formatNumber(data.content.estimasiVolumeWadukSetelahOperasi)}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600" colSpan={2}>
                m³
              </td>
            </tr>

            <tr>
              <td className="border border-slate-300 p-4 font-semibold text-slate-700">
                ESTIMASI ELEVASI WADUK SETELAH UNIT BEROPERASI
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-purple-600" colSpan={2}>
                {data.content.estimasiElevasiWadukSetelahOperasi}
              </td>
              <td className="border border-slate-300 p-4 text-center text-slate-600" colSpan={2}>
                Mdpl
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Power Load Summary */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-4 mt-8">
        <h2 className="text-xl font-semibold text-center">
          ESTIMASI PEMBEBANAN PLTA PBS (NETT)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="border border-slate-300 p-4 font-bold text-slate-700 text-center">
                Total Beban
              </td>
              <td className="border border-slate-300 p-4 text-center font-bold text-orange-600 text-xl" colSpan={4}>
                {formatNumber(data.content.totalDaya)} MW
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RohPowerTable; 