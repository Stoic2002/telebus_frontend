// components/report/RohTable.tsx

import React from 'react';
import { Card, CardHeader, CardContent, } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell,   } from '@/components/ui/table';
import { TableCellsMerge, TableColumnsSplit } from 'lucide-react';

interface RohData {
    header: {
        logo: string;
        judul: string;
        'no dokumen': string;
    };
    content: {
        [key: string]: any; // Mengizinkan konten dengan berbagai tipe data
    };
}

interface Props {
    rohData: RohData[];
}

const RohTable: React.FC<Props> = ({ rohData }) => {
    const data = rohData[0];

    return (

        <Card>
        <CardContent>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <tbody className="bg-gray-200">
                    <tr>
                        <td colSpan={2} rowSpan={3} className="border border-gray-300">
                            <img src="/assets/ip-mrica-logo.png" alt="Logo" className="w-40 h-auto mx-auto" />
                        </td>
                        <td colSpan={6} className="border border-gray-300 p-2 text-center font-semibold">
                            {data.header.judul}
                        </td>
                        <td colSpan={2} className="border border-gray-300 p-2 text-center">
                            No. Dokumen
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={6} className="font-semibold text-center border border-gray-300 p-2">RENCANA OPERASI HARIAN</td>
                        <td rowSpan={2} colSpan={2} className="text-center border border-gray-300 p-2">{data.header['no dokumen']}</td>
                    </tr>
                    
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={10} className="border border-gray-300 p-2 text-center font-semibold">
                    ESTIMASI INFLOW UNTUK ESTIMASI PEMBEBANAN PLTA PBS
                        </td>

                    </tr>
                </tbody>
                <tbody>
                    <tr>
                    <td colSpan={6} className="border border-gray-300 p-2">
                            HARI/TANGGAL
                        </td>
                    <td colSpan={4} className="border border-gray-300 p-2 text-center">
                            31-Oct-24
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 ">
                    ESTIMASI INFLOW 
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            30,16
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³/s    
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            26345
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2">
                    TARGET ELEVASI HARI INI
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            30,16
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³/s    
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            26345
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2">
                    REALISASI ELEVASI H-1 PUKUL 09.00
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            30,16
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³/s    
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            26345
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2">
                    ESTIMASI IRIGASI
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            30,16
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³/s    
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            26345
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={4} className="border border-gray-300 p-2 ">
                    ESTIMASI DDC X TOTAL JAM PEMBUKAAN 
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                    jam
                        </td>
                        
                    <td className="border border-gray-300 p-2 text-center">
                            30,16
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³/s    
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            26345
                        </td>
                    <td className="border border-gray-300 p-2">
                            m³
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={4} className="border border-gray-300 p-2">
                    ESTIMASI SPILLWAY X TOTAL JAM PEMBUKAAN
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                    jam
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            30,16
                        </td>
                    <td className="border border-gray-300 p-2 ">
                            m³/s    
                        </td>
                    <td className="border border-gray-300 p-2 text-center">
                            26345
                        </td>
                    <td className="border border-gray-300 p-2 ">
                            m³
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={10} className="border border-gray-300 p-2 text-center font-semibold">
                    ESTIMASI INFLOW
                    S/D Target Elevasi
                        </td>

                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2">
                    ESTIMASI VOLUME WADUK
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 ">
                    ESTMASI TOTAL DAYA YANG DIHASILKAN
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>
                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 ">
                    ESTIMASI SPILLWAY X TOTAL JAM PEMBUKAAN
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>

                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 ">
                    ESTIMASI DAYA PER JAM
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td  colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>

                    </tr>
                </tbody>
                <tbody>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2  ">
                    ESTIMASI OUTFLOW
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>
                
                    </tr>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2  ">
                    ESTIMASI VOLUME WADUK SETELAH UNIT BEROPERASI
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>
                
                    </tr>
                <tr>
                    <td colSpan={6} className="border border-gray-300 p-2 ">
                    ESTIMASI ELEVASI WADUK SETELAH UNIT BEROPERASI
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 text-center">
                    0
                        </td>
                    <td colSpan={2} className="border border-gray-300 p-2 ">
                    jam
                        </td>
                
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                    <td colSpan={10} className="border border-gray-300 p-2 text-center font-semibold">
                    ESTIMASI PEMBEBANAN PLTA PBS
                        </td>
                    </tr>
                    <tr>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                    jam
                        </td>
                    <td colSpan={9} className="border border-gray-300 p-2 text-center font-semibold">
                    PEMBEBANAN SESUAI ESTIMASI INFLOW 
S/D TARGET ELEVASI (MW)
                        </td>
                    </tr>
                    
                    {data.content['ESTIMASI PEMBEBANA PLTA PBS']
                                .filter((item: any) => item.jam) // Filter out the 'total' item
                                .map((item:any, index: number) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2 text-center">
                                            {item['jam']}
                                        </td>
                                        <td colSpan={9} className="border border-gray-300 p-2 text-center">
                                            {item['PEMBEBANAN SESUAI ESTIMASI INFLOW']}
                                        </td>
                                    </tr>
                            ))}
                        <tr>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                    Total
                        </td>
                    <td colSpan={9} className="border border-gray-300 p-2 text-center font-semibold">
                    {(data.content['ESTIMASI PEMBEBANA PLTA PBS']
            .filter((item: any) => item.jam) 
            .reduce((acc: number, item: any) => acc + Number(item['PEMBEBANAN SESUAI ESTIMASI INFLOW']), 0)/2)}
                        </td>
                    </tr>
                 
                </tbody>
            </table>
        </div>
        </CardContent>
        </Card>

    );
};

export default RohTable;