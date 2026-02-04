// Prices in USD per 1K tokens
// Update these values based on current Azure pricing
export const TOKEN_PRICES: Record<string, { input: number; output: number }> = {
  'gpt-4.1': { input: 0.002, output: 0.008 },
  'gpt-4.1-mini': { input: 0.0004, output: 0.0016 },
  'gpt-4.1-nano': { input: 0.0001, output: 0.0004 },
  'gpt-5': { input: 0.005, output: 0.015 },
  'gpt-5-mini': { input: 0.00075, output: 0.003 },
  'llama-4-maverick': { input: 0.0005, output: 0.0015 },
  'deepseek-v3': { input: 0.00027, output: 0.0011 },
  'default': { input: 0.001, output: 0.003 },
};

export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const normalizedModel = model.toLowerCase();
  const pricing = TOKEN_PRICES[normalizedModel] || TOKEN_PRICES['default'];
  const inputCost = (promptTokens / 1000) * pricing.input;
  const outputCost = (completionTokens / 1000) * pricing.output;
  return inputCost + outputCost;
}
