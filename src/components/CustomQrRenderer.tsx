import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQrStore } from '../store/useQrStore';
import { useQrHistoryStore } from '../store/useQrHistoryStore';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { Copy, Check, Download } from 'lucide-react';

export const CustomQrRenderer: React.FC = () => {
  const qrOptions = useQrStore((state) => state.options);
  const batchData = useQrStore((state) => state.batchData);
  const addToHistory = useQrHistoryStore((state) => state.addToHistory);

  const ref = useRef<HTMLDivElement>(null);
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(qrOptions));
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [copied, setCopied] = useState(false);

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
          pdf.save('qr-code.pdf');
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        console.error("Error generating PDF:", err);
      }
      return;
    }

    qrCode.download({
      extension: ext
    });
  };

  const handleCopyToClipboard = async () => {
    try {
      const blob = await qrCode.getRawData("png") as Blob;
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        setCopied(true);
        saveToHistory();
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy image to clipboard", err);
    }
  };

  const handleBatchDownload = async () => {
    if (!batchData || batchData.length === 0) return;

    setIsGeneratingBatch(true);
    saveToHistory();

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
      });
    }
  };

  const isBatchMode = batchData && batchData.length > 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 w-full transition-all duration-300">
      <div
        ref={ref}
        className="mb-6 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm bg-white flex justify-center items-center w-full min-h-[300px]"
        style={{
           /* This container ensures the QR canvas stays centered regardless of size */
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center'
        }}
      />

      {isBatchMode ? (
        <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in duration-300">
          <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-lg">
            Batch Mode: {batchData.length} items ready
          </p>
          <button
            onClick={handleBatchDownload}
            disabled={isGeneratingBatch}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-md shadow-blue-500/30 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGeneratingBatch ? 'Generating ZIP Archive...' : 'Download Batch ZIP'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full animate-in fade-in duration-300">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-bold text-sm border border-gray-200 dark:border-gray-600"
          >
            {copied ? <Check className="w-4 h-4 text-green-600 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Image to Clipboard'}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownload('png')}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 font-semibold text-sm shadow-sm shadow-blue-500/20"
            >
              PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 font-semibold text-sm shadow-sm shadow-indigo-500/20"
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
