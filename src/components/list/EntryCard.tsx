import { useState } from 'react';
import type { TaskEntry } from '../../types';
import { formatDuration } from '../../utils/time';

interface Props {
  entry: TaskEntry;
  onEdit: (entry: TaskEntry) => void;
  onDelete: (id: string) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-sm font-medium text-gray-700">
              {entry.startTime} - {entry.endTime}
            </span>
            <span className="text-xs text-gray-400">({formatDuration(entry.durationMinutes)})</span>
            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              {entry.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{entry.description}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          {!confirmDelete ? (
            <>
              <button
                onClick={() => onEdit(entry)}
                className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
              >
                編集
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50 transition-colors"
              >
                削除
              </button>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-500 self-center">削除しますか?</span>
              <button
                onClick={() => onDelete(entry.id)}
                className="rounded px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                はい
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded px-2 py-1 text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                いいえ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
