import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { 
  AiOutlineMenu, 
  AiOutlineHome,
  AiOutlineOpenAI,
  AiOutlineLineChart,
  AiOutlineFileText,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineForm,
  AiOutlineRobot
} from 'react-icons/ai';
import { Button } from "@/components/ui/button";
import { logout } from '@/services/auth/logout';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  role: string;
  [key: string]: any;
}

const Header = () => {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDataInputDropdownOpen, setIsDataInputDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ROLE_PERMISSIONS = {
    admin: [
      'home', 
      'machine-learning', 
      'trends', 
      'report', 
      'data-input-operator', 
      'data-input-ghw', 
      // 'data-calculation', 
      'telemetering-pjt',
      'user-admin'
    ],
    ghw: [
      'home', 
      'machine-learning',
      'data-input-ghw', 
      'trends',
      'telemetering-pjt',
      'report'
    ],
    client: [
      'home', 
      'machine-learning', 
      'trends', 
      'telemetering-pjt',
      'report'
    ],
    opr: [
      'home', 
      'machine-learning',
      'data-input-operator',
      'trends',
      'telemetering-pjt',
      'report'
    ]
  };

  useEffect(() => {
    const token = Cookies.get('__sessionId');
    
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        
        if (decodedToken.role) {
          setUserRole(decodedToken.role);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, []);

  const handleHomeClick = (item: string) => {
    // Check if the menu item is allowed for the user's role
    if (ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS]?.includes(item)) {
      router.push(`/dashboard/${item}`);
      setIsMobileMenuOpen(false);
    } else {
      // Optionally, show an error message or prevent navigation
      alert('You do not have permission to access this page.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setIsLogoutDialogOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDataInputDropdown = () => setIsDataInputDropdownOpen(!isDataInputDropdownOpen);

  // Function to filter menu items based on user role
  const getPermittedMenuItems = () => {
    const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
    
    return [
      {
        label: 'Home',
        route: 'home',
        icon: AiOutlineHome,
        show: rolePermissions.includes('home')
      },
      {
        label: 'Telemetering PJT',
        route: 'telemetering-pjt',
        icon: AiOutlineHome,
        show: rolePermissions.includes('telemetering-pjt')
      },
      {
        label: 'Machine Learning',
        route: 'machine-learning',
        icon: AiOutlineRobot ,
        show: rolePermissions.includes('machine-learning')
      },
      {
        label: 'Trends',
        route: 'trends',
        icon: AiOutlineLineChart,
        show: rolePermissions.includes('trends')
      },
      {
        label: 'Report',
        route: 'report',
        icon: AiOutlineFileText,
        show: rolePermissions.includes('report')
      }
    ];
  };

  // Function to get permitted data input items
  const getPermittedDataInputItems = () => {
    const rolePermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
    
    return [
      {
        label: 'Data Input Operator',
        route: 'data-input-operator',
        show: rolePermissions.includes('data-input-operator')
      },
      {
        label: 'Data Input GHW',
        route: 'data-input-ghw',
        show: rolePermissions.includes('data-input-ghw')
      },
      {
        label: 'Data Calculation',
        route: 'data-calculation',
        show: rolePermissions.includes('data-calculation')
      },
      {
        label: 'User Admin',
        route: 'user-admin',
        show: rolePermissions.includes('user-admin')
      }
    ];
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDataInputDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Toggle */}
            <div className="flex items-center">
              <div 
                onClick={() => handleHomeClick('home')} 
                className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <img src="/assets/ip-mrica-logo.png" alt="Logo" className="h-10 w-auto" />
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden ml-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <AiOutlineClose className="h-6 w-6 text-gray-600" />
                ) : (
                  <AiOutlineMenu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center space-x-1">
              {getPermittedMenuItems().map((menuItem) => 
                menuItem.show ? (
                  <Button
                    key={menuItem.route}
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 font-medium transition-all duration-200"
                    onClick={() => handleHomeClick(menuItem.route)}
                  >
                    <menuItem.icon className="mr-2 h-4 w-4" /> 
                    {menuItem.label}
                  </Button>
                ) : null
              )}

              {getPermittedDataInputItems().some(item => item.show) && (
                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-4 py-2 font-medium transition-all duration-200"
                    onClick={toggleDataInputDropdown}
                  >
                    <AiOutlineForm className="mr-2 h-4 w-4" />
                    Data Input
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                  {isDataInputDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {getPermittedDataInputItems().map((dataInput) => 
                        dataInput.show ? (
                          <button
                            key={dataInput.route}
                            onClick={() => {
                              router.push(`/dashboard/${dataInput.route}`);
                              setIsDataInputDropdownOpen(false);
                            }} 
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          >
                            {dataInput.label}
                          </button>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Right Side - Logo and Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <img src="/assets/tele-bus.png" alt="Tele Bus Logo" className="h-8 w-auto" />
              </div>
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg px-4 py-2 font-medium transition-all duration-200"
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                <AiOutlineLogout className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
              <div className="p-4 space-y-2">
                {getPermittedMenuItems().map((menuItem) => 
                  menuItem.show ? (
                    <Button
                      key={menuItem.route}
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-3 font-medium transition-all duration-200"
                      onClick={() => handleHomeClick(menuItem.route)}
                    >
                      <menuItem.icon className="mr-3 h-5 w-5" /> 
                      {menuItem.label}
                    </Button>
                  ) : null
                )}

                {getPermittedDataInputItems().some(item => item.show) && (
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-3 font-medium transition-all duration-200"
                      onClick={toggleDataInputDropdown}
                    >
                      <AiOutlineForm className='mr-3 h-5 w-5'/>
                      Data Input
                      <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                    {isDataInputDropdownOpen && (
                      <div className="pl-6 space-y-1">
                        {getPermittedDataInputItems().map((dataInput) => 
                          dataInput.show ? (
                            <button
                              key={dataInput.route}
                              onClick={() => {
                                router.push(`/dashboard/${dataInput.route}`);
                                setIsMobileMenuOpen(false);
                              }} 
                              className="w-full text-left p-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                            >
                              {dataInput.label}
                            </button>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg p-3 font-medium transition-all duration-200"
                    onClick={() => setIsLogoutDialogOpen(true)}
                  >
                    <AiOutlineLogout className="mr-3 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className='bg-white rounded-2xl border-0 shadow-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-800">Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin keluar dari sistem?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-3">
            <AlertDialogCancel className="rounded-lg border-gray-300 hover:bg-gray-50">Tidak</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 rounded-lg"
            >
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;