import type { TaskEntry } from '../types';
import { formatDuration } from './time';

const HEADERS = ['日付', '開始時刻', '終了時刻', '所要時間', 'カテゴリ', '業務概要'];

function escapeCsv(value: string): string {
  // ダブルクォート・カンマ・改行を含む場合はクォートで囲む
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCsv(entries: TaskEntry[], filename: string): void {
  const rows = [
    HEADERS.join(','),
    ...entries
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .map((e) =>
        [
          e.date,
          e.startTime,
          e.endTime,
          formatDuration(e.durationMinutes),
          escapeCsv(e.category),
          escapeCsv(e.description),
        ].join(',')
      ),
  ];

  // BOM付きUTF-8 → Excelで文字化けしない
  const bom = '\uFEFF';
  const blob = new Blob([bom + rows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
