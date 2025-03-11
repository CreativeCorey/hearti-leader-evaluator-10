
import React from 'react';
import { LogOut, UserX, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/language/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { user, signOut, anonymousMode, toggleAnonymousMode } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b backdrop-blur-sm bg-white/95 fixed top-0 z-10">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAnonymousMode}
          className="flex items-center gap-1 text-xs truncate h-8 px-2"
        >
          {anonymousMode ? (
            <>
              <UserCheck size={16} className="text-green-500" />
              <span className="hidden md:inline">{t('header.anonymous')}</span>
            </>
          ) : (
            <>
              <UserX size={16} />
              <span className="hidden md:inline">{t('header.enableAnonymous')}</span>
            </>
          )}
        </Button>
        
        <LanguageSelector />
      </div>
      
      <div className="flex justify-center items-center">
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/f5c0e163-fd58-4828-bce7-5e62049ef409.png" 
            alt="HEARTI™ Leader Quotient Logo" 
            className="h-8 md:h-10"
          />
        </Link>
      </div>
      
      <div className="flex items-center justify-end min-w-[100px]">
        {user && !anonymousMode ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-1 text-xs h-8 px-2 whitespace-nowrap"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">{t('header.signOut')}</span>
          </Button>
        ) : !user && !anonymousMode ? (
          <Button asChild size="sm" className="text-xs h-8 px-2 whitespace-nowrap">
            <Link to="/auth">{t('header.signIn')}</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
