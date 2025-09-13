import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search, Settings, X, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-elegant">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link to="/" className="flex items-center gap-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-2xl font-bold text-white">V</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-3xl font-heading font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vista News Flow
                </span>
                <div className="text-sm text-muted-foreground font-medium tracking-wide">
                  Breaking News • Trusted Insights
                </div>
              </div>
            </Link>
          </div>

          {/* Center section - Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link to="/" className="text-base font-semibold text-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Home
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/world" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              World
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/business" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Business
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/technology" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Technology
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/sports" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Sports
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/entertainment" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Entertainment
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/opinion" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Opinion
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search breaking news..."
                    className="w-80 h-12 rounded-xl border-2 focus:border-primary transition-all"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl" onClick={() => setSearchOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent transition-all" onClick={() => setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-accent transition-all relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

          </div>
        </div>
      </div>
    </header>
  );
};