import { useState } from 'react';
import type { TaskEntry } from '../../types';
import { useAggregates } from '../../hooks/useAggregates';
import { CategoryBarChart } from './CategoryBarChart';
import { CategoryPieChart } from './CategoryPieChart';
import { DailyAreaChart } from './DailyAreaChart';
import { formatDuration, formatYearMonthJa, currentYearMonth } from '../../utils/time';
import { getAvailableMonths } from '../../utils/aggregate';

interface Props {
  entries: TaskEntry[];
}

function prevMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  if (m === 1) return `${y - 1}-12`;
  return `${y}-${String(m - 1).padStart(2, '0')}`;
}

function nextMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  if (m === 12) return `${y + 1}-01`;
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

export function AnalyticsView({ entries }: Props) {
  const [yearMonth, setYearMonth] = useState(currentYearMonth);
  const { aggregate, categoryChartData, dailyChartData } = useAggregates(entries, yearMonth);
  const availableMonths = getAvailableMonths(entries);

  const topCategory = categoryChartData.length > 0 ? categoryChartData[0].category : '—';

  return (
    <div className="space-y-4">
      {/* 月選択 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setYearMonth(prevMonth(yearMonth))}
            className="rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg"
          >
            ‹
          </button>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-gray-800">
              {formatYearMonthJa(yearMonth)}
            </span>
            <select
              value={yearMonth}
              onChange={(e) => setYearMonth(e.target.value)}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {availableMonths.length === 0 ? (
                <option value={yearMonth}>{yearMonth}</option>
              ) : (
                availableMonths.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))
              )}
            </select>
          </div>
          <button
            onClick={() => setYearMonth(nextMonth(yearMonth))}
            className="rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg"
          >
            ›
          </button>
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '総作業時間', value: formatDuration(aggregate.totalMinutes) },
          { label: '最多カテゴリ', value: topCategory },
          { label: '稼働日数', value: `${aggregate.workingDays}日` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-base font-bold text-gray-800 truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* カテゴリ別時間（棒グラフ） */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">カテゴリ別作業時間</h3>
        <CategoryBarChart data={categoryChartData} />
      </div>

      {/* カテゴリ構成比（円グラフ） */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">カテゴリ構成比</h3>
        <CategoryPieChart data={categoryChartData} />
      </div>

      {/* 日別作業時間（エリアグラフ） */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">日別作業時間</h3>
        <DailyAreaChart data={dailyChartData} />
      </div>
    </div>
  );
}
