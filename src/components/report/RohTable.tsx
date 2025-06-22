import React from 'react';
import { rohDataProps } from '@/types/reportTypes';
import { 
  RohHeader, 
  RohInflowTable, 
  RohPowerTable, 
  RohStatusFooter 
} from '@/components/features/reports/roh/components';

const RohTable: React.FC<rohDataProps> = ({rohData}) => {
    const data = rohData[0];

    return (
        <div className="bg-white min-h-screen">
            <RohHeader title={data.header.judul} />
            
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <RohInflowTable data={data} />
                    <RohPowerTable data={data} />
                    <RohStatusFooter data={data} />
                </div>
            </div>
        </div>
    );
};

export default RohTable;