import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Mic2, PlayCircle, FolderOpen, History, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { logOut } from '../../lib/firebase';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Voices', path: '/voices', icon: Mic2 },
  { name: 'Studio', path: '/studio', icon: PlayCircle },
  { name: 'Projects', path: '/projects', icon: FolderOpen },
  { name: 'History', path: '/history', icon: History },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-zinc-800 selection:text-zinc-100">
      
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Mic2 className="h-5 w-5 text-zinc-100" />
          <span className="font-semibold text-zinc-100">AI Voice Studio</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 hover:text-zinc-200">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col justify-between",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo / Header */}
          <div className="px-6 py-8 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <Mic2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-100">AI Voice Studio</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-16 md:mt-0">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                    isActive 
                      ? "bg-zinc-800/50 text-zinc-100" 
                      : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-200"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/80">
              <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700/50">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-zinc-400 text-xs font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-zinc-200 truncate">
                  {user?.displayName || "Studio User"}
                </span>
                <span className="text-xs text-zinc-500 truncate">
                  {user?.email}
                </span>
              </div>
              <button 
                onClick={logOut}
                className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-12 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
