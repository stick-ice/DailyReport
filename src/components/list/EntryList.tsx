import { useMemo, useState } from 'react';
import type { TaskEntry } from '../../types';
import { EntryCard } from './EntryCard';
import { EntryFilter } from './EntryFilter';
import { EntryForm } from '../form/EntryForm';
import { formatDateJa, getYearMonth } from '../../utils/time';
import { getAvailableMonths } from '../../utils/aggregate';
import type { NewEntryInput } from '../../hooks/useEntries';

interface Props {
  entries: TaskEntry[];
  customCategories: string[];
  onAddCategory: (cat: string) => void;
  onUpdate: (id: string, input: NewEntryInput) => void;
  onDelete: (id: string) => void;
}

export function EntryList({ entries, customCategories, onAddCategory, onUpdate, onDelete }: Props) {
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editTarget, setEditTarget] = useState<TaskEntry | null>(null);

  const availableMonths = useMemo(() => getAvailableMonths(entries), [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterMonth && getYearMonth(e.date) !== filterMonth) return false;
      if (filterCategory && e.category !== filterCategory) return false;
      return true;
    });
  }, [entries, filterMonth, filterCategory]);

  // 日付ごとにグループ化（降順）
  const grouped = useMemo(() => {
    const map = new Map<string, TaskEntry[]>();
    for (const entry of filtered) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    // 日付降順にソート
    const sorted = Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
    return sorted;
  }, [filtered]);

  const handleEdit = (entry: TaskEntry) => {
    setEditTarget(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = (input: NewEntryInput) => {
    if (!editTarget) return;
    onUpdate(editTarget.id, input);
    setEditTarget(null);
  };

  if (editTarget) {
    return (
      <div className="space-y-4">
        <EntryForm
          customCategories={customCategories}
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
        <EntryFilter
          filterMonth={filterMonth}
          filterCategory={filterCategory}
          customCategories={customCategories}
          availableMonths={availableMonths}
          onMonthChange={setFilterMonth}
          onCategoryChange={setFilterCategory}
        />
      </div>

      {grouped.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          {entries.length === 0 ? '日報がまだ登録されていません' : '条件に一致する日報がありません'}
        </div>
      ) : (
        grouped.map(([date, dayEntries]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 px-1">
              {formatDateJa(date)}
            </h3>
            {dayEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
