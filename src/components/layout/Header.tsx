import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { Menu, Search, User, LogOut, Settings, Bookmark, X, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Signed out successfully',
      });
    }
  };

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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-premium shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-2xl font-bold text-white">N</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-3xl font-heading font-bold bg-gradient-premium bg-clip-text text-transparent">
                  NewsStream
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
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/world" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              World
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/business" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Business
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/technology" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Technology
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/sports" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Sports
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/entertainment" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Entertainment
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link to="/opinion" className="text-base font-semibold text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2">
              Opinion
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-premium rounded-full group-hover:w-full transition-all duration-300" />
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

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks" className="flex items-center">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role && ['admin', 'editor', 'author'].includes(profile.role) && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};