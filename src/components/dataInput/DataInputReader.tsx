import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Definisikan tipe untuk data CSV
type CSVRowData = Record<string, string>;

const CSVReader = () => {
  const [csvData, setCsvData] = useState<CSVRowData[]>([]);
  const [error, setError] = useState<string>('');

  const processCSVData = (csv: string) => {
    try {
      // Split the CSV into rows and remove empty rows
      const rows = csv.split('\n').filter(row => row.trim());
      
      // Get headers (first row) and split by semicolon
      const headers = rows[0].split(/[,;]/g);
      console.log('header',headers)
      
      // Process each row after headers
      const data: CSVRowData[] = rows.slice(1).map(row => {
        const values = row.split(/[,;]/g);
        const rowData: CSVRowData = {};
        
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });
        console.log('rowData',rowData)
        
        return rowData;
      });
      
      setCsvData(data);
      setError('');
    } catch (err) {
      setError('Error processing CSV file: ' + err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file');
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string; // Type assertion
        processCSVData(text);
      };
      
      reader.onerror = () => {
        setError('Error reading file');
      };
      
      reader.readAsText(file);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>CSV File Reader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {csvData.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(csvData[0]).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVReader;