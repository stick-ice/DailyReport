import { useMemo, useState } from 'react';
import type { TaskEntry } from '../../types';
import { EntryCard } from './EntryCard';
import { EntryFilter } from './EntryFilter';
import { formatDateJa } from '../../utils/time';
import { exportToCsv } from '../../utils/export';

interface Props {
  entries: TaskEntry[];
  categories: string[];
  onEdit: (entry: TaskEntry) => void;
  onDelete: (id: string) => void;
}

export function EntryList({ entries, categories, onEdit, onDelete }: Props) {
  const [filterCategory, setFilterCategory] = useState('');

  const filtered = useMemo(() => {
    if (!filterCategory) return entries;
    return entries.filter((e) => e.category === filterCategory);
  }, [entries, filterCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, TaskEntry[]>();
    for (const entry of filtered) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const handleExport = () => {
    const target = filterCategory ? filtered : entries;
    exportToCsv(target, `業務日報.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-end justify-between gap-3 flex-wrap">
        <EntryFilter
          filterCategory={filterCategory}
          categories={categories}
          onCategoryChange={setFilterCategory}
        />
        <button
          onClick={handleExport}
          disabled={entries.length === 0}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          CSVエクスポート{filterCategory ? ' (絞り込み中)' : ''}
        </button>
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
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
