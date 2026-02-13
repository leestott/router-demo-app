import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AggregatedStats } from '../types';

interface Props {
  stats: AggregatedStats;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function DistributionChart({ stats }: Props) {
  const data = Object.entries(stats.routingDistribution).map(([model, count]) => ({
    model: model.replace('gpt-', '').replace('-', ' '),
    count,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-2">Routing Distribution</h3>
        <p className="text-gray-500 text-xs">Run prompts via Router to see distribution.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold mb-2">Routing Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="model" type="category" width={80} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="count" name="Requests">
            {data.map((entry, index) => (
              <Cell key={entry.model} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
