import { useMemo } from 'react';
import type { PlanEntry } from '../../types';
import { PlanCard } from './PlanCard';
import { formatDateJa, formatDuration } from '../../utils/time';

interface Props {
  plans: PlanEntry[];
  onEdit: (plan: PlanEntry) => void;
  onDelete: (id: string) => void;
}

export function PlanList({ plans, onEdit, onDelete }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, PlanEntry[]>();
    for (const plan of plans) {
      const list = map.get(plan.date) ?? [];
      list.push(plan);
      map.set(plan.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [plans]);

  if (grouped.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        {plans.length === 0 ? '作業計画がまだ登録されていません' : '条件に一致する作業計画がありません'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([date, dayPlans]) => {
        const totalMinutes = dayPlans.reduce((sum, p) => sum + p.estimatedMinutes, 0);
        return (
          <div key={date} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-gray-500">{formatDateJa(date)}</h3>
              <span className="text-xs text-gray-400">合計 {formatDuration(totalMinutes)}</span>
            </div>
            {dayPlans.map((plan) => (
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
