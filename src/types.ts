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
