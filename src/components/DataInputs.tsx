import React, { useState, useEffect, useRef } from 'react';
import { useQrStore } from '../store/useQrStore';
import type { QrDataTypes } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Upload, Type, Link, Wifi, User, Mail, MapPin, Phone, MessageSquare, Calendar, Layers } from 'lucide-react';

const InputWrapper = ({ children, label }: { children: React.ReactNode, label: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
        {children}
    </div>
);

export const DataInputs: React.FC = () => {
  const [dataType, setDataType] = useState<QrDataTypes>('text');
  const setOptions = useQrStore((state) => state.setOptions);
  const setBatchData = useQrStore((state) => state.setBatchData);

  // States
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
        setBatchText(prev => prev ? `${prev}\n${content}` : content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const types: { id: QrDataTypes; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: 'Link', icon: <Link className="w-4 h-4" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: 'vCard', icon: <User className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'batch', label: 'Batch', icon: <Layers className="w-4 h-4" /> },
  ];

  const defaultInputClass = "w-full p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm";

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">QR Code Content</h2>

      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
        {types.map(({id, label, icon}) => (
          <button
            key={id}
            onClick={() => handleDataTypeChange(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
              dataType === id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-800'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-5 animate-in fade-in duration-300">
        {/* Existing Forms */}
        {(dataType === 'text' || dataType === 'url') && (
          <InputWrapper label={dataType === 'url' ? 'URL Link' : 'Text Content'}>
            <textarea
              className={`${defaultInputClass} min-h-[120px] resize-y`}
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              placeholder={dataType === 'url' ? 'https://example.com' : 'Enter your text here...'}
            />
          </InputWrapper>
        )}

        {dataType === 'batch' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Batch Upload
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
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-600 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-500 font-medium rounded-md transition-colors border border-gray-200 dark:border-gray-500 shadow-sm"
                >
                    <Upload className="w-4 h-4" />
                    Upload CSV/TXT
                </button>
              </div>
            </div>

            <InputWrapper label="Manual Entry (One per line)">
                <textarea
                className={`${defaultInputClass} min-h-[200px] resize-y font-mono text-sm`}
                value={batchText}
                onChange={(e) => setBatchText(e.target.value)}
                placeholder="https://example.com/item1&#10;https://example.com/item2&#10;https://example.com/item3"
                />
            </InputWrapper>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter multiple lines of text or URLs, or upload a CSV/TXT file. Each line will generate a separate QR code.
            </p>
          </div>
        )}

        {dataType === 'wifi' && (
          <div className="space-y-4">
            <InputWrapper label="Network Name (SSID)">
              <input type="text" className={defaultInputClass} value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} />
            </InputWrapper>
            <InputWrapper label="Password">
              <input type="password" className={defaultInputClass} value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} />
            </InputWrapper>
            <div className="flex gap-4">
              <div className="flex-1">
                <InputWrapper label="Encryption">
                    <select className={defaultInputClass} value={wifiEncryption} onChange={(e) => setWifiEncryption(e.target.value)}>
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                    </select>
                </InputWrapper>
              </div>
              <div className="flex items-center mt-7">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                  />
                  Hidden Network
                </label>
              </div>
            </div>
          </div>
        )}

        {dataType === 'vcard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWrapper label="First Name"><input type="text" className={defaultInputClass} value={vcardFirstName} onChange={(e) => setVcardFirstName(e.target.value)} /></InputWrapper>
            <InputWrapper label="Last Name"><input type="text" className={defaultInputClass} value={vcardLastName} onChange={(e) => setVcardLastName(e.target.value)} /></InputWrapper>
            <InputWrapper label="Phone"><input type="tel" className={defaultInputClass} value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} /></InputWrapper>
            <InputWrapper label="Email"><input type="email" className={defaultInputClass} value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} /></InputWrapper>
            <div className="md:col-span-2">
                <InputWrapper label="Organization / Company"><input type="text" className={defaultInputClass} value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} /></InputWrapper>
            </div>
          </div>
        )}

        {dataType === 'email' && (
          <div className="space-y-4">
            <InputWrapper label="To (Email Address)"><input type="email" className={defaultInputClass} value={emailTo} onChange={(e) => setEmailTo(e.target.value)} /></InputWrapper>
            <InputWrapper label="Subject"><input type="text" className={defaultInputClass} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} /></InputWrapper>
            <InputWrapper label="Message Body"><textarea className={`${defaultInputClass} min-h-[120px]`} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} /></InputWrapper>
          </div>
        )}

        {dataType === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWrapper label="Latitude"><input type="text" className={defaultInputClass} placeholder="e.g. 40.7128" value={locLat} onChange={(e) => setLocLat(e.target.value)} /></InputWrapper>
            <InputWrapper label="Longitude"><input type="text" className={defaultInputClass} placeholder="e.g. -74.0060" value={locLng} onChange={(e) => setLocLng(e.target.value)} /></InputWrapper>
            <div className="md:col-span-2 text-sm text-gray-500 dark:text-gray-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p>Hint: You can find latitude and longitude on Google Maps by right-clicking a location.</p>
            </div>
          </div>
        )}

        {dataType === 'phone' && (
          <InputWrapper label="Phone Number"><input type="tel" className={defaultInputClass} placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} /></InputWrapper>
        )}

        {dataType === 'sms' && (
          <div className="space-y-4">
            <InputWrapper label="Phone Number"><input type="tel" className={defaultInputClass} placeholder="+1234567890" value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)} /></InputWrapper>
            <InputWrapper label="Message"><textarea className={`${defaultInputClass} min-h-[100px]`} placeholder="Hello!" value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} /></InputWrapper>
          </div>
        )}

        {dataType === 'whatsapp' && (
          <div className="space-y-4">
            <InputWrapper label="WhatsApp Number (with country code)"><input type="tel" className={defaultInputClass} placeholder="1234567890" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} /></InputWrapper>
            <InputWrapper label="Pre-filled Message"><textarea className={`${defaultInputClass} min-h-[100px]`} placeholder="I'm interested in..." value={waMessage} onChange={(e) => setWaMessage(e.target.value)} /></InputWrapper>
          </div>
        )}

        {dataType === 'calendar' && (
          <div className="space-y-4">
            <InputWrapper label="Event Title"><input type="text" className={defaultInputClass} value={calEvent} onChange={(e) => setCalEvent(e.target.value)} /></InputWrapper>
            <InputWrapper label="Location"><input type="text" className={defaultInputClass} value={calLocation} onChange={(e) => setCalLocation(e.target.value)} /></InputWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWrapper label="Start Time"><input type="datetime-local" className={defaultInputClass} value={calStart} onChange={(e) => setCalStart(e.target.value)} /></InputWrapper>
              <InputWrapper label="End Time"><input type="datetime-local" className={defaultInputClass} value={calEnd} onChange={(e) => setCalEnd(e.target.value)} /></InputWrapper>
            </div>
            <InputWrapper label="Notes / Description"><textarea className={`${defaultInputClass} min-h-[100px]`} value={calNotes} onChange={(e) => setCalNotes(e.target.value)} /></InputWrapper>
          </div>
        )}
      </div>
    </div>
  );
};
