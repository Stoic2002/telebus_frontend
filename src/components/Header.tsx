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
  AiOutlineForm
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
      'machine-learning',
      'data-input-operator',
      'trends',
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
        icon: AiOutlineOpenAI,
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
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-gray-300 text-white shadow-md relative">
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <img 
            onClick={() => handleHomeClick('home')} 
            src="/assets/ip-mrica-logo.png" 
            alt="Logo" 
            className="h-12 sm:h-16 cursor-pointer" 
          />
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center gap-4 lg:gap-8">
          {getPermittedMenuItems().map((menuItem) => 
            menuItem.show ? (
              <Button
                key={menuItem.route}
                variant="ghost"
                className="text-white hover:text-white hover:bg-gray-700"
                onClick={() => handleHomeClick(menuItem.route)}
              >
                <menuItem.icon className="mr-2" /> {menuItem.label}
              </Button>
            ) : null
          )}

          {getPermittedDataInputItems().some(item => item.show) && (
            <div className="relative" ref={dropdownRef}>
              <Button 
                variant="ghost" 
                className="text-white hover:text-white hover:bg-gray-700"
                onClick={toggleDataInputDropdown}
              >
                Data Input
              </Button>
              {isDataInputDropdownOpen && (
                <div className="absolute left-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg z-50">
                  {getPermittedDataInputItems().map((dataInput) => 
                    dataInput.show ? (
                      <div 
                        key={dataInput.route}
                        onClick={() => {
                          router.push(`/dashboard/${dataInput.route}`);
                          setIsDataInputDropdownOpen(false);
                        }} 
                        className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                      >
                        {dataInput.label}
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Logo and Logout for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <img 
            src="/assets/tele-bus.png" 
            alt="Logo" 
            className="h-10 w-auto sm:h-15" 
          />
          <Button
            variant="ghost"
            className="text-white hover:text-white hover:bg-red-600"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <AiOutlineLogout className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gradient-to-r from-green-500 to-gray-300 z-50">
            <div className="flex flex-col items-start p-4 space-y-2">
              {getPermittedMenuItems().map((menuItem) => 
                menuItem.show ? (
                  <Button
                    key={menuItem.route}
                    variant="ghost"
                    className="w-full text-left text-white hover:text-white hover:bg-gray-700"
                    onClick={() => handleHomeClick(menuItem.route)}
                  >
                    <menuItem.icon className="mr-2" /> {menuItem.label}
                  </Button>
                ) : null
              )}

              {getPermittedDataInputItems().some(item => item.show) && (
                <div className="w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full text-left text-white hover:text-white hover:bg-gray-700"
                    onClick={toggleDataInputDropdown}
                  >
                    <AiOutlineForm className='mr-2'/>
                    Data Input
                  </Button>
                  {isDataInputDropdownOpen && (
                    <div className="pl-4 space-y-2 mt-2">
                      {getPermittedDataInputItems().map((dataInput) => 
                        dataInput.show ? (
                          <div 
                            key={dataInput.route}
                            onClick={() => router.push(`/dashboard/${dataInput.route}`)} 
                            className="text-white cursor-pointer hover:bg-gray-700 p-2"
                          >
                            {dataInput.label}
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="w-full border-t border-white/30 pt-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full text-left text-white hover:text-white hover:bg-red-600"
                  onClick={() => setIsLogoutDialogOpen(true)}
                >
                  <AiOutlineLogout className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari sistem?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
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