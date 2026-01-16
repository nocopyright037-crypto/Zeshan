
import React, { useState } from 'react';
import { PressSettings } from '../types';

interface SettingsProps {
  settings: PressSettings;
  onUpdate: (newSettings: PressSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<PressSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 bombay-font uppercase tracking-tight">سیٹنگز (Settings)</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">پرنٹنگ پریس کی معلومات تبدیل کریں</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">پرنٹنگ پریس کا نام (Press Name)</label>
            <input
              type="text"
              className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all font-bold text-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">ٹیگ لائن (Tagline)</label>
            <input
              type="text"
              className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all font-bold"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">رابطہ نمبر (Contact Number)</label>
            <input
              type="text"
              className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all font-mono"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">پتہ (Address)</label>
            <textarea
              className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all font-bold"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
          <button
            type="submit"
            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95"
          >
            معلومات محفوظ کریں
          </button>
          {isSaved && (
            <span className="text-emerald-600 font-bold flex items-center gap-2 animate-bounce">
              <i className="fas fa-check-circle"></i> محفوظ ہو گیا!
            </span>
          )}
        </div>
      </form>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
        <div className="flex gap-4">
          <i className="fas fa-info-circle text-amber-500 text-xl mt-1"></i>
          <div>
            <h4 className="font-black text-amber-900 mb-1">نوٹ (Note)</h4>
            <p className="text-sm text-amber-800 font-bold leading-relaxed">
              یہاں تبدیل کی گئی معلومات تمام نئی رسیدوں پر ظاہر ہوں گی۔ پرانی رسیدوں پر ان کی تخلیق کے وقت کی معلومات ہی برقرار رہیں گی۔
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
