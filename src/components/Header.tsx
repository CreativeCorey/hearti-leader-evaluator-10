
import React from 'react';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 flex justify-center items-center border-b backdrop-blur-sm bg-white/50 fixed top-0 z-10">
      <div className="flex items-center space-x-2">
        <Heart 
          className="text-gray-800" 
          size={24}
          strokeWidth={2} 
        />
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">
          HEARTI Leader Assessment
        </h1>
      </div>
    </header>
  );
};

export default Header;
