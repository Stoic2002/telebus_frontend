import React, { useEffect, useState } from 'react';
import { IoDocumentTextOutline, IoLocationOutline, IoCalendarOutline, IoStatsChartOutline, IoSpeedometerOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';
import { rohDataProps } from '@/types/reportTypes';
import { formatNumber } from '@/lib/formatNumber';

const RohTable: React.FC<rohDataProps> = ({rohData}) => {
   
    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    const data = rohData[0];
    // const filteredData = data.content['ESTIMASI PEMBEBANAN PLTA PBS'].filter((item: any) => item.jam);
    // const midPoint = Math.ceil(filteredData.length / 2);

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center space-x-6">
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                                <img 
                                    src="/assets/ip-mrica-logo.png" 
                                    alt="Logo" 
                                    className="w-24 h-24 object-contain"
                                />
                            </div>
                            
                            {/* Company Info */}
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold flex items-center space-x-3">
                                    <IoDocumentTextOutline className="w-8 h-8" />
                                    <span>{data.header.judul}</span>
                                </h1>
                                <div className="space-y-1 text-slate-200">
                                    <p className="text-xl">RENCANA OPERASI HARIAN</p>
                                    <p className="text-sm opacity-90">Document No: IK. MRC.03.01.05</p>
                                </div>
                            </div>
                        </div>

                        {/* Report Type Badge */}
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <IoStatsChartOutline className="w-6 h-6" />
                                <span className="font-semibold text-lg">ROH Report</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
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

                        {/* Status Indicator */}
                        <div className="mt-6">
                            <div 
                                className={`p-6 text-center text-white font-bold text-xl rounded-xl ${
                                    data.content.estimasiVolumeWadukSetelahOperasi > data.content.targetELevasiHariIni
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                        : "bg-gradient-to-r from-red-500 to-red-600"
                                }`}
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    {data.content.estimasiVolumeWadukSetelahOperasi > data.content.targetELevasiHariIni ? (
                                        <>
                                            <IoCheckmarkCircleOutline className="w-8 h-8" />
                                            <span>OPERATION STATUS: OK</span>
                                        </>
                                    ) : (
                                        <>
                                            <IoWarningOutline className="w-8 h-8" />
                                            <span>OPERATION STATUS: WARNING</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-200 mt-6">
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Report generated on {new Date().toLocaleDateString('id-ID')}</span>
                                <span>PT. PLN Indonesia Power - Unit Pembangkitan Mrica</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default RohTable;