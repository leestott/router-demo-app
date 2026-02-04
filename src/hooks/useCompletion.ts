import { useState, useCallback } from 'react';
import type { CompletionResult, PromptItem } from '../types';
import { ENDPOINTS, API_VERSION } from '../config/endpoints';
import { calculateCost } from '../config/pricing';

export function useCompletion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete = useCallback(async (
    path: 'router' | 'standard',
    prompt: PromptItem,
    routingMode?: 'balanced' | 'cost' | 'quality'
  ): Promise<CompletionResult> => {
    const endpoint = path === 'router' ? ENDPOINTS.router : ENDPOINTS.standard;
    
    if (!endpoint.url || !endpoint.apiKey) {
      throw new Error(`Missing configuration for ${path} endpoint`);
    }

    setLoading(true);
    setError(null);

    const startTime = performance.now();

    try {
      const response = await fetch(
        `${endpoint.url}/openai/deployments/${endpoint.deploymentName}/chat/completions?api-version=${API_VERSION}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': endpoint.apiKey,
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt.prompt }],
            max_tokens: 1024,
            temperature: 0.7,
          }),
        }
      );

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // KEY INSIGHT: response.model reveals the chosen underlying model
      const chosenModel = data.model || endpoint.deploymentName;
      const usage = data.usage || {};

      return {
        promptId: prompt.id,
        promptLabel: prompt.label,
        path,
        routingMode: path === 'router' ? routingMode : undefined,
        chosenModel,
        content: data.choices?.[0]?.message?.content || '',
        latencyMs,
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
        estimatedCost: calculateCost(
          chosenModel,
          usage.prompt_tokens || 0,
          usage.completion_tokens || 0
        ),
        timestamp: new Date(),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { complete, loading, error };
}
