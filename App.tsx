
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import ReceiptForm from './components/ReceiptForm';
import ReceiptHistory from './components/ReceiptHistory';
import ReceiptView from './components/ReceiptView';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Login from './components/Login';
import { Receipt, PressSettings } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const saved = localStorage.getItem('zeshan_graphics_receipts');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<PressSettings>(() => {
    const saved = localStorage.getItem('press_settings');
    return saved ? JSON.parse(saved) : {
      name: 'ذیشان گرافکس',
      tagline: 'کوالٹی پرنٹنگ اور تخلیقی ڈیزائننگ مرکز',
      address: 'بالمقابل سول ہسپتال، پرنٹنگ مارکیٹ، لاہور',
      contact: '+92 300 123 4567'
    };
  });

  useEffect(() => {
    localStorage.setItem('zeshan_graphics_receipts', JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem('press_settings', JSON.stringify(settings));
  }, [settings]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
  };

  const addReceipt = (receipt: Receipt) => {
    const receiptWithSettings = { ...receipt, settingsSnapshot: settings };
    setReceipts(prev => [receiptWithSettings, ...prev]);
  };

  const deleteReceipt = (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  const updateSettings = (newSettings: PressSettings) => {
    setSettings(newSettings);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Navigation Sidebar/TopBar */}
        <nav className="w-full md:w-64 bg-slate-900 text-white p-4 md:p-6 md:space-y-8 no-print shrink-0 md:min-h-screen sticky top-0 md:relative z-50">
          <div className="flex items-center justify-between md:block">
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 overflow-hidden">
              <i className="fas fa-print text-blue-400"></i>
              <span className="truncate">{settings.name.split(' ')[0]}</span>
              <span className="text-blue-400 truncate">{settings.name.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="hidden md:block text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">رسید مینجمنٹ سسٹم</p>
          </div>

          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-10 overflow-x-auto no-scrollbar">
            <NavLink to="/" icon="fa-home" label="ڈیش بورڈ" />
            <NavLink to="/new" icon="fa-plus-circle" label="نئی رسید" />
            <NavLink to="/history" icon="fa-history" label="تاریخچہ" />
            <NavLink to="/settings" icon="fa-cog" label="سیٹنگز" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all text-red-400 hover:bg-red-500/10 whitespace-nowrap flex-1 md:flex-none justify-center md:justify-start"
            >
              <i className="fas fa-sign-out-alt text-sm md:w-5"></i>
              <span className="font-bold text-xs md:text-sm">لاگ آؤٹ</span>
            </button>
          </div>

          <div className="hidden md:block pt-10 border-t border-slate-800 absolute bottom-10 left-6 right-6">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">کل رسیدیں</p>
              <p className="text-2xl font-black text-blue-400">{receipts.length}</p>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 bg-slate-50 overflow-x-hidden pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard receipts={receipts} settings={settings} />} />
            <Route path="/new" element={<ReceiptForm onSave={addReceipt} settings={settings} />} />
            <Route path="/history" element={<ReceiptHistory receipts={receipts} onDelete={deleteReceipt} />} />
            <Route path="/view/:id" element={<ReceiptView receipts={receipts} currentSettings={settings} />} />
            <Route path="/settings" element={<Settings settings={settings} onUpdate={updateSettings} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg transition-all whitespace-nowrap flex-1 md:flex-none justify-center md:justify-start ${
        isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400'
      }`}
    >
      <i className={`fas ${icon} text-sm md:w-5`}></i>
      <span className="font-bold text-xs md:text-sm">{label}</span>
    </Link>
  );
};

export default App;
