import { useState, useCallback } from 'react';
import type { PromptItem, RoutingMode } from './types';
import { PROMPT_SET } from './config/prompts';
import { useCompletion } from './hooks/useCompletion';
import { useResults } from './hooks/useResults';
import { PromptSelector } from './components/PromptSelector';
import { RunControls } from './components/RunControls';
import { ResultsTable } from './components/ResultsTable';
import { StatsCards } from './components/StatsCards';
import { DistributionChart } from './components/DistributionChart';
import { MetadataBadge } from './components/MetadataBadge';

function App() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [routingMode, setRoutingMode] = useState<RoutingMode>('balanced');
  const [isRunning, setIsRunning] = useState(false);

  const { complete, error } = useCompletion();
  const { results, addResult, clearResults, stats } = useResults();

  const runRouter = useCallback(async () => {
    if (!selectedPrompt) return;
    setIsRunning(true);
    try {
      const result = await complete('router', selectedPrompt, routingMode);
      addResult(result);
    } catch (e) {
      console.error('Router error:', e);
    }
    setIsRunning(false);
  }, [selectedPrompt, routingMode, complete, addResult]);

  const runStandard = useCallback(async () => {
    if (!selectedPrompt) return;
    setIsRunning(true);
    try {
      const result = await complete('standard', selectedPrompt);
      addResult(result);
    } catch (e) {
      console.error('Standard error:', e);
    }
    setIsRunning(false);
  }, [selectedPrompt, complete, addResult]);

  const runBoth = useCallback(async () => {
    if (!selectedPrompt) return;
    setIsRunning(true);
    try {
      const [routerResult, standardResult] = await Promise.all([
        complete('router', selectedPrompt, routingMode),
        complete('standard', selectedPrompt),
      ]);
      addResult(routerResult);
      addResult(standardResult);
    } catch (e) {
      console.error('Comparison error:', e);
    }
    setIsRunning(false);
  }, [selectedPrompt, routingMode, complete, addResult]);

  const runAll = useCallback(async () => {
    setIsRunning(true);
    for (const prompt of PROMPT_SET) {
      try {
        const [routerResult, standardResult] = await Promise.all([
          complete('router', prompt, routingMode),
          complete('standard', prompt),
        ]);
        addResult(routerResult);
        addResult(standardResult);
      } catch (e) {
        console.error(`Error on prompt ${prompt.id}:`, e);
      }
    }
    setIsRunning(false);
  }, [routingMode, complete, addResult]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          🔀 Model Router vs 📌 Standard Deployment
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Azure AI Foundry Model Router Demo — Compare intelligent routing vs fixed model
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <MetadataBadge routingMode={routingMode} />
          <div className="bg-white rounded-lg shadow p-4">
            <label className="text-sm font-medium">Routing Mode (Demo)</label>
            <select
              value={routingMode}
              onChange={e => setRoutingMode(e.target.value as RoutingMode)}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="balanced">Balanced (Default)</option>
              <option value="cost">Cost-Optimized</option>
              <option value="quality">Quality-Optimized</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Change in Foundry Portal to affect routing
            </p>
          </div>
          <PromptSelector selectedPrompt={selectedPrompt} onSelect={setSelectedPrompt} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RunControls
              onRunRouter={runRouter}
              onRunStandard={runStandard}
              onRunBoth={runBoth}
              onRunAll={runAll}
              onClear={clearResults}
              loading={isRunning}
              hasSelection={!!selectedPrompt}
            />
            <DistributionChart stats={stats} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          <StatsCards stats={stats} />
          <ResultsTable results={results} />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-8 text-center text-xs text-gray-500">
        <p>
          📚 Docs:{' '}
          <a href="https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-router?view=foundry-classic" className="text-blue-600 hover:underline">
            Concepts
          </a>{' '}
          |{' '}
          <a href="https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/model-router?view=foundry" className="text-blue-600 hover:underline">
            How-To
          </a>{' '}
          |{' '}
          <a href="https://ai.azure.com/catalog/models/model-router" className="text-blue-600 hover:underline">
            Catalog
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
