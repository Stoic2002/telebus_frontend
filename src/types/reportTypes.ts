import TmaTable from '../components/report/TmaTable';
//elevation
export interface ElevationData {
    id: number;
    elevation: string;
    volume: string;
    area: string;
}

export interface ReportData {
    id: number;
    year: number;
    status: string;
    elevationData: ElevationData[];
}

export interface ElevationTableProps {
    report: ReportData;
}

//inflow
export interface HeaderInflow {
    logo: string;
    judul: string;
    unit: string;
    periode: string;
    lokasi: string;
}

export interface ItemInflow {
    jam: number;
    inflow: number;
}

export interface ContentInflow {
    tanggal: number;
    item: ItemInflow[];
}

export interface InflowData {
    header: HeaderInflow;
    content: ContentInflow[];
}

export interface InflowTableProps {
    inflowData: InflowData[]; 
}

//outflow
interface HeaderOutflow {
    logo: string;
    judul: string;
    unit: string;
    periode: string;
    lokasi: string;
}

interface ItemOutflow {
    jam: number;
    outflow: number;
}

interface ContentOutflow {
    tanggal: number;
    item: ItemOutflow[];
}

interface OutflowData {
    header: HeaderOutflow;
    content: ContentOutflow[];
}

export interface OutflowTableProps {
    outflowData: OutflowData[]; // Expecting an array of outflowData
}

//rtow
interface DataItem {
    id: number;
    bulan: string;
    hari: number;
    targetElevasi: number;
    rtowId: number;
    createdAt: string;
    updatedAt: string;
}

export interface RtowData {
    id: number;
    tahun: string;
    createdAt: string;
    updatedAt: string;
    data: DataItem[];
}

//tma
interface HeaderTma {
    logo: string;
    judul: string;
    unit: string;
    periode: string;
    lokasi: string;
}

interface ItemTma {
    jam: number;
    tma: number;
}

interface ContentTma {
    tanggal: number;
    item: ItemTma[];
}

interface TmaData {
    header: HeaderTma;
    content: ContentTma[];
}

export interface TmaTableProps {
    tmaData: TmaData[]; // Expecting an array of TmaData
}