import React, { useState, useEffect, useRef } from 'react';
import { useQrStore } from '../store/useQrStore';
import type { QrDataTypes } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Upload } from 'lucide-react';

export const DataInputs: React.FC = () => {
  const [dataType, setDataType] = useState<QrDataTypes>('text');
  const setOptions = useQrStore((state) => state.setOptions);
  const setBatchData = useQrStore((state) => state.setBatchData);

  // Existing States...
  const [textData, setTextData] = useState('https://pressmark.app');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vcardFirstName, setVcardFirstName] = useState('');
  const [vcardLastName, setVcardLastName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [locLat, setLocLat] = useState('');
  const [locLng, setLocLng] = useState('');
  const [batchText, setBatchText] = useState('');

  // New States
  const [phone, setPhone] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [calEvent, setCalEvent] = useState('');
  const [calLocation, setCalLocation] = useState('');
  const [calStart, setCalStart] = useState('');
  const [calEnd, setCalEnd] = useState('');
  const [calNotes, setCalNotes] = useState('');

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounces
  const debouncedTextData = useDebounce(textData, 300);
  const debouncedWifiSsid = useDebounce(wifiSsid, 300);
  const debouncedWifiPassword = useDebounce(wifiPassword, 300);
  const debouncedWifiEncryption = useDebounce(wifiEncryption, 300);
  const debouncedWifiHidden = useDebounce(wifiHidden, 300);
  const debouncedVcardFirstName = useDebounce(vcardFirstName, 300);
  const debouncedVcardLastName = useDebounce(vcardLastName, 300);
  const debouncedVcardPhone = useDebounce(vcardPhone, 300);
  const debouncedVcardEmail = useDebounce(vcardEmail, 300);
  const debouncedVcardOrg = useDebounce(vcardOrg, 300);
  const debouncedEmailTo = useDebounce(emailTo, 300);
  const debouncedEmailSubject = useDebounce(emailSubject, 300);
  const debouncedEmailBody = useDebounce(emailBody, 300);
  const debouncedLocLat = useDebounce(locLat, 300);
  const debouncedLocLng = useDebounce(locLng, 300);
  const debouncedBatchText = useDebounce(batchText, 500);

  const debouncedPhone = useDebounce(phone, 300);
  const debouncedSmsPhone = useDebounce(smsPhone, 300);
  const debouncedSmsMessage = useDebounce(smsMessage, 300);
  const debouncedWaPhone = useDebounce(waPhone, 300);
  const debouncedWaMessage = useDebounce(waMessage, 300);
  const debouncedCalEvent = useDebounce(calEvent, 300);
  const debouncedCalLocation = useDebounce(calLocation, 300);
  const debouncedCalStart = useDebounce(calStart, 300);
  const debouncedCalEnd = useDebounce(calEnd, 300);
  const debouncedCalNotes = useDebounce(calNotes, 300);

  // Effects
  useEffect(() => {
    if (dataType === 'text' || dataType === 'url') {
      setOptions({ data: debouncedTextData });
    }
  }, [debouncedTextData, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'wifi') {
      const hidden = debouncedWifiHidden ? 'H:true;' : '';
      const str = `WIFI:T:${debouncedWifiEncryption};S:${debouncedWifiSsid};P:${debouncedWifiPassword};${hidden};`;
      setOptions({ data: str });
    }
  }, [debouncedWifiSsid, debouncedWifiPassword, debouncedWifiEncryption, debouncedWifiHidden, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'vcard') {
      const str = `BEGIN:VCARD\nVERSION:3.0\nN:${debouncedVcardLastName};${debouncedVcardFirstName}\nFN:${debouncedVcardFirstName} ${debouncedVcardLastName}\nORG:${debouncedVcardOrg}\nTEL:${debouncedVcardPhone}\nEMAIL:${debouncedVcardEmail}\nEND:VCARD`;
      setOptions({ data: str });
    }
  }, [debouncedVcardFirstName, debouncedVcardLastName, debouncedVcardPhone, debouncedVcardEmail, debouncedVcardOrg, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'email') {
      const str = `MATMSG:TO:${debouncedEmailTo};SUB:${debouncedEmailSubject};BODY:${debouncedEmailBody};;`;
      setOptions({ data: str });
    }
  }, [debouncedEmailTo, debouncedEmailSubject, debouncedEmailBody, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'location') {
      const str = `geo:${debouncedLocLat},${debouncedLocLng}`;
      setOptions({ data: str });
    }
  }, [debouncedLocLat, debouncedLocLng, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'batch') {
      const lines = debouncedBatchText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      setBatchData(lines);
      if (lines.length > 0) {
        setOptions({ data: lines[0] });
      } else {
        setOptions({ data: 'https://pressmark.app' });
      }
    }
  }, [debouncedBatchText, dataType, setOptions, setBatchData]);

  useEffect(() => {
    if (dataType === 'phone') {
      setOptions({ data: `tel:${debouncedPhone}` });
    }
  }, [debouncedPhone, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'sms') {
      setOptions({ data: `smsto:${debouncedSmsPhone}:${debouncedSmsMessage}` });
    }
  }, [debouncedSmsPhone, debouncedSmsMessage, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'whatsapp') {
      const url = `https://wa.me/${debouncedWaPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(debouncedWaMessage)}`;
      setOptions({ data: url });
    }
  }, [debouncedWaPhone, debouncedWaMessage, dataType, setOptions]);

  useEffect(() => {
    if (dataType === 'calendar') {
      const formatTime = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
      };
      const start = formatTime(debouncedCalStart);
      const end = formatTime(debouncedCalEnd);
      const str = `BEGIN:VEVENT\nSUMMARY:${debouncedCalEvent}\nLOCATION:${debouncedCalLocation}\nDESCRIPTION:${debouncedCalNotes}\nDTSTART:${start}\nDTEND:${end}\nEND:VEVENT`;
      setOptions({ data: str });
    }
  }, [debouncedCalEvent, debouncedCalLocation, debouncedCalStart, debouncedCalEnd, debouncedCalNotes, dataType, setOptions]);


  const handleDataTypeChange = (type: QrDataTypes) => {
    setDataType(type);
    setBatchData([]);
    if(type === 'text' || type === 'url') setOptions({ data: textData });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Just append to the existing batch text or replace if empty
        setBatchText(prev => prev ? `${prev}\n${content}` : content);
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const types: QrDataTypes[] = ['text', 'url', 'wifi', 'vcard', 'email', 'location', 'phone', 'sms', 'whatsapp', 'calendar', 'batch'];

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-gray-800">QR Code Content</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => handleDataTypeChange(type)}
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
        {/* Existing Forms */}
        {(dataType === 'text' || dataType === 'url') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dataType === 'url' ? 'URL Link' : 'Text Content'}
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder={dataType === 'url' ? 'https://example.com' : 'Enter your text here...'}
            />
          </div>
        )}

        {dataType === 'batch' && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Batch Processing (One per line)
              </label>
              <div>
                <input
                    type="file"
                    accept=".txt,.csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                    <Upload className="w-3 h-3" />
                    Upload CSV/TXT
                </button>
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="https://example.com/item1&#10;https://example.com/item2&#10;https://example.com/item3"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter multiple lines of text or URLs, or upload a CSV/TXT file. Each line will generate a separate QR code. You can download all as a ZIP file.
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
                onChange={(e) => setWifiSsid(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={wifiEncryption}
                  onChange={(e) => setWifiEncryption(e.target.value)}
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
                  onChange={(e) => setWifiHidden(e.target.checked)}
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
                onChange={(e) => setVcardFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardLastName}
                onChange={(e) => setVcardLastName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardEmail}
                onChange={(e) => setVcardEmail(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Company</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={vcardOrg}
                onChange={(e) => setVcardOrg(e.target.value)}
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
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Body</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
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
                onChange={(e) => setLocLat(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. -74.0060"
                value={locLng}
                onChange={(e) => setLocLng(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 text-sm text-gray-500 mt-2">
              <p>Hint: You can find latitude and longitude on Google Maps by right-clicking a location.</p>
            </div>
          </div>
        )}

        {/* New Forms */}
        {dataType === 'phone' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}

        {dataType === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Hello!"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
              />
            </div>
          </div>
        )}

        {dataType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (with country code)</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1234567890"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pre-filled Message</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="I'm interested in..."
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
              />
            </div>
          </div>
        )}

        {dataType === 'calendar' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={calEvent}
                onChange={(e) => setCalEvent(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={calLocation}
                onChange={(e) => setCalLocation(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={calStart}
                  onChange={(e) => setCalStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={calEnd}
                  onChange={(e) => setCalEnd(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={calNotes}
                onChange={(e) => setCalNotes(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
