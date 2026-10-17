export type ActivityCategory =
  | 'stay'
  | 'food'
  | 'culture'
  | 'nature'
  | 'logistics'
  | 'walk';

export interface Activity {
  id: string;
  time?: string;
  title: string;
  description?: string;
  location?: string;
  category: ActivityCategory;
  completed?: boolean;
  notes?: string;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date?: string;
  title: string;
  summary?: string;
  activities: Activity[];
  notes?: string;
}

export interface PackingItem {
  id: string;
  text: string;
  done: boolean;
}

export type TripStatus = 'planning' | 'upcoming' | 'in_progress' | 'completed';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  destinationSlug?: string;
  country: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  description?: string;
  days: ItineraryDay[];
  generalNotes?: string;
  packingList?: PackingItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DestinationHighlight {
  title: string;
  category: ActivityCategory;
  description: string;
  location: string;
}

export interface DestinationNeighborhood {
  name: string;
  vibe: string;
  topPick: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  tagline: string;
  heroImage: string;
  galleryImages: string[];
  description: string;
  curatedSummary: string;
  idealDuration: string;
  bestSeason: string;
  highlights: DestinationHighlight[];
  neighborhoods: DestinationNeighborhood[];
  practicalTips: string[];
  isFeatured?: boolean;
}

export type ExperienceCategory =
  | 'food'
  | 'culture'
  | 'nature'
  | 'stay'
  | 'hidden-gem';

export interface Experience {
  id: string;
  title: string;
  destination: string;
  country: string;
  category: ExperienceCategory;
  image: string;
  description: string;
  locationName: string;
}
