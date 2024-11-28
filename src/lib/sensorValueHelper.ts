import { SensorValueResponse } from "@/types/sensorTypes";

export const formatValue = (value: SensorValueResponse | null): string => {
    return value?.data?.value?.value.toFixed(2) || 'N/A';
  };
  
  export const calculateTotalValue = (values: (SensorValueResponse | null)[], divideBy1000: boolean = false): number => {
      const validValues = values.filter((v): v is SensorValueResponse => v !== null);
      if (validValues.length === 0) return 0;
      
      const total = validValues.reduce((sum, v) => sum + v.data.value.value, 0);
      
      // Divide by 1000 if the flag is true
      return (divideBy1000 ? total / 1000 : total)
    };