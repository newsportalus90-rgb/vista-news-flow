import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Menu, Home, Globe, Building, Laptop, Trophy, Camera, Heart, MessageSquare } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/world', label: 'World', icon: Globe },
  { href: '/business', label: 'Business', icon: Building },
  { href: '/technology', label: 'Technology', icon: Laptop },
  { href: '/sports', label: 'Sports', icon: Trophy },
  { href: '/entertainment', label: 'Entertainment', icon: Camera },
  { href: '/health', label: 'Health', icon: Heart },
  { href: '/opinion', label: 'Opinion', icon: MessageSquare },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-premium">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <div>
              <span className="text-lg font-heading font-bold bg-gradient-premium bg-clip-text text-transparent">
                NewsStream
              </span>
              <div className="text-xs text-muted-foreground">
                Breaking News • Trusted Insights
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <Separator className="my-6" />
        
        <nav className="space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start h-12"
                asChild
                onClick={() => onOpenChange(false)}
              >
                <Link to={item.href}>
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/search">Search Articles</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/bookmarks">My Bookmarks</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/newsletter">Newsletter</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="secondary" className="justify-center py-2">Politics</Badge>
            <Badge variant="secondary" className="justify-center py-2">Science</Badge>
            <Badge variant="secondary" className="justify-center py-2">Lifestyle</Badge>
            <Badge variant="secondary" className="justify-center py-2">Education</Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};