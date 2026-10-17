'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  Plus,
  Compass,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DESTINATIONS } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreateTripModal } from '@/components/trips/CreateTripModal';
import { isDestinationSaved, toggleSavedDestination, subscribeToStorage } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { toast } = useToast();

  const destination = DESTINATIONS.find((d) => d.slug === slug);
  const [isSaved, setIsSaved] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      setIsSaved(isDestinationSaved(slug));
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const checkSaved = () => {
      setIsSaved(isDestinationSaved(slug));
    };
    return subscribeToStorage(checkSaved);
  }, [slug]);

  if (!destination) {
    return (
      <div className="py-24 max-w-3xl mx-auto px-4 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-ink">
          Destination Not Found
        </h1>
        <p className="text-xs text-ink-secondary">
          The requested destination guide does not exist or has been moved.
        </p>
        <Link href="/destinations">
          <Button variant="outline">Back to Destinations</Button>
        </Link>
      </div>
    );
  }

  const handleToggleSave = () => {
    const nextSaved = toggleSavedDestination(destination.slug);
    setIsSaved(nextSaved);
    toast(
      nextSaved
        ? `Saved ${destination.name} to your travel list.`
        : `Removed ${destination.name} from saved destinations.`,
      'info'
    );
  };

  return (
    <>
      <div className="pb-24">
        {/* Back navigation bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Destinations</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative h-[65vh] min-h-[460px] w-full overflow-hidden bg-sand-900">
          <Image
            src={destination.heroImage}
            alt={destination.name}
            fill
            priority
            className="object-cover object-center brightness-90 contrast-[1.02]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-ink/40 to-ink/20" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
            <div className="space-y-3 max-w-2xl text-canvas">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-canvas bg-ink/80 backdrop-blur-sm rounded-sm">
                  {destination.region}
                </span>
                <span className="text-xs text-sand-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                  <span>{destination.country}</span>
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-canvas">
                {destination.name}
              </h1>

              <p className="text-sm sm:text-base text-sand-100 max-w-xl leading-relaxed">
                {destination.tagline}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant={isSaved ? 'terracotta' : 'secondary'}
                size="md"
                onClick={handleToggleSave}
                className="gap-2"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved to List' : 'Save Destination'}</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Plan a Trip Here</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          {/* Key Facts Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-xl bg-canvas-card border border-sand-300 shadow-fine">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-sand-100 flex items-center justify-center text-ink flex-shrink-0">
                <Clock className="w-4 h-4 text-terracotta-600" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Suggested Duration
                </span>
                <span className="text-sm font-semibold text-ink">
                  {destination.idealDuration}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-sand-100 flex items-center justify-center text-ink flex-shrink-0">
                <Calendar className="w-4 h-4 text-olive-600" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Best Seasons
                </span>
                <span className="text-sm font-semibold text-ink">
                  {destination.bestSeason}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-sand-100 flex items-center justify-center text-ink flex-shrink-0">
                <Compass className="w-4 h-4 text-ink" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                  Travel Rhythm
                </span>
                <span className="text-sm font-semibold text-ink">
                  Unhurried & Immersive
                </span>
              </div>
            </div>
          </div>

          {/* Overview & Cultural Context */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
                  Regional Context
                </span>
                <h2 className="font-serif text-3xl font-semibold text-ink tracking-tight">
                  The Essence of {destination.name}
                </h2>
              </div>
              <p className="text-base text-ink-secondary leading-relaxed font-serif text-lg">
                {destination.description}
              </p>
              <div className="p-5 rounded-lg bg-sand-100 border-l-4 border-terracotta-500 text-xs text-ink-secondary leading-relaxed">
                <span className="font-semibold text-ink block mb-1">
                  Curator Note:
                </span>
                {destination.curatedSummary}
              </div>
            </div>

            {/* Practical Advice Sidebar */}
            <div className="p-6 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink pb-2 border-b border-sand-200">
                Practical Travel Advice
              </h3>
              <ul className="space-y-3">
                {destination.practicalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-secondary">
                    <CheckCircle2 className="w-4 h-4 text-olive-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Curated Highlights */}
          <div className="space-y-8">
            <div className="pb-4 border-b border-sand-300 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
                  Experiences
                </span>
                <h2 className="font-serif text-3xl font-semibold text-ink tracking-tight mt-1">
                  Essential Regional Highlights
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {destination.highlights.map((hl, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg bg-canvas-card border border-sand-300 shadow-fine space-y-3 hover:border-sand-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Badge category={hl.category}>{hl.category}</Badge>
                    <span className="text-[11px] text-ink-faint flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-terracotta-500" />
                      <span>{hl.location}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-ink">
                    {hl.title}
                  </h3>

                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {hl.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhood Guide */}
          <div className="space-y-8">
            <div className="pb-4 border-b border-sand-300">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-olive-700">
                Local Geography
              </span>
              <h2 className="font-serif text-3xl font-semibold text-ink tracking-tight mt-1">
                Neighborhood Rhythm & Quarters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destination.neighborhoods.map((n, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg bg-sand-100 border border-sand-200 space-y-3"
                >
                  <h3 className="font-serif text-xl font-bold text-ink">
                    {n.name}
                  </h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {n.vibe}
                  </p>
                  <div className="pt-2 border-t border-sand-300/60 text-[11px] text-ink-muted">
                    <span className="font-semibold text-ink">Top Pick: </span>
                    {n.topPick}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Images Strip */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
              Atmosphere & Imagery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {destination.galleryImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-sand-300 bg-sand-200"
                >
                  <Image
                    src={imgUrl}
                    alt={`${destination.name} photo ${i + 1}`}
                    fill
                    className="object-cover object-center hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Card */}
          <div className="p-8 sm:p-12 rounded-xl bg-ink text-canvas flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-canvas">
                Plan your itinerary for {destination.name}
              </h3>
              <p className="text-xs text-sand-300 max-w-lg leading-relaxed">
                Build a tailored day-by-day itinerary with activities, stays, and
                travel logistics.
              </p>
            </div>

            <Button
              variant="terracotta"
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Itinerary</span>
            </Button>
          </div>
        </div>
      </div>

      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        defaultDestination={destination.name}
      />
    </>
  );
}
