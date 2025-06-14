import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IoLayersOutline, IoLocationOutline, IoCalendarOutline, IoStatsChartOutline, IoSpeedometerOutline } from 'react-icons/io5';
import { TmaTableProps } from '@/types/reportTypes';

const TmaTable: React.FC<TmaTableProps> = ({ tmaData }) => {
    const data = tmaData[0]; // Assuming tmaData has at least one entry

    // Prepare a map for TMA values by jam and tanggal
    const tmaMap: { [key: number]: { [key: number]: number } } = {};

    data.content.forEach((day) => {
        day.item.forEach((entry) => {
            if (!tmaMap[entry.jam]) {
                tmaMap[entry.jam] = {};
            }
            tmaMap[entry.jam][day.tanggal] = entry.tma;
        });
    });

    const jamKeys = Object.keys(tmaMap).map(Number); // Get the jam keys
    const tanggalKeys = data.content.map((day) => day.tanggal); // Get the tanggal keys

    // Calculate ATA, MAX, and MIN
    const ata: { [key: number]: number } = {};
    const max: { [key: number]: number } = {};
    const min: { [key: number]: number } = {};

    tanggalKeys.forEach((tanggal) => {
        ata[tanggal] = 0;
        max[tanggal] = Number.NEGATIVE_INFINITY;
        min[tanggal] = Number.POSITIVE_INFINITY;

        jamKeys.forEach((jam) => {
            const tmaValue = tmaMap[jam][tanggal];
            if (tmaValue !== undefined) {
                ata[tanggal] += tmaValue; // Sum for ATA
                max[tanggal] = Math.max(max[tanggal], tmaValue); // Max value
                min[tanggal] = Math.min(min[tanggal], tmaValue); // Min value
            }
        });

        // Calculate average for ATA
        const count = jamKeys.filter(jam => tmaMap[jam][tanggal] !== undefined).length;
        ata[tanggal] = count > 0 ? ata[tanggal] / count : 0;
    });

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section with Enhanced Design */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center space-x-6">
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                                <img 
                                    src={data.header.logo} 
                                    alt="Logo" 
                                    className="w-24 h-24 object-contain"
                                />
                            </div>
                            
                            {/* Company Info */}
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold flex items-center space-x-3">
                                    <IoSpeedometerOutline className="w-8 h-8" />
                                    <span>{data.header.judul}</span>
                                </h1>
                                <div className="space-y-1 text-emerald-100">
                                    <p className="flex items-center space-x-2 text-lg">
                                        <IoLocationOutline className="w-5 h-5" />
                                        <span>{data.header.unit}</span>
                                    </p>
                                    <p className="flex items-center space-x-2">
                                        <IoCalendarOutline className="w-4 h-4" />
                                        <span>{data.header.periode}</span>
                                    </p>
                                    <p className="text-sm opacity-90">{data.header.lokasi}</p>
                                </div>
                            </div>
                        </div>

                        {/* Report Type Badge */}
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <IoStatsChartOutline className="w-6 h-6" />
                                <span className="font-semibold text-lg">TMA Report</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4">
                            <h2 className="text-xl font-semibold flex items-center space-x-2">
                                <IoLayersOutline className="w-6 h-6" />
                                <span>Hourly Water Level Data (MDPL)</span>
                            </h2>
                        </div>

                        {/* Scrollable Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border border-slate-300 p-4 text-center text-sm font-bold text-slate-700" rowSpan={2}>
                                            Jam
                                        </th>
                                        <th className="border border-slate-300 p-4 text-center text-sm font-bold text-slate-700" colSpan={tanggalKeys.length}>
                                            Tanggal
                                        </th>
                                    </tr>
                                    <tr>
                                        {tanggalKeys.map((tanggal) => (
                                            <th key={tanggal} className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-600 bg-slate-50">
                                                {tanggal}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {jamKeys.map((jam, jamIndex) => (
                                        <tr key={jam} className={jamIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-700 bg-slate-100">
                                                {jam}:00
                                            </td>
                                            {tanggalKeys.map((tanggal) => (
                                                <td key={tanggal} className="border border-slate-300 p-3 text-center text-sm text-slate-600 font-medium">
                                                    {tmaMap[jam][tanggal] !== undefined ? tmaMap[jam][tanggal].toFixed(2) : '0.00'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {/* Statistics Rows */}
                                    <tr className="bg-gradient-to-r from-emerald-100 to-teal-100">
                                        <td className="border border-slate-300 p-3 text-center font-bold text-emerald-700 text-sm">AVG</td>
                                        {tanggalKeys.map((tanggal) => (
                                            <td key={tanggal} className="border border-slate-300 p-3 text-center text-sm font-bold text-emerald-600">
                                                {ata[tanggal].toFixed(2)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="bg-gradient-to-r from-green-100 to-emerald-100">
                                        <td className="border border-slate-300 p-3 text-center font-bold text-green-700 text-sm">MAX</td>
                                        {tanggalKeys.map((tanggal) => (
                                            <td key={tanggal} className="border border-slate-300 p-3 text-center text-sm font-bold text-green-600">
                                                {max[tanggal] !== Number.NEGATIVE_INFINITY ? max[tanggal].toFixed(2) : '0.00'}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="bg-gradient-to-r from-red-100 to-rose-100">
                                        <td className="border border-slate-300 p-3 text-center font-bold text-red-700 text-sm">MIN</td>
                                        {tanggalKeys.map((tanggal) => (
                                            <td key={tanggal} className="border border-slate-300 p-3 text-center text-sm font-bold text-red-600">
                                                {min[tanggal] !== Number.POSITIVE_INFINITY ? min[tanggal].toFixed(2) : '0.00'}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-200">
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Data generated on {new Date().toLocaleDateString('id-ID')}</span>
                                <span className="flex items-center space-x-1">
                                    <IoLayersOutline className="w-4 h-4" />
                                    <span>All values in MDPL (Meters Above Sea Level)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TmaTable;