import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MachineLearningContent from '../../components/MachineLearning/MachineLearningContent';
import TrendsContent from '../../components/Trends/TrendsContent';
import HomeContent from '@/components/Home/HomeContent';
import ReportContent from '@/components/report/ReportContent';
import DataInputGhwContent from '@/components/dataInput/DataInputGhwContent';
import DataInputOperator from '@/components/dataInput/DataInputOperatorContent';
import UserAdminContent from '@/components/dataInput/UserAdminContent';
import DataCalculationContent from '@/components/dataInput/DataCalculationContent';
import { dummyCalcData } from '@/data/dataInput/calculationData';

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
        return <DataInputOperator/>
      case 'report':
        return <ReportContent/>
      case 'data-input-ghw':
        return <DataInputGhwContent/>
      case 'user-admin':
        return <UserAdminContent/>
      case 'data-calculation':
        return <DataCalculationContent calcData={[dummyCalcData]}/>
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