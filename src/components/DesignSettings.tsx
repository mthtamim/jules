import React, { useState, useEffect } from 'react';
import { useQrStore } from '../store/useQrStore';

export const DesignSettings: React.FC = () => {
  const options = useQrStore((state) => state.options);
  const setOptions = useQrStore((state) => state.setOptions);
  const setQrOptions = useQrStore((state) => state.setQrOptions);
  const setDotsOptions = useQrStore((state) => state.setDotsOptions);
  const setCornersSquareOptions = useQrStore((state) => state.setCornersSquareOptions);
  const setCornersDotOptions = useQrStore((state) => state.setCornersDotOptions);
  const setBackgroundOptions = useQrStore((state) => state.setBackgroundOptions);
  const setImageOptions = useQrStore((state) => state.setImageOptions);

  const [useGradient, setUseGradient] = useState(!!options.dotsOptions?.gradient);
  const [gradientColor1, setGradientColor1] = useState(options.dotsOptions?.gradient?.colorStops?.[0]?.color || options.dotsOptions?.color || '#000000');
  const [gradientColor2, setGradientColor2] = useState(options.dotsOptions?.gradient?.colorStops?.[1]?.color || '#aa3bff');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>(options.dotsOptions?.gradient?.type === 'radial' ? 'radial' : 'linear');

  // Synchronize local state with global store when options change (e.g., from History Restore)
  useEffect(() => {
      const hasGradient = !!options.dotsOptions?.gradient;
      setUseGradient(hasGradient);
      if (hasGradient) {
          setGradientColor1(options.dotsOptions?.gradient?.colorStops?.[0]?.color || '#000000');
          setGradientColor2(options.dotsOptions?.gradient?.colorStops?.[1]?.color || '#aa3bff');
          setGradientType(options.dotsOptions?.gradient?.type === 'radial' ? 'radial' : 'linear');
      } else {
          setGradientColor1(options.dotsOptions?.color || '#000000');
      }
  }, [options.dotsOptions]);

  const updateGradient = (c1: string, c2: string, type: 'linear' | 'radial', active: boolean) => {
    if (active) {
      setDotsOptions({
        gradient: {
          type,
          rotation: 0,
          colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }]
        }
      });
    } else {
      setDotsOptions({ color: c1, gradient: undefined });
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md border border-gray-100 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Design Customization</h2>

      <div className="space-y-6">
        {/* Size & Margin & Error Correction Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size ({options.width}px)
            </label>
            <input
              type="range"
              min="100" max="1000" step="10"
              value={options.width}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setOptions({ width: val, height: val });
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin ({options.margin}px)
            </label>
            <input
              type="range"
              min="0" max="100" step="1"
              value={options.margin}
              onChange={(e) => setOptions({ margin: parseInt(e.target.value, 10) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Error Correction
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={options.qrOptions?.errorCorrectionLevel || 'Q'}
              onChange={(e) => setQrOptions({ errorCorrectionLevel: e.target.value as any })}
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>

        {/* Color Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">QR Code Color</label>
              <label className="flex items-center text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={useGradient}
                  onChange={(e) => {
                    setUseGradient(e.target.checked);
                    updateGradient(gradientColor1, gradientColor2, gradientType, e.target.checked);
                  }}
                  className="mr-1"
                />
                Use Gradient
              </label>
            </div>

            {!useGradient ? (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={gradientColor1}
                  onChange={(e) => {
                    setGradientColor1(e.target.value);
                    setDotsOptions({ color: e.target.value, gradient: undefined });
                    setCornersSquareOptions({ color: e.target.value });
                    setCornersDotOptions({ color: e.target.value });
                  }}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm font-mono text-gray-600">{gradientColor1}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input type="color" value={gradientColor1} onChange={(e) => { setGradientColor1(e.target.value); updateGradient(e.target.value, gradientColor2, gradientType, true); }} className="w-8 h-8 p-0 cursor-pointer" />
                  <input type="color" value={gradientColor2} onChange={(e) => { setGradientColor2(e.target.value); updateGradient(gradientColor1, e.target.value, gradientType, true); }} className="w-8 h-8 p-0 cursor-pointer" />
                  <select
                    value={gradientType}
                    onChange={(e) => { setGradientType(e.target.value as any); updateGradient(gradientColor1, gradientColor2, e.target.value as any, true); }}
                    className="text-sm border rounded px-1"
                  >
                    <option value="linear">Linear</option>
                    <option value="radial">Radial</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Background Color</label>
              <label className="flex items-center text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.backgroundOptions?.color === 'transparent'}
                  onChange={(e) => setBackgroundOptions({ color: e.target.checked ? 'transparent' : '#ffffff' })}
                  className="mr-1"
                />
                Transparent
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={options.backgroundOptions?.color === 'transparent' ? '#ffffff' : (options.backgroundOptions?.color || '#ffffff')}
                onChange={(e) => setBackgroundOptions({ color: e.target.value })}
                disabled={options.backgroundOptions?.color === 'transparent'}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0 disabled:opacity-50"
              />
              <span className="text-sm font-mono text-gray-600">
                {options.backgroundOptions?.color === 'transparent' ? 'Transparent' : (options.backgroundOptions?.color || '#ffffff')}
              </span>
            </div>
          </div>
        </div>

        {/* Shape Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pattern Style</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={options.dotsOptions?.type || 'square'}
              onChange={(e) => setDotsOptions({ type: e.target.value as any })}
            >
              <option value="square">Square</option>
              <option value="dots">Dots</option>
              <option value="rounded">Rounded</option>
              <option value="extra-rounded">Extra Rounded</option>
              <option value="classy">Classy</option>
              <option value="classy-rounded">Classy Rounded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Corner Square Style</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={options.cornersSquareOptions?.type || 'square'}
              onChange={(e) => setCornersSquareOptions({ type: e.target.value as any })}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
              <option value="extra-rounded">Extra Rounded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Corner Dot Style</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={options.cornersDotOptions?.type || 'square'}
              onChange={(e) => setCornersDotOptions({ type: e.target.value as any })}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
            </select>
          </div>
        </div>

        {/* Add Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Add Logo (Image URL)</label>
          <input
            type="text"
            placeholder="https://example.com/logo.png"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={() => setImageOptions({ crossOrigin: "anonymous" })}
            onBlur={(e) => {
                const val = e.target.value;
                if(val) {
                    useQrStore.getState().setOptions({ image: val } as any);
                } else {
                    useQrStore.getState().setOptions({ image: undefined } as any);
                }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">Paste a direct URL to an image (PNG/JPG) to add it to the center of your QR code.</p>
        </div>
      </div>
    </div>
  );
};
