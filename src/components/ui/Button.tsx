import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terracotta' | 'olive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink disabled:opacity-50 disabled:pointer-events-none rounded-md';

    const variants = {
      primary:
        'bg-ink text-canvas hover:bg-ink-secondary active:bg-ink focus-visible:ring-ink shadow-fine',
      secondary:
        'bg-sand-100 text-ink hover:bg-sand-200 active:bg-sand-300 border border-sand-300',
      outline:
        'border border-sand-300 bg-transparent text-ink hover:bg-sand-100 active:bg-sand-200',
      ghost:
        'text-ink-secondary hover:text-ink hover:bg-sand-100 active:bg-sand-200',
      terracotta:
        'bg-terracotta-500 text-canvas hover:bg-terracotta-600 active:bg-terracotta-700 shadow-fine',
      olive:
        'bg-olive-600 text-canvas hover:bg-olive-700 active:bg-olive-800 shadow-fine',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3 h-12 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
