import { Fragment } from 'react';
import type { CompletionResult } from '../types';

interface Props {
  results: CompletionResult[];
}

export function ResultsTable({ results }: Props) {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Results</h2>
        <p className="text-gray-500 text-sm">No results yet. Run a prompt to see comparisons.</p>
      </div>
    );
  }

  // Group by promptId
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.promptId]) acc[r.promptId] = { router: null, standard: null, label: r.promptLabel };
    acc[r.promptId][r.path] = r;
    return acc;
  }, {} as Record<string, { router: CompletionResult | null; standard: CompletionResult | null; label: string }>);

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-3">Results Comparison</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Prompt</th>
            <th className="text-left p-2">Path</th>
            <th className="text-left p-2">Routing Mode</th>
            <th className="text-left p-2">Chosen Model</th>
            <th className="text-right p-2">Latency</th>
            <th className="text-right p-2">Tokens</th>
            <th className="text-right p-2">Est. Cost</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([promptId, data]) => (
            <Fragment key={promptId}>
              {data.router && (
                <tr className="border-b bg-blue-50">
                  <td className="p-2 font-medium">{data.label}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Router</span>
                  </td>
                  <td className="p-2">
                    {data.router.routingMode && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs capitalize">
                        {data.router.routingMode}
                      </span>
                    )}
                  </td>
                  <td className="p-2 font-mono text-xs">{data.router.chosenModel}</td>
                  <td className="p-2 text-right">{data.router.latencyMs}ms</td>
                  <td className="p-2 text-right">{data.router.totalTokens}</td>
                  <td className="p-2 text-right">${data.router.estimatedCost.toFixed(5)}</td>
                </tr>
              )}
              {data.standard && (
                <tr className="border-b">
                  <td className="p-2 font-medium">{!data.router ? data.label : ''}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Standard</span>
                  </td>
                  <td className="p-2">
                    <span className="text-gray-400 text-xs">N/A</span>
                  </td>
                  <td className="p-2 font-mono text-xs">{data.standard.chosenModel}</td>
                  <td className="p-2 text-right">{data.standard.latencyMs}ms</td>
                  <td className="p-2 text-right">{data.standard.totalTokens}</td>
                  <td className="p-2 text-right">${data.standard.estimatedCost.toFixed(5)}</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
