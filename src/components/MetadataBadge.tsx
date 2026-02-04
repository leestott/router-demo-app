import type { RoutingMode } from '../types';

interface Props {
  routingMode: RoutingMode;
  modelSubset?: string[];
}

export function MetadataBadge({ routingMode, modelSubset }: Props) {
  const modeColors = {
    balanced: 'bg-blue-100 text-blue-800',
    cost: 'bg-green-100 text-green-800',
    quality: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold mb-2">Current Configuration</h3>
      <div className="flex flex-wrap gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${modeColors[routingMode]}`}>
          Mode: {routingMode.charAt(0).toUpperCase() + routingMode.slice(1)}
        </span>
        {modelSubset && modelSubset.length > 0 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Subset: {modelSubset.length} models
          </span>
        )}
      </div>
    </div>
  );
}
