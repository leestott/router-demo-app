/**
 * SECURITY NOTE — Client-Side API Keys
 * ─────────────────────────────────────
 * This demo intentionally reads API keys from VITE_ env vars so it can call
 * Azure OpenAI directly from the browser.  This is acceptable for **local
 * development and personal demos only**.
 *
 * For any production or publicly-deployed scenario you MUST proxy requests
 * through a backend server that keeps the API key secret and applies
 * authentication, rate-limiting, and input validation.
 *
 * See: https://learn.microsoft.com/azure/ai-services/openai/how-to/managed-identity
 */
export const ENDPOINTS = {
  router: {
    url: import.meta.env.VITE_ROUTER_ENDPOINT || '',
    apiKey: import.meta.env.VITE_ROUTER_API_KEY || '',
    deploymentName: import.meta.env.VITE_ROUTER_DEPLOYMENT || 'model-router',
  },
  standard: {
    url: import.meta.env.VITE_STANDARD_ENDPOINT || '',
    apiKey: import.meta.env.VITE_STANDARD_API_KEY || '',
    deploymentName: import.meta.env.VITE_STANDARD_DEPLOYMENT || 'gpt-5-nano',
  },
} as const;

export const API_VERSION = '2024-10-21';
