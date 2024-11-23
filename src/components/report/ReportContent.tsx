import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Shadcn UI Components
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
import { Download } from 'lucide-react';

// Components and Data
import RohTable from './RohTable';
import { rohData } from '@/data/ROH/rohData';
import TmaTable from './TmaTable';
import { tmaData } from '@/data/TMA/tmaData';
import InflowTable from './InflowTable';
import { inflowData } from '@/data/inflow/inflowData';
import OutflowTable from './Outflow.table';
import { outflowData } from '@/data/outflow/outflowData';

// Types
interface ReportOption {
  value: string;
  label: string;
}

const ReportContent: React.FC = () => {
  // State Management
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showReport, setShowReport] = useState<boolean>(false);
  
  // Refs
  const reportRef = useRef<HTMLDivElement>(null);

  // Report Options
  const reportOptions: ReportOption[] = [
    { value: 'ROH', label: 'ROH' },
    { value: 'inflow', label: 'Inflow' },
    { value: 'outflow', label: 'Outflow' },
    { value: 'TMA', label: 'TMA' },
  ];

  // Handle Report Selection
  const handleReportChange = (value: string) => {
    setSelectedReport(value);
    // Reset dates when changing reports
    setStartDate('');
    setEndDate('');
    setShowReport(false);
  };

  // Submit Handler
  const handleSubmit = () => {
    if (selectedReport === 'ROH' && startDate) {
      setShowReport(true);
    } else if (selectedReport && startDate && endDate) {
      setShowReport(true);
    }
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
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

  // Validate submit button state
  const isSubmitDisabled = selectedReport === 'ROH' 
    ? !startDate 
    : !selectedReport || !startDate || !endDate;

  // Validate download button state
  const isDownloadDisabled = !showReport;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Telemetering</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Report Select */}
            <div>
              <Select
                value={selectedReport}
                onValueChange={handleReportChange}
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

            {/* Date Inputs */}
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={selectedReport === 'ROH' ? 'Pilih Tanggal' : 'Tanggal Mulai'}
              />
            </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={selectedReport === 'ROH'}
                placeholder="Tanggal Akhir"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                Submit
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF}
                disabled={isDownloadDisabled}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showReport && selectedReport && (
        <div ref={reportRef}>
          {selectedReport === 'ROH' && <RohTable rohData={rohData} />}
          {selectedReport === 'TMA' && <TmaTable tmaData={tmaData} />}
          {selectedReport === 'inflow' && <InflowTable inflowData={inflowData} />}
          {selectedReport === 'outflow' && <OutflowTable outflowData={outflowData} />}
        </div>
      )}
    </div>
  );
};

export default ReportContent;