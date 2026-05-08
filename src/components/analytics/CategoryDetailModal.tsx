import type { TaskEntry } from '../../types';
import { formatDuration, formatDateJa } from '../../utils/time';

interface Props {
  category: string;
  entries: TaskEntry[];
  totalMinutes: number;
  onClose: () => void;
}

export function CategoryDetailModal({ category, entries, totalMinutes, onClose }: Props) {
  const sorted = [...entries].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">{category}</h2>
            <p className="text-sm text-blue-600 font-medium mt-0.5">{formatDuration(totalMinutes)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors text-xl leading-none"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* エントリ一覧 */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {sorted.length === 0 ? (
            <p className="text-center text-gray-400 py-8">データがありません</p>
          ) : (
            sorted.map((entry) => (
              <div
                key={entry.id}
                className="bg-gray-50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">{formatDateJa(entry.date)}</span>
                  <span className="text-xs font-medium text-blue-600 shrink-0">
                    {formatDuration(entry.durationMinutes)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {entry.startTime} – {entry.endTime}
                  </span>
                  {entry.description && (
                    <span className="text-sm text-gray-700 truncate">{entry.description}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* フッター：件数 */}
        <div className="px-5 py-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">{sorted.length}件の実績</p>
        </div>
      </div>
    </div>
  );
}
