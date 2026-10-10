import type { Options } from 'qr-code-styling';

export type QrDataTypes = 'text' | 'url' | 'wifi' | 'vcard' | 'email' | 'location' | 'phone' | 'sms' | 'whatsapp' | 'calendar' | 'batch';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QrCodeOptions = Options;
