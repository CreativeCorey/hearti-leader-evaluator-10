
import React from 'react';
import { LogOut, UserX, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const { user, signOut, anonymousMode, toggleAnonymousMode } = useAuth();

  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b backdrop-blur-sm bg-white/95 fixed top-0 z-10">
      <div className="w-1/4 flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAnonymousMode}
          className="flex items-center gap-1 text-xs"
        >
          {anonymousMode ? (
            <>
              <UserCheck size={16} className="text-green-500" />
              <span className="hidden md:inline">Anonymous Mode</span>
            </>
          ) : (
            <>
              <UserX size={16} />
              <span className="hidden md:inline">Enable Anonymous</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="w-2/4 flex justify-center items-center">
        <Link to="/" className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/f5c0e163-fd58-4828-bce7-5e62049ef409.png" 
            alt="HEARTI™ Leader Quotient Logo" 
            className="h-8 md:h-10"
          />
        </Link>
      </div>
      
      <div className="w-1/4 flex items-center justify-end">
        {user && !anonymousMode ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-2 text-xs"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        ) : !user && !anonymousMode ? (
          <Button asChild size="sm" className="text-xs">
            <Link to="/auth">Sign In</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
