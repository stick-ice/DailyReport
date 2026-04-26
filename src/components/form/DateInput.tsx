interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DateInput({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
