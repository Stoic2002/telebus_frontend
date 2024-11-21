import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';
import RohTable from './RohTable';
import { rohData } from '@/data/ROH/rohData';

const ReportContent = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showReport, setShowReport] = useState(false);

  // Sample data - dalam implementasi nyata, ini akan diambil dari API
  const sampleData = {
    ROH: [
      { date: '2024-01-01', value: '75%' },
      { date: '2024-01-02', value: '80%' },
      { date: '2024-01-03', value: '85%' },
    ],
    inflow: [
      { date: '2024-01-01', value: '100 m³/s' },
      { date: '2024-01-02', value: '120 m³/s' },
      { date: '2024-01-03', value: '110 m³/s' },
    ],
    outflow: [
      { date: '2024-01-01', value: '90 m³/s' },
      { date: '2024-01-02', value: '95 m³/s' },
      { date: '2024-01-03', value: '100 m³/s' },
    ],
    TMA: [
      { date: '2024-01-01', value: '100 m' },
      { date: '2024-01-02', value: '102 m' },
      { date: '2024-01-03', value: '101 m' },
    ],
  };

  const reportOptions = [
    { value: 'ROH', label: 'ROH' },
    { value: 'inflow', label: 'Inflow' },
    { value: 'outflow', label: 'Outflow' },
    { value: 'TMA', label: 'TMA' },
  ];

  const periodOptions = [
    { value: 'daily', label: 'Harian' },
    { value: 'weekly', label: 'Mingguan' },
    { value: 'monthly', label: 'Bulanan' },
  ];

  const handleSubmit = () => {
    if (selectedReport && selectedPeriod) {
      setShowReport(true);
    }
  };

  const handleDownload = (format: string) => {
    // Implementasi download berdasarkan format
    console.log(`Downloading ${format} format...`);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Telemetering</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select
                value={selectedReport}
                onValueChange={setSelectedReport}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Report" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {reportOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {periodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Submit</Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDownload('excel')}>
                    Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('word')}>
                    Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {showReport && selectedReport && (
        <RohTable rohData={rohData} />
        // <Card>
        //   <CardHeader>
        //     <CardTitle>
        //       Report {reportOptions.find(opt => opt.value === selectedReport)?.label}
        //     </CardTitle>
        //   </CardHeader>
        //   <CardContent>
        //     <Table>
        //       <TableHeader>
        //         <TableRow>
        //           <TableHead>Tanggal</TableHead>
        //           <TableHead>Nilai</TableHead>
        //         </TableRow>
        //       </TableHeader>
        //       <TableBody>
        //         {sampleData[selectedReport as keyof typeof sampleData].map((item, index) => (
        //           <TableRow key={index}>
        //             <TableCell>{item.date}</TableCell>
        //             <TableCell>{item.value}</TableCell>
        //           </TableRow>
        //         ))}
        //       </TableBody>
        //     </Table>
        //   </CardContent>
        // </Card>
      )}
    </div>
  );
};

export default ReportContent;