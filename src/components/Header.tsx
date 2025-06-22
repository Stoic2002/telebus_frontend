import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
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
import { Loading } from "@/components/ui/loading";
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
import { useAuthStore, useAppStore } from '@/store';

// Role permissions configuration
const ROLE_PERMISSIONS = {
  admin: [
    'home', 
    'machine-learning', 
    'trends', 
    'report', 
    'data-input-operator', 
    'data-input-ghw', 
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
} as const;

type UserRole = keyof typeof ROLE_PERMISSIONS;

const Header = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Zustand stores
  const { user, logout, loading: authLoading } = useAuthStore();
  const { 
    openModal, 
    closeModal, 
    modals,
    isMobile,
    sidebarOpen,
    setSidebarOpen
  } = useAppStore();

  // Derived state from stores
  const userRole = user?.role as UserRole;
  const isLogoutDialogOpen = modals['logout'] || false;
  const isMobileMenuOpen = modals['mobileMenu'] || false;
  const isDataInputDropdownOpen = modals['dataInputDropdown'] || false;

  // Get current active route
  const currentRoute = router.pathname.split('/')[2] || 'home'; // Extract route from /dashboard/[menu]

  // Permission checking function
  const hasPermission = (permission: string): boolean => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) return false;
    return ROLE_PERMISSIONS[userRole].includes(permission as any);
  };

  // Check if route is active
  const isActiveRoute = (route: string): boolean => {
    return currentRoute === route;
  };

  // Check if any data input route is active
  const isDataInputActive = (): boolean => {
    const dataInputRoutes = ['data-input-operator', 'data-input-ghw', 'data-calculation', 'user-admin'];
    return dataInputRoutes.includes(currentRoute);
  };

  // Navigation handler with permission check
  const handleNavigation = (route: string) => {
    if (hasPermission(route)) {
      router.push(`/dashboard/${route}`);
      closeModal('mobileMenu');
      closeModal('dataInputDropdown');
    } else {
      // Could replace with toast notification in future
      alert('You do not have permission to access this page.');
    }
  };

  // Logout handler using store
  const handleLogout = async () => {
    try {
      logout(); // Store handles the logout logic
    } catch (error) {
      console.error('Logout failed:', error);
    }
    closeModal('logout');
  };

  // UI event handlers
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeModal('mobileMenu');
    } else {
      openModal('mobileMenu');
    }
  };

  const toggleDataInputDropdown = () => {
    if (isDataInputDropdownOpen) {
      closeModal('dataInputDropdown');
    } else {
      openModal('dataInputDropdown');
    }
  };

  // Menu items configuration
  const getPermittedMenuItems = () => {
    return [
      {
        label: 'Home',
        route: 'home',
        icon: AiOutlineHome,
        show: hasPermission('home')
      },
      {
        label: 'Telemetering PJT',
        route: 'telemetering-pjt',
        icon: AiOutlineHome,
        show: hasPermission('telemetering-pjt')
      },
      {
        label: 'Machine Learning',
        route: 'machine-learning',
        icon: AiOutlineRobot,
        show: hasPermission('machine-learning')
      },
      {
        label: 'Trends',
        route: 'trends',
        icon: AiOutlineLineChart,
        show: hasPermission('trends')
      },
      {
        label: 'Report',
        route: 'report',
        icon: AiOutlineFileText,
        show: hasPermission('report')
      }
    ];
  };

  // Data input menu items
  const getPermittedDataInputItems = () => {
    return [
      {
        label: 'Data Input Operator',
        route: 'data-input-operator',
        show: hasPermission('data-input-operator')
      },
      {
        label: 'Data Input GHW',
        route: 'data-input-ghw',
        show: hasPermission('data-input-ghw')
      },
      {
        label: 'Data Calculation',
        route: 'data-calculation',
        show: hasPermission('data-calculation')
      },
      {
        label: 'User Admin',
        route: 'user-admin',
        show: hasPermission('user-admin')
      }
    ];
  };

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeModal('dataInputDropdown');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeModal]);

  // Don't render if no user (should be handled by _app.tsx auth check)
  if (!user) {
    return (
      <header className="bg-blue-900 border-b border-blue-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Loading size="sm" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-blue-900 border-b border-blue-800 shadow-lg sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo Section - Left Corner */}
            <div className="flex items-center flex-shrink-0">
              <div 
                onClick={() => handleNavigation('home')} 
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <img src="/assets/ip-mrica-logo.png" alt="Logo" className="h-10 w-auto" />
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden ml-4 p-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <AiOutlineClose className="h-6 w-6 text-white" />
                ) : (
                  <AiOutlineMenu className="h-6 w-6 text-white" />
                )}
              </button>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex flex-1 justify-center space-x-1 mx-8">
              {getPermittedMenuItems().map((menuItem) => 
                menuItem.show ? (
                  <Button
                    key={menuItem.route}
                    variant="ghost"
                    className={`font-medium transition-all duration-200 rounded-lg px-4 py-2 ${
                      isActiveRoute(menuItem.route)
                        ? 'bg-blue-700 text-white border border-blue-600 shadow-md'
                        : 'text-blue-100 hover:text-white hover:bg-blue-800'
                    }`}
                    onClick={() => handleNavigation(menuItem.route)}
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
                    className={`font-medium transition-all duration-200 rounded-lg px-4 py-2 ${
                      isDataInputActive()
                        ? 'bg-blue-700 text-white border border-blue-600 shadow-md'
                        : 'text-blue-100 hover:text-white hover:bg-blue-800'
                    }`}
                    onClick={toggleDataInputDropdown}
                  >
                    <AiOutlineForm className="mr-2 h-4 w-4" />
                    Data Input
                    <svg 
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isDataInputDropdownOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                  {isDataInputDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                      {getPermittedDataInputItems().map((dataInput) => 
                        dataInput.show ? (
                          <button
                            key={dataInput.route}
                            onClick={() => handleNavigation(dataInput.route)} 
                            className={`w-full text-left px-4 py-3 text-sm transition-colors duration-200 ${
                              isActiveRoute(dataInput.route)
                                ? 'bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-500'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                            }`}
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

            {/* Right Side - User Info and Logout - Right Corner */}
            <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
              {/* User Role Badge */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="bg-blue-700 text-blue-100 px-3 py-1 rounded-full text-xs font-medium border border-blue-600">
                  {user.role.toUpperCase()}
                </span>
                {/* <img src="/assets/tele-bus.png" alt="Tele Bus Logo" className="h-8 w-auto" /> */}
              </div>
              
              <Button
                variant="ghost"
                className="text-blue-100 hover:text-white hover:bg-red-600 rounded-lg px-4 py-2 font-medium transition-all duration-200"
                onClick={() => openModal('logout')}
                disabled={authLoading}
              >
                {authLoading ? (
                  <Loading size="sm" className="mr-2" />
                ) : (
                  <AiOutlineLogout className="mr-2 h-4 w-4" />
                )}
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fade-in" 
              onClick={() => closeModal('mobileMenu')}
            />
            <div className="md:hidden absolute top-full left-0 right-0 bg-blue-900 border-b border-blue-800 shadow-lg z-50 animate-slide-in">
              <div className="p-4 space-y-2">
                {/* User Info in Mobile */}
                <div className="flex items-center justify-between pb-4 border-b border-blue-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-100">
                      {user.username || 'User'}
                    </span>
                    <span className="bg-blue-700 text-blue-100 px-2 py-1 rounded-full text-xs font-medium">
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <img src="/assets/tele-bus.png" alt="Tele Bus Logo" className="h-6 w-auto" />
                </div>

                {getPermittedMenuItems().map((menuItem) => 
                  menuItem.show ? (
                    <Button
                      key={menuItem.route}
                      variant="ghost"
                      className={`w-full justify-start font-medium transition-all duration-200 rounded-lg p-3 ${
                        isActiveRoute(menuItem.route)
                          ? 'bg-blue-700 text-white border border-blue-600'
                          : 'text-blue-100 hover:text-white hover:bg-blue-800'
                      }`}
                      onClick={() => handleNavigation(menuItem.route)}
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
                      className={`w-full justify-start font-medium transition-all duration-200 rounded-lg p-3 ${
                        isDataInputActive()
                          ? 'bg-blue-700 text-white border border-blue-600'
                          : 'text-blue-100 hover:text-white hover:bg-blue-800'
                      }`}
                      onClick={toggleDataInputDropdown}
                    >
                      <AiOutlineForm className='mr-3 h-5 w-5'/>
                      Data Input
                      <svg 
                        className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                          isDataInputDropdownOpen ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                    {isDataInputDropdownOpen && (
                      <div className="pl-6 space-y-1 animate-fade-in">
                        {getPermittedDataInputItems().map((dataInput) => 
                          dataInput.show ? (
                            <button
                              key={dataInput.route}
                              onClick={() => handleNavigation(dataInput.route)} 
                              className={`w-full text-left p-3 text-sm rounded-lg transition-colors duration-200 ${
                                isActiveRoute(dataInput.route)
                                  ? 'bg-blue-700 text-white font-medium'
                                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                              }`}
                            >
                              {dataInput.label}
                            </button>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t border-blue-700 pt-4 mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-300 hover:text-white hover:bg-red-600 rounded-lg p-3 font-medium transition-all duration-200"
                    onClick={() => openModal('logout')}
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <Loading size="sm" className="mr-3" />
                    ) : (
                      <AiOutlineLogout className="mr-3 h-5 w-5" />
                    )}
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog 
        open={isLogoutDialogOpen} 
        onOpenChange={(open) => open ? openModal('logout') : closeModal('logout')}
      >
        <AlertDialogContent className='bg-white rounded-2xl border-0 shadow-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-800">
              Konfirmasi Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin keluar dari sistem?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-3">
            <AlertDialogCancel className="rounded-lg border-gray-300 hover:bg-gray-50">
              Tidak
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              disabled={authLoading}
              className="bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
            >
              {authLoading ? (
                <div className="flex items-center">
                  <Loading size="sm" className="mr-2" />
                  Processing...
                </div>
              ) : (
                'Ya, Logout'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;