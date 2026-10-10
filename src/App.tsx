import { CustomQrRenderer } from './components/CustomQrRenderer';
import { DataInputs } from './components/DataInputs';
import { DesignSettings } from './components/DesignSettings';
import { HistoryPanel } from './components/HistoryPanel';
import { QrCode } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [currentYear] = useState<number>(() => new Date().getFullYear());

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 md:p-8">
      <header className="max-w-7xl mx-auto flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <div className="bg-blue-600 p-2 rounded-lg">
          <QrCode className="text-white w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight m-0">Pressmark</h1>
          <p className="text-gray-500 font-medium">Professional QR Code Generator</p>
        </div>
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

      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} Pressmark QR Code Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
