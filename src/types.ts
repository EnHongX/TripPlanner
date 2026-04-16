export interface Activity {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  budget: number;
}

export interface DayPlan {
  id: string;
  date: string;
  activities: Activity[];
}

export interface TripPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  totalBudget: number;
}

export interface PackingItem {
  id: string;
  name: string;
  category: string;
  isPacked: boolean;
}

export interface PackingCategory {
  id: string;
  name: string;
  icon: string;
}

export interface PackingList {
  id: string;
  tripId: string;
  items: PackingItem[];
  categories: PackingCategory[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  categoryId: string;
}

export interface PackingTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: TemplateCategory[];
  items: TemplateItem[];
}

export type TravelType = 'flight' | 'train' | 'bus' | 'taxi' | 'other';

export interface Transportation {
  id: string;
  type: TravelType;
  number: string;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatNumber: string;
  bookingNumber: string;
  notes: string;
}

export interface Accommodation {
  id: string;
  name: string;
  address: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  price: number;
  bookingNumber: string;
  notes: string;
}

export interface TravelInfo {
  id: string;
  tripId: string;
  accommodations: Accommodation[];
  transportations: Transportation[];
}

export type ReminderType = 'document' | 'booking' | 'packing' | 'activity' | 'other';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  type: ReminderType;
  date: string;
  time: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface ReminderList {
  id: string;
  tripId: string;
  reminders: Reminder[];
}

export interface PhotoNote {
  id: string;
  date: string;
  imageUrl: string;
  note: string;
  createdAt: string;
}

export interface DayReview {
  id: string;
  date: string;
  content: string;
  mood: string;
  weather: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewList {
  id: string;
  tripId: string;
  reviews: DayReview[];
  photoNotes: PhotoNote[];
}

export interface TripProject {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  createdAt: string;
  tripPlan: TripPlan;
  packingList: PackingList;
  travelInfo: TravelInfo;
  reminderList: ReminderList;
  reviewList: ReviewList;
}
