
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ReceiptStatus } from '../types';

interface ReceiptHistoryProps {
  receipts: Receipt[];
  onDelete: (id: string) => void;
}

const ReceiptHistory: React.FC<ReceiptHistoryProps> = ({ receipts, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReceipts = receipts.filter(r => 
    r.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 bombay-font">رسیدوں کا تاریخچہ</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">تمام تیار کردہ رسیدیں یہاں موجود ہیں۔</p>
        </div>
        <div className="relative w-full md:w-80">
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder="گاہک کا نام یا رسید نمبر..."
            className="pr-10 pl-4 py-3 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none w-full text-sm font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-900 border-b border-slate-800 text-white text-[10px] font-black uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">نمبر</th>
                <th className="px-6 py-4">گاہک</th>
                <th className="px-6 py-4">تاریخ</th>
                <th className="px-6 py-4">کل رقم</th>
                <th className="px-6 py-4">سٹیٹس</th>
                <th className="px-6 py-4 text-left">آپشنز</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.length > 0 ? filteredReceipts.map(receipt => (
                <tr key={receipt.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 font-mono text-xs text-blue-600 font-black">{receipt.receiptNumber}</td>
                  <td className="px-6 py-5">
                    <p className="font-black text-slate-800 text-lg">{receipt.customer.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{receipt.customer.phone}</p>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-500">
                    {new Date(receipt.date).toLocaleDateString('ur-PK')}
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-slate-800 text-lg">{receipt.total.toFixed(0)}</p>
                    {receipt.remainingBalance > 0 && (
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">بقایا: {receipt.remainingBalance.toFixed(0)}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={receipt.status} remains={receipt.remainingBalance} />
                  </td>
                  <td className="px-6 py-5 text-left space-x-2 space-x-reverse">
                    <Link to={`/view/${receipt.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                      <i className="fas fa-eye text-xs"></i>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('کیا آپ واقعی یہ رسید ختم کرنا چاہتے ہیں؟')) {
                          onDelete(receipt.id);
                        }
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-300">
                    <i className="fas fa-receipt text-6xl mb-4 block opacity-10"></i>
                    <p className="font-black text-xl">کوئی رسید نہیں ملی</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: ReceiptStatus, remains: number }> = ({ status, remains }) => {
  if (remains === 0) {
    return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
            مکمل ادا
        </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-700">
        بقایا ہے
    </span>
  );
};

export default ReceiptHistory;
