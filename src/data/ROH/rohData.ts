import { RohData } from "@/components/report/RohTable";

export const rohData  = [{
  header: {
    logo: "/assets/ip-mrica-logo2.png",
    judul: "LAPORAN ROH HARIAN",
  },
  content: {
    // Bagian 1
    hariOrTanggal: "2024-11-25",
    estimasiInflow: 150.25, // dalam m3/s
    targetELevasiHariIni: 105.50, // dalam mdpl
    volumeTargetELevasiHariIni: 2000.75, // dalam juta m3
    realisasiElevasi: 105.35, // dalam mdpl
    volumeRealisasiElevasi: 1998.30, // dalam juta m3
    estimasiIrigasi: 50.45, // dalam m3/s
    estimasiDdcXTotalJamPembukaan: 12.5, // dalam m3/s
    ddcJam: 4, // jam
    estimasiSpillwayTotalJamPembukaan: 15.3, // dalam m3/s
    spillwayJam: 6, // jam
    
    // Bagian 2
    estimasiVolumeWaduk: 2001.25, // dalam juta m3
    estimasiTotalDayaYangDiHasilkan: 250.5, // dalam MW
    estimasiWadukSetelahOperasi: 1997.45, // dalam juta m3

    // Bagian 3
    totalDaya: 245.75, // dalam MW
  },
}];
