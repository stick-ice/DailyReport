import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatDuration } from '../../utils/time';

interface DataItem {
  category: string;
  hours: number;
  minutes: number;
}

interface Props {
  data: DataItem[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DataItem }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
      <p className="font-medium text-gray-800">{d.category}</p>
      <p className="text-blue-600">{formatDuration(d.minutes)}</p>
    </div>
  );
}

export function CategoryBarChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-10">データがありません</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          interval={0}
        />
        <YAxis
          tickFormatter={(v: number) => `${v}h`}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
