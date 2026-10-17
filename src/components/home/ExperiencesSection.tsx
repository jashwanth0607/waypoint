'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Utensils, Landmark, Mountain, Bed, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { EXPERIENCES } from '@/lib/data';
import { ExperienceCategory } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ExperiencesSection() {
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory | 'all'>('all');

  const categories: { key: ExperienceCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'all', label: 'All Highlights', icon: Sparkles },
    { key: 'food', label: 'Local Food', icon: Utensils },
    { key: 'culture', label: 'Architecture & Culture', icon: Landmark },
    { key: 'nature', label: 'Nature & Outdoors', icon: Mountain },
    { key: 'stay', label: 'Boutique Stays', icon: Bed },
    { key: 'hidden-gem', label: 'Quiet Places', icon: Sparkles },
  ];

  const filteredExperiences = activeCategory === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter((exp) => exp.category === activeCategory);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-sand-300">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-600">
            <span>Curated Moments</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight">
            Places and experiences that ground a journey.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
            From sunrise temple walks to seaside trattorias, discover experiences
            that capture the authentic spirit of a destination.
          </p>
        </div>

        <Link href="/destinations">
          <Button variant="outline" size="md" className="gap-2">
            <span>Browse All Places</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Category Pills/Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-md border transition-all duration-150 ${
                isActive
                  ? 'bg-ink text-canvas border-ink shadow-fine'
                  : 'bg-canvas-card text-ink-secondary hover:text-ink hover:bg-sand-100 border-sand-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Experience Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperiences.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col rounded-lg bg-canvas-card border border-sand-300 overflow-hidden shadow-fine hover:shadow-card transition-all duration-300"
          >
            {/* Image */}
            <div className="relative aspect-[16/11] w-full bg-sand-200 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />

              <div className="absolute top-3 left-3">
                <Badge
                  category={
                    item.category === 'hidden-gem' ? 'featured' : item.category
                  }
                  className="bg-canvas/90 backdrop-blur-sm text-ink font-semibold"
                >
                  {item.category.replace('-', ' ')}
                </Badge>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-canvas flex items-center gap-1.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-terracotta-300" />
                <span className="font-medium text-sand-100">{item.locationName}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink tracking-tight mb-2 group-hover:text-terracotta-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-[11px] text-ink-muted">
                <span>{item.destination}, {item.country}</span>
                <Link
                  href={`/destinations/${item.destination.toLowerCase().replace(/\s+/g, '-')}`}
                  className="font-medium text-ink hover:text-terracotta-600 transition-colors inline-flex items-center gap-1"
                >
                  <span>Regional Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
