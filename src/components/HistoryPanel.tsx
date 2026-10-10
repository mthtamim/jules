import React from 'react';
import { useQrHistoryStore } from '../store/useQrHistoryStore';
import { useQrStore } from '../store/useQrStore';
import { Clock, Trash2, RefreshCw } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const history = useQrHistoryStore((state) => state.history);
  const removeFromHistory = useQrHistoryStore((state) => state.removeFromHistory);
  const clearHistory = useQrHistoryStore((state) => state.clearHistory);
  const setOptions = useQrStore((state) => state.setOptions);

  if (history.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          History
        </h2>
        <div className="py-8 text-center text-gray-400 dark:text-gray-500">
          <p>No QR codes generated yet.</p>
          <p className="text-sm mt-1">Generate a QR code to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 flex flex-col max-h-[600px] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          History
        </h2>
        <button
          onClick={clearHistory}
          className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-3 flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {history.map((item) => (
          <div key={item.id} className="p-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all group">
            <div className="flex justify-between items-start mb-2.5">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate pr-2 text-sm" title={item.title}>
                {item.title}
              </h3>
              <button
                onClick={() => removeFromHistory(item.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
              <button
                onClick={() => setOptions(item.options)}
                className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
