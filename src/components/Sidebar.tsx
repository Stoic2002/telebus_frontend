import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

import { 
  AiOutlineMenu, 
  AiOutlineHome,
  AiOutlineCloud, 
  AiOutlineLineChart,
  AiOutlineRadarChart,
  AiOutlineOpenAI,
  AiOutlineFileText,
  AiOutlineForm,
  AiOutlineCalculator,
  AiOutlineUserSwitch,
  AiOutlineDatabase
} from 'react-icons/ai';

interface JwtPayload {
  id: string;
  role: string;
  [key: string]: any;
}

const Sidebar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { menu } = router.query;
  const [userRole, setUserRole] = useState<string>('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // const handleMenuClick = (menuPath:any) => {
  //   router.push(`/dashboard/${menuPath}`);
  // };

  const isActive = (menuPath:any) => menu === menuPath;
  const getIconColor = (menuPath:any) => isActive(menuPath) ? '#A5D6A7' : '#FFFFFF';

  const ROLE_PERMISSIONS = {
    admin: [
      'home', 
      'machine-learning', 
      'trends', 
      'report', 
      'data-input-operator', 
      'data-input-ghw', 
      'data-calculation', 
      'user-admin'
    ],
    ghw: [
      'home', 
      'mahine-learning',
      'data-input-operator',
      'data-input-ghw', 
      'trends',
      'report'
    ],
    client: [
      'home', 
      'machine-learning', 
      'trends', 
      'report'
    ],
    opr: [
      'home', 
      'mahine-learning',
      'data-input-operator',
      'trends',
      'report'
    ]
  };

  const menuItems = [
    { path: 'home', label: 'Home', Icon: AiOutlineHome },
    { path: 'machine-learning', label: 'Machine Learning', Icon: AiOutlineOpenAI },
    { path: 'trends', label: 'Trends', Icon: AiOutlineLineChart },
    { path: 'report', label: 'Report', Icon: AiOutlineFileText },
    { path: 'data-input-operator', label: 'Data Input Operator', Icon: AiOutlineForm },
    { path: 'data-input-ghw', label: 'Data Input GHW', Icon: AiOutlineDatabase },
    { path: 'data-calculation', label: 'Data Calculation', Icon: AiOutlineCalculator },
    { path: 'user-admin', label: 'User Admin', Icon: AiOutlineUserSwitch }
  ];

  useEffect(() => {
    // Ambil token dari localStorage atau cookie
    const token = Cookies.get('__sessionId');
    
    if (token) {
      try {
        // Dekode JWT untuk mendapatkan role
        const decodedToken = jwtDecode<JwtPayload>(token);
        
        
        // Set role dari token
        if (decodedToken.role) {
          setUserRole(decodedToken.role);
        } else {
          // Redirect ke login jika tidak ada role
          router.push('/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Redirect ke login jika token invalid
        router.push('/login');
      }
    } else {
      // Redirect ke halaman login jika tidak ada token
      router.push('/login');
    }
  }, []);

  const handleMenuClick = (menuPath: string) => {
    // Cek apakah menu diizinkan untuk role user
    const allowedMenus = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
    
    if (allowedMenus.includes(menuPath)) {
      router.push(`/dashboard/${menuPath}`);
    } else {
      // Tampilkan pesan error atau notifikasi akses ditolak
      alert('Anda tidak memiliki akses ke menu ini');
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]?.includes(item.path)
  );

  if (!userRole) {
    return (
      <aside className="w-20 h-max bg-gray-800 text-white absolute shadow-lg">
        <div className="p-4 flex justify-center items-center">
          <span>Loading...</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-20 bg-gray-800 text-white flex-shrink-0 h-full flex flex-col">
      {/* <div className="p-4 text-xl font-bold border-b border-gray-700 flex justify-center items-center">
        <AiOutlineMenu onClick={toggleDropdown} className="cursor-pointer" />
      </div> */}
      <ul className="space-y-4 p-2">
        {filteredMenuItems.map(({ path, label, Icon }) => (
          <li 
            key={path} 
            onClick={() => handleMenuClick(path)} 
            className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors duration-200 hover:bg-gray-700`}
          >
            <Icon 
              className="mb-1 text-xl" 
              style={{ color: getIconColor(path) }} 
            />
            <span className={`text-xs ${isActive(path) ? 'text-green-300' : ''} text-center`}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;