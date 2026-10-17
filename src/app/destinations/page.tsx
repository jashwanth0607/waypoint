'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Compass, Bookmark, Filter, X, Plus } from 'lucide-react';
import { DESTINATIONS } from '@/lib/data';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { Button } from '@/components/ui/Button';
import { CreateTripModal } from '@/components/trips/CreateTripModal';
import { getSavedDestinations, subscribeToStorage } from '@/lib/storage';

function DestinationsContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>(initialFilter);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Sync saved destinations
  useEffect(() => {
    setSavedSlugs(getSavedDestinations());
    return subscribeToStorage(() => {
      setSavedSlugs(getSavedDestinations());
    });
  }, []);

  // Update filter if search param changes
  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setFilterType(f);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Extract unique regions
  const regions = useMemo(() => {
    const list = Array.from(new Set(DESTINATIONS.map((d) => d.region)));
    return ['all', ...list];
  }, []);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((d) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(q);
        const matchesCountry = d.country.toLowerCase().includes(q);
        const matchesDesc = d.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry && !matchesDesc) return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && d.region !== selectedRegion) {
        return false;
      }

      // Filter type (saved, featured, all)
      if (filterType === 'saved') {
        if (!savedSlugs.includes(d.slug)) return false;
      } else if (filterType === 'featured') {
        if (!d.isFeatured) return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, filterType, savedSlugs]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setFilterType('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedRegion !== 'all' || filterType !== 'all';

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-sand-300">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
            <Compass className="w-4 h-4" />
            <span>Destination Catalog</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
            Curated destinations for unhurried exploration.
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            Discover in-depth regional guides with cultural highlights, practical
            local advice, and neighborhood recommendations.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Plan a Custom Trip</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-lg bg-canvas-card border border-sand-300 shadow-fine">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city, country, or theme..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-canvas rounded-md border border-sand-300 text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Collection filters */}
          <div className="flex items-center gap-1 bg-canvas p-1 rounded-md border border-sand-300">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                filterType === 'all'
                  ? 'bg-ink text-canvas shadow-fine'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              All Guides
            </button>

            <button
              onClick={() => setFilterType('featured')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                filterType === 'featured'
                  ? 'bg-ink text-canvas shadow-fine'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              Featured
            </button>

            <button
              onClick={() => setFilterType('saved')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
                filterType === 'saved'
                  ? 'bg-terracotta-500 text-canvas shadow-fine'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Saved ({savedSlugs.length})</span>
            </button>
          </div>

          {/* Region dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs font-semibold text-ink bg-canvas border border-sand-300 rounded-md px-3 py-2 focus:outline-none focus:border-ink"
            >
              <option value="all">All Regions</option>
              {regions.filter((r) => r !== 'all').map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-ink-muted hover:text-ink underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <span>
          Showing {filteredDestinations.length}{' '}
          {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
        </span>
        {filterType === 'saved' && (
          <span className="text-terracotta-700">
            Filtering by your saved bookmarks
          </span>
        )}
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              variant="tall"
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-xl bg-canvas-card border border-sand-300 p-8 space-y-4">
          <Compass className="w-8 h-8 text-ink-muted mx-auto" />
          <h3 className="font-serif text-2xl font-semibold text-ink">
            No destinations found
          </h3>
          <p className="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
            {filterType === 'saved'
              ? 'You have not saved any destinations yet. Browse destinations and click the bookmark icon to save places to your list.'
              : 'No destinations matched your search filters. Try adjusting your query or resetting filters.'}
          </p>
          <div className="pt-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-ink-muted">Loading destinations...</div>}>
      <DestinationsContent />
    </Suspense>
  );
}
