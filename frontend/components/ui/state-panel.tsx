import * as React from 'react';
import { cn } from '../../lib/utils';
import { Button } from './button';

type StateTone = 'neutral' | 'error' | 'success';

const toneClasses: Record<StateTone, string> = {
  neutral: 'border-border bg-card text-foreground',
  error: 'border-primary/25 bg-primary/[0.06] text-foreground',
  success: 'border-secondary/35 bg-secondary/[0.10] text-foreground',
};

const iconClasses: Record<StateTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  error: 'bg-primary/10 text-primary',
  success: 'bg-secondary/20 text-secondary-foreground',
};

interface StatePanelProps {
  title: string;
  description: string;
  tone?: StateTone;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function StatePanel({
  title,
  description,
  tone = 'neutral',
  icon,
  actionLabel,
  onAction,
  className,
}: StatePanelProps) {
  return (
    <div
      className={cn(
        'flex min-h-52 flex-col items-center justify-center rounded-[1.25rem] border p-6 text-center shadow-sm sm:p-10',
        toneClasses[tone],
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            'mb-5 flex size-12 items-center justify-center rounded-full',
            iconClasses[tone]
          )}
        >
          {icon}
        </div>
      ) : null}
      <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function LoadingPanel({
  label = 'Carregando...',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid min-h-52 place-items-center rounded-[1.25rem] border border-border bg-card p-8 shadow-sm',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="size-9 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm font-bold text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
