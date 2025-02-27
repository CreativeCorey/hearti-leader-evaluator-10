
import React from 'react';
import { Heart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full py-6 px-4 flex justify-between items-center border-b backdrop-blur-sm bg-white/50 fixed top-0 z-10">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2">
          <Heart 
            className="text-gray-800" 
            size={24}
            strokeWidth={2} 
          />
          <h1 className="text-2xl font-medium tracking-tight text-gray-900">
            HEARTI Leader Assessment
          </h1>
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
