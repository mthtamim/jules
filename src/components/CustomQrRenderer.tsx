import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQrStore } from '../store/useQrStore';
import { useQrHistoryStore } from '../store/useQrHistoryStore';
import { useToastStore } from '../store/useToastStore';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { Copy, Download, Share2, ClipboardType } from 'lucide-react';

export const CustomQrRenderer: React.FC = () => {
  const qrOptions = useQrStore((state) => state.options);
  const batchData = useQrStore((state) => state.batchData);
  const addToHistory = useQrHistoryStore((state) => state.addToHistory);
  const addToast = useToastStore((state) => state.addToast);

  const ref = useRef<HTMLDivElement>(null);
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(qrOptions));
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

  useEffect(() => {
    qrCode.update(qrOptions);
  }, [qrCode, qrOptions]);

  const saveToHistory = () => {
    const title = typeof qrOptions.data === 'string' && qrOptions.data.length > 30
      ? qrOptions.data.substring(0, 30) + '...'
      : String(qrOptions.data || 'Unknown QR');
    addToHistory(qrOptions, title);
  };

  const handleDownload = async (ext: "png" | "jpeg" | "webp" | "svg" | "pdf") => {
    saveToHistory();
    addToast(`Downloading ${ext.toUpperCase()}...`, 'info');

    if (ext === 'pdf') {
      try {
        const blob = await qrCode.getRawData("png");
        if (blob) {
          const url = URL.createObjectURL(blob as Blob);
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [qrOptions.width || 300, qrOptions.height || 300]
          });
          pdf.addImage(url, 'PNG', 0, 0, qrOptions.width || 300, qrOptions.height || 300);
          pdf.save('pressmark-qr.pdf');
          URL.revokeObjectURL(url);
          addToast('PDF downloaded successfully!');
        }
      } catch (err) {
        console.error("Error generating PDF:", err);
        addToast('Failed to generate PDF', 'error');
      }
      return;
    }

    qrCode.download({
      name: 'pressmark-qr',
      extension: ext
    });
    // Assuming instantaneous for these
    setTimeout(() => addToast(`${ext.toUpperCase()} downloaded successfully!`), 500);
  };

  const handleCopyImage = async () => {
    try {
      const blob = await qrCode.getRawData("png") as Blob;
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        saveToHistory();
        addToast('QR Code image copied to clipboard!');
      }
    } catch (err) {
      console.error("Failed to copy image to clipboard", err);
      addToast('Failed to copy image to clipboard', 'error');
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(String(qrOptions.data));
      addToast('Raw QR data copied to clipboard!');
    } catch (err) {
      console.error("Failed to copy text", err);
      addToast('Failed to copy text', 'error');
    }
  };

  const handleShare = async () => {
    try {
      const blob = await qrCode.getRawData("png") as Blob;
      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'qr.png', { type: blob.type })] })) {
        await navigator.share({
          title: 'Pressmark QR Code',
          text: 'Check out my QR Code generated with Pressmark.',
          files: [new File([blob], 'qr.png', { type: blob.type })]
        });
        saveToHistory();
        addToast('Shared successfully!');
      } else {
        addToast('Native sharing not supported on this browser.', 'error');
      }
    } catch (err: any) {
        if (err.name !== 'AbortError') {
            console.error("Error sharing:", err);
            addToast('Failed to share QR Code', 'error');
        }
    }
  };

  const handleBatchDownload = async () => {
    if (!batchData || batchData.length === 0) return;

    setIsGeneratingBatch(true);
    saveToHistory();
    addToast('Generating ZIP archive...', 'info');

    const zip = new JSZip();
    const folder = zip.folder("qr-codes");

    if (folder) {
      for (let i = 0; i < batchData.length; i++) {
        const data = batchData[i];
        const tempQr = new QRCodeStyling({
          ...qrOptions,
          data
        });

        try {
          const blob = await tempQr.getRawData('png');
          if (blob) {
            folder.file(`qr-code-${i + 1}.png`, blob as Blob);
          }
        } catch (e) {
          console.error(`Error generating batch item ${i}`, e);
        }
      }

      zip.generateAsync({ type: "blob" }).then(function(content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "pressmark-qr-batch.zip";
        link.click();
        URL.revokeObjectURL(link.href);
        setIsGeneratingBatch(false);
        addToast('Batch ZIP downloaded successfully!');
      });
    }
  };

  const isBatchMode = batchData && batchData.length > 0;

  return (
    <div className="flex flex-col items-center justify-center p-5 md:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 w-full transition-all duration-300">
      <div
        ref={ref}
        className="mb-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-white flex justify-center items-center w-full min-h-[300px]"
        style={{
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center'
        }}
      />

      {isBatchMode ? (
        <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in duration-300">
          <p className="text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
            Batch Mode: {batchData.length} items ready
          </p>
          <button
            onClick={handleBatchDownload}
            disabled={isGeneratingBatch}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold text-sm shadow-md shadow-indigo-500/30 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGeneratingBatch ? 'Generating ZIP...' : 'Download Batch ZIP'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full animate-in fade-in duration-300">

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
                onClick={handleCopyImage}
                className="flex items-center justify-center gap-2 w-full px-2 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold text-sm border border-slate-200 dark:border-slate-600 col-span-1"
                title="Copy Image"
            >
                <Copy className="w-4 h-4" />
                <span className="hidden md:inline">Image</span>
            </button>
            <button
                onClick={handleCopyText}
                className="flex items-center justify-center gap-2 w-full px-2 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold text-sm border border-slate-200 dark:border-slate-600 col-span-1"
                title="Copy Data Text"
            >
                <ClipboardType className="w-4 h-4" />
                <span className="hidden md:inline">Data</span>
            </button>
            <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full px-2 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-semibold text-sm border border-slate-200 dark:border-slate-600 col-span-2 md:col-span-1"
                title="Share QR"
            >
                <Share2 className="w-4 h-4" />
                <span className="hidden md:inline">Share</span>
                <span className="md:hidden">Share QR</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => handleDownload('png')}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 font-semibold text-sm shadow-sm shadow-indigo-500/20"
            >
              PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 font-semibold text-sm shadow-sm shadow-blue-500/20"
            >
              SVG
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all active:scale-95 font-semibold text-sm shadow-sm shadow-rose-500/20"
            >
              PDF
            </button>
            <button
              onClick={() => handleDownload('jpeg')}
              className="px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all active:scale-95 font-semibold text-sm shadow-sm shadow-violet-500/20"
            >
              JPEG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
