
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username !== 'malik' || password !== '2324') {
      setError('صارف کا نام یا پاس ورڈ غلط ہے!');
      return;
    }

    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('کیپچا کوڈ غلط ہے!');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-600 p-8 text-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <h1 className="text-4xl font-black text-white bombay-font mb-2">ذیشان گرافکس</h1>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">انتظامی لاگ ان (Admin Login)</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-shake">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">صارف کا نام (Username)</label>
              <div className="relative">
                <i className="fas fa-user absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pr-12 pl-4 py-4 focus:border-blue-500 outline-none transition-all font-bold"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="malik"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">پاس ورڈ (Password)</label>
              <div className="relative">
                <i className="fas fa-lock absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pr-12 pl-4 py-4 focus:border-blue-500 outline-none transition-all font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="****"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">کیپچا کوڈ (Captcha)</label>
              <div className="flex gap-3">
                <div 
                  className="bg-slate-100 px-6 py-4 rounded-2xl font-black text-2xl tracking-[0.3em] text-slate-400 select-none italic line-through decoration-slate-300 flex-1 text-center border-2 border-dashed border-slate-200"
                  style={{ fontFamily: 'monospace' }}
                >
                  {captchaCode}
                </div>
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="w-14 h-14 bg-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors flex items-center justify-center border-2 border-slate-100"
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              </div>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 mt-3 focus:border-blue-500 outline-none transition-all font-black text-center text-xl uppercase tracking-widest"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="اوپر والا کوڈ یہاں لکھیں"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            لاگ ان کریں
            <i className="fas fa-arrow-left text-sm"></i>
          </button>
        </form>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">محفوظ رسائی صرف ذیشان گرافکس کے لیے</p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default Login;
