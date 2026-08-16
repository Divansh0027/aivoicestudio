import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-24 px-6 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 mb-6 border border-zinc-700/50">
        <Icon className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="text-xl font-medium text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 mb-8 max-w-sm text-base leading-relaxed">{description}</p>
      {actionLabel && (
        <button disabled className="px-6 py-2.5 rounded-full bg-zinc-100 text-zinc-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
