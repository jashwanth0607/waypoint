import React from 'react';
import { cn } from '@/lib/utils';
import { ActivityCategory } from '@/lib/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: ActivityCategory | 'featured' | 'general' | 'status';
  variant?: 'outline' | 'solid';
}

export function Badge({
  className,
  category = 'general',
  variant = 'solid',
  children,
  ...props
}: BadgeProps) {
  const categoryStyles: Record<string, string> = {
    stay: 'bg-sand-200 text-ink-secondary border-sand-300',
    food: 'bg-terracotta-100 text-terracotta-800 border-terracotta-200',
    culture: 'bg-olive-100 text-olive-800 border-olive-200',
    nature: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    walk: 'bg-amber-100 text-amber-800 border-amber-200',
    logistics: 'bg-stone-200 text-stone-800 border-stone-300',
    featured: 'bg-ink text-canvas border-ink',
    general: 'bg-sand-100 text-ink-secondary border-sand-200',
    status: 'bg-sand-200 text-ink border-sand-300',
  };

  const style = categoryStyles[category] || categoryStyles.general;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm border uppercase tracking-wider',
        variant === 'outline' ? 'bg-transparent' : '',
        style,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
