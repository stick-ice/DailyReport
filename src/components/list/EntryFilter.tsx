interface Props {
  filterMonth: string;
  filterCategory: string;
  categories: string[];
  availableMonths: string[];
  onMonthChange: (month: string) => void;
  onCategoryChange: (category: string) => void;
}

export function EntryFilter({
  filterMonth,
  filterCategory,
  categories,
  availableMonths,
  onMonthChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      <div>
        <label className="block text-xs text-gray-500 mb-1">月で絞り込み</label>
        <select
          value={filterMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {availableMonths.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">カテゴリで絞り込み</label>
        <select
          value={filterCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">すべて</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
