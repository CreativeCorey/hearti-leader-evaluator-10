
import React from 'react';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 w-full ${isMobile ? 'px-2 pt-16 pb-8' : 'px-4 pt-20 pb-12'}`}>
        <div className={`mx-auto ${isMobile ? 'w-full' : 'max-w-[95%] md:max-w-6xl'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
