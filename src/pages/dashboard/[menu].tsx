import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import MachineLearningContent from '../../components/MachineLearning/MachineLearningContent';
import TelePBSoedirmanContent from '../../components/TelemeteringPBSoedirman/TelemeteringPBSoedirmanContent';
import TrendsContent from '../../components/Trends/TrendsContent';
import HomeContent from '@/components/Home/HomeContent';
import OperatorInputForm from '@/components/dataInputOperator/DataInputOperatorContent';
import ReportContent from '@/components/report/ReportContent';

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
        return <OperatorInputForm/>
      case 'report':
        return <ReportContent/>
      default:
        return <div className="p-6">Select a menu item</div>;
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 bg-gray-100">
        <Header />
        <Sidebar />
        <main className="pl-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;