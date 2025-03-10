
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full px-4 pt-20 pb-12">
        <div className="mx-auto max-w-[95%] md:max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
