
import React from 'react';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isIndexPage = location.pathname === '/' || location.pathname === '/index';
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Always show Header */}
      <Header />
      <main className={`flex-1 w-full ${isMobile ? 'px-3 pt-20 pb-8' : 'px-4 pt-24 pb-12'}`}>
        <div className={`mx-auto ${isMobile ? 'w-full max-w-[96%]' : 'max-w-[95%] md:max-w-6xl'}`}>
          {children}
        </div>
      </main>
      <footer className="py-2 px-4 text-center text-xs text-gray-500 border-t">
        {t('common.copyright')}
      </footer>
    </div>
  );
};

export default Layout;
