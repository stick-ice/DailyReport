interface Props {
  filterCategory: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
}

export function EntryFilter({ filterCategory, categories, onCategoryChange }: Props) {
  return (
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
  );
}
