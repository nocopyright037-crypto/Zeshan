
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { LineItem, Customer, Receipt, ReceiptStatus, PaymentMethod, PressSettings } from '../types';
import { getJobSuggestions } from '../services/geminiService';

interface ReceiptFormProps {
  onSave: (receipt: Receipt) => void;
  settings: PressSettings;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ onSave, settings }) => {
  const navigate = useNavigate();
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [customer, setCustomer] = useState<Customer>({
    name: '', phone: '', email: '', address: ''
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: uuidv4(), description: '', specs: '', quantity: 1, rate: 0, total: 0 }
  ]);

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [advancePayment, setAdvancePayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [notes, setNotes] = useState('');

  const handleAddItem = (suggested?: Partial<LineItem>) => {
    setItems([...items, {
      id: uuidv4(),
      description: suggested?.description || '',
      specs: suggested?.specs || '',
      quantity: suggested?.quantity || 1,
      rate: suggested?.rate || 0,
      total: (suggested?.quantity || 1) * (suggested?.rate || 0)
    }]);
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.total = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleAISuggest = async () => {
    if (!aiPrompt) return;
    setLoadingAI(true);
    const suggestions = await getJobSuggestions(aiPrompt);
    if (suggestions.length > 0) {
      const first = suggestions[0];
      handleAddItem({
        description: first.description,
        specs: first.suggestedSpecs,
        rate: first.suggestedRate
      });
    }
    setLoadingAI(false);
    setAiPrompt('');
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal - discount) * (taxRate / 100);
  const total = subtotal - discount + tax;
  const remainingBalance = total - advancePayment;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceipt: Receipt = {
      id: uuidv4(),
      receiptNumber: `ZG-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customer,
      items,
      subtotal,
      tax,
      discount,
      total,
      advancePayment,
      remainingBalance,
      paymentMethod,
      status: remainingBalance <= 0 ? ReceiptStatus.PAID : (advancePayment > 0 ? ReceiptStatus.PARTIAL : ReceiptStatus.PENDING),
      notes
    };
    onSave(newReceipt);
    navigate(`/view/${newReceipt.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">نئی رسید بنائیں</h2>
      </div>

      <div className="bg-blue-600 rounded-xl p-4 md:p-6 text-white shadow-lg border-b-4 border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-magic"></i>
          <h3 className="font-bold text-lg">AI ہیلپر (آٹو ریٹ)</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 outline-none text-sm"
            placeholder="مثال: 1000 فلائر اے 5 سائز..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <button
            onClick={handleAISuggest}
            disabled={loadingAI}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-black hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 text-sm"
          >
            {loadingAI ? 'سوچ رہا ہے...' : 'تجویز حاصل کریں'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        {/* Customer Information */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 border-b pb-2 text-slate-700">گاہک کی تفصیلات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">گاہک کا نام</label>
              <input
                required
                className="w-full border-2 border-slate-100 rounded-lg px-3 py-3 focus:border-blue-500 outline-none transition-all"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">فون نمبر</label>
              <input
                className="w-full border-2 border-slate-100 rounded-lg px-3 py-3 focus:border-blue-500 outline-none transition-all"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold border-b pb-2 flex-1 text-slate-700">آرڈر کی تفصیل</h3>
            <button
              type="button"
              onClick={() => handleAddItem()}
              className="text-blue-600 text-xs font-black flex items-center gap-1 hover:bg-blue-50 p-2 rounded"
            >
              <i className="fas fa-plus-circle"></i> مزید آئٹم
            </button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 space-y-3 relative">
                <button type="button" onClick={() => handleRemoveItem(item.id)} className="absolute top-2 left-2 text-red-400 p-2">
                   <i className="fas fa-times"></i>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">کام کی تفصیل</label>
                    <input
                      required
                      placeholder="مثلاً وزٹنگ کارڈ"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">سائز / پیپر</label>
                    <input
                      placeholder="مثلاً 3.5x2 میٹ"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={item.specs}
                      onChange={(e) => handleItemChange(item.id, 'specs', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:col-span-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">تعداد</label>
                      <input
                        type="number"
                        className="w-full border rounded-lg px-2 py-2 text-sm text-center"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">ریٹ</label>
                      <input
                        type="number"
                        className="w-full border rounded-lg px-2 py-2 text-sm text-center"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">کل</label>
                      <div className="h-9 flex items-center justify-center font-black text-sm text-slate-700">
                        {item.total.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payments and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold mb-2 border-b pb-2 text-slate-700">ادائیگی کی معلومات</h3>
            <div className="grid grid-cols-2 gap-3">
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">ادائیگی کا طریقہ</label>
                  <select
                    className="w-full border-2 border-slate-100 rounded-lg px-3 py-3 outline-none"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="Cash">نقد (Cash)</option>
                    <option value="EasyPaisa">ایزی پیسہ</option>
                    <option value="JazzCash">جاز کیش</option>
                    <option value="Bank Transfer">بینک ٹرانسفر</option>
                  </select>
               </div>
               <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">ایڈوانس وصولی</label>
                  <input
                    type="number"
                    className="w-full border-2 border-blue-100 rounded-lg px-3 py-3 focus:border-blue-500 outline-none text-xl font-black text-blue-600"
                    value={advancePayment}
                    onChange={(e) => setAdvancePayment(parseFloat(e.target.value) || 0)}
                  />
               </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg flex justify-between items-center border border-red-100">
              <span className="text-sm font-black text-red-700 uppercase tracking-widest">بقایا رقم (Remains)</span>
              <span className="text-2xl font-black text-red-700">
                {remainingBalance.toFixed(0)}
              </span>
            </div>
          </section>

          <section className="bg-slate-900 text-white p-4 md:p-6 rounded-xl shadow-xl space-y-3">
            <h3 className="text-lg font-bold mb-2 border-b border-white/10 pb-2">بل کی کل تفصیل</h3>
            <div className="flex justify-between items-center opacity-70">
              <span className="text-sm">ٹوٹل رقم</span>
              <span className="font-bold">{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center opacity-70">
              <span className="text-sm">رعایت (Discount)</span>
              <input
                type="number"
                className="w-20 bg-white/10 border border-white/20 rounded px-2 py-1 text-right text-white"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <span className="text-xl font-black text-blue-400">صاف رقم (Net Total)</span>
              <span className="text-4xl font-black text-blue-400">{total.toFixed(0)}</span>
            </div>
            <p className="text-[10px] text-white/40 text-center pt-4 italic">برائے مہربانی پرنٹنگ سے پہلے پروف چیک کر لیں۔</p>
          </section>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="px-6 py-4 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-all"
          >
            واپس جائیں
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-12 py-4 rounded-xl font-black hover:bg-blue-700 shadow-2xl shadow-blue-900/40 transition-all text-lg active:scale-95"
          >
            رسید تیار کریں
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceiptForm;
