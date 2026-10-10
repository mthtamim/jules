import { create } from 'zustand';
import type { QrCodeOptions } from '../types';

interface QrStoreState {
  options: QrCodeOptions;
  batchData: string[]; // For batch processing
  setOptions: (options: Partial<QrCodeOptions>) => void;
  setQrOptions: (options: Partial<NonNullable<QrCodeOptions['qrOptions']>>) => void;
  setDotsOptions: (options: Partial<NonNullable<QrCodeOptions['dotsOptions']>>) => void;
  setCornersSquareOptions: (options: Partial<NonNullable<QrCodeOptions['cornersSquareOptions']>>) => void;
  setCornersDotOptions: (options: Partial<NonNullable<QrCodeOptions['cornersDotOptions']>>) => void;
  setBackgroundOptions: (options: Partial<NonNullable<QrCodeOptions['backgroundOptions']>>) => void;
  setImageOptions: (options: Partial<NonNullable<QrCodeOptions['imageOptions']>>) => void;
  setBatchData: (data: string[]) => void;
}

const defaultOptions: QrCodeOptions = {
  data: 'https://pressmark.app',
  width: 300,
  height: 300,
  margin: 10,
  qrOptions: {
    typeNumber: 0 as any,
    mode: 'Byte',
    errorCorrectionLevel: 'Q'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    color: '#000000',
    type: 'square'
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square'
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'square'
  }
};

export const useQrStore = create<QrStoreState>((set) => ({
  options: defaultOptions,
  batchData: [],
  setOptions: (newOptions) => set((state) => ({ options: { ...state.options, ...newOptions } })),
  setQrOptions: (newOptions) => set((state) => ({ options: { ...state.options, qrOptions: { ...state.options.qrOptions, ...newOptions } } })),
  setDotsOptions: (newOptions) => set((state) => ({ options: { ...state.options, dotsOptions: { ...state.options.dotsOptions, ...newOptions } } })),
  setCornersSquareOptions: (newOptions) => set((state) => ({ options: { ...state.options, cornersSquareOptions: { ...state.options.cornersSquareOptions, ...newOptions } } })),
  setCornersDotOptions: (newOptions) => set((state) => ({ options: { ...state.options, cornersDotOptions: { ...state.options.cornersDotOptions, ...newOptions } } })),
  setBackgroundOptions: (newOptions) => set((state) => ({ options: { ...state.options, backgroundOptions: { ...state.options.backgroundOptions, ...newOptions } } })),
  setImageOptions: (newOptions) => set((state) => ({ options: { ...state.options, imageOptions: { ...state.options.imageOptions, ...newOptions } } })),
  setBatchData: (data) => set({ batchData: data }),
}));
