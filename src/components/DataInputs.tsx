import React, { useState } from 'react';
import { useQrStore } from '../store/useQrStore';
import type { QrDataTypes } from '../types';

export const DataInputs: React.FC = () => {
  const [dataType, setDataType] = useState<QrDataTypes>('text');
  const setOptions = useQrStore((state) => state.setOptions);
  const setBatchData = useQrStore((state) => state.setBatchData);

  // WiFi State
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard State
  const [vcardFirstName, setVcardFirstName] = useState('');
  const [vcardLastName, setVcardLastName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');

  // Email State
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Location State
  const [locLat, setLocLat] = useState('');
  const [locLng, setLocLng] = useState('');

  // Text/URL State
  const [textData, setTextData] = useState('https://pressmark.app');

  // Batch State
  const [batchText, setBatchText] = useState('');

  const updateQrData = (data: string) => {
    setOptions({ data });
  };

  const handleDataTypeChange = (type: QrDataTypes) => {
    setDataType(type);
    // Reset or generate default string for the new type
    switch (type) {
      case 'text':
      case 'url':
        updateQrData(textData);
        setBatchData([]);
        break;
      case 'wifi':
        generateWifiString();
        setBatchData([]);
        break;
      case 'vcard':
        generateVCardString();
        setBatchData([]);
        break;
      case 'email':
        generateEmailString();
        setBatchData([]);
        break;
      case 'location':
        generateLocationString();
        setBatchData([]);
        break;
      case 'batch':
        updateBatchData(batchText);
        break;
    }
  };

  const generateWifiString = () => {
    const hidden = wifiHidden ? 'H:true;' : '';
    const str = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};${hidden};`;
    updateQrData(str);
  };

  const generateVCardString = () => {
    const str = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLastName};${vcardFirstName}\nFN:${vcardFirstName} ${vcardLastName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
    updateQrData(str);
  };

  const generateEmailString = () => {
    const str = `MATMSG:TO:${emailTo};SUB:${emailSubject};BODY:${emailBody};;`;
    updateQrData(str);
  };

  const generateLocationString = () => {
    const str = `geo:${locLat},${locLng}`;
    updateQrData(str);
  };

  const updateBatchData = (text: string) => {
    setBatchText(text);
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    setBatchData(lines);
    if (lines.length > 0) {
      updateQrData(lines[0]); // Preview the first item in batch
    } else {
      updateQrData('https://pressmark.app');
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">QR Code Content</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {['text', 'url', 'wifi', 'vcard', 'email', 'location', 'batch'].map((type) => (
          <button
            key={type}
            onClick={() => handleDataTypeChange(type as QrDataTypes)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              dataType === type
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(dataType === 'text' || dataType === 'url') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dataType === 'url' ? 'URL Link' : 'Text Content'}
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              value={textData}
              onChange={(e) => {
                setTextData(e.target.value);
                updateQrData(e.target.value);
              }}
              placeholder={dataType === 'url' ? 'https://example.com' : 'Enter your text here...'}
            />
          </div>
        )}

        {dataType === 'batch' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Processing (One per line)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
              value={batchText}
              onChange={(e) => updateBatchData(e.target.value)}
              placeholder="https://example.com/item1&#10;https://example.com/item2&#10;https://example.com/item3"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter multiple lines of text or URLs. Each line will generate a separate QR code. You can download all as a ZIP file.
            </p>
          </div>
        )}

        {dataType === 'wifi' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={wifiSsid}
                onChange={(e) => { setWifiSsid(e.target.value); generateWifiString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={wifiPassword}
                onChange={(e) => { setWifiPassword(e.target.value); generateWifiString(); }}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={wifiEncryption}
                  onChange={(e) => { setWifiEncryption(e.target.value); generateWifiString(); }}
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="hidden-wifi"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={wifiHidden}
                  onChange={(e) => { setWifiHidden(e.target.checked); generateWifiString(); }}
                />
                <label htmlFor="hidden-wifi" className="ml-2 text-sm text-gray-700">Hidden Network</label>
              </div>
            </div>
          </div>
        )}

        {dataType === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardFirstName}
                onChange={(e) => { setVcardFirstName(e.target.value); generateVCardString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardLastName}
                onChange={(e) => { setVcardLastName(e.target.value); generateVCardString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardPhone}
                onChange={(e) => { setVcardPhone(e.target.value); generateVCardString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardEmail}
                onChange={(e) => { setVcardEmail(e.target.value); generateVCardString(); }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Company</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardOrg}
                onChange={(e) => { setVcardOrg(e.target.value); generateVCardString(); }}
              />
            </div>
          </div>
        )}

        {dataType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To (Email Address)</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={emailTo}
                onChange={(e) => { setEmailTo(e.target.value); generateEmailString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={emailSubject}
                onChange={(e) => { setEmailSubject(e.target.value); generateEmailString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={emailBody}
                onChange={(e) => { setEmailBody(e.target.value); generateEmailString(); }}
              />
            </div>
          </div>
        )}

        {dataType === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 40.7128"
                value={locLat}
                onChange={(e) => { setLocLat(e.target.value); generateLocationString(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. -74.0060"
                value={locLng}
                onChange={(e) => { setLocLng(e.target.value); generateLocationString(); }}
              />
            </div>
            <div className="md:col-span-2 text-sm text-gray-500 mt-2">
              <p>Hint: You can find latitude and longitude on Google Maps by right-clicking a location.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
