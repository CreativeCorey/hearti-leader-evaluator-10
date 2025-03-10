
import React from 'react';
import { LogOut, UserX, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const { user, signOut, anonymousMode, toggleAnonymousMode } = useAuth();

  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b backdrop-blur-sm bg-white/50 fixed top-0 z-10">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/f5c0e163-fd58-4828-bce7-5e62049ef409.png" 
            alt="HEARTI™ Leader Quotient Logo" 
            className="h-10 md:h-12"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAnonymousMode}
          className="flex items-center gap-1"
        >
          {anonymousMode ? (
            <>
              <UserCheck size={16} className="text-green-500" />
              <span className="hidden md:inline text-xs">Anonymous Mode</span>
            </>
          ) : (
            <>
              <UserX size={16} />
              <span className="hidden md:inline text-xs">Enable Anonymous</span>
            </>
          )}
        </Button>
        
        {user && !anonymousMode ? (
          <Button
            variant="ghost"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        ) : !user && !anonymousMode ? (
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
