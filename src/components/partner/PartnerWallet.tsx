import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '../../types';

interface PartnerWalletProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PartnerWallet: React.FC<PartnerWalletProps> = ({ onNavigate }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('1500000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [autoAccept, setAutoAccept] = useState(true);
  const [maxDistance, setMaxDistance] = useState(5);

  // Availability schedule grid: Mon to Sun, 3 slots per day (Morning, Afternoon, Evening)
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const dates = ['22/10', '23/10', '24/10', '25/10', '26/10', '27/10', '28/10'];
  const slots = [
    { id: 'morning', label: 'Sáng (08:00 - 12:00)' },
    { id: 'afternoon', label: 'Chiều (13:00 - 17:00)' },
    { id: 'evening', label: 'Tối (17:30 - 21:30)' },
  ];

  // Schedule matrix state: 0 = Off, 1 = Available (Đăng ký rảnh), 2 = Booked (Có ca)
  const [schedule, setSchedule] = useState<{ [key: string]: number }>({
    '0-morning': 2,
    '0-afternoon': 2,
    '0-evening': 0,
    '1-morning': 1,
    '1-afternoon': 2,
    '1-evening': 0,
    '2-morning': 2,
    '2-afternoon': 1,
    '2-evening': 1,
    '3-morning': 1,
    '3-afternoon': 2,
    '3-evening': 0,
    '4-morning': 2,
    '4-afternoon': 2,
    '4-evening': 1,
    '5-morning': 1,
    '5-afternoon': 1,
    '5-evening': 0,
    '6-morning': 0,
    '6-afternoon': 0,
    '6-evening': 0,
  });

  const toggleSlot = (dIdx: number, sId: string) => {
    const key = `${dIdx}-${sId}`;
    setSchedule((prev) => {
      const current = prev[key] || 0;
      if (current === 2) return prev; // Cannot toggle booked shifts
      return {
        ...prev,
        [key]: current === 1 ? 0 : 1,
      };
    });
  };

  const transactions = [
    {
      id: 'TXN-89421',
      title: 'Thù lao hoàn tất ca dọn dẹp #GDX-89241',
      sub: 'Masteri Thảo Điền • Lê Minh Anh',
      date: 'Hôm nay, 17:45',
      amount: '+288.000 ₫',
      status: 'pending',
      statusLabel: 'Chờ đối soát (24h)',
      type: 'income',
    },
    {
      id: 'TXN-89410',
      title: 'Tiền Tip từ khách hàng',
      sub: 'MoMo • Cảm ơn cô Mai dọn nhà sạch sẽ',
      date: 'Hôm nay, 17:46',
      amount: '+50.000 ₫',
      status: 'success',
      statusLabel: 'Đã vào ví',
      type: 'tip',
    },
    {
      id: 'TXN-89235',
      title: 'Thù lao ca dọn dẹp #GDX-89235',
      sub: 'Vinhomes Central Park • Anh Trần Đức',
      date: 'Hôm qua, 18:30',
      amount: '+350.000 ₫',
      status: 'success',
      statusLabel: 'Đã cộng ví',
      type: 'income',
    },
    {
      id: 'TXN-88902',
      title: 'Rút tiền nhanh về Vietcombank',
      sub: 'Tài khoản: 0071000******8921 • VCB Thủ Đức',
      date: '24/10/2025, 09:15',
      amount: '-2.000.000 ₫',
      status: 'success',
      statusLabel: 'Thành công',
      type: 'withdrawal',
    },
    {
      id: 'TXN-88741',
      title: 'Thưởng tuần Đối tác 5 Sao Bạch Kim',
      sub: 'Chỉ số hài lòng 4.95/5.0 • 12 ca đạt chuẩn A+',
      date: '21/10/2025, 20:00',
      amount: '+200.000 ₫',
      status: 'success',
      statusLabel: 'Đã cộng ví',
      type: 'bonus',
    },
  ];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setWithdrawModalOpen(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-[#005c55] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('partner-board')}
              className="p-1.5 rounded-lg hover:bg-[#0f766e] text-white transition-colors"
              title="Quay lại sàn nhận việc"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-emerald-300">account_balance_wallet</span>
              <span className="font-bold text-lg tracking-tight">Ví Thu Nhập & Lịch Ca</span>
            </div>
            <span className="bg-emerald-800/80 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium hidden sm:inline-flex border border-emerald-600/40">
              Đối tác Bạch Kim 5★
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-emerald-100">Đối tác thực thi</div>
              <div className="text-sm font-semibold">Hoàng Thị Mai</div>
            </div>
            <img
              src={IMAGES.hoangThiMaiWalletAvatar}
              alt="Hoàng Thị Mai"
              className="w-10 h-10 rounded-full border-2 border-emerald-300 object-cover shadow"
            />
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="bg-[#004d47] border-t border-[#006e66]/40 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 text-sm">
            <button
              onClick={() => onNavigate('partner-board')}
              className="px-3 py-1.5 rounded-lg text-emerald-100 hover:bg-[#005c55] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">radar</span>
              <span>Sàn nhận việc & Radar</span>
            </button>
            <button
              onClick={() => onNavigate('partner-shift')}
              className="px-3 py-1.5 rounded-lg text-emerald-100 hover:bg-[#005c55] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">timer</span>
              <span>Ca hiện trường (Live Timer)</span>
            </button>
            <button
              className="px-3 py-1.5 rounded-lg bg-[#005c55] text-white font-semibold shadow-inner whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">account_balance_wallet</span>
              <span>Ví & Lịch làm việc</span>
            </button>
            <button
              onClick={() => onNavigate('customer-tracking')}
              className="px-3 py-1.5 rounded-lg text-emerald-100 hover:bg-[#005c55] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">visibility</span>
              <span>Xem góc nhìn Khách</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Quick Stat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Wallet Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#005c55] to-[#0b4d47] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                  <span>Số dư khả dụng có thể rút</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:text-white transition-colors"
                    title={showBalance ? 'Ẩn số dư' : 'Hiện số dư'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showBalance ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  {showBalance ? '3.420.000 ₫' : '•••••••• ₫'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-4 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 text-sm"
                >
                  <span className="material-symbols-outlined text-lg">payments</span>
                  <span>Rút tiền 24/7</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-emerald-600/50 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs relative z-10">
              <div>
                <div className="text-emerald-200">Đang đối soát ca</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {showBalance ? '450.000 ₫' : '•••••• ₫'}
                </div>
                <div className="text-[11px] text-emerald-300">Ca #GDX-89241 (24h)</div>
              </div>

              <div>
                <div className="text-emerald-200">Tổng thu nhập tuần</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {showBalance ? '4.920.000 ₫' : '•••••• ₫'}
                </div>
                <div className="text-[11px] text-emerald-300 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  +18% so với tuần trước
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="text-emerald-200">Tài khoản thụ hưởng</div>
                <div className="text-sm font-semibold text-white mt-0.5 truncate">
                  Vietcombank • ***8921
                </div>
                <div className="text-[11px] text-emerald-300">Hoàng Thị Mai (Đã định danh)</div>
              </div>
            </div>
          </div>

          {/* Quick Partner Rating & Auto-Dispatch Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hiệu suất làm việc</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Top 5%</span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl border border-amber-200">
                  4.95
                </div>
                <div>
                  <div className="flex text-amber-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    320 ca hoàn tất • 0 ca hủy
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-800">Tự động nhận đơn</div>
                  <div className="text-xs text-slate-500">Bán kính ưu tiên: {maxDistance}km</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoAccept(!autoAccept)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    autoAccept ? 'bg-[#005c55]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      autoAccept ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Khoảng cách di chuyển</span>
                  <span className="font-bold text-[#005c55]">{maxDistance} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#005c55]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Availability & Schedule Management Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005c55] text-2xl">calendar_month</span>
                <h2 className="text-lg font-bold text-slate-900">Quản Lý Lịch Rảnh & Nhận Ca Trong Tuần</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhấp vào từng khung giờ để chuyển đổi trạng thái: <span className="text-emerald-700 font-semibold">Sẵn sàng nhận đơn</span> hoặc <span className="text-slate-400 font-semibold">Nghỉ</span>. Hệ thống sẽ tự động điều phối khách hàng theo lịch bạn đã đăng ký.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block" />
                <span className="text-slate-700 font-medium">Sẵn sàng nhận việc</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block" />
                <span className="text-slate-700 font-medium">Đã có ca (Đã chốt)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 inline-block" />
                <span className="text-slate-500 font-medium">Nghỉ / Bận</span>
              </span>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-44">
                    Khung thời gian
                  </th>
                  {days.map((day, idx) => (
                    <th key={day} className="p-3 text-xs font-bold text-slate-800">
                      <div>{day}</div>
                      <div className="text-[11px] font-normal text-slate-500">{dates[idx]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-left font-medium text-xs text-slate-700 bg-slate-50/80">
                      <div className="font-bold text-slate-900">{slot.label.split(' ')[0]}</div>
                      <div className="text-[11px] text-slate-500">{slot.label.substring(slot.label.indexOf('('))}</div>
                    </td>
                    {days.map((_, dayIdx) => {
                      const key = `${dayIdx}-${slot.id}`;
                      const status = schedule[key] || 0;
                      return (
                        <td key={key} className="p-2">
                          <button
                            type="button"
                            onClick={() => toggleSlot(dayIdx, slot.id)}
                            className={`w-full py-2.5 px-2 rounded-xl text-xs font-semibold transition-all transform active:scale-95 ${
                              status === 2
                                ? 'bg-amber-100 border border-amber-300 text-amber-900 shadow-sm cursor-not-allowed'
                                : status === 1
                                ? 'bg-emerald-100 border border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-100 border border-slate-200 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {status === 2 ? (
                              <div className="flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xs text-amber-700">lock</span>
                                <span>Có khách</span>
                              </div>
                            ) : status === 1 ? (
                              <div className="flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xs text-emerald-700">check</span>
                                <span>Nhận việc</span>
                              </div>
                            ) : (
                              <span>Nghỉ</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 text-emerald-700">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Lịch làm việc đã được đồng bộ với thuật toán tự động ghép đơn</span>
            </div>
            <button
              onClick={() => alert('Đã lưu cài đặt khung giờ làm việc thành công!')}
              className="text-white bg-[#005c55] hover:bg-[#0f766e] px-3.5 py-1.5 rounded-lg font-bold shadow-sm transition-colors"
            >
              Lưu cấu hình tuần
            </button>
          </div>
        </div>

        {/* Income Chart & Recent Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income Bar Chart & Breakdown */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Thống Kê Thu Nhập</h3>
                <p className="text-xs text-slate-500">Thu nhập trung bình 700k/ngày</p>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    period === 'week' ? 'bg-white shadow text-[#005c55]' : 'text-slate-600'
                  }`}
                >
                  Tuần này
                </button>
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    period === 'month' ? 'bg-white shadow text-[#005c55]' : 'text-slate-600'
                  }`}
                >
                  Tháng này
                </button>
              </div>
            </div>

            {/* Simulated Bar Chart */}
            <div className="pt-4 pb-2">
              <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-slate-200 pb-2">
                {[
                  { day: 'T2', amount: '480k', height: '48%' },
                  { day: 'T3', amount: '620k', height: '62%' },
                  { day: 'T4', amount: '550k', height: '55%' },
                  { day: 'T5', amount: '720k', height: '72%' },
                  { day: 'T6', amount: '850k', height: '85%' },
                  { day: 'T7', amount: '920k', height: '92%', active: true },
                  { day: 'CN', amount: '780k', height: '78%' },
                ].map((item) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-800 transition-colors opacity-0 group-hover:opacity-100 font-bold">
                      {item.amount}
                    </span>
                    <div
                      style={{ height: item.height }}
                      className={`w-full max-w-[28px] rounded-t-md transition-all ${
                        item.active
                          ? 'bg-[#005c55] shadow-md'
                          : 'bg-emerald-200 group-hover:bg-emerald-300'
                      }`}
                    />
                    <span className="text-[11px] font-semibold text-slate-600">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Dọn dẹp căn hộ (8 ca)</span>
                <span className="font-bold text-slate-900">2.680.000 ₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Nấu ăn gia đình (4 ca)</span>
                <span className="font-bold text-slate-900">1.840.000 ₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tiền tip từ khách</span>
                <span className="font-bold text-emerald-600">+200.000 ₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Thưởng hiệu suất 5★</span>
                <span className="font-bold text-amber-600">+200.000 ₫</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Nhật Ký Giao Dịch Gần Đây</h3>
                <p className="text-xs text-slate-500">Minh bạch 100% từng đơn hàng và thù lao đối tác</p>
              </div>
              <button
                onClick={() => alert('Xuất sao kê giao dịch tháng 10/2025 dưới định dạng Excel')}
                className="text-xs text-[#005c55] font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Xuất file sao kê
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-xl px-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : tx.type === 'tip'
                          ? 'bg-amber-50 text-amber-600'
                          : tx.type === 'bonus'
                          ? 'bg-purple-50 text-purple-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {tx.type === 'income'
                          ? 'attach_money'
                          : tx.type === 'tip'
                          ? 'volunteer_activism'
                          : tx.type === 'bonus'
                          ? 'military_tech'
                          : 'credit_card'}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900">{tx.title}</div>
                      <div className="text-xs text-slate-500">{tx.sub}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{tx.date}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-black ${
                        tx.amount.startsWith('+') ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {tx.amount}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                        tx.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.statusLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Withdrawal Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005c55] text-2xl">account_balance</span>
                <h3 className="font-bold text-slate-900 text-base">Rút Tiền Về Tài Khoản</h3>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  <span className="material-symbols-outlined text-3xl">check_circle</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Yêu Cầu Rút Tiền Đã Gửi!</h4>
                <p className="text-xs text-slate-600">
                  Hệ thống đang chuyển {Number(withdrawAmount).toLocaleString('vi-VN')} ₫ vào tài khoản Vietcombank (*8921) của bạn trong vòng 60 giây qua Napas 247.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Tài khoản nhận tiền mặc định:</div>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">VIETCOMBANK • 0071000******8921</div>
                  <div className="text-xs text-slate-600">Chủ TK: HOANG THI MAI (Đã xác minh KYC)</div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nhập số tiền cần rút (Tối thiểu 100.000 ₫)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={3420000}
                      min={100000}
                      step={50000}
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005c55] text-lg"
                    />
                    <span className="absolute right-3 top-3 text-slate-400 font-bold text-sm">₫</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                    <span>Số dư khả dụng: 3.420.000 ₫</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount('3420000')}
                      className="text-[#005c55] font-bold hover:underline"
                    >
                      Rút tất cả
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  {['500000', '1000000', '2000000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt)}
                      className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                    >
                      +{Number(amt).toLocaleString('vi-VN')} ₫
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#005c55] hover:bg-[#0f766e] text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 text-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    <span>Xác nhận chuyển tiền ngay</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
