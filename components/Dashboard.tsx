
import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ReceiptStatus, PressSettings } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface DashboardProps {
  receipts: Receipt[];
  settings: PressSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ receipts, settings }) => {
  const totalAdvanced = receipts.reduce((sum, r) => sum + r.advancePayment, 0);
  const totalRemains = receipts.reduce((sum, r) => sum + r.remainingBalance, 0);
  const totalInvoiced = totalAdvanced + totalRemains;

  const statusData = [
    { name: 'مکمل ادائیگی', value: receipts.filter(r => r.remainingBalance === 0).length },
    { name: 'بقایا جات', value: receipts.filter(r => r.remainingBalance > 0).length },
  ];

  const COLORS = ['#10b981', '#f43f5e'];

  const recentReceipts = receipts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight bombay-font uppercase">خوش آمدید</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{settings.name} بزنس اوورویو</p>
        </div>
        <Link
          to="/new"
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-black hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          <i className="fas fa-plus"></i> نیا آرڈر بک کریں
        </Link>
      </div>

      {/* Responsive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <MetricCard
          title="ایڈوانس وصولی"
          value={totalAdvanced.toLocaleString()}
          subtitle="تمام آرڈرز کی ایڈوانس رقم"
          icon="fa-wallet"
          color="blue"
        />
        <MetricCard
          title="کل بقایا جات"
          value={totalRemains.toLocaleString()}
          subtitle="مارکیٹ سے وصول ہونے والی رقم"
          icon="fa-clock"
          color="amber"
        />
        <MetricCard
          title="کل بزنس والیم"
          value={totalInvoiced.toLocaleString()}
          subtitle="بک شدہ آرڈرز کی کل مالیت"
          icon="fa-chart-line"
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Activity */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center justify-between border-b pb-4">
            حالیہ آرڈرز
            <Link to="/history" className="text-[10px] text-blue-600 hover:underline">مکمل تاریخ دیکھیں</Link>
          </h3>
          <div className="space-y-4">
            {recentReceipts.length > 0 ? recentReceipts.map(receipt => (
              <div key={receipt.id} className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition-all text-xl">
                    {receipt.customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{receipt.customer.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{receipt.receiptNumber}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-lg font-black text-slate-900">{receipt.total.toFixed(0)}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${receipt.remainingBalance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {receipt.remainingBalance > 0 ? `بقایا: ${receipt.remainingBalance}` : 'پیمنٹ مکمل'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 opacity-30">
                <i className="fas fa-folder-open text-4xl mb-2"></i>
                <p className="text-sm font-bold">کوئی آرڈر نہیں ملا۔</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Chart */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4 w-full border-b pb-4">ادائیگیوں کی صورتحال</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontFamily: 'Noto Nastaliq Urdu', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 w-full mt-4">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs font-bold bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-slate-600 uppercase tracking-widest">{s.name}</span>
                </div>
                <span className="font-black text-slate-900">{s.value} آرڈرز</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; subtitle: string; icon: string; color: 'blue' | 'amber' | 'indigo' }> = ({ title, value, subtitle, icon, color }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          <i className={`fas ${icon} text-2xl`}></i>
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
            <p className="text-[10px] font-bold text-slate-400 leading-tight">{subtitle}</p>
        </div>
      </div>
      <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none relative z-10">{value} <span className="text-sm opacity-30">/-</span></p>
      <div className={`absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:scale-110 transition-transform ${colorMap[color].split(' ')[0]}`}>
          <i className={`fas ${icon}`}></i>
      </div>
    </div>
  );
};

export default Dashboard;
