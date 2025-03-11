
import React from 'react';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isIndexPage = location.pathname === '/' || location.pathname === '/index';
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Header if not on index page */}
      {!isIndexPage && <Header />}
      <main className={`flex-1 w-full ${isMobile ? 'px-3 pt-16 pb-8' : 'px-4 pt-20 pb-12'} ${isIndexPage ? 'pt-4' : ''}`}>
        <div className={`mx-auto ${isMobile ? 'w-full' : 'max-w-[95%] md:max-w-6xl'}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
