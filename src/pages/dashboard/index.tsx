import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DashboardIndex = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/home');
  }, [router]);

  return null;
};

export default DashboardIndex;