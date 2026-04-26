import { currentTimeString } from '../../utils/time';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function TimeInput({ label, value, onChange, error }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = e.target.value;
    // HHMMをHH:MMに自動補完
    if (/^\d{4}$/.test(v)) {
      onChange(`${v.slice(0, 2)}:${v.slice(2)}`);
    }
  };

  const fillCurrentTime = () => {
    onChange(currentTimeString());
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="HH:MM"
          maxLength={5}
          className={`w-28 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={fillCurrentTime}
          className="rounded-md bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          現在時刻
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
