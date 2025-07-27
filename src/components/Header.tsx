
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
interface UserRole {
  role?: 'user' | 'admin' | 'coach';
  organization_id?: string;
}

const Header = () => {
  const { user, signOut } = useAuth();
  const { t, i18n, availableLanguages } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<UserRole | null>(null);

  // Load user profile and role
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role, organization_id')
          .eq('id', user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };
    loadProfile();
  }, [user]);

  return (
    <header className="bg-white dark:bg-gray-950 border-b sticky top-0 z-50">
      <div className="container flex h-16 max-w-screen-2xl items-center p-4">
        <div className="flex gap-4 items-center">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            {/* Logo - using consistent size for both mobile and desktop */}
            <img 
              src="/lovable-uploads/eeabbcb2-eae5-4d68-8275-2fe4b955c9a9.png" 
              alt="HEARTI Logo" 
              className="h-8" 
            />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link to="/" className={`${location.pathname === '/' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-colors`}>
              Assessment
            </Link>
            {/* Conditional navigation links based on user role */}
            {user && profile?.role && ['coach', 'admin'].includes(profile.role) && (
              <Link to="/coach" className={`${location.pathname === '/coach' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-colors`}>
                Coach Dashboard
              </Link>
            )}
            {user && profile?.role === 'admin' && (
              <Link to="/admin" className={`${location.pathname === '/admin' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-colors`}>
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {i18n.language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
                  {lang.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Theme toggle */}
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          {/* Auth buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="secondary" size="sm">
                {t('auth.signIn')}
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu */}
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/">Assessment</Link>
              </DropdownMenuItem>
              {/* Conditional mobile navigation links based on user role */}
              {user && profile?.role && ['coach', 'admin'].includes(profile.role) && (
                <DropdownMenuItem asChild>
                  <Link to="/coach">Coach Dashboard</Link>
                </DropdownMenuItem>
              )}
              {user && profile?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </DropdownMenuItem>
              {availableLanguages.map((lang) => (
                <DropdownMenuItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
                  {lang.toUpperCase()}
                </DropdownMenuItem>
              ))}
              {user ? (
                <DropdownMenuItem onClick={() => signOut()}>
                  {t('auth.signOut')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/auth">{t('auth.signIn')}</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
