import { useMemo, useState } from 'react';
import type { PlanEntry } from '../../types';
import { PlanCard } from './PlanCard';
import { PlanForm } from './PlanForm';
import { formatDateJa, getYearMonth, formatDuration } from '../../utils/time';
import { getAvailableMonths } from '../../utils/aggregate';
import type { NewPlanInput } from '../../hooks/useEntries';

interface Props {
  plans: PlanEntry[];
  categories: string[];
  onAddCategory: (cat: string) => void;
  onUpdate: (id: string, input: NewPlanInput) => void;
  onDelete: (id: string) => void;
}

export function PlanList({ plans, categories, onAddCategory, onUpdate, onDelete }: Props) {
  const [filterMonth, setFilterMonth] = useState('');
  const [editTarget, setEditTarget] = useState<PlanEntry | null>(null);

  const availableMonths = useMemo(
    () => getAvailableMonths(plans.map((p) => ({ ...p, startTime: '', endTime: '', durationMinutes: 0 }))),
    [plans]
  );

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      if (filterMonth && getYearMonth(p.date) !== filterMonth) return false;
      return true;
    });
  }, [plans, filterMonth]);

  const grouped = useMemo(() => {
    const map = new Map<string, PlanEntry[]>();
    for (const plan of filtered) {
      const list = map.get(plan.date) ?? [];
      list.push(plan);
      map.set(plan.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const handleEdit = (plan: PlanEntry) => {
    setEditTarget(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = (input: NewPlanInput) => {
    if (!editTarget) return;
    onUpdate(editTarget.id, input);
    setEditTarget(null);
  };

  if (editTarget) {
    return (
      <div className="space-y-4">
        <PlanForm
          categories={categories}
          onAddCategory={onAddCategory}
          onSubmit={handleUpdate}
          editTarget={editTarget}
          onCancelEdit={() => setEditTarget(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 shrink-0">月で絞り込み</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべて</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          {plans.length === 0 ? '作業計画がまだ登録されていません' : '条件に一致する作業計画がありません'}
        </div>
      ) : (
        grouped.map(([date, dayPlans]) => {
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
                  onEdit={handleEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
