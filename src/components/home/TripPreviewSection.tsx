'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Share2,
} from 'lucide-react';
import { SAMPLE_TRIPS } from '@/lib/data';
import { formatDateRange } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function TripPreviewSection() {
  const sampleTrip = SAMPLE_TRIPS[0];
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({
    'act-1': true,
    'act-2': true,
  });

  const activeDay = sampleTrip.days[activeDayIndex] || sampleTrip.days[0];

  const toggleActivity = (id: string) => {
    setCompletedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-24 bg-canvas-subtle border-t border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-sand-300">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
              <span>Interactive Preview</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight">
              An itinerary designed for clarity on the road.
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              Explore how daily schedules, location pins, and travel notes stay organized.
              Interact with the sample itinerary below or customize your own.
            </p>
          </div>

          <Link href={`/trips/${sampleTrip.id}`}>
            <Button variant="primary" size="md" className="gap-2">
              <span>Open Full Interactive Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Itinerary Preview Container */}
        <div className="rounded-xl bg-canvas-card border border-sand-300 shadow-card overflow-hidden">
          {/* Trip Header Banner */}
          <div className="relative p-6 sm:p-8 bg-ink text-canvas border-b border-sand-400/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-sand-300 tracking-wider uppercase font-medium">
                  <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                  <span>{sampleTrip.destination}, {sampleTrip.country}</span>
                  <span className="text-sand-500">•</span>
                  <span>{formatDateRange(sampleTrip.startDate, sampleTrip.endDate)}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-canvas">
                  {sampleTrip.title}
                </h3>
                <p className="text-xs text-sand-300 max-w-xl leading-relaxed">
                  {sampleTrip.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/trips/${sampleTrip.id}`}>
                  <Button variant="terracotta" size="sm" className="gap-1.5">
                    <span>Customize This Trip</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Day Selection Tabs */}
          <div className="flex items-center gap-2 px-6 py-3 bg-sand-100 border-b border-sand-200 overflow-x-auto">
            {sampleTrip.days.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeDayIndex === idx
                    ? 'bg-canvas-card text-ink shadow-fine border border-sand-300'
                    : 'text-ink-secondary hover:text-ink hover:bg-sand-200'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                <span className="text-[10px] text-ink-faint">
                  ({day.activities.length} stops)
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Content */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline Activities Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="pb-4 border-b border-sand-200">
                <h4 className="font-serif text-xl font-bold text-ink">
                  {activeDay.title}
                </h4>
                {activeDay.summary && (
                  <p className="text-xs text-ink-muted mt-1">
                    {activeDay.summary}
                  </p>
                )}
              </div>

              {/* Activity Timeline List */}
              <div className="space-y-4">
                {activeDay.activities.map((act) => {
                  const isDone = completedActivities[act.id] ?? act.completed;
                  return (
                    <div
                      key={act.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                        isDone
                          ? 'bg-sand-50/60 border-sand-200 opacity-75'
                          : 'bg-canvas border-sand-300 hover:border-sand-400'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleActivity(act.id)}
                        className="mt-0.5 text-ink-muted hover:text-ink transition-colors focus:outline-none"
                        aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-olive-600 fill-olive-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-sand-400" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {act.time && (
                              <span className="text-xs font-mono font-medium text-ink-faint flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {act.time}
                              </span>
                            )}
                            <Badge category={act.category}>
                              {act.category}
                            </Badge>
                          </div>
                        </div>

                        <h5
                          className={`text-sm font-semibold text-ink ${
                            isDone ? 'line-through text-ink-muted' : ''
                          }`}
                        >
                          {act.title}
                        </h5>

                        {act.description && (
                          <p className="text-xs text-ink-secondary leading-relaxed">
                            {act.description}
                          </p>
                        )}

                        {act.location && (
                          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted pt-1">
                            <MapPin className="w-3 h-3 text-terracotta-500" />
                            <span>{act.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Travel Context & Packing Sidebar */}
            <div className="space-y-6">
              {/* Daily Travel Notes */}
              <div className="p-5 rounded-lg bg-sand-100 border border-sand-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink">
                  <BookOpen className="w-4 h-4 text-terracotta-600" />
                  <span>Logistics & Notes</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {sampleTrip.generalNotes}
                </p>
              </div>

              {/* Sample Packing Checklist */}
              <div className="p-5 rounded-lg bg-sand-100 border border-sand-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                    Packing List
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    {sampleTrip.packingList?.filter((i) => i.done).length} /{' '}
                    {sampleTrip.packingList?.length} Packed
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-ink-secondary">
                  {sampleTrip.packingList?.slice(0, 4).map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-none bg-olive-600" />
                      <span className={item.done ? 'line-through text-ink-muted' : ''}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Link href={`/trips/${sampleTrip.id}`} className="block">
                  <Button variant="outline" className="w-full justify-center">
                    <span>Manage All Activities</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
