import { useMemo, useState } from 'react';
import type { TaskEntry, PlanEntry } from '../../types';
import { PlanForm } from '../plan/PlanForm';
import { PlanList } from '../plan/PlanList';
import { EntryForm } from '../form/EntryForm';
import { EntryList } from '../list/EntryList';
import type { NewEntryInput, NewPlanInput } from '../../hooks/useEntries';

interface Props {
  entries: TaskEntry[];
  plans: PlanEntry[];
  categories: string[];
  onAddCategory: (cat: string) => void;
  onAddEntry: (input: NewEntryInput) => void;
  onUpdateEntry: (id: string, input: NewEntryInput) => void;
  onDeleteEntry: (id: string) => void;
  onAddPlan: (input: NewPlanInput) => void;
  onUpdatePlan: (id: string, input: NewPlanInput) => void;
  onDeletePlan: (id: string) => void;
}

export function DailyView({
  entries, plans, categories, onAddCategory,
  onAddEntry, onUpdateEntry, onDeleteEntry,
  onAddPlan, onUpdatePlan, onDeletePlan,
}: Props) {
  const [filterDate, setFilterDate] = useState('');
  const [editEntry, setEditEntry] = useState<TaskEntry | null>(null);
  const [editPlan, setEditPlan] = useState<PlanEntry | null>(null);

  const filteredEntries = useMemo(
    () => filterDate ? entries.filter((e) => e.date === filterDate) : entries,
    [entries, filterDate]
  );

  const filteredPlans = useMemo(
    () => filterDate ? plans.filter((p) => p.date === filterDate) : plans,
    [plans, filterDate]
  );

  const handleEntrySubmit = (input: NewEntryInput) => {
    if (editEntry) {
      onUpdateEntry(editEntry.id, input);
      setEditEntry(null);
    } else {
      onAddEntry(input);
    }
  };

  const handlePlanSubmit = (input: NewPlanInput) => {
    if (editPlan) {
      onUpdatePlan(editPlan.id, input);
      setEditPlan(null);
    } else {
      onAddPlan(input);
    }
  };

  const handleEditEntry = (entry: TaskEntry) => {
    setEditEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPlan = (plan: PlanEntry) => {
    setEditPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {/* 共有日付フィルター */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 shrink-0">日付で絞り込み</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      {/* 2カラム */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* 左列: 作業計画 */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-700 px-1">作業計画</h2>
          <PlanForm
            categories={categories}
            onAddCategory={onAddCategory}
            onSubmit={handlePlanSubmit}
            editTarget={editPlan}
            onCancelEdit={() => setEditPlan(null)}
          />
          <PlanList
            plans={filteredPlans}
            onEdit={handleEditPlan}
            onDelete={onDeletePlan}
          />
        </div>

        {/* 右列: 作業実績 */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-700 px-1">作業実績</h2>
          <EntryForm
            categories={categories}
            onAddCategory={onAddCategory}
            onSubmit={handleEntrySubmit}
            editTarget={editEntry}
            onCancelEdit={() => setEditEntry(null)}
          />
          <EntryList
            entries={filteredEntries}
            onEdit={handleEditEntry}
            onDelete={onDeleteEntry}
          />
        </div>
      </div>
    </div>
  );
}
