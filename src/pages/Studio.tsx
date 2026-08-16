import React from 'react';
import { PlayCircle } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const Studio: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">Studio</h1>
          <p className="mt-2 text-zinc-400">Generate and edit high-quality AI speech.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          icon={PlayCircle}
          title="Studio is empty"
          description="Select a voice and enter some text to start generating speech."
          actionLabel="Open Studio Editor"
        />
      </div>
    </div>
  );
};
