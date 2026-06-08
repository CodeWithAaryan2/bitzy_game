import { Code2, RotateCcw } from 'lucide-react';

export default function ErrorFallback({ error }: { error: Error }) {
  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Code2 className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="font-display text-xl font-bold text-gray-800 mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-500 mb-4">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={handleReset}
          className="bitxy-btn bitxy-btn-green px-6 py-3 text-sm inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Data & Reload
        </button>
        <p className="text-xs text-gray-400 mt-3">
          This will clear your local progress and refresh the page.
        </p>
      </div>
    </div>
  );
}
