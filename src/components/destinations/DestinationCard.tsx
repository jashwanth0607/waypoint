'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { Destination } from '@/lib/types';
import { isDestinationSaved, toggleSavedDestination, subscribeToStorage } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface DestinationCardProps {
  destination: Destination;
  variant?: 'featured' | 'tall' | 'standard';
  className?: string;
}

export function DestinationCard({
  destination,
  variant = 'standard',
  className,
}: DestinationCardProps) {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isDestinationSaved(destination.slug));
  }, [destination.slug]);

  useEffect(() => {
    const checkSaved = () => {
      setSaved(isDestinationSaved(destination.slug));
    };
    return subscribeToStorage(checkSaved);
  }, [destination.slug]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleSavedDestination(destination.slug);
    setSaved(isNowSaved);
    toast(
      isNowSaved
        ? `Saved ${destination.name} to your travel list.`
        : `Removed ${destination.name} from saved destinations.`,
      'info'
    );
  };

  const imageAspect = {
    featured: 'h-[360px] sm:h-[440px]',
    tall: 'h-[380px] sm:h-[460px]',
    standard: 'h-[240px] sm:h-[280px]',
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-lg bg-canvas-card border border-sand-300 overflow-hidden shadow-fine hover:shadow-card transition-all duration-300',
        className
      )}
    >
      {/* Image container */}
      <div className={cn('relative w-full overflow-hidden bg-sand-200', imageAspect[variant])}>
        <Image
          src={destination.heroImage}
          alt={`${destination.name}, ${destination.country}`}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent opacity-80 group-hover:opacity-75 transition-opacity" />

        {/* Region Badge & Save Button Overlay */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-canvas bg-ink/75 backdrop-blur-sm rounded-sm">
            {destination.region}
          </span>

          <button
            onClick={handleToggleSave}
            aria-label={saved ? `Unsave ${destination.name}` : `Save ${destination.name}`}
            className={cn(
              'p-2 rounded-sm backdrop-blur-sm transition-all duration-150 focus:outline-none',
              saved
                ? 'bg-terracotta-500 text-canvas'
                : 'bg-canvas/80 text-ink hover:bg-canvas'
            )}
          >
            <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} />
          </button>
        </div>

        {/* Bottom image overlay details */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-canvas">
          <div className="flex items-center gap-1.5 text-xs text-sand-200 mb-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta-300" />
            <span>{destination.country}</span>
          </div>
          <h3 className="font-serif text-2xl font-bold tracking-tight text-canvas">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-ink-secondary leading-relaxed line-clamp-3">
          {destination.description}
        </p>

        <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-[11px] text-ink-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-ink-faint" />
            <span>{destination.idealDuration}</span>
          </div>

          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-ink group-hover:text-terracotta-600 transition-colors"
          >
            <span>View Guide</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
