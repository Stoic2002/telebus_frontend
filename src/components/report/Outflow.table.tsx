import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
                                <th className="border border-black p-1 pb-2 text-center" rowSpan={2}>Jam</th>
                                <th className="border border-black p-1 pb-2 text-center" colSpan={tanggalKeys.length}>Tanggal</th>
                            </tr>
                            <tr>
                                {tanggalKeys.map((tanggal) => (
                                    <th key={tanggal} className="border border-black p-1 pb-2 text-center">
                                        {tanggal}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {jamKeys.map((jam) => (
                                <tr key={jam}>
                                    <td className="border border-black p-1 pb-2 text-center">{jam}</td>
                                    {tanggalKeys.map((tanggal) => (
                                        <td key={tanggal} className="border border-black p-1 pb-2 text-center">
                                            {outflowMap[jam][tanggal] !== undefined ? outflowMap[jam][tanggal] : '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* ATA, MAX, and MIN Rows */}
                            <tr>
                                <td className="border border-black p-1 pb-2 text-center font-bold">AVG</td>
                                {tanggalKeys.map((tanggal) => (
                                    <td key={tanggal} className="border border-black p-1 pb-2 text-center">
                                        {ata[tanggal].toFixed(2)}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="border border-black p-1 pb-2 text-center font-bold">MAX</td>
                                {tanggalKeys.map((tanggal) => (
                                    <td key={tanggal} className="border border-black p-1 pb-2 text-center">
                                        {max[tanggal] !== Number.NEGATIVE_INFINITY ? max[tanggal] : '-'}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="border border-black p-1 pb-2 text-center font-bold">MIN</td>
                                {tanggalKeys.map((tanggal) => (
                                    <td key={tanggal} className="border border-black p-1 pb-2 text-center">
                                        {min[tanggal] !== Number.POSITIVE_INFINITY ? min[tanggal] : '-'}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
    );
};

export default OutflowTable;