import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ElevationTableProps } from '@/types/reportTypes';

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
        <div className="flex">
            <div className="flex-1 p-4" ref={reportRef}>
                {[...Array(totalPages)].map((_, pageIndex) => {
                    if (pageIndex !== currentPage) return null;

                    return (
                        <div key={pageIndex} className="page">
                            <div className="flex justify-between">
                                {[0, 1, 2].map((tableIndex) => {
                                    const startIndex = pageIndex * itemsPerTable * tablesPerPage + tableIndex * itemsPerTable;
                                    const endIndex = startIndex + itemsPerTable;
                                    const tableData = report.elevationData.slice(startIndex, endIndex);

                                    return (
                                        <div key={tableIndex} className="table-container">
                                            <table className="data-table" style={{ width: tableData.length < itemsPerTable ? 'auto' : '32%' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Elevasi (m)</th>
                                                        <th>Volume (m3)</th>
                                                        <th>Luas (m3)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((data) => (
                                                        <tr key={data.id}>
                                                            <td>{data.elevation}</td>
                                                            <td>{data.volume}</td>
                                                            <td>{data.area}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="w-1/4 p-4 bg-gray-100 flex flex-col justify-between">
                <div>
                    <button 
                        onClick={downloadPDF} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
                    >
                        Download PDF
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button 
                            onClick={previousPage} 
                            disabled={currentPage === 0}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`py-2 px-4 rounded font-bold ${
                                    currentPage === pageNum
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={nextPage} 
                            disabled={currentPage === totalPages - 1}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .page {
                    background-color: white;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    width: 100%;
                    min-height: 297mm;
                    padding: 16mm;
                    box-sizing: border-box;
                }

                .table-container {
                    flex: 1;
                    margin-right: 1%;
                }

                .data-table {
                    border-collapse: collapse;
                }

                .data-table th, 
                .data-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }

                .data-table thead {
                    background-color: #f2f2f2;
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