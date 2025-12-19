import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search, Clock, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { useTheme } from 'next-themes';

interface TopBarProps {
  title: string;
}

import { MobileSidebar } from './MobileSidebar';

export function TopBar({ title }: TopBarProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const electionEndDate = new Date('2024-12-05T18:00:00');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Countdown */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Closes in:</span>
          <CountdownTimer targetDate={electionEndDate} variant="compact" className="text-foreground font-semibold" />
        </div>

        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-secondary/50 border-0"
          />
        </div>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="relative"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
            3
          </Badge>
        </Button>

        {/* User Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      </div>
    </header>
  );
}
