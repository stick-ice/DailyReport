export interface TaskEntry {
  id: string;
  date: string;            // "YYYY-MM-DD"
  startTime: string;       // "HH:MM" 24h
  endTime: string;         // "HH:MM" 24h
  durationMinutes: number; // computed at save time
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanEntry {
  id: string;
  date: string;               // "YYYY-MM-DD"
  startTime: string;          // "HH:MM" 24h
  endTime: string;            // "HH:MM" 24h
  estimatedMinutes: number;   // computed from startTime/endTime
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  entries: TaskEntry[];
  plans: PlanEntry[];
  categories: string[];
}

export interface MonthlyAggregate {
  yearMonth: string; // "YYYY-MM"
  byCategory: Record<string, number>; // category -> total minutes
  byDay: Record<number, number>;      // day (1-31) -> total minutes
  totalMinutes: number;
  workingDays: number;
}
