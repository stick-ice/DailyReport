import { useState } from 'react';
import type { PlanEntry } from '../../types';
import { formatDuration } from '../../utils/time';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function renderDescription(text: string) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    URL_REGEX.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

interface Props {
  plan: PlanEntry;
  onEdit: (plan: PlanEntry) => void;
  onDelete: (id: string) => void;
}

export function PlanCard({ plan, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-sm font-medium text-gray-700">
              {plan.startTime} - {plan.endTime}
            </span>
            <span className="text-xs text-gray-400">({formatDuration(plan.estimatedMinutes)})</span>
            <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              {plan.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{renderDescription(plan.description)}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          {!confirmDelete ? (
            <>
              <button
                onClick={() => onEdit(plan)}
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
                onClick={() => onDelete(plan.id)}
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
