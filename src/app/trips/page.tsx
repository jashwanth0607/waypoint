'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  Download,
  Upload,
  Compass,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Trip, TripStatus } from '@/lib/types';
import {
  getTrips,
  deleteTrip,
  subscribeToStorage,
  exportDataAsJson,
  importDataFromJson,
} from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreateTripModal } from '@/components/trips/CreateTripModal';
import { formatDateRange, calculateDaysBetween } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function TripsPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | TripStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Sync trips from storage
  useEffect(() => {
    setTrips(getTrips());
    return subscribeToStorage(() => {
      setTrips(getTrips());
    });
  }, []);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDest = t.destination.toLowerCase().includes(q);
        const matchCountry = t.country.toLowerCase().includes(q);
        if (!matchTitle && !matchDest && !matchCountry) return false;
      }
      return true;
    });
  }, [trips, statusFilter, searchQuery]);

  // Statistics
  const totalDays = useMemo(() => {
    return trips.reduce((acc, t) => acc + calculateDaysBetween(t.startDate, t.endDate), 0);
  }, [trips]);

  const totalActivities = useMemo(() => {
    return trips.reduce(
      (acc, t) =>
        acc +
        t.days.reduce((dAcc, day) => dAcc + day.activities.length, 0),
      0
    );
  }, [trips]);

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteTrip(id);
      toast(`Trip "${title}" removed.`, 'info');
    }
  };

  const handleExport = () => {
    const dataStr = exportDataAsJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wayfarer-itineraries-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast('Itineraries exported to JSON file.', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataFromJson(content);
      if (success) {
        toast('Itineraries successfully restored from backup!', 'success');
      } else {
        toast('Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-sand-300">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
              <Compass className="w-4 h-4" />
              <span>Itinerary Management</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-ink tracking-tight">
              My Journeys & Itineraries
            </h1>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              Review current travel plans, organize day-by-day stops, and build
              new itineraries with structured activity timelines.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              title="Download backup JSON"
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              title="Restore from backup JSON"
              className="gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Plan a Trip</span>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Active & Planned Trips
            </span>
            <div className="font-serif text-3xl font-bold text-ink">
              {trips.length}
            </div>
            <p className="text-xs text-ink-secondary pt-1">
              Structured travel itineraries
            </p>
          </div>

          <div className="p-6 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Total Days Scheduled
            </span>
            <div className="font-serif text-3xl font-bold text-ink">
              {totalDays}
            </div>
            <p className="text-xs text-ink-secondary pt-1">
              Days across all journeys
            </p>
          </div>

          <div className="p-6 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Total Activities
            </span>
            <div className="font-serif text-3xl font-bold text-ink">
              {totalActivities}
            </div>
            <p className="text-xs text-ink-secondary pt-1">
              Stops, meals, walks, and lodgings
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-canvas-card border border-sand-300 shadow-fine">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-canvas p-1 rounded-md border border-sand-300 w-full sm:w-auto overflow-x-auto">
            {(['all', 'planning', 'upcoming', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm capitalize transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-ink text-canvas shadow-fine'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or city..."
              className="w-full px-3 py-1.5 text-xs bg-canvas rounded-md border border-sand-300 text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => {
              const daysCount = calculateDaysBetween(trip.startDate, trip.endDate);
              const activityCount = trip.days.reduce(
                (sum, d) => sum + d.activities.length,
                0
              );

              return (
                <div
                  key={trip.id}
                  className="group flex flex-col rounded-xl bg-canvas-card border border-sand-300 overflow-hidden shadow-fine hover:shadow-card transition-all duration-300"
                >
                  {/* Trip Card Cover Image */}
                  <div className="relative aspect-[16/9] w-full bg-sand-200 overflow-hidden">
                    <Image
                      src={trip.coverImage}
                      alt={trip.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-canvas bg-ink/75 backdrop-blur-sm rounded-sm">
                        {trip.status}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => handleDelete(trip.id, trip.title, e)}
                        className="p-1.5 rounded-sm bg-canvas/80 hover:bg-red-50 text-ink-muted hover:text-red-700 backdrop-blur-sm transition-colors"
                        aria-label={`Delete trip ${trip.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-canvas flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-terracotta-300" />
                        <span className="font-medium text-sand-100">
                          {trip.destination}, {trip.country}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] bg-canvas/20 backdrop-blur-sm px-2 py-0.5 rounded-sm">
                        {daysCount} Days
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] text-ink-muted font-medium mb-1">
                        {formatDateRange(trip.startDate, trip.endDate)}
                      </div>
                      <h3 className="font-serif text-xl font-bold text-ink tracking-tight group-hover:text-terracotta-600 transition-colors">
                        {trip.title}
                      </h3>
                      {trip.description && (
                        <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2 mt-1.5">
                          {trip.description}
                        </p>
                      )}
                    </div>

                    {/* Stats & Link */}
                    <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-ink-muted">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{activityCount} stops planned</span>
                      </div>

                      <Link
                        href={`/trips/${trip.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-ink hover:text-terracotta-600 transition-colors"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center rounded-xl bg-canvas-card border border-sand-300 p-8 space-y-4">
            <Calendar className="w-8 h-8 text-ink-muted mx-auto" />
            <h3 className="font-serif text-2xl font-semibold text-ink">
              No itineraries found
            </h3>
            <p className="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? 'No trips matched your search query. Try clearing the filter.'
                : 'You have not created any trips yet. Create your first journey to begin organizing days, activities, and travel notes.'}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Journey</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateTripModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
