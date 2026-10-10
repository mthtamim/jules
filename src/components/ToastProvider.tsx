import React from 'react';
import { useToastStore } from '../store/useToastStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-slate-800 dark:bg-slate-700 text-white px-4 py-3 rounded-lg shadow-xl shadow-slate-900/20 animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}

          <span className="text-sm font-medium">{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
