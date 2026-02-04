import type { AggregatedStats } from '../types';

interface Props {
  stats: AggregatedStats;
}

export function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500 uppercase">Avg Latency (Router)</div>
        <div className="text-2xl font-bold text-blue-600">{stats.avgLatencyRouter}ms</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500 uppercase">Avg Latency (Standard)</div>
        <div className="text-2xl font-bold text-gray-600">{stats.avgLatencyStandard}ms</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500 uppercase">Total Cost (Router)</div>
        <div className="text-2xl font-bold text-green-600">${stats.totalCostRouter.toFixed(4)}</div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-xs text-gray-500 uppercase">Cost Savings</div>
        <div className={`text-2xl font-bold ${stats.costSavingsPercent > 0 ? 'text-green-600' : 'text-gray-600'}`}>
          {stats.costSavingsPercent.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
