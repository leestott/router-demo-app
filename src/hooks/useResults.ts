import { useState, useCallback, useMemo } from 'react';
import type { CompletionResult, AggregatedStats } from '../types';

export function useResults() {
  const [results, setResults] = useState<CompletionResult[]>([]);

  const addResult = useCallback((result: CompletionResult) => {
    setResults(prev => [...prev, result]);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const stats = useMemo((): AggregatedStats => {
    const routerResults = results.filter(r => r.path === 'router');
    const standardResults = results.filter(r => r.path === 'standard');

    const avgLatencyRouter = routerResults.length > 0
      ? routerResults.reduce((sum, r) => sum + r.latencyMs, 0) / routerResults.length
      : 0;

    const avgLatencyStandard = standardResults.length > 0
      ? standardResults.reduce((sum, r) => sum + r.latencyMs, 0) / standardResults.length
      : 0;

    const totalCostRouter = routerResults.reduce((sum, r) => sum + r.estimatedCost, 0);
    const totalCostStandard = standardResults.reduce((sum, r) => sum + r.estimatedCost, 0);

    const routingDistribution: Record<string, number> = {};
    for (const r of routerResults) {
      routingDistribution[r.chosenModel] = (routingDistribution[r.chosenModel] || 0) + 1;
    }

    const costSavingsPercent = totalCostStandard > 0
      ? ((totalCostStandard - totalCostRouter) / totalCostStandard) * 100
      : 0;

    return {
      avgLatencyRouter: Math.round(avgLatencyRouter),
      avgLatencyStandard: Math.round(avgLatencyStandard),
      totalCostRouter,
      totalCostStandard,
      routingDistribution,
      costSavingsPercent,
    };
  }, [results]);

  return { results, addResult, clearResults, stats };
}
