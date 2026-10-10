import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQrStore } from '../store/useQrStore';
import { useQrHistoryStore } from '../store/useQrHistoryStore';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { Copy, Check } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
      <div ref={ref} className="mb-6 rounded-lg overflow-hidden border border-gray-100 shadow-sm" />

      {isBatchMode ? (
        <div className="flex flex-col gap-3 w-full">
          <p className="text-center text-sm font-medium text-gray-700">
            Batch Mode: {batchData.length} items ready
          </p>
          <button
            onClick={handleBatchDownload}
            disabled={isGeneratingBatch}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm disabled:opacity-50"
          >
            {isGeneratingBatch ? 'Generating ZIP...' : 'Download Batch ZIP'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-bold text-sm"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Image to Clipboard'}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDownload('png')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
              SVG
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm"
            >
              PDF
            </button>
            <button
              onClick={() => handleDownload('jpeg')}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium text-sm"
            >
              JPEG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
