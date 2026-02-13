import { useState } from 'react';
import type { PromptItem } from '../types';
import { PROMPT_SET } from '../config/prompts';

interface Props {
  selectedPrompt: PromptItem | null;
  onSelect: (prompt: PromptItem) => void;
  onRunWithPrompt?: (prompt: PromptItem) => void;
}

export function PromptSelector({ selectedPrompt, onSelect, onRunWithPrompt }: Props) {
  const [customPromptText, setCustomPromptText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleUseCustomPrompt = () => {
    if (customPromptText.trim()) {
      const customPrompt: PromptItem = {
        id: 'custom-' + Date.now(),
        label: 'Custom Prompt',
        category: 'medium',
        prompt: customPromptText.trim(),
      };
      onSelect(customPrompt);
      setShowCustomInput(false); // Switch back to show the activated prompt
      // Automatically trigger benchmark run with the custom prompt
      if (onRunWithPrompt) {
        onRunWithPrompt(customPrompt);
      }
    }
  };

  const handleClearCustom = () => {
    setCustomPromptText('');
    setShowCustomInput(false);
  };

  const isCustomPromptSelected = selectedPrompt?.id.startsWith('custom-');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Select Prompt</h2>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {showCustomInput ? '📋 Presets' : '✏️ Custom'}
        </button>
      </div>

      {showCustomInput ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Enter your custom prompt:
            </label>
            <textarea
              value={customPromptText}
              onChange={e => setCustomPromptText(e.target.value)}
              placeholder="Type your prompt here to test with the model router..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={8}
              maxLength={50000}
              aria-label="Custom prompt text"
            />
            <div className="text-xs text-gray-500 mt-1">
              {customPromptText.length.toLocaleString()} / 50,000 characters
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUseCustomPrompt}
              disabled={!customPromptText.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ✓ Use This Prompt
            </button>
            <button
              onClick={handleClearCustom}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
          {isCustomPromptSelected && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              ✓ Custom prompt is active
            </div>
          )}
        </div>
      ) : (
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
      )}

      {isCustomPromptSelected && !showCustomInput && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-1">Custom Prompt Active</div>
          <div className="text-xs text-blue-700 line-clamp-3">{selectedPrompt?.prompt}</div>
          <button
            onClick={() => setShowCustomInput(true)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline"
          >
            Edit custom prompt
          </button>
        </div>
      )}
    </div>
  );
}
