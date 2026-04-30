import { useState } from 'react';
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
  const [editEntry, setEditEntry] = useState<TaskEntry | null>(null);
  const [editPlan, setEditPlan] = useState<PlanEntry | null>(null);

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
          plans={plans}
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
          entries={entries}
          categories={categories}
          onEdit={handleEditEntry}
          onDelete={onDeleteEntry}
        />
      </div>
    </div>
  );
}
