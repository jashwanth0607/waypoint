'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreateTripModal } from '@/components/trips/CreateTripModal';

export function FinalCta() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-2xl bg-canvas-card border border-sand-300 p-8 sm:p-14 shadow-card space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-sand-100 border border-sand-200">
            <Compass className="w-3.5 h-3.5 text-terracotta-600" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
              Begin Your Journey
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to shape your next journey with intention?
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-ink-secondary leading-relaxed">
            Create day-by-day schedules, record key reservations, and organize
            meaningful experiences in one calm, dedicated workspace.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="terracotta"
              size="lg"
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Create an Itinerary</span>
            </Button>

            <Link href="/destinations" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full gap-2">
                <span>Browse Destination Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
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
