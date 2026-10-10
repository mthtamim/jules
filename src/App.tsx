import { CustomQrRenderer } from './components/CustomQrRenderer';
import { DataInputs } from './components/DataInputs';
import { DesignSettings } from './components/DesignSettings';
import { HistoryPanel } from './components/HistoryPanel';
import { ToastProvider } from './components/ToastProvider';
import { QrCode, Moon, Sun, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const [currentYear] = useState<number>(() => new Date().getFullYear());
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
  };

  const handleReset = () => {
    if(window.confirm('Are you sure you want to reset all QR settings to default?')) {
      localStorage.removeItem('qr-store');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans p-4 md:p-6 lg:p-8 transition-colors duration-300 flex flex-col">
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between mb-6 md:mb-10 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 md:p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <QrCode className="text-white w-7 h-7 md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 m-0 leading-tight">Pressmark</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm">Professional QR Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95 text-sm font-medium"
            title="Reset Settings"
          >
            <Settings2 className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 md:p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' || (theme === 'system' && document.documentElement.classList.contains('dark')) ? (
              <Sun className="w-5 h-5 md:w-5 md:h-5" />
            ) : (
              <Moon className="w-5 h-5 md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 flex-1">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <DataInputs />
          <DesignSettings />
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <div className="sticky top-6 flex flex-col gap-6">
            <CustomQrRenderer />
            <HistoryPanel />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl w-full mx-auto mt-12 md:mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors pb-6">
        <p>&copy; {currentYear} Pressmark. Built for mobile & desktop.</p>
      </footer>

      <ToastProvider />
    </div>
  );
}

export default App;
