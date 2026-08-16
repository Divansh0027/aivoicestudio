import React from 'react';
import { Plus, Play, Mic2, FolderOpen, Folder } from 'lucide-react';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Dashboard</h1>
        <p className="mt-2 text-zinc-400 text-base">Overview of your recent activity and quick actions.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard 
          icon={Mic2} 
          title="Create Voice" 
          description="Clone a voice or design a new one" 
        />
        <QuickActionCard 
          icon={Play} 
          title="Generate Speech" 
          description="Synthesize text to audio" 
        />
        <QuickActionCard 
          icon={FolderOpen} 
          title="New Project" 
          description="Create a workspace" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
        {/* Recent Projects */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-zinc-100">Recent Projects</h2>
            <button className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">View all</button>
          </div>
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
              <Folder className="h-6 w-6 text-zinc-500" />
            </div>
            <h3 className="text-zinc-200 font-medium mb-1">No projects found</h3>
            <p className="text-sm text-zinc-500 max-w-[250px]">You haven't created any projects yet. Start by creating a new workspace.</p>
          </div>
        </div>

        {/* Recent Voices & Generations */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-zinc-100">Recent Voices</h2>
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="text-sm text-zinc-500">No voices available</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-zinc-100">Recent Generations</h2>
            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="text-sm text-zinc-500">No audio generated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
  return (
    <button disabled className="group flex flex-col items-start gap-4 p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 text-left transition-all hover:bg-zinc-800 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed">
      <div className="p-3 rounded-xl bg-zinc-800/80 text-zinc-200 group-hover:bg-zinc-700 group-hover:text-zinc-100 transition-colors">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-zinc-100">{title}</h3>
        <p className="text-sm text-zinc-400 mt-1">{description}</p>
      </div>
    </button>
  );
};
