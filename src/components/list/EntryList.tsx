import { useMemo, useState } from 'react';
import type { TaskEntry } from '../../types';
import { EntryCard } from './EntryCard';
import { formatDateJa } from '../../utils/time';
import { exportToCsv } from '../../utils/export';

type SortKey = 'time' | 'category';
type SortDir = 'asc' | 'desc';

interface Props {
  entries: TaskEntry[];
  onEdit: (entry: TaskEntry) => void;
  onDelete: (id: string) => void;
}

function sortEntries(entries: TaskEntry[], key: SortKey, dir: SortDir): TaskEntry[] {
  return [...entries].sort((a, b) => {
    const cmp = key === 'time'
      ? a.startTime.localeCompare(b.startTime)
      : a.category.localeCompare(b.category, 'ja');
    return dir === 'asc' ? cmp : -cmp;
  });
}

export function EntryList({ entries, onEdit, onDelete }: Props) {
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

  const grouped = useMemo((): [string, TaskEntry[]][] => {
    const map = new Map<string, TaskEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, dayEntries]): [string, TaskEntry[]] => [date, sortEntries(dayEntries, sortKey, sortDir)]);
  }, [entries, sortKey, sortDir]);

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '';

  if (grouped.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        日報がまだ登録されていません
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
      {grouped.map(([date, dayEntries]: [string, TaskEntry[]]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 px-1">
            {formatDateJa(date)}
          </h3>
          {dayEntries.map((entry: TaskEntry) => (
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
