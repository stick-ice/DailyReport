import { useMemo, useState } from 'react';
import type { PlanEntry } from '../../types';
import { PlanCard } from './PlanCard';
import { formatDateJa, formatDuration } from '../../utils/time';

type SortKey = 'time' | 'category';
type SortDir = 'asc' | 'desc';

interface Props {
  plans: PlanEntry[];
  onEdit: (plan: PlanEntry) => void;
  onDelete: (id: string) => void;
}

function sortPlans(plans: PlanEntry[], key: SortKey, dir: SortDir): PlanEntry[] {
  return [...plans].sort((a, b) => {
    const cmp = key === 'time'
      ? a.startTime.localeCompare(b.startTime)
      : a.category.localeCompare(b.category, 'ja');
    return dir === 'asc' ? cmp : -cmp;
  });
}

export function PlanList({ plans, onEdit, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('time');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d: SortDir) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const grouped = useMemo((): [string, PlanEntry[]][] => {
    const map = new Map<string, PlanEntry[]>();
    for (const plan of plans) {
      const list = map.get(plan.date) ?? [];
      list.push(plan);
      map.set(plan.date, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, dayPlans]): [string, PlanEntry[]] => [date, sortPlans(dayPlans, sortKey, sortDir)]);
  }, [plans, sortKey, sortDir]);

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  if (grouped.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        {plans.length === 0 ? '作業計画がまだ登録されていません' : '条件に一致する作業計画がありません'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs text-gray-500">並び替え:</span>
        <button
          onClick={() => handleSort('time')}
          className={`text-xs px-2 py-1 rounded border transition-colors ${sortKey === 'time' ? 'bg-blue-100 border-blue-300 text-blue-700 font-semibold' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
        >
          時間{arrow('time')}
        </button>
        <button
          onClick={() => handleSort('category')}
          className={`text-xs px-2 py-1 rounded border transition-colors ${sortKey === 'category' ? 'bg-blue-100 border-blue-300 text-blue-700 font-semibold' : 'border-gray-300 text-gray-500 hover:bg-gray-100'}`}
        >
          カテゴリ{arrow('category')}
        </button>
      </div>
      {grouped.map(([date, dayPlans]: [string, PlanEntry[]]) => {
        const totalMinutes = dayPlans.reduce((sum: number, p: PlanEntry) => sum + p.estimatedMinutes, 0);
        return (
          <div key={date} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-gray-500">{formatDateJa(date)}</h3>
              <span className="text-xs text-gray-400">合計 {formatDuration(totalMinutes)}</span>
            </div>
            {dayPlans.map((plan: PlanEntry) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
