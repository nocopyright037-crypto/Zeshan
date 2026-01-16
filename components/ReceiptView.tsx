
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Receipt, PressSettings } from '../types';

interface ReceiptViewProps {
  receipts: Receipt[];
  currentSettings: PressSettings;
}

const ReceiptView: React.FC<ReceiptViewProps> = ({ receipts, currentSettings }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const receipt = receipts.find(r => r.id === id);

  if (!receipt) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">رسید نہیں ملی۔</p>
        <button onClick={() => navigate('/history')} className="text-blue-600 font-bold mt-4 underline">تاریخچہ میں جائیں</button>
      </div>
    );
  }

  // Use the snapshot from the receipt if available, otherwise fallback to current app settings
  const press = receipt.settingsSnapshot || currentSettings;
  const pressNameArr = press.name.trim().split(' ');
  const firstWord = pressNameArr[0];
  const otherWords = pressNameArr.slice(1).join(' ');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6 no-print">
        <button onClick={() => navigate('/history')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-bold">
          <i className="fas fa-arrow-right"></i> واپس جائیں
        </button>
        <div className="flex gap-2">
            <button
                onClick={handlePrint}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black hover:bg-slate-800 flex items-center gap-2 shadow-xl"
            >
                <i className="fas fa-print"></i> پرنٹ نکالیں
            </button>
        </div>
      </div>

      {/* The Actual Professional Receipt Template */}
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-slate-200 min-h-[1056px] flex flex-col print:shadow-none print:border-none print:p-0 relative overflow-hidden">
        
        {/* Branding Area */}
        <div className="flex justify-between items-start border-b-8 border-double border-slate-900 pb-8 mb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none mb-2 bombay-font">
              {firstWord} <span className="text-blue-600">{otherWords}</span>
            </h1>
            <p className="text-slate-600 font-black text-sm uppercase tracking-widest">
              {press.tagline}
            </p>
            <div className="mt-6 text-xs text-slate-700 space-y-2 font-bold">
              <p><i className="fas fa-map-marker-alt w-5 text-blue-500"></i> {press.address}</p>
              <p><i className="fas fa-phone w-5 text-blue-500"></i> {press.contact}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-slate-900 text-white px-6 py-2 inline-block mb-4 rounded-s-full">
                <h2 className="text-xl font-black uppercase tracking-tighter bombay-font">جاب رسید</h2>
            </div>
            <div className="space-y-2 mt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">رسید نمبر</p>
              <p className="text-2xl font-mono font-black text-blue-600 leading-none">{receipt.receiptNumber}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">تاریخ</p>
              <p className="font-black text-slate-800 leading-none text-lg">{new Date(receipt.date).toLocaleDateString('ur-PK')}</p>
            </div>
          </div>
        </div>

        {/* Client Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b-2 border-slate-200 pb-1 w-fit">نام گاہک</h3>
            <p className="text-3xl font-black text-slate-900">{receipt.customer.name}</p>
            <p className="text-slate-600 font-bold mt-2 text-lg leading-none">{receipt.customer.phone}</p>
          </div>
          <div className="sm:text-left flex flex-col sm:items-end justify-center">
             <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-slate-200 inline-block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">طریقہ ادائیگی</p>
                <p className="text-xl font-black text-slate-800 uppercase tracking-tight">{receipt.paymentMethod}</p>
             </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-slate-900 text-white text-right text-xs font-black uppercase tracking-wider">
                <th className="px-4 py-4 rounded-tr-lg">نمبر شمار</th>
                <th className="px-4 py-4">کام کی تفصیل و سائز</th>
                <th className="px-4 py-4 text-center">تعداد</th>
                <th className="px-4 py-4 text-center">ریٹ</th>
                <th className="px-4 py-4 text-left rounded-tl-lg">کل رقم</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {receipt.items.map((item, idx) => (
                <tr key={item.id} className="text-base group">
                  <td className="px-4 py-6 text-slate-400 font-black">{idx + 1}</td>
                  <td className="px-4 py-6">
                    <p className="font-black text-slate-900 text-xl">{item.description}</p>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-tighter opacity-70 italic">{item.specs}</p>
                  </td>
                  <td className="px-4 py-6 text-center font-bold text-slate-700 text-lg">{item.quantity}</td>
                  <td className="px-4 py-6 text-center font-bold text-slate-700 text-lg">{item.rate.toFixed(0)}</td>
                  <td className="px-4 py-6 text-left font-black text-slate-900 text-xl">{item.total.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summation Area */}
        <div className="mt-12 pt-8 border-t-4 border-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">شرائط و ضوابط</h3>
                    <div className="text-slate-700 text-xs font-bold leading-relaxed bg-blue-50/50 p-5 border-r-4 border-blue-500 rounded-lg italic text-justify">
                        ١- پرنٹنگ سے پہلے پروف چیک کرنا گاہک کی ذمہ داری ہے۔ <br/>
                        ٢- پرنٹ ہونے کے بعد مال واپس یا تبدیل نہیں ہوگا۔ <br/>
                        ٣- ڈیلیوری کا وقت کام کی نوعیت کے مطابق ہوگا۔
                    </div>
                </div>
                <div className="pt-12 flex gap-12">
                    <div className="flex-1 text-center">
                        <div className="border-b-2 border-slate-300 mb-2 h-12"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">دستخط گاہک</p>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="border-b-2 border-slate-900 mb-2 h-12 flex items-center justify-center">
                            <span className="opacity-20 font-black text-xs uppercase tracking-[0.5em] select-none">OFFICIAL SEAL</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">دستخط {press.name}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-slate-500 text-sm font-black uppercase tracking-wider">
                    <span>ٹوٹل بل</span>
                    <span>{receipt.subtotal.toFixed(0)} /-</span>
                </div>
                {receipt.discount > 0 && (
                    <div className="flex justify-between text-red-500 text-sm font-black uppercase tracking-wider">
                        <span>رعایت</span>
                        <span>- {receipt.discount.toFixed(0)} /-</span>
                    </div>
                )}
                
                <div className="flex justify-between items-center border-y-2 border-slate-100 py-6 my-4">
                    <span className="text-lg font-black text-slate-900 uppercase tracking-widest bombay-font">کل رقم (صاف)</span>
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{receipt.total.toFixed(0)} <span className="text-lg opacity-50 font-bold">PKR</span></span>
                </div>

                <div className="bg-blue-600 text-white p-6 rounded-2xl flex justify-between items-center shadow-2xl shadow-blue-900/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 skew-x-12 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">وصول شدہ (ایڈوانس)</p>
                        <p className="text-2xl font-black leading-none">-{receipt.advancePayment.toFixed(0)} /-</p>
                    </div>
                    <div className="relative z-10 text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 text-right">بقایا رقم (پینڈنگ)</p>
                        <p className="text-4xl font-black tracking-tighter leading-none">
                            {receipt.remainingBalance.toFixed(0)} <span className="text-sm">/-</span>
                        </p>
                    </div>
                </div>
                
                {receipt.remainingBalance === 0 && (
                     <div className="text-center bg-emerald-500 text-white py-3 font-black uppercase text-sm tracking-widest rounded-xl mt-4 shadow-lg">
                        رقم پوری وصول ہو چکی ہے
                    </div>
                )}
            </div>
          </div>
        </div>

        <div className="mt-auto text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] border-t-2 border-slate-50 pt-8 mb-4">
          {press.name} &bull; Fast Printing &bull; Creative Design &bull; Reliable Service
        </div>
      </div>
    </div>
  );
};

export default ReceiptView;
