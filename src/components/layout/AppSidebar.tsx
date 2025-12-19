import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import {
  LayoutDashboard,
  Vote,
  Users,
  BarChart3,
  Bell,
  Settings,
  Building,
  ClipboardList,
  Shield,
  UserCog,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const memberNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/member' },
  { icon: Vote, label: 'Ballot', path: '/member/ballot' },
  { icon: Bell, label: 'Notifications', path: '/member/notifications' },
  { icon: Settings, label: 'Settings', path: '/member/settings' },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ClipboardList, label: 'Positions', path: '/admin/positions' },
  { icon: Users, label: 'Candidates', path: '/admin/candidates' },
  { icon: BarChart3, label: 'Live Results', path: '/admin/results' },
  { icon: Building, label: 'Branches', path: '/admin/branches' },
  { icon: Shield, label: 'Audit Trail', path: '/admin/audit' },
  { icon: UserCog, label: 'Users', path: '/admin/users' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

interface SidebarContentProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean; // New prop to handle mobile specific styling adjustments
}

export function SidebarContent({ collapsed, onCollapse, isMobile = false }: SidebarContentProps) {
  const { user, logout, switchRole } = useAuth();
  const { selectedLevel, requestLevelSwitch, hasSelectedLevel } = useVoting();
  
  const navItems = user?.role === 'admin' ? adminNavItems : memberNavItems;
  const isMember = user?.role === 'member';

  return (
    <>
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-4 border-b border-white/10 shrink-0">
        {(!collapsed || isMobile) && <Logo variant="light" />}
        {!isMobile && onCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 ml-auto"
            onClick={() => onCollapse(!collapsed)}
          >
            <ChevronLeft className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                    (collapsed && !isMobile) && 'justify-center px-2',
                    isActive
                      ? 'bg-[#2dd4bf] text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3 shrink-0">
        {/* Level Switch for Members */}
        {isMember && hasSelectedLevel && (
          <Button
            className={cn(
              "w-full bg-[#1e5a52] hover:bg-[#2dd4bf] text-white border-0 h-12 rounded-lg font-medium",
              (collapsed && !isMobile) ? "px-2 justify-center" : "justify-start"
            )}
            onClick={() => requestLevelSwitch(selectedLevel === 'national' ? 'branch' : 'national')}
          >
            <ClipboardList className={cn("h-5 w-5", (!collapsed || isMobile) && "mr-3")} />
            {(!collapsed || isMobile) && `Switch to ${selectedLevel === 'national' ? 'Branch' : 'National'}`}
          </Button>
        )}

        {/* Switch Role Button for Admin */}
        {user?.role === 'admin' && (
          <Button
            className={cn(
              "w-full bg-[#1e5a52] hover:bg-[#2dd4bf] text-white border-0 h-12 rounded-lg font-medium",
              (collapsed && !isMobile) ? "px-2 justify-center" : "justify-start"
            )}
            onClick={switchRole}
          >
            <ClipboardList className={cn("h-5 w-5", (!collapsed || isMobile) && "mr-3")} />
            {(!collapsed || isMobile) && "Switch to Branch"}
          </Button>
        )}
        
        {/* Logout Button */}
        <Button
          variant="ghost"
          className={cn(
            "w-full text-gray-300 hover:bg-white/5 hover:text-white h-12 rounded-lg font-medium",
            (collapsed && !isMobile) ? "px-2 justify-center" : "justify-start"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-5 w-5", (!collapsed || isMobile) && "mr-3")} />
          {(!collapsed || isMobile) && "Logout"}
        </Button>
      </div>
    </>
  );
}

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed, onCollapse }: AppSidebarProps) {
  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col bg-[#1a2332] text-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarContent collapsed={collapsed} onCollapse={onCollapse} />
    </aside>
  );
}
