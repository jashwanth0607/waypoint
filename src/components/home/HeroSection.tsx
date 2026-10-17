'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Compass, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DESTINATIONS } from '@/lib/data';
import { CreateTripModal } from '@/components/trips/CreateTripModal';

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push('/destinations');
      return;
    }

    const matched = DESTINATIONS.find((d) =>
      d.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    if (matched) {
      router.push(`/destinations/${matched.slug}`);
    } else {
      router.push(`/destinations?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-canvas">
        {/* Editorial Background Composition */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop"
            alt="Kyoto bamboo forest morning path"
            fill
            priority
            className="object-cover object-center filter brightness-[0.88] contrast-[1.03]"
            sizes="100vw"
          />
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-ink/30" />
          <div className="absolute inset-0 bg-canvas/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Editorial Category Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-canvas/90 backdrop-blur-sm border border-sand-300 shadow-fine">
            <span className="w-1.5 h-1.5 rounded-none bg-terracotta-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
              Structured Travel Itineraries
            </span>
          </div>

          {/* Headline - Direct value proposition */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-ink tracking-tight leading-[1.08]">
            Turn destination ideas into structured, day-by-day itineraries.
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-ink-secondary leading-relaxed font-sans">
            Plan unhurried journeys with curated regional highlights, precise daily
            timelines, and thoughtful travel notes in one focused interface.
          </p>

          {/* Quick Search & Planning Bar */}
          <div className="max-w-xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-lg bg-canvas-card/95 backdrop-blur-md border border-sand-300 shadow-elevated"
            >
              <div className="flex items-center gap-2.5 px-3 w-full sm:flex-1 h-11">
                <Search className="w-4 h-4 text-ink-muted flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to travel? (e.g. Kyoto, Amalfi, Iceland)"
                  className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>

            {/* Popular Quick Destinations */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-secondary">
              <span className="font-medium text-ink-muted">Quick Guides:</span>
              {DESTINATIONS.slice(0, 4).map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="hover:text-ink underline decoration-sand-400 hover:decoration-ink transition-colors font-medium"
                >
                  {dest.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="terracotta"
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Button>

            <Link href="/destinations" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-canvas/80 backdrop-blur-sm"
              >
                <span>Browse Destination Guides</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Understated Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[10px] tracking-widest uppercase font-medium text-ink-muted">
            Scroll to Explore
          </span>
          <div className="w-4 h-7 rounded-sm border border-ink-muted flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-ink rounded-none animate-bounce" />
          </div>
        </div>
      </section>

      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
