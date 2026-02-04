export type RoutingMode = 'balanced' | 'cost' | 'quality';

export interface PromptItem {
  id: string;
  label: string;
  category: 'simple' | 'medium' | 'complex' | 'long-context';
  prompt: string;
  expectedRoutingHint?: string;
}

export interface CompletionResult {
  promptId: string;
  promptLabel: string;
  path: 'router' | 'standard';
  routingMode?: RoutingMode;
  chosenModel: string;
  content: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  timestamp: Date;
}

export interface DemoMetadata {
  routingMode: RoutingMode;
  modelSubset: string[];
  routerDeploymentName: string;
  standardDeploymentName: string;
}

export interface AggregatedStats {
  avgLatencyRouter: number;
  avgLatencyStandard: number;
  totalCostRouter: number;
  totalCostStandard: number;
  routingDistribution: Record<string, number>;
  costSavingsPercent: number;
}
