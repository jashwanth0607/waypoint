'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-md border shadow-card text-xs font-medium tracking-wide transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-2',
              t.type === 'success' && 'bg-canvas-card border-olive-300 text-ink',
              t.type === 'error' && 'bg-canvas-card border-red-300 text-red-900',
              t.type === 'info' && 'bg-canvas-card border-sand-300 text-ink'
            )}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-olive-600 flex-shrink-0" />
              )}
              {t.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              {t.type === 'info' && (
                <Info className="w-4 h-4 text-ink-muted flex-shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink-muted hover:text-ink transition-colors p-1"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: (msg: string) => {
        if (typeof window !== 'undefined') console.log(`[Toast] ${msg}`);
      },
    };
  }
  return context;
}
