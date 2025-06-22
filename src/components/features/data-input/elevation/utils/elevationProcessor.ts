// Elevation processing utilities

export interface GHWData {
  [elevation: number]: {
    volume: string;
    area: string;
  };
}

export interface ProcessingResult {
  success: boolean;
  data: GHWData;
  error?: string;
}

export const MIN_ELEVATION = 224.50;
export const MAX_ELEVATION = 231.50;

// Generate valid elevation range
export const generateValidElevations = (): number[] => {
  const elevations = [];
  for (let elevation = MIN_ELEVATION; elevation <= MAX_ELEVATION; elevation += 0.01) {
    elevations.push(parseFloat(elevation.toFixed(2)));
  }
  return elevations;
};

// Parse Indonesian formatted numbers
export const parseLocalFloat = (value: string): number => {
  try {
    const cleanValue = value.trim();
    const normalizedValue = cleanValue.replace(/[.,]/g, "");
    const calc = (parseFloat(normalizedValue) / 100).toFixed(2);
    return parseFloat(calc);
  } catch (error) {
    console.error('Error parsing value:', value, error);
    return 0;
  }
};

// Process CSV file content
export const processElevationCSV = (text: string): ProcessingResult => {
  try {
    const rows = text.split('\n').filter(row => row.trim());
    const results: any[] = [];
    const invalidElevations: number[] = [];
    const validElevations = generateValidElevations();
    const parsedElevations: number[] = [];

    // Skip header row and parse CSV
    rows.slice(1).forEach((row) => {
      const columns = row.split(/[;,]/).filter(col => col.trim());
      
      if (columns.length >= 3) {
        const [elevation, volume, area] = columns;
        const elevationNum = parseLocalFloat(elevation);
        const parsedVolume = parseLocalFloat(volume);
        const parsedArea = parseLocalFloat(area);
        
        // Validate elevation range
        if (elevationNum < MIN_ELEVATION || elevationNum > MAX_ELEVATION) {
          invalidElevations.push(elevationNum);
        } else {
          parsedElevations.push(elevationNum);
          results.push({
            elevation: elevationNum,
            volume: parsedVolume,
            area: parsedArea,
          });
        }
      }
    });

    // Validate result count
    if (results.length !== 701) {
      return {
        success: false,
        data: {},
        error: `Elevasi tidak valid: ${invalidElevations.join(', ')}. Rentang elevasi harus antara ${MIN_ELEVATION} sampai ${MAX_ELEVATION}.`
      };
    }

    // Transform to required format
    const formData: GHWData = {};
    results.forEach(({ elevation, volume, area }) => {
      if (!isNaN(elevation) && !isNaN(volume) && !isNaN(area)) {
        formData[elevation] = {
          volume: volume.toFixed(2),
          area: area.toFixed(2),
        };
      }
    });

    return {
      success: true,
      data: formData
    };
  } catch (error) {
    return {
      success: false,
      data: {},
      error: 'Error processing CSV file'
    };
  }
};

// Prepare data for submission
export const prepareSubmissionData = (formData: GHWData, year: number) => {
  return {
    year,
    data: Object.entries(formData).map(([elevation, data]) => ({
      elevation: Number(elevation),
      volume: Number(data.volume),
      area: Number(data.area)
    }))
  };
}; 