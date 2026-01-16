
export interface LineItem {
  id: string;
  description: string;
  specs: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export enum ReceiptStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  PARTIAL = 'Partial',
  CANCELLED = 'Cancelled'
}

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Card' | 'Cheque';

export interface PressSettings {
  name: string;
  tagline: string;
  address: string;
  contact: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  customer: Customer;
  items: LineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  advancePayment: number;
  remainingBalance: number;
  paymentMethod: PaymentMethod;
  status: ReceiptStatus;
  notes: string;
  settingsSnapshot?: PressSettings; // Store snapshot of settings at time of creation
}

export interface AIJobSuggestion {
  description: string;
  suggestedSpecs: string;
  suggestedRate: number;
}
