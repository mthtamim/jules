import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QrCodeOptions } from '../types';

export interface QrHistoryItem {
  id: string;
  createdAt: number;
  options: QrCodeOptions;
  title: string;
}

interface QrHistoryState {
  history: QrHistoryItem[];
  addToHistory: (options: QrCodeOptions, title: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useQrHistoryStore = create<QrHistoryState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (options, title) => set((state) => {
        const newItem: QrHistoryItem = {
          id: Math.random().toString(36).substring(7),
          createdAt: Date.now(),
          options,
          title
        };
        return { history: [newItem, ...state.history] };
      }),
      removeFromHistory: (id) => set((state) => ({
        history: state.history.filter(item => item.id !== id)
      })),
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'qr-history-storage'
    }
  )
);
