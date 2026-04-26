import { useState } from 'react';

interface Props {
  value: string;
  categories: string[];
  onChange: (value: string) => void;
  onAddCategory: (category: string) => void;
  error?: string;
}

const CUSTOM_SENTINEL = '__custom__';

export function CategorySelect({ value, categories, onChange, onAddCategory, error }: Props) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === CUSTOM_SENTINEL) {
      setShowCustomInput(true);
      return;
    }
    setShowCustomInput(false);
    onChange(e.target.value);
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    onChange(trimmed);
    setCustomInput('');
    setShowCustomInput(false);
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
    if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">業務カテゴリ</label>
      <select
        value={showCustomInput ? CUSTOM_SENTINEL : value}
        onChange={handleSelect}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        <option value="">選択してください</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
        <option value={CUSTOM_SENTINEL}>+ カテゴリを追加...</option>
      </select>
      {showCustomInput && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="カテゴリ名を入力"
            autoFocus
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
          >
            追加
          </button>
          <button
            type="button"
            onClick={() => { setShowCustomInput(false); setCustomInput(''); }}
            className="rounded-md bg-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-300 transition-colors"
          >
            キャンセル
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
