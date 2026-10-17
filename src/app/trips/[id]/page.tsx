'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  CheckCircle2,
  Circle,
  Printer,
  BookOpen,
  CheckSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Trip, ItineraryDay, Activity, TripStatus } from '@/lib/types';
import {
  getTripById,
  saveTrip,
  addActivityToDay,
  updateActivityInDay,
  deleteActivityFromDay,
  reorderActivitiesInDay,
  addDayToTrip,
  updateDayInTrip,
  deleteDayFromTrip,
  subscribeToStorage,
} from '@/lib/storage';
import { formatDateRange, calculateDaysBetween } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ActivityModal } from '@/components/trips/ActivityModal';
import { useToast } from '@/components/ui/Toast';

export default function TripWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const tripId = unwrappedParams.id;
  const router = useRouter();
  const { toast } = useToast();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'notes' | 'packing'>('itinerary');
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Activity Modal State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Packing list new item input
  const [newPackingText, setNewPackingText] = useState('');

  // Day title editing
  const [isEditingDayTitle, setIsEditingDayTitle] = useState(false);
  const [editedDayTitle, setEditedDayTitle] = useState('');

  // Load and sync trip
  useEffect(() => {
    const loaded = getTripById(tripId);
    setTrip(loaded);
  }, [tripId]);

  useEffect(() => {
    return subscribeToStorage(() => {
      const updated = getTripById(tripId);
      setTrip(updated);
    });
  }, [tripId]);

  if (!trip) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-ink">
          Itinerary Not Found
        </h1>
        <p className="text-xs text-ink-secondary">
          The requested trip could not be found or was deleted.
        </p>
        <Link href="/trips">
          <Button variant="outline">Back to My Trips</Button>
        </Link>
      </div>
    );
  }

  const activeDay: ItineraryDay | undefined = trip.days[activeDayIndex] || trip.days[0];

  // Trip Status Change
  const handleStatusChange = (newStatus: TripStatus) => {
    const updated = { ...trip, status: newStatus };
    setTrip(updated);
    saveTrip(updated);
    toast(`Trip status marked as ${newStatus}.`, 'info');
  };

  // Add Day
  const handleAddDay = () => {
    const nextNumber = trip.days.length + 1;
    const newDay = addDayToTrip(trip.id, {
      title: `Day ${nextNumber}`,
      summary: '',
      activities: [],
      notes: '',
    });

    if (newDay) {
      toast(`Day ${nextNumber} added to itinerary.`, 'success');
      setActiveDayIndex(trip.days.length);
    }
  };

  // Delete Day
  const handleDeleteDay = (dayId: string, dayNumber: number) => {
    if (trip.days.length <= 1) {
      toast('An itinerary must contain at least one day.', 'error');
      return;
    }

    if (confirm(`Delete Day ${dayNumber}? All scheduled activities on this day will be removed.`)) {
      const success = deleteDayFromTrip(trip.id, dayId);
      if (success) {
        toast(`Day ${dayNumber} removed.`, 'info');
        setActiveDayIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Save Day Title
  const handleSaveDayTitle = () => {
    if (!activeDay) return;
    if (editedDayTitle.trim()) {
      updateDayInTrip(trip.id, {
        ...activeDay,
        title: editedDayTitle.trim(),
      });
      toast('Day title updated.', 'success');
    }
    setIsEditingDayTitle(false);
  };

  // Activity Handlers
  const handleOpenAddActivity = () => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (data: Omit<Activity, 'id'> | Activity) => {
    if (!activeDay) return;

    if ('id' in data && data.id) {
      updateActivityInDay(trip.id, activeDay.id, data as Activity);
      toast('Activity updated.', 'success');
    } else {
      addActivityToDay(trip.id, activeDay.id, data as Omit<Activity, 'id'>);
      toast('Activity added.', 'success');
    }
  };

  const handleDeleteActivity = (actId: string, title: string) => {
    if (!activeDay) return;
    if (confirm(`Remove "${title}" from Day ${activeDay.dayNumber}?`)) {
      deleteActivityFromDay(trip.id, activeDay.id, actId);
      toast(`Removed "${title}".`, 'info');
    }
  };

  const handleMoveActivity = (idx: number, direction: 'up' | 'down') => {
    if (!activeDay) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    reorderActivitiesInDay(trip.id, activeDay.id, idx, targetIdx);
  };

  const handleToggleActivityCompletion = (activity: Activity) => {
    if (!activeDay) return;
    updateActivityInDay(trip.id, activeDay.id, {
      ...activity,
      completed: !activity.completed,
    });
  };

  // Packing List Handlers
  const handleTogglePackingItem = (itemId: string) => {
    const list = trip.packingList || [];
    const updatedList = list.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    saveTrip({ ...trip, packingList: updatedList });
  };

  const handleAddPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingText.trim()) return;

    const list = trip.packingList || [];
    const newItem = {
      id: `p-${Date.now()}`,
      text: newPackingText.trim(),
      done: false,
    };

    saveTrip({ ...trip, packingList: [...list, newItem] });
    setNewPackingText('');
    toast('Item added to packing list.', 'success');
  };

  const handleDeletePackingItem = (itemId: string) => {
    const list = trip.packingList || [];
    const updatedList = list.filter((item) => item.id !== itemId);
    saveTrip({ ...trip, packingList: updatedList });
  };

  // General Notes Update
  const handleUpdateGeneralNotes = (notes: string) => {
    saveTrip({ ...trip, generalNotes: notes });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-24">
      {/* Top Breadcrumb & Actions Bar (no-print) */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between">
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Trips</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Itinerary</span>
          </Button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative bg-ink text-canvas py-10 px-4 sm:px-6 lg:px-8 border-y border-sand-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-sand-300">
              <span className="flex items-center gap-1 font-medium text-sand-200">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                <span>{trip.destination}, {trip.country}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
              </span>
              <span>•</span>
              <span className="font-mono text-sand-200">
                {calculateDaysBetween(trip.startDate, trip.endDate)} Days
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-canvas">
              {trip.title}
            </h1>

            {trip.description && (
              <p className="text-xs text-sand-300 max-w-2xl leading-relaxed">
                {trip.description}
              </p>
            )}
          </div>

          {/* Status selector */}
          <div className="no-print flex items-center gap-2">
            <span className="text-xs text-sand-400">Status:</span>
            <select
              value={trip.status}
              onChange={(e) => handleStatusChange(e.target.value as TripStatus)}
              className="text-xs font-semibold uppercase tracking-wider bg-canvas/10 text-canvas border border-sand-400/40 rounded-md px-3 py-1.5 focus:outline-none"
            >
              <option value="planning" className="text-ink">Planning</option>
              <option value="upcoming" className="text-ink">Upcoming</option>
              <option value="in_progress" className="text-ink">In Progress</option>
              <option value="completed" className="text-ink">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspace Navigation Tabs (no-print) */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 border-b border-sand-300 pb-2">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'itinerary'
                ? 'bg-ink text-canvas shadow-fine'
                : 'text-ink-secondary hover:text-ink hover:bg-sand-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Day-by-Day Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('packing')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'packing'
                ? 'bg-ink text-canvas shadow-fine'
                : 'text-ink-secondary hover:text-ink hover:bg-sand-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Packing List ({trip.packingList?.filter((p) => p.done).length || 0}/{trip.packingList?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-ink text-canvas shadow-fine'
                : 'text-ink-secondary hover:text-ink hover:bg-sand-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Travel Notes</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: ITINERARY */}
      {activeTab === 'itinerary' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* Day selection tabs (no-print) */}
          <div className="no-print flex items-center justify-between gap-4 pb-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              {trip.days.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeDayIndex === idx
                      ? 'bg-canvas-card text-ink shadow-fine border border-sand-300 font-bold'
                      : 'bg-sand-100 text-ink-secondary hover:text-ink hover:bg-sand-200'
                  }`}
                >
                  <span>Day {day.dayNumber}</span>
                  <span className="text-[10px] text-ink-faint">
                    ({day.activities.length})
                  </span>
                </button>
              ))}

              <button
                onClick={handleAddDay}
                className="px-3 py-2 text-xs font-semibold rounded-md border border-dashed border-sand-400 text-ink-muted hover:text-ink hover:bg-sand-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Add a new day to the trip"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            {activeDay && trip.days.length > 1 && (
              <button
                onClick={() => handleDeleteDay(activeDay.id, activeDay.dayNumber)}
                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 p-2 rounded-md hover:bg-red-50 transition-colors whitespace-nowrap"
                title={`Delete Day ${activeDay.dayNumber}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Day {activeDay.dayNumber}</span>
              </button>
            )}
          </div>

          {/* Active Day Detail Card */}
          {activeDay && (
            <div className="p-6 sm:p-8 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-6">
              {/* Day Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-terracotta-600">
                    Day {activeDay.dayNumber} Itinerary
                  </div>

                  {isEditingDayTitle ? (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={editedDayTitle}
                        onChange={(e) => setEditedDayTitle(e.target.value)}
                        className="px-3 py-1 text-base font-serif font-bold text-ink border border-sand-300 rounded-md bg-canvas focus:outline-none"
                        autoFocus
                      />
                      <Button size="sm" variant="primary" onClick={handleSaveDayTitle}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingDayTitle(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                        {activeDay.title}
                      </h2>
                      <button
                        onClick={() => {
                          setEditedDayTitle(activeDay.title);
                          setIsEditingDayTitle(true);
                        }}
                        className="no-print p-1 text-ink-muted hover:text-ink transition-colors"
                        title="Edit day title"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {activeDay.summary && (
                    <p className="text-xs text-ink-secondary">
                      {activeDay.summary}
                    </p>
                  )}
                </div>

                <div className="no-print flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenAddActivity}
                    className="gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity</span>
                  </Button>
                </div>
              </div>

              {/* Day Activities List */}
              {activeDay.activities.length > 0 ? (
                <div className="space-y-4">
                  {activeDay.activities.map((activity, idx) => (
                    <div
                      key={activity.id}
                      className={`flex flex-col sm:flex-row items-start justify-between gap-4 p-5 rounded-lg border transition-all ${
                        activity.completed
                          ? 'bg-sand-50/70 border-sand-200 opacity-75'
                          : 'bg-canvas border-sand-300 hover:border-sand-400'
                      }`}
                    >
                      {/* Checkbox & Details */}
                      <div className="flex items-start gap-3.5 flex-1">
                        <button
                          onClick={() => handleToggleActivityCompletion(activity)}
                          className="no-print mt-0.5 text-ink-muted hover:text-ink transition-colors focus:outline-none"
                          aria-label={
                            activity.completed
                              ? 'Mark as incomplete'
                              : 'Mark as complete'
                          }
                        >
                          {activity.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-olive-600 fill-olive-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-sand-400" />
                          )}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {activity.time && (
                              <span className="text-xs font-mono font-medium text-ink-faint flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {activity.time}
                              </span>
                            )}
                            <Badge category={activity.category}>
                              {activity.category}
                            </Badge>
                          </div>

                          <h4
                            className={`font-serif text-lg font-bold text-ink ${
                              activity.completed ? 'line-through text-ink-muted' : ''
                            }`}
                          >
                            {activity.title}
                          </h4>

                          {activity.description && (
                            <p className="text-xs text-ink-secondary leading-relaxed">
                              {activity.description}
                            </p>
                          )}

                          {activity.location && (
                            <div className="flex items-center gap-1.5 text-[11px] text-ink-muted pt-1">
                              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reorder and Edit Actions (no-print) */}
                      <div className="no-print flex items-center gap-1 self-end sm:self-center">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveActivity(idx, 'up')}
                          className="p-1.5 rounded-sm hover:bg-sand-200 text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move activity up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={idx === activeDay.activities.length - 1}
                          onClick={() => handleMoveActivity(idx, 'down')}
                          className="p-1.5 rounded-sm hover:bg-sand-200 text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move activity down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditActivity(activity)}
                          className="p-1.5 rounded-sm hover:bg-sand-200 text-ink-muted hover:text-ink transition-colors ml-1"
                          title="Edit activity"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteActivity(activity.id, activity.title)
                          }
                          className="p-1.5 rounded-sm hover:bg-red-50 text-ink-muted hover:text-red-700 transition-colors"
                          title="Remove activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center rounded-lg border border-dashed border-sand-300 p-6 space-y-3">
                  <Clock className="w-6 h-6 text-ink-muted mx-auto" />
                  <h4 className="font-serif text-lg font-semibold text-ink">
                    No activities scheduled for Day {activeDay.dayNumber}
                  </h4>
                  <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                    Add temples, dining spots, walking paths, or boutique lodgings to
                    structure your day.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenAddActivity}
                    className="gap-1.5 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Activity</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PACKING LIST */}
      {activeTab === 'packing' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink">
                  Packing & Gear Checklist
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Keep track of essential travel documents, gear, and destination-specific items.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-olive-700 bg-olive-50 px-2.5 py-1 rounded-sm border border-olive-200">
                {trip.packingList?.filter((i) => i.done).length || 0} of{' '}
                {trip.packingList?.length || 0} packed
              </span>
            </div>

            {/* Add Item Form */}
            <form onSubmit={handleAddPackingItem} className="flex gap-2">
              <input
                type="text"
                value={newPackingText}
                onChange={(e) => setNewPackingText(e.target.value)}
                placeholder="Add packing item (e.g. Rain shell, Travel adapter)..."
                className="flex-1 px-3 py-2 text-sm bg-canvas rounded-md border border-sand-300 text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
              />
              <Button type="submit" variant="primary" size="sm" className="gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </form>

            {/* Checklist */}
            <ul className="space-y-2.5 pt-2">
              {trip.packingList && trip.packingList.length > 0 ? (
                trip.packingList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-md bg-canvas border border-sand-200 text-xs"
                  >
                    <button
                      onClick={() => handleTogglePackingItem(item.id)}
                      className="flex items-center gap-2.5 text-left flex-1"
                    >
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-olive-600 fill-olive-100 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-sand-400 flex-shrink-0" />
                      )}
                      <span
                        className={
                          item.done
                            ? 'line-through text-ink-muted'
                            : 'font-medium text-ink'
                        }
                      >
                        {item.text}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeletePackingItem(item.id)}
                      className="text-ink-muted hover:text-red-700 p-1 transition-colors"
                      aria-label="Delete packing item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-center py-6 text-xs text-ink-muted">
                  No packing items added yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* TAB CONTENT: GENERAL NOTES */}
      {activeTab === 'notes' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-canvas-card border border-sand-300 shadow-fine space-y-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                General Travel Notes & Logistics
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Record flight reservation numbers, rail pass details, local emergency contacts, or packing reminders.
              </p>
            </div>

            <textarea
              rows={10}
              defaultValue={trip.generalNotes || ''}
              onBlur={(e) => handleUpdateGeneralNotes(e.target.value)}
              placeholder="Record lodging reservation numbers, train codes, restaurant bookings, or cultural notes here..."
              className="w-full p-4 text-sm bg-canvas rounded-lg border border-sand-300 text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink leading-relaxed"
            />
            <p className="text-[11px] text-ink-muted">
              Notes automatically save to your local travel workspace on blur.
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        initialData={editingActivity}
        dayNumber={activeDay?.dayNumber || 1}
      />
    </div>
  );
}
