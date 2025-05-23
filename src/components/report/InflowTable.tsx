import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { InflowTableProps } from '@/types/reportTypes';



const InflowTable: React.FC<InflowTableProps> = ({ inflowData }) => {
    const data = inflowData[0]; // Assuming inflowData has at least one entry

    // Prepare a map for inflow values by jam and tanggal
    const inflowMap: { [key: number]: { [key: number]: number } } = {};

    data.content.forEach((day) => {
        day.item.forEach((entry) => {
            if (!inflowMap[entry.jam]) {
                inflowMap[entry.jam] = {};
            }
            // Ensure all inflow values are positive (absolute values)
            inflowMap[entry.jam][day.tanggal] = Math.abs(entry.inflow);
        });
    });

    const jamKeys = Object.keys(inflowMap).map(Number); // Get the jam keys
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
            const inflowValue = inflowMap[jam][tanggal];
            if (inflowValue !== undefined) {
                ata[tanggal] += inflowValue; // Sum for ATA
                max[tanggal] = Math.max(max[tanggal], inflowValue); // Max value
                min[tanggal] = Math.min(min[tanggal], inflowValue); // Min value
            }
        });

        // Calculate average for ATA
        const count = jamKeys.filter(jam => inflowMap[jam][tanggal] !== undefined).length;
        ata[tanggal] = count > 0 ? ata[tanggal] / count : 0;
    });

    // Helper function to format values with 2 decimal places
    const formatValue = (value: number): string => {
        return value.toFixed(2);
    };

    return (
        <div className="overflow-x-auto p-6 bg-white">
            <div className="text-center mt-2 flex items-center gap-4">
                {/* Div kiri: Logo */}
                <div className="flex h-full w-1/3">
                    <img src={data.header.logo} alt="Logo"  style={{width:300}}/>
                </div>

                {/* Div kanan: Informasi */}
                <div className="items-center text-center p-4">
                    <h1 className="text-xl font-bold">{data.header.judul}</h1>
                    <p>{data.header.unit}</p>
                    <p>{data.header.periode}</p>
                    <p>{data.header.lokasi}</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 mt-6">
                    <thead className='bg-slate-300'>
                        <tr>
                            <th className="border border-black p-1 pb-2 text-center text-[11px]" rowSpan={2}>Jam</th>
                            <th className="border border-black p-1 pb-2 text-center text-[11px]" colSpan={tanggalKeys.length}>Tanggal</th>
                        </tr>
                        <tr>
                            {tanggalKeys.map((tanggal) => (
                                <th key={tanggal} className="border border-black p-1 pb-2 text-center text-[11px]">
                                    {tanggal}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {jamKeys.map((jam) => (
                            <tr key={jam}>
                                <td className="border border-black p-1 pb-2 text-center text-[11px]">{jam}</td>
                                {tanggalKeys.map((tanggal) => (
                                    <td key={tanggal} className="border border-black p-1 pb-2 text-center text-[11px]">
                                        {inflowMap[jam][tanggal] !== undefined ? formatValue(inflowMap[jam][tanggal]) : '0.00'}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* ATA, MAX, and MIN Rows */}
                        <tr>
                            <td className="border border-black p-1 pb-2 text-center font-bold text-[11px]">AVG</td>
                            {tanggalKeys.map((tanggal) => (
                                <td key={tanggal} className="border border-black p-1 pb-2 text-center text-[11px]">
                                    {formatValue(ata[tanggal])}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="border border-black p-1 pb-2 text-center font-bold text-[11px]">MAX</td>
                            {tanggalKeys.map((tanggal) => (
                                <td key={tanggal} className="border border-black p-1 pb-2 text-center text-[11px]">
                                    {max[tanggal] !== Number.NEGATIVE_INFINITY ? formatValue(max[tanggal]) : '0.00'}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="border border-black p-1 pb-2 text-center font-bold text-[11px]">MIN</td>
                            {tanggalKeys.map((tanggal) => (
                                <td key={tanggal} className="border border-black p-1 pb-2 text-center text-[11px]">
                                    {min[tanggal] !== Number.POSITIVE_INFINITY ? formatValue(min[tanggal]) : '0.00'}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InflowTable;