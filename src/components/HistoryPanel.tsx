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
      <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          History
        </h2>
        <div className="py-8 text-center text-gray-400">
          <p>No QR codes generated yet.</p>
          <p className="text-sm mt-1">Generate a QR code to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col max-h-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          History
        </h2>
        <button
          onClick={clearHistory}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-y-auto pr-2 space-y-3 flex-1">
        {history.map((item) => (
          <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-800 truncate pr-2" title={item.title}>
                {item.title}
              </h3>
              <button
                onClick={() => removeFromHistory(item.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{new Date(item.createdAt).toLocaleString()}</span>
              <button
                onClick={() => setOptions(item.options)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-1 rounded"
              >
                <RefreshCw className="w-3 h-3" />
                Restore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
