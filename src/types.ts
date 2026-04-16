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
}
