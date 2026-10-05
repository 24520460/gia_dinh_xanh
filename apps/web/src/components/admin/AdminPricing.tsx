import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '@gdx/shared-types';

interface AdminPricingProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminPricing: React.FC<AdminPricingProps> = ({ onNavigate }) => {
  // Pricing configurations
  const [cleaningRate, setCleaningRate] = useState(80000);
  const [cookingRate, setCookingRate] = useState(110000);
  const [deepCleanRate, setDeepCleanRate] = useState(130000);
  
  // Surge multipliers
  const [peakMultiplier, setPeakMultiplier] = useState(1.15);
  const [weekendSurcharge, setWeekendSurcharge] = useState(10000);
  const [holidayMultiplier, setHolidayMultiplier] = useState(2.0);
  const [autoSurgeEnabled, setAutoSurgeEnabled] = useState(true);

  // Revenue share split
  const [partnerSplit, setPartnerSplit] = useState(82); // 82%
  const [platinumBonus, setPlatinumBonus] = useState(3); // 3%

  // Sandbox Simulator State
  const [simService, setSimService] = useState<'clean' | 'cook' | 'deep'>('clean');
  const [simHours, setSimHours] = useState(3);
  const [simIsPeak, setSimIsPeak] = useState(true);
  const [simIsWeekend, setSimIsWeekend] = useState(false);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Calculate simulated pricing
  const baseRate = simService === 'clean' ? cleaningRate : simService === 'cook' ? cookingRate : deepCleanRate;
  const rawSubtotal = baseRate * simHours;
  const peakExtra = simIsPeak ? rawSubtotal * (peakMultiplier - 1) : 0;
  const weekendExtra = simIsWeekend ? weekendSurcharge * simHours : 0;
  const totalCustomerPays = Math.round((rawSubtotal + peakExtra + weekendExtra) / 1000) * 1000;
  
  const partnerEarnings = Math.round((totalCustomerPays * (partnerSplit / 100)) / 1000) * 1000;
  const platformFee = totalCustomerPays - partnerEarnings;

  const handleSave = () => {
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005c55] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl">tune</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">GIA ĐÌNH XANH</span>
                <span className="bg-[#005c55] text-emerald-200 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider">
                  PRICING ENGINE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Thiết Lập Biểu Phí & Chia Sẻ Doanh Thu Đối Tác</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>Lưu Cấu Hình Q4/2025</span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <img
                src={IMAGES.minhTuanAdmin}
                alt="Minh Tuấn"
                className="w-9 h-9 rounded-lg border border-slate-700 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sub Navigation Ribbon */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 text-xs font-semibold">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Tổng quan & Điều phối Live</span>
            </button>
            <button
              className="px-3 py-1.5 rounded-md bg-[#005c55] text-white flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Biểu giá & Chiết khấu (Pricing Engine)</span>
            </button>
            <button
              onClick={() => onNavigate('admin-kyc')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Duyệt hồ sơ KYC Đối tác</span>
            </button>
            <button
              onClick={() => onNavigate('customer-booking')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Kiểm thử Booking Wizard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice alert */}
        {isSavedAlert ? (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm animate-in fade-in">
            <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
            <span className="font-bold">Đã lưu cấu hình biểu giá thành công! Toàn bộ đơn hàng mới sẽ áp dụng công thức này ngay lập tức.</span>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-base">info</span>
              <span>
                <b>Chính sách giá áp dụng:</b> Tự động tính phụ thu giờ cao điểm 16:30 - 19:00 và chia sẻ tối thiểu 80% cho đối tác để đảm bảo tỷ lệ nhận ca cao nhất.
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Version 2.4.1</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Configuration Forms (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Base Service Rates */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005c55] text-xl">payments</span>
                  <h3 className="font-bold text-slate-900 text-sm">1. Đơn Giá Giờ Cơ Bản (Base Hourly Rate)</h3>
                </div>
                <span className="text-xs text-slate-500">Đơn vị: VNĐ / Giờ</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-xs text-slate-900">Dọn dẹp nhà cửa tiêu chuẩn</div>
                    <div className="text-[11px] text-slate-500">Áp dụng cho căn hộ, nhà phố (Tối thiểu 2 giờ)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={cleaningRate}
                      onChange={(e) => setCleaningRate(Number(e.target.value))}
                      step={5000}
                      className="w-28 text-right font-bold text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#005c55]"
                    />
                    <span className="text-xs font-semibold text-slate-500">₫/h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-xs text-slate-900">Nấu ăn gia đình theo khẩu vị</div>
                    <div className="text-[11px] text-slate-500">2-4 món theo yêu cầu + dọn bếp (Tối thiểu 2 giờ)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={cookingRate}
                      onChange={(e) => setCookingRate(Number(e.target.value))}
                      step={5000}
                      className="w-28 text-right font-bold text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#005c55]"
                    />
                    <span className="text-xs font-semibold text-slate-500">₫/h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-xs text-slate-900">Tổng vệ sinh chuyên sâu (Deep Clean)</div>
                    <div className="text-[11px] text-slate-500">Đầy đủ dụng cụ hóa chất 5 sao (Tối thiểu 3 giờ)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={deepCleanRate}
                      onChange={(e) => setDeepCleanRate(Number(e.target.value))}
                      step={5000}
                      className="w-28 text-right font-bold text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#005c55]"
                    />
                    <span className="text-xs font-semibold text-slate-500">₫/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Surge Multipliers & Dynamic Pricing */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-xl">bolt</span>
                  <h3 className="font-bold text-slate-900 text-sm">2. Hệ Số Cao Điểm & Phụ Phí (Surge & Peak Multipliers)</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">Tự động surge:</span>
                  <button
                    type="button"
                    onClick={() => setAutoSurgeEnabled(!autoSurgeEnabled)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                      autoSurgeEnabled ? 'bg-[#005c55]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                        autoSurgeEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Giờ cao điểm chiều tối</span>
                    <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                      {peakMultiplier}x ({Math.round((peakMultiplier - 1) * 100)}%)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Khung giờ: 16:30 - 19:00 hàng ngày</div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.5"
                    step="0.05"
                    value={peakMultiplier}
                    onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#005c55]"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Phụ phí cuối tuần</span>
                    <span className="text-slate-800 font-bold bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                      +{weekendSurcharge.toLocaleString('vi-VN')} ₫/h
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Thứ Bảy & Chủ Nhật</div>
                  <input
                    type="range"
                    min="0"
                    max="30000"
                    step="5000"
                    value={weekendSurcharge}
                    onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#005c55]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Revenue Share & Commission Split */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-xl">pie_chart</span>
                  <h3 className="font-bold text-slate-900 text-sm">3. Tỷ Lệ Chia Sẻ Doanh Thu (Revenue Share)</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    Đối tác nhận: <span className="text-emerald-700 font-black text-sm">{partnerSplit}%</span>
                  </span>
                  <span className="font-bold text-slate-800">
                    Phí nền tảng Gia Đình Xanh: <span className="text-slate-600 font-black text-sm">{100 - partnerSplit}%</span>
                  </span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div style={{ width: `${partnerSplit}%` }} className="bg-[#005c55] h-full" />
                  <div style={{ width: `${100 - partnerSplit}%` }} className="bg-slate-400 h-full" />
                </div>

                <input
                  type="range"
                  min="75"
                  max="90"
                  value={partnerSplit}
                  onChange={(e) => setPartnerSplit(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#005c55]"
                />

                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600 pt-1">
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <b className="text-emerald-900">Thu nhập đối tác (Thực nhận về ví)</b>
                    <div>Bao gồm thù lao thời gian, phụ cấp đi lại và tiền tip 100% của khách hàng.</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <b className="text-slate-900">Phí vận hành nền tảng ({100 - partnerSplit}%)</b>
                    <div>Bao gồm bảo hiểm vật chất tài sản 50 triệu, chi phí máy chủ, thuế và tổng đài CSKH 24/7.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Pricing Simulator Sandbox (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">calculate</span>
                  <h3 className="font-bold text-white text-base">Sandbox Thử Nghiệm Giá</h3>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Live Preview
                </span>
              </div>

              {/* Interactive Sandbox Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Chọn loại dịch vụ:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'clean', label: 'Dọn dẹp' },
                      { id: 'cook', label: 'Nấu ăn' },
                      { id: 'deep', label: 'Tổng vệ sinh' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSimService(s.id as any)}
                        className={`py-2 rounded-lg font-bold transition-colors ${
                          simService === s.id
                            ? 'bg-[#005c55] text-white border border-emerald-400'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-bold mb-1">
                    <span>Thời lượng phục vụ</span>
                    <span className="text-emerald-400">{simHours} Giờ</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={simHours}
                    onChange={(e) => setSimHours(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl cursor-pointer hover:bg-slate-800">
                    <span className="text-slate-300">Khung giờ cao điểm (16:30 - 19:00)</span>
                    <input
                      type="checkbox"
                      checked={simIsPeak}
                      onChange={(e) => setSimIsPeak(e.target.checked)}
                      className="w-4 h-4 accent-[#005c55] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl cursor-pointer hover:bg-slate-800">
                    <span className="text-slate-300">Cuối tuần (Thứ 7 / CN)</span>
                    <input
                      type="checkbox"
                      checked={simIsWeekend}
                      onChange={(e) => setSimIsWeekend(e.target.checked)}
                      className="w-4 h-4 accent-[#005c55] rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Simulation Result Receipt */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-700/80 space-y-2 text-xs">
                <div className="text-slate-400 font-medium">Bảng kê chi tiết đơn mô phỏng:</div>

                <div className="flex justify-between text-slate-300">
                  <span>Giá gốc ({simHours} giờ x {baseRate.toLocaleString('vi-VN')} ₫)</span>
                  <span>{rawSubtotal.toLocaleString('vi-VN')} ₫</span>
                </div>

                {simIsPeak && (
                  <div className="flex justify-between text-amber-400">
                    <span>Hệ số cao điểm ({peakMultiplier}x)</span>
                    <span>+{Math.round(peakExtra).toLocaleString('vi-VN')} ₫</span>
                  </div>
                )}

                {simIsWeekend && (
                  <div className="flex justify-between text-slate-300">
                    <span>Phụ phí cuối tuần</span>
                    <span>+{Math.round(weekendExtra).toLocaleString('vi-VN')} ₫</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-bold">
                  <span className="text-white">Tổng khách thanh toán:</span>
                  <span className="text-emerald-300 text-lg font-black font-mono">
                    {totalCustomerPays.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>

              {/* Split Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800/50">
                  <div className="text-emerald-400 text-[11px] font-bold">Thợ nhận ({partnerSplit}%)</div>
                  <div className="text-lg font-black text-emerald-200 mt-1 font-mono">
                    {partnerEarnings.toLocaleString('vi-VN')} ₫
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">+100% tip nếu có</div>
                </div>

                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[11px] font-bold">Nền tảng ({100 - partnerSplit}%)</div>
                  <div className="text-lg font-black text-white mt-1 font-mono">
                    {platformFee.toLocaleString('vi-VN')} ₫
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Phí dịch vụ & BH</div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-[#005c55] hover:bg-[#0f766e] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Áp dụng biểu giá này cho toàn hệ thống</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
