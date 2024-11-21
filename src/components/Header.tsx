import { useRouter } from 'next/router';
import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from '@/services/auth/logout';

const Header = () => {
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  
  const handleHomeClick = (item: string) => {
    router.push(`/dashboard/${item}`);
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

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-gray-300 text-white shadow-md">
        <img 
          onClick={() => handleHomeClick('home')} 
          src="/assets/ip-mrica-logo.png" 
          alt="Logo" 
          className="h-16 cursor-pointer" 
        />
        
        <div className="flex items-center gap-4">
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
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
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