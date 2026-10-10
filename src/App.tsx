import { CustomQrRenderer } from './components/CustomQrRenderer';
import { DataInputs } from './components/DataInputs';
import { DesignSettings } from './components/DesignSettings';
import { HistoryPanel } from './components/HistoryPanel';
import { QrCode, Moon, Sun } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8 transition-colors duration-300">
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <QrCode className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 m-0">Pressmark</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Professional QR Code Generator</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all active:scale-95"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' || (theme === 'system' && document.documentElement.classList.contains('dark')) ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <DataInputs />
          <DesignSettings />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="sticky top-8 flex flex-col gap-6">
            <CustomQrRenderer />
            <HistoryPanel />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
        <p>&copy; {currentYear} Pressmark QR Code Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
