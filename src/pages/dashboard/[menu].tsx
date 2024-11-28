import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MachineLearningContent from '../../components/MachineLearning/MachineLearningContent';
import TelePBSoedirmanContent from '../../components/TelemeteringPBSoedirman/TelemeteringPBSoedirmanContent';
import TrendsContent from '../../components/Trends/TrendsContent';
import HomeContent from '@/components/Home/HomeContent';
import ReportContent from '@/components/report/ReportContent';
import DataInputGhwContent from '@/components/dataInputGHW/DataInputGhwContent';
import DataInputOperator from '@/components/dataInputOperator/DataInputOperatorContent';

const DashboardPage = () => {
  const router = useRouter();
  const { menu } = router.query;

  

  const renderContent = () => {
    switch (menu) {
      case 'home' :
        return <HomeContent />  
      case 'machine-learning':
        return <MachineLearningContent />;
      case 'tele-pb-soedirman':
        return <TelePBSoedirmanContent />;
      case 'trends':
        return <TrendsContent />; 
      case 'data-input-operator':
        return <DataInputOperator/>
      case 'report':
        return <ReportContent/>
      case 'data-input-ghw':
        return <DataInputGhwContent/>
      default:
        return <div className="p-6">Select a menu item</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
    {/* Header di atas */}
    <Header />

    {/* Kontainer utama */}
    <div className="flex flex-1">
      {/* Sidebar di kiri */}
      <Sidebar />

      {/* Konten di kanan */}
      <main className="flex-1 bg-gray-100">
        {renderContent()}
      </main>
    </div>
  </div>
  );
};

export default DashboardPage;