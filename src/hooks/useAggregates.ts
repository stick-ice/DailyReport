import { useMemo } from 'react';
import type { TaskEntry, MonthlyAggregate } from '../types';
import {
  aggregateByMonth,
  toCategoryChartData,
  toDailyChartData,
} from '../utils/aggregate';

export function useAggregates(entries: TaskEntry[], yearMonth: string) {
  const aggregate: MonthlyAggregate = useMemo(
    () => aggregateByMonth(entries, yearMonth),
    [entries, yearMonth]
  );

  const categoryChartData = useMemo(
    () => toCategoryChartData(aggregate.byCategory),
    [aggregate.byCategory]
  );

  const dailyChartData = useMemo(
    () => toDailyChartData(yearMonth, aggregate.byDay),
    [yearMonth, aggregate.byDay]
  );

  return { aggregate, categoryChartData, dailyChartData };
}
