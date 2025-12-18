import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [scope, setScope] = useState<'national' | 'branch'>('national');

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64 transition-all duration-300">
        <TopBar title={title} scope={scope} onScopeChange={setScope} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
