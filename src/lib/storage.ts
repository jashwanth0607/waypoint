'use client';

import { Activity, ItineraryDay, Trip } from './types';
import { SAMPLE_TRIPS } from './data';

const TRIPS_KEY = 'wayfarer_trips_v1';
const SAVED_DESTINATIONS_KEY = 'wayfarer_saved_destinations_v1';
const STORAGE_EVENT = 'wayfarer-storage-update';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function notifyUpdate() {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
  }
}

export function getTrips(): Trip[] {
  if (!isBrowser()) return SAMPLE_TRIPS;

  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(SAMPLE_TRIPS));
      return SAMPLE_TRIPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_TRIPS;
  } catch {
    return SAMPLE_TRIPS;
  }
}

export function getTripById(id: string): Trip | null {
  const trips = getTrips();
  return trips.find((t) => t.id === id) || null;
}

export function saveTrip(trip: Trip): void {
  if (!isBrowser()) return;

  try {
    const trips = getTrips();
    const index = trips.findIndex((t) => t.id === trip.id);
    const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };

    let nextTrips: Trip[];
    if (index >= 0) {
      nextTrips = [...trips];
      nextTrips[index] = updatedTrip;
    } else {
      nextTrips = [updatedTrip, ...trips];
    }

    localStorage.setItem(TRIPS_KEY, JSON.stringify(nextTrips));
    notifyUpdate();
  } catch (err) {
    console.error('Failed to save trip to localStorage:', err);
  }
}

export function createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Trip {
  const newTrip: Trip = {
    ...tripData,
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveTrip(newTrip);
  return newTrip;
}

export function deleteTrip(id: string): void {
  if (!isBrowser()) return;

  try {
    const trips = getTrips();
    const filtered = trips.filter((t) => t.id !== id);
    localStorage.setItem(TRIPS_KEY, JSON.stringify(filtered));
    notifyUpdate();
  } catch (err) {
    console.error('Failed to delete trip:', err);
  }
}

export function addActivityToDay(
  tripId: string,
  dayId: string,
  activityData: Omit<Activity, 'id'>
): Activity | null {
  const trip = getTripById(tripId);
  if (!trip) return null;

  const dayIndex = trip.days.findIndex((d) => d.id === dayId);
  if (dayIndex === -1) return null;

  const newActivity: Activity = {
    ...activityData,
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };

  const updatedDays = [...trip.days];
  updatedDays[dayIndex] = {
    ...updatedDays[dayIndex],
    activities: [...updatedDays[dayIndex].activities, newActivity],
  };

  saveTrip({ ...trip, days: updatedDays });
  return newActivity;
}

export function updateActivityInDay(
  tripId: string,
  dayId: string,
  activity: Activity
): boolean {
  const trip = getTripById(tripId);
  if (!trip) return false;

  const dayIndex = trip.days.findIndex((d) => d.id === dayId);
  if (dayIndex === -1) return false;

  const day = trip.days[dayIndex];
  const actIndex = day.activities.findIndex((a) => a.id === activity.id);
  if (actIndex === -1) return false;

  const updatedActivities = [...day.activities];
  updatedActivities[actIndex] = activity;

  const updatedDays = [...trip.days];
  updatedDays[dayIndex] = { ...day, activities: updatedActivities };

  saveTrip({ ...trip, days: updatedDays });
  return true;
}

export function deleteActivityFromDay(
  tripId: string,
  dayId: string,
  activityId: string
): boolean {
  const trip = getTripById(tripId);
  if (!trip) return false;

  const dayIndex = trip.days.findIndex((d) => d.id === dayId);
  if (dayIndex === -1) return false;

  const day = trip.days[dayIndex];
  const updatedActivities = day.activities.filter((a) => a.id !== activityId);

  const updatedDays = [...trip.days];
  updatedDays[dayIndex] = { ...day, activities: updatedActivities };

  saveTrip({ ...trip, days: updatedDays });
  return true;
}

export function reorderActivitiesInDay(
  tripId: string,
  dayId: string,
  sourceIndex: number,
  targetIndex: number
): boolean {
  const trip = getTripById(tripId);
  if (!trip) return false;

  const dayIndex = trip.days.findIndex((d) => d.id === dayId);
  if (dayIndex === -1) return false;

  const day = trip.days[dayIndex];
  if (
    sourceIndex < 0 ||
    sourceIndex >= day.activities.length ||
    targetIndex < 0 ||
    targetIndex >= day.activities.length
  ) {
    return false;
  }

  const updatedActivities = [...day.activities];
  const [movedItem] = updatedActivities.splice(sourceIndex, 1);
  updatedActivities.splice(targetIndex, 0, movedItem);

  const updatedDays = [...trip.days];
  updatedDays[dayIndex] = { ...day, activities: updatedActivities };

  saveTrip({ ...trip, days: updatedDays });
  return true;
}

export function addDayToTrip(
  tripId: string,
  dayData: Partial<ItineraryDay>
): ItineraryDay | null {
  const trip = getTripById(tripId);
  if (!trip) return null;

  const nextDayNumber = trip.days.length + 1;
  const newDay: ItineraryDay = {
    id: `day-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    dayNumber: nextDayNumber,
    title: dayData.title || `Day ${nextDayNumber}`,
    summary: dayData.summary || '',
    activities: dayData.activities || [],
    date: dayData.date,
    notes: dayData.notes || '',
  };

  const updatedDays = [...trip.days, newDay];
  saveTrip({ ...trip, days: updatedDays });
  return newDay;
}

export function updateDayInTrip(
  tripId: string,
  updatedDay: ItineraryDay
): boolean {
  const trip = getTripById(tripId);
  if (!trip) return false;

  const dayIndex = trip.days.findIndex((d) => d.id === updatedDay.id);
  if (dayIndex === -1) return false;

  const updatedDays = [...trip.days];
  updatedDays[dayIndex] = updatedDay;

  saveTrip({ ...trip, days: updatedDays });
  return true;
}

export function deleteDayFromTrip(tripId: string, dayId: string): boolean {
  const trip = getTripById(tripId);
  if (!trip || trip.days.length <= 1) return false;

  const filteredDays = trip.days
    .filter((d) => d.id !== dayId)
    .map((day, idx) => ({ ...day, dayNumber: idx + 1 }));

  saveTrip({ ...trip, days: filteredDays });
  return true;
}

export function getSavedDestinations(): string[] {
  if (!isBrowser()) return ['kyoto', 'amalfi-coast'];

  try {
    const raw = localStorage.getItem(SAVED_DESTINATIONS_KEY);
    if (!raw) {
      const initial = ['kyoto', 'amalfi-coast'];
      localStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return ['kyoto', 'amalfi-coast'];
  }
}

export function isDestinationSaved(slug: string): boolean {
  const saved = getSavedDestinations();
  return saved.includes(slug);
}

export function toggleSavedDestination(slug: string): boolean {
  if (!isBrowser()) return false;

  try {
    const saved = getSavedDestinations();
    let nextSaved: string[];
    let isNowSaved: boolean;

    if (saved.includes(slug)) {
      nextSaved = saved.filter((s) => s !== slug);
      isNowSaved = false;
    } else {
      nextSaved = [...saved, slug];
      isNowSaved = true;
    }

    localStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(nextSaved));
    notifyUpdate();
    return isNowSaved;
  } catch (err) {
    console.error('Failed to toggle saved destination:', err);
    return false;
  }
}

export function exportDataAsJson(): string {
  const data = {
    trips: getTrips(),
    savedDestinations: getSavedDestinations(),
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJson(jsonString: string): boolean {
  if (!isBrowser()) return false;

  try {
    const data = JSON.parse(jsonString);
    if (data.trips && Array.isArray(data.trips)) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(data.trips));
    }
    if (data.savedDestinations && Array.isArray(data.savedDestinations)) {
      localStorage.setItem(
        SAVED_DESTINATIONS_KEY,
        JSON.stringify(data.savedDestinations)
      );
    }
    notifyUpdate();
    return true;
  } catch {
    return false;
  }
}

export function subscribeToStorage(callback: () => void): () => void {
  if (!isBrowser()) return () => {};

  window.addEventListener(STORAGE_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(STORAGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
