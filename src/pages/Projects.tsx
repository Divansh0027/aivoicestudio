import React from 'react';
import { FolderOpen } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const Projects: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Projects</h1>
          <p className="mt-2 text-zinc-400">Organize your voice generations into workspaces.</p>
        </div>
        <button disabled className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          New Project
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          icon={FolderOpen}
          title="No projects found"
          description="You don't have any projects yet. Start a new project to organize your work."
          actionLabel="Create new project"
        />
      </div>
    </div>
  );
};
