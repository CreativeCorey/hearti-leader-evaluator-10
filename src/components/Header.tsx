
import React from 'react';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/language/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b backdrop-blur-sm bg-white/95 fixed top-0 z-10">
      <div className="flex items-center gap-2 w-1/4">
        <LanguageSelector />
      </div>
      
      <div className="flex justify-center items-center w-2/4">
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/f5c0e163-fd58-4828-bce7-5e62049ef409.png" 
            alt="HEARTI™ Leader Quotient Logo" 
            className="h-8 md:h-10"
          />
        </Link>
      </div>
      
      <div className="flex items-center justify-end w-1/4">
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-1 text-xs h-7 px-2 ml-auto"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">{t('header.signOut')}</span>
          </Button>
        ) : (
          <Button 
            asChild 
            size="sm" 
            className="text-xs h-7 px-2 ml-auto"
          >
            <Link to="/auth">{t('header.signIn')}</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
