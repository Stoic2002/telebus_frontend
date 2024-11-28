import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface RohData {
    header: {
        logo: string;
        judul: string;
    };
    content: {
        //1
        hariOrTanggal : string;
        estimasiInflow : number;
        targetELevasiHariIni : number;
        volumeTargetELevasiHariIni : number;
        realisasiElevasi : number;
        volumeRealisasiElevasi : number;
        estimasiIrigasi : number;
        estimasiDdcXTotalJamPembukaan : number;
        ddcJam : number;
        estimasiSpillwayTotalJamPembukaan : number;
        spillwayJam :number;
        //2
        estimasiVolumeWaduk :number;
        estimasiTotalDayaYangDiHasilkan: number;
        estimasiWadukSetelahOperasi: number;
        //3
        totalDaya: number
    };
}

interface Props {
    rohData: RohData[];
}

const RohTable: React.FC<Props> = ({ rohData }) => {
    const data = rohData[0];
    // const filteredData = data.content['ESTIMASI PEMBEBANAN PLTA PBS'].filter((item: any) => item.jam);
    // const midPoint = Math.ceil(filteredData.length / 2);

    return (
        <Card>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-black h-full">
                        <tbody className="bg-gray-300">
                            <tr>
                                <td colSpan={2} rowSpan={3} className="border border-black" style={{ width: '15%' }}>
                                    <img src="/assets/ip-mrica-logo.png" alt="Logo" className="w-40 h-auto mx-auto" />
                                </td>
                                <td align='center' colSpan={6} className="border border-black p-2 text-center font-semibold" style={{ width: '50%' }}>
                                    {data.header.judul}
                                </td>
                                <td align='center' colSpan={2} className="border border-black p-2 text-center" style={{ width: '15%' }}>
                                    No. Dokumen
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="font-semibold text-center border border-black p-2" style={{ width: '50%' }}>
                                    RENCANA OPERASI HARIAN
                                </td>
                                <td rowSpan={2} colSpan={2} className="text-center border border-black p-2" style={{ width: '15%' }}>
                                IK. MRC.03.01.05
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={10} className="border border-black p-2 text-center font-semibold">
                                    ESTIMASI INFLOW UNTUK ESTIMASI PEMBEBANAN PLTA PBS
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    HARI/TANGGAL
                                </td>
                                <td colSpan={4} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    {data.content.hariOrTanggal}
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI INFLOW
                                </td>
                                < td colSpan={1} className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiInflow}
                                </td>
                                <td colSpan={1} className="border border-black p-2" style={{ width: '10%' }}>
                                    m³/s
                                </td>
                                <td colSpan={1} className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiInflow * 24 * 3600}
                                </td>
                                <td colSpan={1} className="border border-black p-2" style={{ width: '10%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    TARGET ELEVASI HARI INI
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.targetELevasiHariIni}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    Mdpl
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.volumeTargetELevasiHariIni}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    REALISASI ELEVASI H-1 PUKUL 09.00
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.realisasiElevasi}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    Mpdl
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.volumeRealisasiElevasi}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI IRIGASI
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiIrigasi}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³/s
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiIrigasi * 24 * 3600}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={4} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI DDC X TOTAL JAM PEMBUKAAN
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.ddcJam}
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    jam
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiDdcXTotalJamPembukaan}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³/s
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiDdcXTotalJamPembukaan * 3600 * data.content.ddcJam}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={4} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI SPILLWAY X TOTAL JAM PEMBUKAAN
                                </td>
                                <td className=" border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.spillwayJam}
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    jam
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiSpillwayTotalJamPembukaan}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³/s
                                </td>
                                <td className="border border-black p-2 text-center" style={{ width: '10%' }}>
                                    {data.content.estimasiSpillwayTotalJamPembukaan * 3600 * data.content.spillwayJam}
                                </td>
                                <td className="border border-black p-2" style={{ width: '10%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={10} className="border border-black p-2 text-center font-semibold">
                                    ESTIMASI INFLOW S/D Target Elevasi
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI VOLUME WADUK
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    {data.content.volumeRealisasiElevasi + 
                                    (data.content.estimasiInflow * 24 * 3600) - 
                                    data.content.volumeTargetELevasiHariIni - 
                                    (data.content.estimasiIrigasi * 24 * 3600) - 
                                    (data.content.estimasiDdcXTotalJamPembukaan * 3600 * data.content.ddcJam) 
                                    - (data.content.estimasiSpillwayTotalJamPembukaan * 3600 * data.content.spillwayJam)}
                                </td>
                                <td colSpan={2} className="border border-black p-2" style={{ width: '20%' }}>
                                    m³
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI TOTAL DAYA YANG DIHASILKAN
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                {((data.content.volumeRealisasiElevasi + 
                                    (data.content.estimasiInflow * 24 * 3600) - 
                                    data.content.volumeTargetELevasiHariIni - 
                                    (data.content.estimasiIrigasi * 24 * 3600) - 
                                    (data.content.estimasiDdcXTotalJamPembukaan * 3600 * data.content.ddcJam) 
                                    - (data.content.estimasiSpillwayTotalJamPembukaan * 3600 * data.content.spillwayJam))-(data.content.estimasiIrigasi * 24 * 3600))/4.080}
                                </td>
                                <td colSpan={2} className="border border-black p-2" style={{ width: '20%' }}>
                                    MW
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI DAYA PER JAM
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                {(((data.content.volumeRealisasiElevasi + 
                                    (data.content.estimasiInflow * 24 * 3600) - 
                                    data.content.volumeTargetELevasiHariIni - 
                                    (data.content.estimasiIrigasi * 24 * 3600) - 
                                    (data.content.estimasiDdcXTotalJamPembukaan * 3600 * data.content.ddcJam) 
                                    - (data.content.estimasiSpillwayTotalJamPembukaan * 3600 * data.content.spillwayJam))-(data.content.estimasiIrigasi * 24 * 3600))/4.080)/24}
                                </td>
                                <td colSpan={2} className="border border-black p-2" style={{ width: '20%' }}>
                                    MW
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI OUTFLOW
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    {(data.content.totalDaya * 4.080) + (data.content.estimasiIrigasi * 24 * 3600)}
                                </td>
                                <td colSpan={2} className="border border-black p-2" style={{ width: '20%' }}>
                                m³
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    WATER CONSUMPTION 1 MW
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    1,16
                                </td>
                                <td colSpan={2} className="border border-black p-2" style={{ width: '20%' }}>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    WATER CONSUMPTION 1 MW TO 1 HOUR
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    4,080
                                </td>
                                <td colSpan={2} className="border border-black p-2">
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI VOLUME WADUK SETELAH UNIT BEROPERASI
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    {data.content.volumeRealisasiElevasi + 
                                    (data.content.estimasiInflow * 24 * 3600) - 
                                    (data.content.totalDaya * 4.080) + 
                                    (data.content.estimasiIrigasi * 24 * 3600) - 
                                    (data.content.estimasiIrigasi * 24 * 3600) -
                                    (data.content.estimasiDdcXTotalJamPembukaan * 3600 * data.content.ddcJam) -
                                    (data.content.estimasiSpillwayTotalJamPembukaan * 3600 * data.content.spillwayJam)
                                    }
                                </td>
                                
                                <td colSpan={2} className="border border-black p-2">
                                m³
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={6} className="border border-black p-2" style={{ width: '30%' }}>
                                    ESTIMASI ELEVASI WADUK SETELAH UNIT BEROPERASI
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center" style={{ width: '20%' }}>
                                    {data.content.estimasiWadukSetelahOperasi}
                                </td>
                                <td colSpan={2} className="border border-black p-2" style={{ width: '20%' }}>
                                    Mdpl
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={10} className="border border-black p-2 text-center font-semibold">
                                    ESTIMASI PEMBEBANAN PLTA PBS
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="border border-black p-2 text-center font-semibold" style={{ width: '15%' }}>
                                    JAM
                                </td>
                                <td colSpan={3} className="border border-black p-2 text-center font-semibold" style={{ width: '40%' }}>
                                    PEMBEBANAN SESUAI ESTIMASI INFLOW S/D TARGET ELEVASI (MW)
                                </td>
                                <td colSpan={2} className="border border-black p-2 text-center font-semibold" style={{ width: '15%' }}>
                                    JAM
                                </td>
                                <td colSpan={3} className="border border-black p-2 text-center font-semibold" style={{ width: '40%' }}>
                                    PEMBEBANAN SESUAI ESTIMASI INFLOW S/D TARGET ELEVASI (MW)
                                </td>
                            </tr>
                        </tbody>
                        {/* <tbody>
                            {filteredData.slice(0, midPoint).map((item: any, index: number) => (
                                <tr key={index}>
                                    <td colSpan={2} className="border border-black pb-2 text-center" style={{ width: '15%' }}>
                                        {item['jam']}
                                    </td>
                                    <td colSpan={3} className="border border-black pb-2 text-center" style={{ width: '35%' }}>
                                        {item['PEMBEBANAN SESUAI ESTIMASI INFLOW']}
                                    </td>
                                    {filteredData[midPoint + index] ? (
                                        <>
                                            <td colSpan={2} className="border border-black pb-2 text-center" style={{ width: '10%' }}>
                                                {filteredData[midPoint + index]['jam']}
                                            </td>
                                            <td colSpan={3} className="border border-black pb-2 text-center" style={{ width: '40%' }}>
                                                {filteredData[midPoint + index]['PEMBEBANAN SESUAI ESTIMASI INFLOW']}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td colSpan={2} className="border border-black p-2"></td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody> */}
                        <tbody>
                            <tr>
                                <td className="border border-black p-2 text-center font-semibold" style={{ width: '15%' }}>
                                    Total
                                </td>
                                <td colSpan={9} className="border border-black p-2 text-center font-semibold" style={{ width: '85%' }}>
                                    {data.content.totalDaya} 
                                </td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td colSpan={10} className="border border-black p-2 text-center">
                                    OK
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