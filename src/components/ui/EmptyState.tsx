import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("w-full flex-1 flex flex-col items-center justify-center py-16 px-6 text-center rounded-2xl glass-panel border border-border-subtle min-h-[50vh] space-y-5", className)}>
      {icon && (
        <div className="text-5xl mb-2 animate-fade-in-up">
          {icon}
        </div>
      )}
      <div className="space-y-2 max-w-md mx-auto animate-fade-in-up [animation-delay:100ms]">
        <h3 className="text-xl font-bold text-text-primary">{title}</h3>
        {description && (
          <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {action && (
        <div className="pt-4 animate-fade-in-up [animation-delay:200ms]">
          {action}
        </div>
      )}
    </div>
  );
}
