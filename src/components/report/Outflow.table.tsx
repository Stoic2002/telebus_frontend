import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { IoWaterOutline, IoLocationOutline, IoCalendarOutline, IoStatsChartOutline, IoTrendingDownOutline } from 'react-icons/io5';
import { OutflowTableProps } from '@/types/reportTypes';

const OutflowTable: React.FC<OutflowTableProps> = ({ outflowData }) => {
    const data = outflowData[0]; // Assuming outflowData has at least one entry

    // Prepare a map for outflow values by jam and tanggal
    const outflowMap: { [key: number]: { [key: number]: number } } = {};

    data.content.forEach((day) => {
        day.item.forEach((entry) => {
            if (!outflowMap[entry.jam]) {
                outflowMap[entry.jam] = {};
            }
            outflowMap[entry.jam][day.tanggal] = entry.outflow;
        });
    });

    const jamKeys = Object.keys(outflowMap).map(Number); // Get the jam keys
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
            const outflowValue = outflowMap[jam][tanggal];
            if (outflowValue !== undefined) {
                ata[tanggal] += outflowValue; // Sum for ATA
                max[tanggal] = Math.max(max[tanggal], outflowValue); // Max value
                min[tanggal] = Math.min(min[tanggal], outflowValue); // Min value
            }
        });

        // Calculate average for ATA
        const count = jamKeys.filter(jam => outflowMap[jam][tanggal] !== undefined).length;
        ata[tanggal] = count > 0 ? ata[tanggal] / count : 0;
    });

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section with Enhanced Design */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8">
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
                                    <IoTrendingDownOutline className="w-8 h-8" />
                                    <span>{data.header.judul}</span>
                                </h1>
                                <div className="space-y-1 text-indigo-100">
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
                                <span className="font-semibold text-lg">Outflow Report</span>
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
                                <IoTrendingDownOutline className="w-6 h-6" />
                                <span>Hourly Outflow Data (m³/s)</span>
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
                                                    {outflowMap[jam][tanggal] !== undefined ? outflowMap[jam][tanggal].toFixed(2) : '0.00'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {/* Statistics Rows */}
                                    <tr className="bg-gradient-to-r from-purple-100 to-indigo-100">
                                        <td className="border border-slate-300 p-3 text-center font-bold text-purple-700 text-sm">AVG</td>
                                        {tanggalKeys.map((tanggal) => (
                                            <td key={tanggal} className="border border-slate-300 p-3 text-center text-sm font-bold text-purple-600">
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
                                    <IoTrendingDownOutline className="w-4 h-4" />
                                    <span>All values in m³/s</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutflowTable;