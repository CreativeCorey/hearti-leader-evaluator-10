
import React from 'react';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full py-4 px-4 flex justify-between items-center border-b backdrop-blur-sm bg-white/50 fixed top-0 z-10">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/f52625fd-8dcf-4e6f-8753-456776fcdaf9.png" 
            alt="HEARTI™ Leader Quotient Logo" 
            className="h-10 md:h-12"
          />
        </Link>
      </div>
      <div>
        {user ? (
          <Button
            variant="ghost"
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
