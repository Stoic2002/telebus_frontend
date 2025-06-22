interface RTOWData {
  bulan: string;
  hari: number;
  targetElevasi: number;
}

const validMonths = [
  'januari', 'februari', 'maret', 'april', 'mei', 'juni',
  'juli', 'agustus', 'september', 'oktober', 'november', 'desember',
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

// Fungsi untuk mengkonversi string angka dengan format Indonesia ke float
export const parseLocalFloat = (value: string): number => {
  try {
    const cleanValue = value.trim();
    const normalizedValue = cleanValue.replace(/[,]/g, "");
    return parseFloat(normalizedValue);
  } catch (error) {
    console.error('Error parsing value:', value, error);
    return 0;
  }
};

export const processRtowCsv = (text: string): RTOWData[] => {
  const rows = text.split('\n').filter(row => row.trim());
  const results: RTOWData[] = [];

  // Skip header row and parse CSV
  rows.slice(1).forEach((row) => {
    const columns = row.split(/[;,]/).filter(col => col.trim());
    if (columns.length >= 3) {
      const [bulan, hari, targetElevasi] = columns;
      
      const dayNumber = parseInt(hari);
      const elevationValue = parseLocalFloat(targetElevasi);
      
      const normalizedMonth = bulan.toLowerCase();

      if (validMonths.includes(normalizedMonth)) {
        results.push({
          bulan: bulan,
          hari: Math.floor(dayNumber),
          targetElevasi: elevationValue
        });
      }
    }
  });

  return results;
};

export const validateRtowData = (data: RTOWData[]): boolean => {
  return data.length > 0;
};

export type { RTOWData }; 