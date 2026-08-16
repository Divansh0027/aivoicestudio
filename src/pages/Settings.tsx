import React from 'react';
import { User, Mail, Bell, Shield, Laptop } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Settings</h1>
        <p className="mt-2 text-zinc-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="space-y-1">
          <SettingsNavLink active icon={User} label="Account" />
          <SettingsNavLink icon={Bell} label="Notifications" />
          <SettingsNavLink icon={Shield} label="Security" />
          <SettingsNavLink icon={Laptop} label="Appearance" />
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-zinc-100 border-b border-zinc-800 pb-2">Profile Details</h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
              
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-zinc-500" />
                  )}
                </div>
                <div>
                  <button disabled className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 font-medium text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Change Avatar
                  </button>
                  <p className="mt-2 text-xs text-zinc-500">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Display Name</label>
                  <input 
                    type="text" 
                    disabled
                    value={user?.displayName || ''} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input 
                      type="email" 
                      disabled
                      value={user?.email || ''} 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button disabled className="px-5 py-2.5 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Preferences Section Placeholder */}
          <section className="space-y-4">
            <h2 className="text-xl font-medium text-zinc-100 border-b border-zinc-800 pb-2">Preferences</h2>
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="text-sm text-zinc-400">Additional settings and preferences are coming soon.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingsNavLink = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => {
  return (
    <button 
      disabled={!active}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
        active ? "bg-zinc-800/50 text-zinc-100" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
};
