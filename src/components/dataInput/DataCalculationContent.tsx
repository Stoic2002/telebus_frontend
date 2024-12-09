import React from 'react';


export interface calcData {
  inflow: {
      waterLevelBefore: number;
      volumeEffectiveBefore: number;
      waterLevelActual: number;
      volumeEffectiveActual:number;
      totalLoadUnit: number;
      turbine: number;
      ouflowIrrigation: number;
      outflowDdc:number;
      outflowSpillway:number;

  };
  roh: {
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
      estimasiElevasiWadukSetelahOperasi: number;
      //3
      totalDaya: number
  };
}

interface Props {
  calcData: calcData[];
}
const DataCalculationContent: React.FC<Props> = ({ calcData }) => {
  const data = calcData[0];

  return (
    <div className="bg-white rounded-lg shadow-2xl p-8">
      <h2 className="text-3xl font-bold mb-6">INFLOW CALCULATION</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">TMA 1 JAM SEBELUM</td>
              <td className="py-4 px-6 text-right">{data.inflow.waterLevelBefore} mdpl</td>
              <td className="py-4 px-6 text-right">{data.inflow.volumeEffectiveBefore} m3</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">TMA ACTUAL</td>
              <td className="py-4 px-6 text-right">{data.inflow.waterLevelActual} mdpl</td>
              <td className="py-4 px-6 text-right">{data.inflow.volumeEffectiveActual} m3</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">TOTAL LOAD UNIT</td>
              <td className="py-4 px-6 text-right">{data.inflow.totalLoadUnit} MW</td>
              <td className="py-4 px-6 text-right">{data.inflow.turbine} M3/s</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">OUTFLOW IRRIGATION</td>
              <td className="py-4 px-6 text-right">{data.inflow.ouflowIrrigation} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">OUTFLOW DDC</td>
              <td className="py-4 px-6 text-right">{data.inflow.outflowDdc} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">OUTFLOW SPILLWAY</td>
              <td className="py-4 px-6 text-right">{data.inflow.outflowSpillway} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-left font-medium">TOTAL INFLOW CALCULATION</td>
              <td className="py-4 px-6 text-right">{(((data.inflow.volumeEffectiveActual - data.inflow.volumeEffectiveBefore)/3600)+ data.inflow.turbine + data.inflow.ouflowIrrigation + data.inflow.outflowDdc + data.inflow.outflowSpillway).toFixed(2)} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-3xl font-bold mt-12 mb-6">ROH CALCULATION</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">INFLOW AVG 3 HARI SEBELUMNYA</td>
              <td className="py-4 px-6 text-right">{data.roh.estimasiInflow} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">TARGET ELEVASI HARI INI</td>
              <td className="py-4 px-6 text-right">{data.roh.targetELevasiHariIni} mdpl</td>
              <td className="py-4 px-6 text-right">{data.roh.volumeTargetELevasiHariIni} m3</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">REALISASI ELEVASI</td>
              <td className="py-4 px-6 text-right">{data.roh.realisasiElevasi} mdpl</td>
              <td className="py-4 px-6 text-right">{data.roh.volumeRealisasiElevasi} m3</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">OUTFLOW IRRIGATION</td>
              <td className="py-4 px-6 text-right">{data.roh.estimasiIrigasi} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">OUTFLOW DDC</td>
              <td className="py-4 px-6 text-right">{data.roh.estimasiDdcXTotalJamPembukaan} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-left font-medium">OUTFLOW SPILLWAY</td>
              <td className="py-4 px-6 text-right">{data.roh.estimasiSpillwayTotalJamPembukaan} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">EST VOLUME WADUK</td>
              <td className="py-4 px-6 text-right"> {(data.roh.volumeRealisasiElevasi + 
                                    (data.roh.estimasiInflow * 24 * 3600) - 
                                    data.roh.volumeTargetELevasiHariIni - 
                                    (data.roh.estimasiIrigasi * 24 * 3600) - 
                                    (data.roh.estimasiDdcXTotalJamPembukaan * 3600 * data.roh.ddcJam) 
                                    - (data.roh.estimasiSpillwayTotalJamPembukaan * 3600 * data.roh.spillwayJam)).toFixed(2)} m3</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">EST TOTAL DAYA DIHASILKAN</td>
              <td className="py-4 px-6 text-right">{(((data.roh.volumeRealisasiElevasi + 
                                    (data.roh.estimasiInflow * 24 * 3600) - 
                                    data.roh.volumeTargetELevasiHariIni - 
                                    (data.roh.estimasiIrigasi * 24 * 3600) - 
                                    (data.roh.estimasiDdcXTotalJamPembukaan * 3600 * data.roh.ddcJam) 
                                    - (data.roh.estimasiSpillwayTotalJamPembukaan * 3600 * data.roh.spillwayJam))-(data.roh.estimasiIrigasi * 24 * 3600))/4176).toFixed(2)} MW</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">EST DAYA PERJAM</td>
              <td className="py-4 px-6 text-right"> {((((data.roh.volumeRealisasiElevasi + 
                                    (data.roh.estimasiInflow * 24 * 3600) - 
                                    data.roh.volumeTargetELevasiHariIni - 
                                    (data.roh.estimasiIrigasi * 24 * 3600) - 
                                    (data.roh.estimasiDdcXTotalJamPembukaan * 3600 * data.roh.ddcJam) 
                                    - (data.roh.estimasiSpillwayTotalJamPembukaan * 3600 * data.roh.spillwayJam))-(data.roh.estimasiIrigasi * 24 * 3600))/4176)/24).toFixed(2)} MW</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">EST OUTFLOW</td>
              <td className="py-4 px-6 text-right"> {(data.roh.totalDaya * 4.080) + (data.roh.estimasiIrigasi * 24 * 3600)} m3/s</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">WATER CONSUMPTION 1 MW</td>
              <td className="py-4 px-6 text-right">1,16</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">WATER CONSUMPTION 1 MW - 1H</td>
              <td className="py-4 px-6 text-right">4176</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">EST VOL WADUK AFTER OPERASI</td>
              <td className="py-4 px-6 text-right">  {(data.roh.volumeRealisasiElevasi + 
                                    (data.roh.estimasiInflow * 24 * 3600) - 
                                    (data.roh.totalDaya * 4176) + 
                                    (data.roh.estimasiIrigasi * 24 * 3600) - 
                                    (data.roh.estimasiIrigasi * 24 * 3600) -
                                    (data.roh.estimasiDdcXTotalJamPembukaan * 3600 * data.roh.ddcJam) -
                                    (data.roh.estimasiSpillwayTotalJamPembukaan * 3600 * data.roh.spillwayJam)
                                    ).toFixed(2)} m3</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">EST ELV WADUK AFTER OPERASI</td>
              <td className="py-4 px-6 text-right">{data.roh.estimasiElevasiWadukSetelahOperasi} mdpl</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 px-6 text-left font-medium">TOTAL DAYA</td>
              <td className="py-4 px-6 text-right">{data.roh.totalDaya} MW</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
            <tr>
              <td className="py-4 px-6 text-left font-medium">STATUS</td>
              <td className="py-4 px-6 text-right">{data.roh.estimasiDdcXTotalJamPembukaan < data.roh.targetELevasiHariIni ? "OK" : "WARNING"}</td>
              <td className="py-4 px-6 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataCalculationContent;