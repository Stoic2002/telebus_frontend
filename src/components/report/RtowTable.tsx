import { RtowData } from '@/types/reportTypes';
import React from 'react';
import { IoCalendarOutline, IoLocationOutline, IoStatsChartOutline, IoTimeOutline, IoTrendingUpOutline } from 'react-icons/io5';

const RtowTable: React.FC<{ rtowData: RtowData }> = ({ rtowData }) => {
    // Mengelompokkan data berdasarkan bulan dan hari
  
    const groupedData: Record<string, Record<number, number>> = {};

    rtowData.data.forEach(item => {
        if (!groupedData[item.bulan]) {
            groupedData[item.bulan] = {};
        }
        groupedData[item.bulan][item.hari] = item.targetElevasi;
    });

    const months = Object.keys(groupedData);
    const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31

    return (
        <div className="bg-white min-h-screen">
            {/* Header Section with Enhanced Design */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center space-x-6">
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                                <img 
                                    src="/assets/ip-mrica-logo2.png" 
                                    alt="Logo" 
                                    className="w-24 h-24 object-contain"
                                />
                            </div>
                            
                            {/* Company Info */}
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold flex items-center space-x-3">
                                    <IoTrendingUpOutline className="w-8 h-8" />
                                    <span>PT. PLN INDONESIA POWER</span>
                                </h1>
                                <div className="space-y-1 text-teal-100">
                                    <p className="text-xl font-semibold">RENCANA TAHUNAN OPERASI WADUK</p>
                                    <p className="flex items-center space-x-2">
                                        <IoLocationOutline className="w-5 h-5" />
                                        <span>WADUK PLTA PB SOEDIRMAN</span>
                                    </p>
                                    <p className="flex items-center space-x-2 text-lg">
                                        <IoCalendarOutline className="w-5 h-5" />
                                        <span>{rtowData.tahun}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Report Type Badge */}
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <IoStatsChartOutline className="w-6 h-6" />
                                <span className="font-semibold text-lg">RTOW Report</span>
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
                                <IoTimeOutline className="w-6 h-6" />
                                <span>Annual Reservoir Operation Schedule - Target Elevation by Month</span>
                            </h2>
                        </div>

                        {/* Scrollable Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border border-slate-300 p-4 text-center text-sm font-bold text-slate-700 sticky left-0 bg-slate-100 z-10">
                                            Tanggal
                                        </th>
                                        {months.map((month, index) => (
                                            <th key={month} className={`border border-slate-300 p-3 text-center text-sm font-semibold text-slate-600 ${
                                                index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                                            }`}>
                                                <div className="flex flex-col items-center space-y-1">
                                                    <span className="font-bold">{month}</span>
                                                    <span className="text-xs text-slate-500">{rtowData.tahun}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {days.map((day, dayIndex) => (
                                        <tr key={day} className={dayIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-700 bg-slate-100 sticky left-0 z-10">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <span>{day}</span>
                                                </div>
                                            </td>
                                            {months.map((month, monthIndex) => {
                                                const value = groupedData[month][day];
                                                const hasValue = value !== undefined;
                                                
                                                return (
                                                    <td key={month} className={`border border-slate-300 p-3 text-center text-sm ${
                                                        hasValue 
                                                            ? 'font-semibold text-slate-700' 
                                                            : 'text-slate-400'
                                                    } ${monthIndex % 2 === 0 ? 'bg-slate-25' : 'bg-white'}`}>
                                                        {hasValue ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-blue-600 font-bold">{value}</span>
                                                                <span className="text-xs text-slate-500">mdpl</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-300">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Section */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 border-t border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl p-4 shadow-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-teal-100 p-3 rounded-lg">
                                            <IoCalendarOutline className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Report Year</p>
                                            <p className="text-xl font-bold text-slate-800">{rtowData.tahun}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 shadow-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-cyan-100 p-3 rounded-lg">
                                            <IoTimeOutline className="w-6 h-6 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Total Data Points</p>
                                            <p className="text-xl font-bold text-slate-800">{rtowData.data.length}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl p-4 shadow-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <IoStatsChartOutline className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-600">Coverage</p>
                                            <p className="text-xl font-bold text-slate-800">{months.length} Months</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 p-4 border-t border-slate-200">
                            <div className="flex justify-between items-center text-sm text-slate-600">
                                <span>Report generated on {new Date().toLocaleDateString('id-ID')}</span>
                                <span className="flex items-center space-x-1">
                                    <IoTrendingUpOutline className="w-4 h-4" />
                                    <span>All elevation values in MDPL (Meters Above Sea Level)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RtowTable;