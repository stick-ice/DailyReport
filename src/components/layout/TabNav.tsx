type Tab = 'form' | 'list' | 'plan' | 'analytics' | 'categories';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'form', label: '実績入力' },
  { id: 'list', label: '実績一覧' },
  { id: 'plan', label: '作業計画' },
  { id: 'analytics', label: '分析' },
  { id: 'categories', label: 'カテゴリ' },
];

export function TabNav({ active, onChange }: Props) {
  return (
    <nav className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-6 py-3 text-sm font-medium transition-colors focus:outline-none ${
            active === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
