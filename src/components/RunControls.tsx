interface Props {
  onRunRouter: () => void;
  onRunStandard: () => void;
  onRunBoth: () => void;
  onRunAll: () => void;
  onClear: () => void;
  loading: boolean;
  hasSelection: boolean;
}

export function RunControls({
  onRunRouter,
  onRunStandard,
  onRunBoth,
  onRunAll,
  onClear,
  loading,
  hasSelection,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Run Controls</h2>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onRunRouter}
          disabled={loading || !hasSelection}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          🔀 Run Router
        </button>
        <button
          onClick={onRunStandard}
          disabled={loading || !hasSelection}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          📌 Run Standard
        </button>
        <button
          onClick={onRunBoth}
          disabled={loading || !hasSelection}
          className="col-span-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          ⚡ Run Both (Compare)
        </button>
        <button
          onClick={onRunAll}
          disabled={loading}
          className="col-span-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          🚀 Run All Prompts
        </button>
        <button
          onClick={onClear}
          disabled={loading}
          className="col-span-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 text-sm"
        >
          🗑️ Clear Results
        </button>
      </div>
      {loading && (
        <div className="mt-3 text-center text-sm text-gray-500">
          ⏳ Processing...
        </div>
      )}
    </div>
  );
}
