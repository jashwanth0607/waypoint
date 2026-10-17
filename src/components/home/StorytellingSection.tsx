import React from 'react';
import Image from 'next/image';
import { Compass, CalendarCheck, CheckSquare } from 'lucide-react';

export function StorytellingSection() {
  const steps = [
    {
      number: '01',
      title: 'Select your destination and travel rhythm',
      description:
        'Choose from curated regional guides or enter your own destination. Establish realistic date boundaries to prevent travel fatigue and overpacked schedules.',
      icon: Compass,
      image:
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
      meta: 'Geographic Context & Seasonal Timing',
    },
    {
      number: '02',
      title: 'Structure experiences into day-by-day itineraries',
      description:
        'Distribute activities logically across morning, afternoon, and evening. Group places by neighborhood so your days flow with natural ease instead of cross-town transit rush.',
      icon: CalendarCheck,
      image:
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1200&auto=format&fit=crop',
      meta: 'Activity Timelines & Neighborhood Grouping',
    },
    {
      number: '03',
      title: 'Keep notes, checklists, and places in one quiet place',
      description:
        'Consolidate lodging details, packing lists, and day notes. Export or print your complete itinerary for offline access when roaming without stable signal.',
      icon: CheckSquare,
      image:
        'https://images.unsplash.com/photo-1528164344705-475426879c0d?q=80&w=1200&auto=format&fit=crop',
      meta: 'Packing Checklists & Exportable Summaries',
    },
  ];

  return (
    <section className="py-24 bg-canvas-subtle border-y border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-olive-700">
            <span>The Planning Method</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight">
            How intentional itineraries are built.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            A three-step approach designed to eliminate travel chaos while leaving
            space for serendipitous discovery.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div
                key={step.number}
                className={`flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-10 lg:gap-16`}
              >
                {/* Visual Image Card */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-sand-300 shadow-card bg-sand-200">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-ink/10" />
                    <div className="absolute bottom-3 left-3 bg-canvas/90 backdrop-blur-sm px-3 py-1 rounded-sm border border-sand-300 text-[11px] font-medium text-ink">
                      {step.meta}
                    </div>
                  </div>
                </div>

                {/* Step Text Details */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-terracotta-600 tracking-wider">
                      PHASE {step.number}
                    </span>
                    <div className="h-px flex-1 bg-sand-300" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-sm bg-sand-200 flex items-center justify-center text-ink flex-shrink-0">
                      <Icon className="w-4 h-4 text-ink-secondary" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
