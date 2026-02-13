import { useState, useCallback, useRef } from 'react';
import type { CompletionResult, PromptItem } from '../types';
import { ENDPOINTS, API_VERSION } from '../config/endpoints';
import { calculateCost } from '../config/pricing';

/** Maximum prompt length (characters) to prevent abuse. */
const MAX_PROMPT_LENGTH = 50_000;

/** Request timeout in milliseconds. */
const REQUEST_TIMEOUT_MS = 60_000;

/**
 * Sanitise an API error so raw backend details are never shown to the user.
 * Keeps only the HTTP status code; the full message is logged for debugging.
 */
function sanitiseError(status: number, raw: string): string {
  if (import.meta.env.DEV) {
    // In development, surface full error for debugging
    return `API error ${status}: ${raw}`;
  }
  const messages: Record<number, string> = {
    400: 'Bad request — please check your prompt and try again.',
    401: 'Authentication failed — verify your API key.',
    403: 'Access denied — your key may lack the required permissions.',
    404: 'Deployment not found — check your endpoint configuration.',
    429: 'Rate limit exceeded — please wait a moment and retry.',
  };
  return messages[status] ?? `Request failed (HTTP ${status}). Please try again later.`;
}

export function useCompletion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeControllers = useRef<Set<AbortController>>(new Set());

  /** Cancel all in-flight requests. */
  const cancel = useCallback(() => {
    for (const c of activeControllers.current) c.abort();
    activeControllers.current.clear();
  }, []);

  const complete = useCallback(async (
    path: 'router' | 'standard',
    prompt: PromptItem,
    routingMode?: 'balanced' | 'cost' | 'quality'
  ): Promise<CompletionResult> => {
    const endpoint = path === 'router' ? ENDPOINTS.router : ENDPOINTS.standard;

    if (!endpoint.url || !endpoint.apiKey) {
      throw new Error(`Missing configuration for ${path} endpoint. See .env.example.`);
    }

    // --- Input validation ---
    if (!prompt.prompt || prompt.prompt.trim().length === 0) {
      throw new Error('Prompt text cannot be empty.');
    }
    if (prompt.prompt.length > MAX_PROMPT_LENGTH) {
      throw new Error(`Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH.toLocaleString()} characters.`);
    }

    // --- Per-request AbortController (allows concurrent calls) ---
    const controller = new AbortController();
    activeControllers.current.add(controller);

    // --- Timeout ---
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    setLoading(true);
    setError(null);

    const startTime = performance.now();

    try {
      const response = await fetch(
        `${endpoint.url}/openai/deployments/${encodeURIComponent(endpoint.deploymentName)}/chat/completions?api-version=${API_VERSION}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': endpoint.apiKey,
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt.prompt }],
            max_completion_tokens: 1024,
          }),
          signal: controller.signal,
        }
      );

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      if (!response.ok) {
        const errorText = await response.text();
        // Log full error in all environments for diagnostics
        console.error(`[${path}] API ${response.status}:`, errorText);
        throw new Error(sanitiseError(response.status, errorText));
      }

      const data = await response.json();

      // KEY INSIGHT: response.model reveals the chosen underlying model
      const chosenModel: string = typeof data.model === 'string' ? data.model : endpoint.deploymentName;
      const usage = data.usage ?? {};
      const content: string = data.choices?.[0]?.message?.content ?? '';

      return {
        promptId: prompt.id,
        promptLabel: prompt.label,
        path,
        routingMode: path === 'router' ? routingMode : undefined,
        chosenModel,
        content,
        latencyMs,
        promptTokens: Number(usage.prompt_tokens) || 0,
        completionTokens: Number(usage.completion_tokens) || 0,
        totalTokens: Number(usage.total_tokens) || 0,
        estimatedCost: calculateCost(
          chosenModel,
          Number(usage.prompt_tokens) || 0,
          Number(usage.completion_tokens) || 0
        ),
        timestamp: new Date(),
      };
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        const message = 'Request timed out or was cancelled.';
        setError(message);
        throw new Error(message);
      }
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      throw err;
    } finally {
      clearTimeout(timeoutId);
      activeControllers.current.delete(controller);
      setLoading(activeControllers.current.size > 0);
    }
  }, []);

  return { complete, loading, error, cancel };
}
