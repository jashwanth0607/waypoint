import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';
import { DESTINATIONS } from '@/lib/data';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { Button } from '@/components/ui/Button';

export function DestinationDiscovery() {
  const featured = DESTINATIONS[0]; // Kyoto
  const secondary = DESTINATIONS.slice(1, 3); // Amalfi, Iceland
  const tertiary = DESTINATIONS.slice(3, 5); // Marrakech, Bali

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-sand-300">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
            <Compass className="w-4 h-4" />
            <span>Curated Geography</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight leading-tight">
            Destinations curated for intentional travel.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            In-depth guides featuring preserved heritage, natural wonders, and
            neighborhood rhythm. Selected for depth rather than superficial checklist travel.
          </p>
        </div>

        <Link href="/destinations" className="flex-shrink-0">
          <Button variant="outline" size="md" className="gap-2">
            <span>Explore All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Editorial Destination Grid */}
      <div className="space-y-8">
        {/* Top Feature: Panoramic Kyoto */}
        {featured && (
          <DestinationCard
            destination={featured}
            variant="featured"
            className="w-full"
          />
        )}

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {secondary.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              variant="tall"
            />
          ))}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tertiary.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              variant="standard"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
