
import React from 'react';
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

const Header = () => {
  const { user, signOut } = useAuth();
  const { t, i18n, availableLanguages } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <header className="bg-white dark:bg-gray-950 border-b sticky top-0 z-50">
      <div className="container flex h-16 max-w-screen-2xl items-center p-4">
        <div className="flex gap-4 items-center">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/logo.svg" alt="HEARTI Logo" className="w-8 h-8" />
            HEARTI
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link to="/" className={`${location.pathname === '/' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-colors`}>
              Assessment
            </Link>
            <Link to="/chat" className={`${location.pathname === '/chat' ? 'text-foreground font-medium' : 'text-muted-foreground'} hover:text-foreground transition-colors`}>
              Group Chat
            </Link>
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
              <DropdownMenuItem asChild>
                <Link to="/chat">Group Chat</Link>
              </DropdownMenuItem>
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
