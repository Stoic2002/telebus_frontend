import { RtowData } from '@/types/reportTypes';
import React from 'react';



const RtowTable: React.FC<{ rtowData: RtowData }> = ({ rtowData }) => {
    // Mengelompokkan data berdasarkan bulan dan hari
    console.log('Received RTOW Data:', rtowData);
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
        <div className="overflow-x-auto p-6 bg-white">
            <div className="text-center mt-2 flex items-center gap-4">
                    {/* Div kiri: Logo */}
                    <div className="flex h-full w-1/3">
                        <img src="/assets/ip-mrica-logo2.png" alt="Logo" style={{width:300}}/>
                    </div>

                    {/* Div kanan: Informasi */}
                    <div className="items-center text-center p-4">
                        <h1 className="text-xl font-bold">PT. PLN INDONESIA POWER</h1>
                        <p>RENCANA TAHUNAN OPERASI WADUK</p>
                        <p>WADUK PLTA PB SOEDIRMAN</p>
                        <p>{rtowData.tahun}</p>
                        
                    </div>
                </div>
            <table className="min-w-full bg-white border border-gray-300 mt-6">
                <thead className='bg-slate-300'>
                    <tr>
                        <th className="border border-black p-2 text-center">Tanggal</th>
                        {months.map(month => (
                            <th key={month} className="border border-black p-2 text-center">{month}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        <tr key={day}>
                            <td className="border border-black p-2 text-center">{day}</td>
                            {months.map(month => (
                                <td key={month} className="border border-black p-2 text-center">
                                    {groupedData[month][day] !== undefined ? groupedData[month][day] : '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RtowTable;