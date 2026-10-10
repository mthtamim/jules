import React, { useState, useEffect, useRef } from 'react';
import { useQrStore } from '../store/useQrStore';
import { Upload } from 'lucide-react';

const PRESET_LOGOS = [
  'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
  'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
  'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
  'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
];

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
  const [customLogoUrl, setCustomLogoUrl] = useState('');

  const logoInputRef = useRef<HTMLInputElement>(null);

  // Synchronize local state with global store when options change (e.g., from History Restore)
  useEffect(() => {
      const hasGradientFromStore = !!options.dotsOptions?.gradient;
      setUseGradient(hasGradientFromStore);
      if (hasGradientFromStore) {
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setOptions({ image: result });
        setImageOptions({ crossOrigin: "anonymous" });
        setCustomLogoUrl(''); // Clear url input
      };
      reader.readAsDataURL(file);
    }
    if (logoInputRef.current) {
        logoInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mt-6 transition-colors duration-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Design Customization</h2>

      <div className="space-y-6">
        {/* Size & Margin & Error Correction Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Margin ({options.margin}px)
            </label>
            <input
              type="range"
              min="0" max="100" step="1"
              value={options.margin}
              onChange={(e) => setOptions({ margin: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Correction
            </label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">QR Code Color</label>
              <label className="flex items-center text-xs cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <input
                  type="checkbox"
                  checked={useGradient}
                  onChange={(e) => {
                    setUseGradient(e.target.checked);
                    updateGradient(gradientColor1, gradientColor2, gradientType, e.target.checked);
                  }}
                  className="mr-1.5 rounded text-blue-600 focus:ring-blue-500 bg-gray-100 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
                />
                Use Gradient
              </label>
            </div>

            {!useGradient ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                    type="color"
                    value={gradientColor1}
                    onChange={(e) => {
                        setGradientColor1(e.target.value);
                        setDotsOptions({ color: e.target.value, gradient: undefined });
                        setCornersSquareOptions({ color: e.target.value });
                        setCornersDotOptions({ color: e.target.value });
                    }}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0 shadow-sm"
                    />
                </div>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase">{gradientColor1}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input type="color" value={gradientColor1} onChange={(e) => { setGradientColor1(e.target.value); updateGradient(e.target.value, gradientColor2, gradientType, true); }} className="w-8 h-8 p-0 cursor-pointer shadow-sm rounded border-0" />
                  <input type="color" value={gradientColor2} onChange={(e) => { setGradientColor2(e.target.value); updateGradient(gradientColor1, e.target.value, gradientType, true); }} className="w-8 h-8 p-0 cursor-pointer shadow-sm rounded border-0" />
                  <select
                    value={gradientType}
                    onChange={(e) => { setGradientType(e.target.value as any); updateGradient(gradientColor1, gradientColor2, e.target.value as any, true); }}
                    className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 shadow-sm transition-colors"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Background Color</label>
              <label className="flex items-center text-xs cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <input
                  type="checkbox"
                  checked={options.backgroundOptions?.color === 'transparent'}
                  onChange={(e) => setBackgroundOptions({ color: e.target.checked ? 'transparent' : '#ffffff' })}
                  className="mr-1.5 rounded text-blue-600 focus:ring-blue-500 bg-gray-100 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600"
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
                className="w-10 h-10 rounded cursor-pointer border-0 p-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase">
                {options.backgroundOptions?.color === 'transparent' ? 'Transparent' : (options.backgroundOptions?.color || '#ffffff')}
              </span>
            </div>
          </div>
        </div>

        {/* Shape Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pattern Style</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corner Square Style</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
              value={options.cornersSquareOptions?.type || 'square'}
              onChange={(e) => setCornersSquareOptions({ type: e.target.value as any })}
            >
              <option value="square">Square</option>
              <option value="dot">Dot</option>
              <option value="extra-rounded">Extra Rounded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Corner Dot Style</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Add Logo</label>
            <div className="flex gap-2 items-center">
               <button
                  onClick={() => {
                      setOptions({ image: undefined });
                      setCustomLogoUrl('');
                  }}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
               >
                   Remove Logo
               </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
             <input
                type="text"
                placeholder="https://example.com/logo.png"
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                onBlur={(e) => {
                    const val = e.target.value;
                    if(val) {
                        setImageOptions({ crossOrigin: "anonymous" });
                        setOptions({ image: val } as any);
                    }
                }}
              />
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">OR</span>
              <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="hidden"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
              />
              <button
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-gray-600"
              >
                  <Upload className="w-4 h-4" />
                  Upload
              </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
             {PRESET_LOGOS.map((logo, idx) => (
                 <button
                    key={idx}
                    onClick={() => {
                        setImageOptions({ crossOrigin: "anonymous" });
                        setOptions({ image: logo });
                        setCustomLogoUrl('');
                    }}
                    className="w-10 h-10 border border-gray-200 dark:border-gray-600 rounded p-1 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all bg-white flex items-center justify-center"
                 >
                     <img src={logo} alt="preset logo" className="max-w-full max-h-full object-contain" />
                 </button>
             ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Paste a URL, upload an image from your device, or select a preset to center it in your QR code.</p>
        </div>
      </div>
    </div>
  );
};
