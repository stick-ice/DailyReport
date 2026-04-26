import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDuration } from '../../utils/time';

interface DataItem {
  day: number;
  hours: number;
}

interface Props {
  data: DataItem[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: number }) {
  if (!active || !payload?.length || !payload[0].value) return null;
  const minutes = Math.round(payload[0].value * 60);
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
      <p className="font-medium text-gray-800">{label}日</p>
      <p className="text-blue-600">{formatDuration(minutes)}</p>
    </div>
  );
}

export function DailyAreaChart({ data }: Props) {
  const hasData = data.some((d) => d.hours > 0);
  if (!hasData) {
    return <p className="text-center text-gray-400 py-10">データがありません</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          tickFormatter={(v: number) => `${v}日`}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          interval={4}
        />
        <YAxis
          tickFormatter={(v: number) => `${v}h`}
          tick={{ fontSize: 11, fill: '#6b7280' }}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#areaGradient)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
