import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IoDownloadOutline, IoChevronBackOutline, IoChevronForwardOutline, IoDocumentOutline, IoRefreshOutline } from 'react-icons/io5';
import { ElevationTableProps } from '@/types/reportTypes';
import { formatNumber } from '@/lib/utils/formatNumber';

const ElevationTable: React.FC<ElevationTableProps> = ({ report }) => {
    const itemsPerTable = 30; // Number of items per table
    const tablesPerPage = 3; // Number of tables per page
    const totalPages = Math.ceil(report.elevationData.length / (itemsPerTable * tablesPerPage));
    const [currentPage, setCurrentPage] = useState(0);
    const reportRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!reportRef.current) return;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = 210;
        const pdfHeight = 295;

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            setCurrentPage(pageIndex);
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (pageIndex > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        }

        pdf.save('elevation_report.pdf');
        setCurrentPage(0);
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to generate page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxButtons = 5; // Maximum number of page buttons to show
        
        let startPage = Math.max(0, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);
        
        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxButtons) {
            startPage = Math.max(0, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return pageNumbers;
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="flex max-w-7xl mx-auto">
                {/* Main Content */}
                <div className="flex-1 p-8" ref={reportRef}>
                    {[...Array(totalPages)].map((_, pageIndex) => {
                        if (pageIndex !== currentPage) return null;

                        return (
                            <div key={pageIndex} className="page bg-white shadow-lg rounded-xl overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
                                    <h1 className="text-3xl font-bold mb-2">Volume Efektif Report</h1>
                                    <p className="text-blue-100">PT. PLN Indonesia Power - Unit Pembangkitan Mrica</p>
                                    <p className="text-blue-200 text-sm mt-2">Halaman {pageIndex + 1} dari {totalPages}</p>
                                </div>
                                
                                {/* Tables Container */}
                                <div className="p-8">
                                    <div className="flex justify-between gap-6">
                                        {[0, 1, 2].map((tableIndex) => {
                                            const startIndex = pageIndex * itemsPerTable * tablesPerPage + tableIndex * itemsPerTable;
                                            const endIndex = startIndex + itemsPerTable;
                                            const tableData = report.elevationData.slice(startIndex, endIndex);

                                            if (tableData.length === 0) return null;

                                            return (
                                                <div key={tableIndex} className="flex-1">
                                                    <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
                                                        <thead>
                                                            <tr className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
                                                                <th className="border border-slate-400 p-3 text-center font-semibold text-sm">Elevasi (m)</th>
                                                                <th className="border border-slate-400 p-3 text-center font-semibold text-sm">Volume (m3)</th>
                                                                <th className="border border-slate-400 p-3 text-center font-semibold text-sm">Luas (m3)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {tableData.map((data, index) => (
                                                                <tr key={data.id} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                                                    <td className="border border-slate-300 p-3 text-center text-sm font-medium text-slate-700">{data.elevation}</td>
                                                                    <td className="border border-slate-300 p-3 text-center text-sm text-slate-600">{formatNumber(Number(data.volume))}</td>
                                                                    <td className="border border-slate-300 p-3 text-center text-sm text-slate-600">{formatNumber(Number(data.area))}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar Controls */}
                <div className="w-80 bg-gradient-to-b from-slate-100 to-slate-200 p-6 flex flex-col justify-between border-l border-slate-300">
                    <div>
                        {/* Download Button */}
                        <button 
                            onClick={downloadPDF} 
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl w-full mb-6 shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                        >
                            <IoDownloadOutline className="w-5 h-5" />
                            <span>Download PDF</span>
                        </button>

                        {/* Page Info */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
                            <h3 className="font-semibold text-slate-700 mb-2 flex items-center space-x-2">
                                <IoDocumentOutline className="w-5 h-5" />
                                <span>Report Information</span>
                            </h3>
                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>Total Data:</span>
                                    <span className="font-medium">{report.elevationData.length} items</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Current Page:</span>
                                    <span className="font-medium">{currentPage + 1} of {totalPages}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Year:</span>
                                    <span className="font-medium">{report.year}</span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="bg-white rounded-xl p-4 shadow-md">
                            <h3 className="font-semibold text-slate-700 mb-4">Page Navigation</h3>
                            
                            {/* Previous/Next Buttons */}
                            <div className="flex gap-2 mb-4">
                                <button 
                                    onClick={previousPage} 
                                    disabled={currentPage === 0}
                                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <IoChevronBackOutline className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>
                                
                                <button 
                                    onClick={nextPage} 
                                    disabled={currentPage === totalPages - 1}
                                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>Next</span>
                                    <IoChevronForwardOutline className="w-4 h-4" />
                                </button>
                            </div>
                            
                            {/* Page Numbers */}
                            <div className="flex flex-wrap gap-2">
                                {getPageNumbers().map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-12 h-10 rounded-lg font-semibold transition-all duration-200 ${
                                            currentPage === pageNum
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer Info */}
                    <div className="text-xs text-slate-500 text-center mt-6">
                        <p>Generated on {new Date().toLocaleDateString('id-ID')}</p>
                        <p className="mt-1">PT. PLN Indonesia Power</p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .page {
                    background-color: white;
                    margin-bottom: 20px;
                    width: 100%;
                    min-height: 297mm;
                    box-sizing: border-box;
                }

                @media print {
                    .page {
                        box-shadow: none;
                        margin: 0;
                        padding: 10mm;
                    }
                }
            `}</style>
        </div>
    );
};

export default ElevationTable;