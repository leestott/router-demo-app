import type { PromptItem } from '../types';
import { PROMPT_SET } from '../config/prompts';

interface Props {
  selectedPrompt: PromptItem | null;
  onSelect: (prompt: PromptItem) => void;
}

export function PromptSelector({ selectedPrompt, onSelect }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Select Prompt</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {PROMPT_SET.map(prompt => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedPrompt?.id === prompt.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-sm">{prompt.label}</div>
            <div className="text-xs text-gray-500 mt-1">
              Category: {prompt.category}
            </div>
            {prompt.expectedRoutingHint && (
              <div className="text-xs text-blue-600 mt-1">
                💡 {prompt.expectedRoutingHint}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
