'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { DESTINATIONS } from '@/lib/data';
import { createTrip } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { calculateDaysBetween } from '@/lib/utils';
import { ItineraryDay } from '@/lib/types';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export function CreateTripModal({
  isOpen,
  onClose,
  defaultDestination = '',
}: CreateTripModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [destination, setDestination] = useState(defaultDestination);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill title and cover image when destination changes
  const handleDestinationSelect = (destName: string) => {
    setDestination(destName);
    if (!title) {
      setTitle(`${destName} Itinerary`);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!destination.trim()) {
      newErrors.destination = 'Destination is required.';
    }
    if (!title.trim()) {
      newErrors.title = 'Trip title is required.';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required.';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required.';
    }
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'End date cannot be earlier than start date.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Find matching destination if available
      const matchedDest = DESTINATIONS.find(
        (d) => d.name.toLowerCase() === destination.trim().toLowerCase()
      );

      const coverImage = matchedDest
        ? matchedDest.heroImage
        : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop';

      const country = matchedDest ? matchedDest.country : 'Worldwide';
      const numDays = calculateDaysBetween(startDate, endDate);

      // Generate initial day structure
      const initialDays: ItineraryDay[] = Array.from({ length: numDays }, (_, i) => ({
        id: `day-${i + 1}-${Date.now()}`,
        dayNumber: i + 1,
        title: i === 0 ? 'Arrival & First Impressions' : `Day ${i + 1}`,
        summary: '',
        activities: [],
        notes: '',
      }));

      const newTrip = createTrip({
        title: title.trim(),
        destination: destination.trim(),
        destinationSlug: matchedDest ? matchedDest.slug : undefined,
        country,
        coverImage,
        startDate,
        endDate,
        status: 'planning',
        description: notes.trim(),
        generalNotes: notes.trim(),
        days: initialDays,
        packingList: [
          { id: 'pack-1', text: 'Passport and travel documentation', done: false },
          { id: 'pack-2', text: 'Local currency or travel cards', done: false },
          { id: 'pack-3', text: 'Power adapters and charging gear', done: false },
        ],
      });

      toast(`Trip "${newTrip.title}" created successfully!`, 'success');
      onClose();
      router.push(`/trips/${newTrip.id}`);
    } catch (err) {
      console.error(err);
      toast('Failed to create trip. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plan a New Journey"
      description="Create a structured itinerary framework with dates, places, and day-by-day activities."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Destination selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
            Destination
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Kyoto, Japan or Amalfi Coast"
              className="flex h-10 w-full rounded-md border border-sand-300 bg-canvas-card px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            />
          </div>
          {errors.destination && (
            <p className="mt-1 text-xs text-red-600 font-medium">
              {errors.destination}
            </p>
          )}

          {/* Quick suggestions */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-muted">Popular:</span>
            {DESTINATIONS.slice(0, 4).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleDestinationSelect(d.name)}
                className="text-xs px-2 py-0.5 rounded-sm bg-sand-100 hover:bg-sand-200 text-ink border border-sand-200 transition-colors"
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Title */}
        <Input
          label="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Autumn in Kyoto & Nara"
          error={errors.title}
        />

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={errors.startDate}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            error={errors.endDate}
          />
        </div>

        {startDate && endDate && startDate <= endDate && (
          <p className="text-xs text-olive-700 bg-olive-50 px-3 py-1.5 rounded-sm border border-olive-200">
            Duration: {calculateDaysBetween(startDate, endDate)} days itinerary
          </p>
        )}

        {/* Notes */}
        <Textarea
          label="Trip Notes or Focus (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key goals, travel companions, lodging ideas, or dietary notes."
          rows={3}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Create Itinerary
          </Button>
        </div>
      </form>
    </Modal>
  );
}
