'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Activity, ActivityCategory } from '@/lib/types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Omit<Activity, 'id'> | Activity) => void;
  initialData?: Activity | null;
  dayNumber: number;
}

export function ActivityModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  dayNumber,
}: ActivityModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('culture');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTime(initialData.time || '');
      setCategory(initialData.category);
      setLocation(initialData.location || '');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setTime('');
      setCategory('culture');
      setLocation('');
      setDescription('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const categories: { key: ActivityCategory; label: string }[] = [
    { key: 'culture', label: 'Culture & Temple' },
    { key: 'food', label: 'Food & Dining' },
    { key: 'nature', label: 'Nature & Landscape' },
    { key: 'walk', label: 'Walking Route' },
    { key: 'stay', label: 'Lodging & Hotel' },
    { key: 'logistics', label: 'Transit & Logistics' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Activity title is required.' });
      return;
    }

    const payload = {
      title: title.trim(),
      time: time.trim() || undefined,
      category,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      completed: initialData ? initialData.completed : false,
      ...(initialData ? { id: initialData.id } : {}),
    };

    onSave(payload as Activity);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Activity' : `Add Activity to Day ${dayNumber}`}
      description="Record timing, category, location, and travel notes for this stop."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Activity Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Visit Kinkaku-ji Golden Pavilion"
          error={errors.title}
          autoFocus
        />

        {/* Category & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              className="flex h-10 w-full rounded-md border border-sand-300 bg-canvas-card px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Planned Time (Optional)"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 09:30 or Morning"
          />
        </div>

        {/* Location / Address */}
        <Input
          label="Location or Address"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. 1 Kinkakujicho, Kita Ward, Kyoto"
        />

        {/* Description / Notes */}
        <Textarea
          label="Notes / Logistics"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Opening hours, ticket tips, reservation codes, or packing notes."
          rows={3}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Save Changes' : 'Add Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
