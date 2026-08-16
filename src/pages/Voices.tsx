import React from 'react';
import { Mic2 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const Voices: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Voices</h1>
          <p className="mt-2 text-zinc-400">Manage and design your custom AI voices.</p>
        </div>
        <button disabled className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          Add Voice
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          icon={Mic2}
          title="No voices yet"
          description="You haven't added any voices to your library. Create your first voice to get started."
          actionLabel="Create your first voice"
        />
      </div>
    </div>
  );
};
