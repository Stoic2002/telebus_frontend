import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import { Sidebar } from '../../components/ui/sidebar';
import { MachineLearningContent } from '@/components/features/machine-learning/legacy';
import { TrendsContent } from '@/components/features/trends/legacy';
import { HomeContent } from '@/components/features/home/legacy';
import ReportContent from '@/components/report/ReportContent';
import DataInputGhwContent from '@/components/dataInput/DataInputGhwContent';
import UserAdminContent from '@/components/dataInput/UserAdminContent';
// import DataCalculationContent from '@/components/dataInput/DataCalculationContent';
// import { dummyCalcData } from '@/data/dataInput/calculationData';
import DataInputOperatorContent from '@/components/dataInput/DataInputOperatorContent';
import TelemeteringPJTContent from '@/components/telemetering-pjt/TelemeteringPJTContent';

const DashboardPage = () => {
  const router = useRouter();
  const { menu } = router.query;

  

  const renderContent = () => {
    switch (menu) {
      case 'home' :
        return <HomeContent />  
      case 'machine-learning':
        return <MachineLearningContent />;
      case 'trends':
        return <TrendsContent />; 
      case 'data-input-operator':
        return <DataInputOperatorContent/>
      case 'report':
        return <ReportContent/>
      case 'data-input-ghw':
        return <DataInputGhwContent/>
      case 'user-admin':
        return <UserAdminContent/>
      case 'telemetering-pjt':
        return <TelemeteringPJTContent/>
      // case 'data-calculation':
      //   return <DataCalculationContent calcData={[dummyCalcData]}/>
      default:
        return <div className="p-6">Select a menu item</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
    {/* Header di atas */}
    <Header />

    {/* Kontainer utama */}
      {/* Sidebar di kiri */}

      {/* Konten di kanan */}
      <main className="flex-1 bg-gray-100">
        {renderContent()}
      </main>

  </div>
  );
};

export default DashboardPage;