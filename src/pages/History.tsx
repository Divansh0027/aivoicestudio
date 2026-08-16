import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const History: React.FC = () => {
  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">History</h1>
          <p className="mt-2 text-zinc-400">View and redownload your past audio generations.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <EmptyState 
          icon={HistoryIcon}
          title="No generation history yet"
          description="Your past speech generations will appear here once you create them."
        />
      </div>
    </div>
  );
};
