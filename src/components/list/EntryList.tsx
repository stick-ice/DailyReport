import { useMemo } from 'react';
import type { TaskEntry } from '../../types';
import { EntryCard } from './EntryCard';
import { formatDateJa } from '../../utils/time';
import { exportToCsv } from '../../utils/export';

interface Props {
  entries: TaskEntry[];
  onEdit: (entry: TaskEntry) => void;
  onDelete: (id: string) => void;
}

export function EntryList({ entries, onEdit, onDelete }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, TaskEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [entries]);

  if (grouped.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        日報がまだ登録されていません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([date, dayEntries]) => (
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
      ))}
      <button
        onClick={() => exportToCsv(entries, '業務日報.csv')}
        disabled={entries.length === 0}
        className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        CSVエクスポート
      </button>
    </div>
  );
}
