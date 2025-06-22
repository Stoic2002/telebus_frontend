import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx-js-style';
import html2canvas from 'html2canvas';
import { RohData } from '@/types/reportTypes';

type FormattedHourlyData = {
  headers: string[];
  data: (string | number)[][];
};

// Helper function to apply consistent cell styling
const applyCellStyle = (
  worksheet: XLSX.WorkSheet, 
  cellAddress: string, 
  alignment: { horizontal: string; vertical: string } = { horizontal: 'center', vertical: 'middle' },
  font?: { bold?: boolean },
  fill?: { patternType: string; fgColor: { rgb: string } }
) => {
  // Ensure cell exists
  if (!worksheet[cellAddress]) {
    worksheet[cellAddress] = { v: '', t: 's' };
  }
  
  // Initialize or update style object with xlsx-js-style format
  worksheet[cellAddress].s = {
    alignment: alignment,
    ...(font && { font: font }),
    ...(fill && { fill: fill })
  };
};

// Helper function to apply styles to a range of cells
const applyRangeStyle = (
  worksheet: XLSX.WorkSheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number,
  alignment: { horizontal: string; vertical: string } = { horizontal: 'center', vertical: 'middle' },
  font?: { bold?: boolean },
  fill?: { patternType: string; fgColor: { rgb: string } }
) => {
  for (let R = startRow; R <= endRow; R++) {
    for (let C = startCol; C <= endCol; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      applyCellStyle(worksheet, cellAddress, alignment, font, fill);
    }
  }
};

export const downloadPDF = async (
  reportRef: React.RefObject<HTMLDivElement>,
  selectedReport: string,
  startDate: string,
  endDate: string
) => {
  if (!reportRef.current) return;

  try {
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    const formattedStartDate = new Date(startDate).toLocaleDateString('id-ID');
    const filename = selectedReport === 'ROH' 
      ? `${selectedReport}_${formattedStartDate}.pdf`
      : `${selectedReport}_${formattedStartDate}_${new Date(endDate).toLocaleDateString('id-ID')}.pdf`;
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Gagal membuat PDF. Silakan coba lagi.');
  }
};

const formatHourlyData = (data: any, valueKey: string): FormattedHourlyData => {
  if (!data?.content?.[0]?.content || data.content[0].content.length === 0) {
    return { headers: [], data: [] };
  }

  interface DayItem {
    tanggal: number;
    item: {
      jam: number;
      [key: string]: any;
    }[];
  }

  const content = data.content[0].content as DayItem[];
  const tanggalKeys: number[] = content.map(day => day.tanggal);
  
  // Always use hours 0-23 for consistent ordering
  const jamKeys: number[] = Array.from({ length: 24 }, (_, i) => i);

  // Create a mapping for quick lookups
  const valueMap: { [key: number]: { [key: number]: number } } = {};
  content.forEach(day => {
    day.item.forEach(item => {
      const jamValue = parseInt(String(item.jam), 10);
      if (!valueMap[jamValue]) valueMap[jamValue] = {};
      
      // Apply Math.abs for inflow values only
      if (valueKey === 'inflow') {
        valueMap[jamValue][day.tanggal] = Math.abs(item[valueKey]);
      } else {
        valueMap[jamValue][day.tanggal] = item[valueKey];
      }
    });
  });

  // Create headers: Jam + Tanggal values
  const headers = ['Jam', ...tanggalKeys.map(String)];

  // Create rows: for each jam, ensure proper ordering from 0-23
  const rows: (string | number)[][] = jamKeys.map(jam => {
    const rowData: (string | number)[] = [jam];
    tanggalKeys.forEach((tanggal: number) => {
      rowData.push(valueMap[jam]?.[tanggal] !== undefined ? valueMap[jam][tanggal] : 0);
    });
    return rowData;
  });

  // Add stats rows (AVG, MAX, MIN)
  const statRows: (string | number)[][] = [
    ['AVG'],
    ['MAX'],
    ['MIN']
  ];

  // Calculate stats for each column
  tanggalKeys.forEach((tanggal: number) => {
    // Get values for this tanggal column (excluding jam column)
    const columnValues = jamKeys
      .map(jam => valueMap[jam]?.[tanggal])
      .filter(value => value !== undefined) as number[];

    // Average
    const avg = columnValues.length ? columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length : 0;
    statRows[0].push(avg);

    // Max
    const max = columnValues.length ? Math.max(...columnValues) : 0;
    statRows[1].push(max);

    // Min
    const min = columnValues.length ? Math.min(...columnValues) : 0;
    statRows[2].push(min);
  });

  return {
    headers,
    data: [...rows, ...statRows]
  };
};

export const downloadExcel = (
  selectedReport: string,
  startDate: string,
  endDate: string,
  tmaData: any,
  inflowData: any,
  outflowData: any,
  rohData: RohData[],
  rtowData: any
) => {
  let worksheet;
  let filename;
  const formattedStartDate = new Date(startDate).toLocaleDateString('id-ID');
  const formattedEndDate = new Date(endDate).toLocaleDateString('id-ID');

  switch (selectedReport) {
    case 'TMA':
    case 'inflow':
    case 'outflow': {
      const valueKey = {
        'TMA': 'tma',
        'inflow': 'inflow',
        'outflow': 'outflow'
      }[selectedReport];
      
      const data = {
        'TMA': tmaData,
        'inflow': inflowData,
        'outflow': outflowData
      }[selectedReport];

      const formattedData = formatHourlyData(data, valueKey);
      
      // Create enhanced data structure with proper headers for merging
      const enhancedData = [
        // First row: Jam and Tanggal merged header
        ['Jam', 'Tanggal', ...Array(formattedData.headers.length - 2).fill('')],
        // Second row: Empty for jam column and individual dates
        ['', ...formattedData.headers.slice(1)],
        // Data rows
        ...formattedData.data
      ];
      
      worksheet = XLSX.utils.aoa_to_sheet(enhancedData);

      // Set column widths
      const colWidth = Array(formattedData.headers.length).fill({ wch: 12 });
      colWidth[0] = { wch: 8 }; // Width for Jam column
      worksheet['!cols'] = colWidth;

      // Add merges for TMA/Inflow/Outflow headers FIRST
      if (formattedData.headers.length > 1) {
        worksheet['!merges'] = [
          // Merge "Jam" header vertically (A1 to A2)
          { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
          // Merge "Tanggal" header across all date columns (B1 to last column, row 1)
          { s: { r: 0, c: 1 }, e: { r: 0, c: formattedData.headers.length - 1 } }
        ];
      }

      // Apply styles AFTER merges are set
      const totalRows = enhancedData.length;
      const totalCols = formattedData.headers.length;
      
      // Apply center alignment to ALL cells first
      applyRangeStyle(worksheet, 0, totalRows - 1, 0, totalCols - 1);
      
      // Apply header styling with background and bold font
      applyRangeStyle(
        worksheet, 
        0, 1, 0, totalCols - 1,
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: 'F0F0F0' } }
      );
      
      // Apply statistics rows styling (last 3 rows)
      const statsStartRow = totalRows - 3;
      applyRangeStyle(
        worksheet,
        statsStartRow, totalRows - 1, 0, totalCols - 1,
        { horizontal: 'center', vertical: 'middle' },
        { bold: true }
      );

      filename = `${selectedReport}_${formattedStartDate}_${formattedEndDate}.xlsx`;
      break;
    }
    
    case 'ROH': {
      // Create ROH format similar to visual table structure including missing data
      const item = rohData[0];
      
      // Debug logging to check data
      console.log('Excel ROH Data Debug:', {
        hariOrTanggal: item.content.hariOrTanggal,
        estimasiElevasiWadukSetelahOperasi: item.content.estimasiElevasiWadukSetelahOperasi,
        totalDaya: item.content.totalDaya,
        fullContent: item.content
      });

      // Test individual field access
      console.log('Excel individual field tests:', {
        'item.content.hariOrTanggal': item.content.hariOrTanggal,
        'item.content.estimasiElevasiWadukSetelahOperasi?.toFixed(2)': item.content.estimasiElevasiWadukSetelahOperasi?.toFixed(2),
        'item.content.totalDaya?.toFixed(2)': item.content.totalDaya?.toFixed(2)
      });
      
      // Calculate operation status
      const isOperationOk = item.content.estimasiVolumeWadukSetelahOperasi > item.content.targetELevasiHariIni;
      const operationStatus = isOperationOk ? 'OK' : 'WARNING';
      
      // Create values first for debugging
      const tanggalValue = item.content.hariOrTanggal || 'Data tidak tersedia';
      const estimasiElevasiValue = item.content.estimasiElevasiWadukSetelahOperasi?.toFixed(2) || '0.00';
      const totalDayaValue = item.content.totalDaya?.toFixed(2) || '0.00';

      console.log('Excel ROH Values to be used:', {
        tanggalValue,
        estimasiElevasiValue,
        totalDayaValue
      });

      console.log('Creating rohSheetData array...');

      const rohSheetData = [
        // Header section
        ['ESTIMASI INFLOW UNTUK ESTIMASI PEMBEBANAN PLTA PBS', '', '', '', ''],
        ['', '', '', '', ''], // Empty row
        ['TANGGAL', tanggalValue, '', '', ''],
        ['', '', '', '', ''], // Empty row
        // Inflow section
        ['ESTIMASI INFLOW', Math.abs(item.content.estimasiInflow).toFixed(2), 'm³/s', (Math.abs(item.content.estimasiInflow) * 24 * 3600).toFixed(0), 'm³'],
        ['TARGET ELEVASI HARI INI', item.content.targetELevasiHariIni.toFixed(2), 'Mdpl', item.content.volumeTargetELevasiHariIni.toFixed(0), 'm³'],
        ['REALISASI ELEVASI H-1 PUKUL 09.00', item.content.realisasiElevasi.toFixed(2), 'Mdpl', item.content.volumeRealisasiElevasi.toFixed(0), 'm³'],
        ['ESTIMASI IRIGASI', item.content.estimasiIrigasi.toFixed(2), 'm³/s', (item.content.estimasiIrigasi * 24 * 3600).toFixed(0), 'm³'],
        ['ESTIMASI DDC X TOTAL JAM PEMBUKAAN', `${item.content.ddcJam} jam`, `${item.content.estimasiDdcXTotalJamPembukaan.toFixed(2)} m³/s`, (item.content.estimasiDdcXTotalJamPembukaan * 3600 * item.content.ddcJam).toFixed(0), 'm³'],
        ['ESTIMASI SPILLWAY X TOTAL JAM PEMBUKAAN', `${item.content.spillwayJam} jam`, `${item.content.estimasiSpillwayTotalJamPembukaan.toFixed(2)} m³/s`, (item.content.estimasiSpillwayTotalJamPembukaan * 3600 * item.content.spillwayJam).toFixed(0), 'm³'],
        ['', '', '', '', ''], // Empty row
        // Power section header
        ['ESTIMASI INFLOW S/D Target Elevasi', '', '', '', ''],
        ['', '', '', '', ''], // Empty row
        ['ESTIMASI VOLUME WADUK', item.content.estimasiVolumeWaduk.toFixed(0), 'm³', '', ''],
        ['ESTIMASI TOTAL DAYA YANG DIHASILKAN (GROSS)', ((item.content.estimasiVolumeWaduk - (item.content.estimasiIrigasi * 24 * 3600))/4080).toFixed(2), 'MW', '', ''],
        ['ESTIMASI DAYA PER JAM', (((item.content.estimasiVolumeWaduk - (item.content.estimasiIrigasi * 24 * 3600))/4080)/24).toFixed(2), 'MW', '', ''],
        ['WATER CONSUMPTION 1 MW', '1.13', '', '', ''],
        ['WATER CONSUMPTION 1 MW TO 1 HOUR', '4080', '', '', ''],
        ['ESTIMASI VOLUME WADUK SETELAH UNIT BEROPERASI', item.content.estimasiVolumeWadukSetelahOperasi?.toFixed(0) || '0', 'm³', '', ''],
        ['ESTIMASI ELEVASI WADUK SETELAH UNIT BEROPERASI', estimasiElevasiValue, 'Mdpl', '', ''],
        ['', '', '', '', ''], // Empty row
        // NETT section header (MISSING DATA ADDED)
        ['ESTIMASI PEMBEBANAN PLTA PBS (NETT)', '', '', '', ''],
        ['', '', '', '', ''], // Empty row
        ['Total Beban', totalDayaValue, 'MW', '', ''],
        ['', '', '', '', ''], // Empty row
        [operationStatus, '', '', '', '']
      ];

      console.log('Excel ROH Complete Sheet Data created successfully');
      console.log('Excel ROH Complete Sheet Data:', rohSheetData);
      
      // Log specific rows for debugging with row counting
      console.log('ROH Array Length:', rohSheetData.length);
      console.log('Excel ROH Specific rows with correct indexing:', {
        'Row 2 (index 2 - Tanggal)': rohSheetData[2],
        'Row 18 (index 18 - Estimasi Elevasi)': rohSheetData[18], 
        'Row 20 (index 20 - NETT Header)': rohSheetData[20],
        'Row 21 (index 21 - Empty)': rohSheetData[21],
        'Row 22 (index 22 - Total Beban)': rohSheetData[22],
        'Row 23 (index 23 - Empty)': rohSheetData[23],
        'Row 24 (index 24 - Operation Status)': rohSheetData[24]
      });

      console.log('Creating XLSX worksheet from rohSheetData...');
      try {
        worksheet = XLSX.utils.aoa_to_sheet(rohSheetData);
        console.log('✅ ROH Worksheet created successfully');
        console.log('ROH Worksheet cells preview:', {
          'A1': worksheet['A1'],
          'A3': worksheet['A3'],
          'B3': worksheet['B3'],
          'A19': worksheet['A19'],
          'B19': worksheet['B19'],
          'A21': worksheet['A21'], // NETT Header
          'A23': worksheet['A23'], // Total Beban
          'B23': worksheet['B23'], // Total Beban Value
          'A25': worksheet['A25']  // Operation Status
        });
      } catch (error) {
        console.error('❌ Error creating ROH worksheet:', error);
        throw error;
      }
      
      // Set column widths for better readability
      worksheet['!cols'] = [
        { wch: 50 }, // Description column
        { wch: 15 }, // Value 1
        { wch: 10 }, // Unit 1
        { wch: 20 }, // Value 2
        { wch: 10 }  // Unit 2
      ];

      // Add merge cells for ROH report FIRST
      worksheet['!merges'] = [
        // Merge main header across all columns
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Header
        
        // Merge empty rows across all columns
        { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Empty row
        { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } }, // Empty row
        { s: { r: 10, c: 0 }, e: { r: 10, c: 4 } }, // Empty row
        { s: { r: 12, c: 0 }, e: { r: 12, c: 4 } }, // Empty row
        { s: { r: 20, c: 0 }, e: { r: 20, c: 4 } }, // Empty row before NETT
        { s: { r: 21, c: 0 }, e: { r: 21, c: 4 } }, // Empty row after Total Beban
        { s: { r: 22, c: 0 }, e: { r: 22, c: 4 } }, // Empty row after Total Beban
        { s: { r: 23, c: 2 }, e: { r: 23, c: 4 } }, // Empty row before operation status
        { s: { r: 24, c: 0 }, e: { r: 24, c: 4 } }, // Empty row before operation status
        
        // Merge tanggal value spans columns B2:E2 (index 1-4)
        { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } }, // Tanggal value
        
        // Merge power section header
        { s: { r: 11, c: 0 }, e: { r: 11, c: 4 } }, // Power section header
        
        // Merge NETT section header (NEW)
        { s: { r: 21, c: 0 }, e: { r: 21, c: 4 } }, // NETT section header
        
        // Merge operation status (NEW)
        { s: { r: 25, c: 0 }, e: { r: 25, c: 4 } }, // Operation status
        
        // Merge power calculation values that span multiple columns
        { s: { r: 13, c: 2 }, e: { r: 13, c: 4 } }, // Volume waduk empty cells
        { s: { r: 14, c: 2 }, e: { r: 14, c: 4 } }, // Total daya empty cells
        { s: { r: 15, c: 2 }, e: { r: 15, c: 4 } }, // Daya per jam empty cells
        { s: { r: 16, c: 1 }, e: { r: 16, c: 4 } }, // Water consumption 1 MW
        { s: { r: 17, c: 1 }, e: { r: 17, c: 4 } }, // Water consumption 1 MW to 1 hour
        { s: { r: 18, c: 2 }, e: { r: 18, c: 4 } }, // Volume waduk setelah operasi empty cells
        { s: { r: 19, c: 2 }, e: { r: 19, c: 4 } }, // Elevasi waduk setelah operasi empty cells
        
        // NOTE: Removed merge for Total Beban row to preserve data
      ];

      // Apply styles AFTER merges are set
      const rohTotalRows = rohSheetData.length;
      
      // Apply center alignment to ALL cells first
      applyRangeStyle(worksheet, 0, rohTotalRows - 1, 0, 4);
      
      // Apply header styling with background and bold font
      applyRangeStyle(
        worksheet,
        0, 0, 0, 4, // Main header
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: 'E3F2FD' } }
      );
      
      // Apply section headers styling
      applyRangeStyle(
        worksheet,
        11, 11, 0, 4, // Power section header
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: 'E3F2FD' } }
      );
      
      applyRangeStyle(
        worksheet,
        21, 21, 0, 4, // NETT section header
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: 'E3F2FD' } }
      );
      
      // Apply operation status styling
      const statusColor = isOperationOk ? 'C8E6C9' : 'FFCDD2'; // Green for OK, Red for WARNING
      applyRangeStyle(
        worksheet,
        25, 25, 0, 4, // Operation status
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: statusColor } }
      );

      filename = `${selectedReport}_${formattedStartDate}.xlsx`;
      break;
    }
    
    case 'rtow': {
      // Create RTOW matrix format similar to visual table
      // Group data by month and day
      const groupedData: Record<string, Record<number, number>> = {};
      rtowData.data.forEach((item: any) => {
        if (!groupedData[item.bulan]) {
          groupedData[item.bulan] = {};
        }
        groupedData[item.bulan][item.hari] = item.targetElevasi;
      });

      const months = Object.keys(groupedData);
      const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31

      // Create enhanced header structure for RTOW
      const rtowSheetData: (string | number)[][] = [
        // Title row
        ['RENCANA TAHUNAN OPERASI WADUK (RTOW)', ...Array(months.length).fill('')],
        // Year row
        [`TAHUN ${rtowData.tahun || new Date().getFullYear()}`, ...Array(months.length).fill('')],
        // Empty row
        Array(months.length + 1).fill(''),
        // Header row
        ['Tanggal', ...months]
      ];
      
      days.forEach(day => {
        const row: (string | number)[] = [day];
        months.forEach(month => {
          const value = groupedData[month][day];
          row.push(value !== undefined ? value : '');
        });
        rtowSheetData.push(row);
      });

      worksheet = XLSX.utils.aoa_to_sheet(rtowSheetData);
      
      // Set column widths
      const colWidths = [{ wch: 15 }]; // Tanggal column
      months.forEach(() => colWidths.push({ wch: 12 })); // Month columns
      worksheet['!cols'] = colWidths;

      // Add merge cells for RTOW report FIRST
      worksheet['!merges'] = [
        // Merge title across all columns
        { s: { r: 0, c: 0 }, e: { r: 0, c: months.length } },
        // Merge year across all columns  
        { s: { r: 1, c: 0 }, e: { r: 1, c: months.length } }
      ];

      // Apply styles AFTER merges are set
      const rtowTotalRows = rtowSheetData.length;
      const rtowTotalCols = months.length + 1;
      
      // Apply center alignment to ALL cells first
      applyRangeStyle(worksheet, 0, rtowTotalRows - 1, 0, rtowTotalCols - 1);
      
      // Apply header styling with background and bold font
      applyRangeStyle(
        worksheet,
        0, 1, 0, rtowTotalCols - 1, // Title and year rows
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: 'FFF3E0' } }
      );
      
      // Apply column headers styling
      applyRangeStyle(
        worksheet,
        3, 3, 0, rtowTotalCols - 1, // Column headers
        { horizontal: 'center', vertical: 'middle' },
        { bold: true },
        { patternType: 'solid', fgColor: { rgb: 'FFF3E0' } }
      );
      
      filename = `${selectedReport}_${rtowData.tahun || formattedStartDate}.xlsx`;
      break;
    }
    
    default:
      return;
  }

  // Create and download workbook with proper configuration for styling
  console.log('Creating workbook and preparing download...');
  console.log('Filename to be used:', filename);
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  
  console.log('Workbook created, writing Excel buffer...');
  
  // Enhanced write options to ensure styles are preserved
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    cellStyles: true,
    cellDates: true,
    sheetStubs: false,
    bookSST: false
  });
  
  console.log('Excel buffer created, creating blob and download...');
  
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  
  console.log('✅ Excel download completed!');
}; 