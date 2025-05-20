import React, { useState } from 'react';
import { UserProfileDropdown } from '@/components/shared/UserProfileDropdown';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export function DesktopHeader() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get page title based on location
  const getPageTitle = () => {
    switch (location) {
      case '/dashboard':
        return 'Dashboard';
      case '/loans':
        return 'My Loans';
      case '/marketplace':
        return 'Loan Marketplace';
      case '/transactions':
        return 'Transactions';
      case '/wallet':
        return 'Wallet';
      case '/settings':
        return 'Settings';
      default:
        return 'BitLend';
    }
  };

  return (
    <header className="hidden md:block bg-card shadow-sm p-4 sticky top-0 z-40">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold">{getPageTitle()}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 bg-muted focus:bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <i className="ri-notification-3-line text-2xl text-foreground"></i>
            <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center pulse-animation">2</span>
          </Button>
          
          <ThemeToggle />
          
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}
