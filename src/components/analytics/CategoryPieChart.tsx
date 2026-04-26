import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DataItem; percent: number }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
      <p className="font-medium text-gray-800">{d.payload.category}</p>
      <p className="text-blue-600">{formatDuration(d.payload.minutes)}</p>
      <p className="text-gray-500">{(d.percent * 100).toFixed(1)}%</p>
    </div>
  );
}

export function CategoryPieChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-10">データがありません</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="hours"
          nameKey="category"
          cx="50%"
          cy="45%"
          outerRadius={90}
          label={({ percent }) => percent != null ? `${(percent * 100).toFixed(0)}%` : ''}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
