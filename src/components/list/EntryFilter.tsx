import { PREDEFINED_CATEGORIES } from '../../constants/categories';

interface Props {
  filterMonth: string;
  filterCategory: string;
  customCategories: string[];
  availableMonths: string[];
  onMonthChange: (month: string) => void;
  onCategoryChange: (category: string) => void;
}

export function EntryFilter({
  filterMonth,
  filterCategory,
  customCategories,
  availableMonths,
  onMonthChange,
  onCategoryChange,
}: Props) {
  const allCategories = [
    ...PREDEFINED_CATEGORIES,
    ...customCategories.filter((c) => !PREDEFINED_CATEGORIES.includes(c)),
  ];

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
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
