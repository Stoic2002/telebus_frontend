import { calcData } from "@/components/dataInput/DataCalculationContent";

export const dummyCalcData: calcData = {
    inflow: {
      waterLevelBefore: 50.5, // dalam meter
      volumeEffectiveBefore: 1200000, // dalam m³
      waterLevelActual: 51.2, // dalam meter
      volumeEffectiveActual: 1230000, // dalam m³
      totalLoadUnit: 150, // dalam MW
      turbine: 2, // jumlah turbin yang beroperasi
      ouflowIrrigation: 25, // dalam m³/s
      outflowDdc: 30, // dalam m³/s
      outflowSpillway: 10, // dalam m³/s
    },
    roh: {
      hariOrTanggal: "2024-12-09", // Format ISO untuk tanggal
      estimasiInflow: 30.16, // dalam m³/s
      targetELevasiHariIni: 229.23, // dalam meter
      volumeTargetELevasiHariIni: 6195029.26, // dalam m³
      realisasiElevasi: 229.18, // dalam meter
      volumeRealisasiElevasi: 5972608.04, // dalam m³
      estimasiIrigasi: 11, // dalam m³/s
      estimasiDdcXTotalJamPembukaan: 0, // dalam m³
      ddcJam: 0, // dalam jam
      estimasiSpillwayTotalJamPembukaan: 0, // dalam m³
      spillwayJam: 0, // dalam jam
      estimasiElevasiWadukSetelahOperasi: 229.24, // dalam mdpl
      totalDaya: 148 // dalam MW
    }
  };
  