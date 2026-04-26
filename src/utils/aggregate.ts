import type { TaskEntry, MonthlyAggregate } from '../types';
import { getYearMonth, minutesToHours } from './time';

export function aggregateByMonth(entries: TaskEntry[], yearMonth: string): MonthlyAggregate {
  const filtered = entries.filter((e) => getYearMonth(e.date) === yearMonth);

  const byCategory: Record<string, number> = {};
  const byDay: Record<number, number> = {};
  let totalMinutes = 0;
  const workingDaySet = new Set<string>();

  for (const entry of filtered) {
    byCategory[entry.category] = (byCategory[entry.category] ?? 0) + entry.durationMinutes;
    const day = Number(entry.date.split('-')[2]);
    byDay[day] = (byDay[day] ?? 0) + entry.durationMinutes;
    totalMinutes += entry.durationMinutes;
    workingDaySet.add(entry.date);
  }

  return {
    yearMonth,
    byCategory,
    byDay,
    totalMinutes,
    workingDays: workingDaySet.size,
  };
}

/** カテゴリ別集計を棒グラフ用データに変換 */
export function toCategoryChartData(byCategory: Record<string, number>) {
  return Object.entries(byCategory)
    .map(([category, minutes]) => ({ category, hours: minutesToHours(minutes), minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}

/** 日別集計をエリアグラフ用データに変換 */
export function toDailyChartData(yearMonth: string, byDay: Record<number, number>) {
  const [year, month] = yearMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return { day, hours: minutesToHours(byDay[day] ?? 0) };
  });
}

/** 利用可能な月一覧（エントリから抽出、降順） */
export function getAvailableMonths(entries: TaskEntry[]): string[] {
  const monthSet = new Set(entries.map((e) => getYearMonth(e.date)));
  return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
}
