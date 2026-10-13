import React, { useState } from 'react';
import { ScreenId } from '@gdx/shared-types';

interface CustomerBookingProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CustomerBooking: React.FC<CustomerBookingProps> = ({ onNavigate }) => {
  // State for form selections
  const [apartmentScale, setApartmentScale] = useState<'1pn' | '2pn' | '3pn' | 'villa'>('2pn');
  const [duration, setDuration] = useState<2 | 3 | 4>(3);
  const [addons, setAddons] = useState<{ tools: boolean; ironing: boolean; fridge: boolean; window: boolean }>({
    tools: true,
    ironing: true,
    fridge: false,
    window: false,
  });
  const [frequency, setFrequency] = useState<'once' | 'recurring'>('once');
  const [selectedDate, setSelectedDate] = useState('25/10');
  const [selectedTime, setSelectedTime] = useState('08:30');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vnpay' | 'card' | 'cash'>('momo');
  const [voucher, setVoucher] = useState('CHAOBANMOI');
  const [voucherApplied, setVoucherApplied] = useState(true);

  // Calculations
  const baseRate = 85000;
  const basePrice = duration * baseRate; // 3 * 85k = 255k
  const toolsPrice = addons.tools ? 35000 : 0;
  const ironingPrice = addons.ironing ? 50000 : 0;
  const fridgePrice = addons.fridge ? 80000 : 0;
  const windowPrice = addons.window ? 40000 : 0;
  const weekendSurcharge = selectedDate === '25/10' || selectedDate === '26/10' ? 20000 : 0;

  const subtotal = basePrice + toolsPrice + ironingPrice + fridgePrice + windowPrice + weekendSurcharge;
  const discount = voucherApplied ? 72000 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleBookingSubmit = () => {
    onNavigate('customer-tracking');
  };

  return (
    <div className="bg-[#FAF8FF] text-[#131B2E] min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('customer-landing')} className="text-xl font-bold text-[#005C55] tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[26px] text-[#005C55]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <span>Gia Đình Xanh</span>
            </button>
            <span className="hidden sm:inline-block w-px h-5 bg-slate-200"></span>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-[#005C55] text-xs font-semibold border border-teal-200">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span>Đặt lịch bảo mật 256-bit SSL</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <button onClick={() => onNavigate('customer-landing')} className="text-slate-600 hover:text-[#005C55] transition-colors">
              Trang chủ
            </button>
            <button className="text-[#005C55] border-b-2 border-[#005C55] pb-1">
              Dọn dẹp
            </button>
            <button onClick={() => onNavigate('customer-landing')} className="text-slate-600 hover:text-[#005C55] transition-colors">
              Nấu ăn
            </button>
            <button onClick={() => onNavigate('customer-tracking')} className="text-slate-600 hover:text-[#005C55] transition-colors">
              Đơn hàng (#GDX-89241)
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-slate-700 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="material-symbols-outlined text-[#005C55] text-[16px]">location_on</span>
              <span>TP. Hồ Chí Minh / Quận 1</span>
            </div>
            <button onClick={() => onNavigate('customer-appointments')} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
              <span className="material-symbols-outlined text-xl">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Step Progress Stepper Bar */}
        <section className="bg-white rounded-2xl p-4 md:p-6 mb-6 border border-slate-200 shadow-xs">
          <div className="max-w-3xl mx-auto flex items-center justify-between relative">
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
              <div className="w-1/2 h-full bg-[#005C55] transition-all duration-300"></div>
            </div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#005C55] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <span className="mt-2 text-xs text-[#005C55] font-bold">1. Dịch vụ cốt lõi</span>
              <span className="text-[11px] text-slate-400 hidden sm:block">Đã hoàn thành</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#005C55] ring-4 ring-teal-100 text-white flex items-center justify-center font-bold text-sm shadow-md animate-pulse">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <span className="mt-2 text-xs text-[#005C55] font-bold">2. Thời gian & Địa điểm</span>
              <span className="text-[11px] text-[#FD651E] font-semibold hidden sm:block">Đang cấu hình</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 border border-slate-300 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="mt-2 text-xs text-slate-500 font-medium">3. Xác nhận & Thanh toán</span>
              <span className="text-[11px] text-slate-400 hidden sm:block">Chờ tiếp theo</span>
            </div>
          </div>
        </section>

        {/* 2-Column Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Detailed Configuration Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-[#005C55] text-xs font-bold flex items-center gap-1 border border-teal-200">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Chuẩn 5 Sao Gia Đình Xanh
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    Bảo hiểm trách nhiệm 100tr
                  </span>
                </div>
                <div className="text-[#FD651E] text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Nhận việc ngay trong 60 phút
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Cấu hình dịch vụ: Dọn dẹp căn hộ & Vệ sinh chuyên sâu
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Chọn diện tích không gian, khung giờ linh hoạt và các tiện ích sinh học gia tăng phù hợp nhất với tổ ấm của bạn.
              </p>
            </div>

            {/* A. Quy mô căn hộ */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005C55] text-white flex items-center justify-center text-xs font-bold">A</span>
                  <h2 className="text-base font-bold text-slate-900">Quy mô căn hộ / Nhà ở</h2>
                </div>
                <span className="text-xs text-slate-400">Bước 2.1</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setApartmentScale('1pn')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    apartmentScale === '1pn'
                      ? 'border-2 border-[#005C55] bg-teal-50/50 ring-1 ring-[#005C55]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-400 mb-1 text-[22px]">single_bed</span>
                  <div className="text-xs font-bold text-slate-900">1 PN - 1 WC</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Dưới 50m²</div>
                </button>

                <button
                  type="button"
                  onClick={() => setApartmentScale('2pn')}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    apartmentScale === '2pn'
                      ? 'border-2 border-[#005C55] bg-teal-50/50 ring-1 ring-[#005C55]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-2 bg-[#005C55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Khuyên dùng
                  </div>
                  <span className="material-symbols-outlined text-[#005C55] mb-1 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>bed</span>
                  <div className="text-xs font-bold text-[#005C55]">2 PN - 2 WC</div>
                  <div className="text-[11px] text-[#005C55] font-medium mt-0.5">Căn hộ 65 - 80m²</div>
                </button>

                <button
                  type="button"
                  onClick={() => setApartmentScale('3pn')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    apartmentScale === '3pn'
                      ? 'border-2 border-[#005C55] bg-teal-50/50 ring-1 ring-[#005C55]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-400 mb-1 text-[22px]">king_bed</span>
                  <div className="text-xs font-bold text-slate-900">3 PN - 2 WC</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Từ 85 - 110m²</div>
                </button>

                <button
                  type="button"
                  onClick={() => setApartmentScale('villa')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    apartmentScale === 'villa'
                      ? 'border-2 border-[#005C55] bg-teal-50/50 ring-1 ring-[#005C55]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-slate-400 mb-1 text-[22px]">villa</span>
                  <div className="text-xs font-bold text-slate-900">Nhà phố / Villa</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Tầng trệt & lầu</div>
                </button>
              </div>
            </div>

            {/* B. Thời lượng đề xuất */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005C55] text-white flex items-center justify-center text-xs font-bold">B</span>
                  <h2 className="text-base font-bold text-slate-900">Thời lượng dọn dẹp đề xuất</h2>
                </div>
                <span className="text-xs text-slate-500 font-semibold">Đơn giá 85.000đ/giờ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 2H */}
                <label
                  onClick={() => setDuration(2)}
                  className={`cursor-pointer border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                    duration === 2 ? 'border-2 border-[#005C55] bg-teal-50/40 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="radio"
                      name="duration_radio"
                      checked={duration === 2}
                      onChange={() => setDuration(2)}
                      className="text-[#005C55] focus:ring-[#005C55] h-4 w-4"
                    />
                    <span className="text-xs text-slate-400">Cơ bản</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">2 Giờ</div>
                  <div className="text-xs text-slate-500 mt-1">Phù hợp căn hộ Studio hoặc dọn phòng khách nhanh.</div>
                  <div className="mt-3 pt-2 border-t border-slate-100 font-bold text-base text-[#005C55]">170.000đ</div>
                </label>

                {/* 3H (Featured) */}
                <label
                  onClick={() => setDuration(3)}
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col justify-between relative shadow-sm transition-all ${
                    duration === 3 ? 'border-[#005C55] bg-teal-50/50' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="absolute -top-3 left-4 bg-[#FD651E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Khuyên Dùng
                  </span>
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="radio"
                      name="duration_radio"
                      checked={duration === 3}
                      onChange={() => setDuration(3)}
                      className="text-[#005C55] focus:ring-[#005C55] h-4 w-4"
                    />
                    <span className="text-xs text-[#005C55] font-bold">Tối ưu nhất</span>
                  </div>
                  <div className="text-base font-bold text-[#005C55]">3 Giờ</div>
                  <div className="text-xs text-slate-600 mt-1">Phù hợp hoàn hảo cho căn hộ 2 phòng ngủ & 2 WC thông thường.</div>
                  <div className="mt-3 pt-2 border-t border-teal-200 font-bold text-base text-[#005C55]">255.000đ</div>
                </label>

                {/* 4H */}
                <label
                  onClick={() => setDuration(4)}
                  className={`cursor-pointer border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                    duration === 4 ? 'border-2 border-[#005C55] bg-teal-50/40 shadow-xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="radio"
                      name="duration_radio"
                      checked={duration === 4}
                      onChange={() => setDuration(4)}
                      className="text-[#005C55] focus:ring-[#005C55] h-4 w-4"
                    />
                    <span className="text-xs text-slate-400">Chuyên sâu</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">4 Giờ</div>
                  <div className="text-xs text-slate-500 mt-1">Vệ sinh sâu kỹ từng ngóc ngách, bếp dầu mỡ và nhà tắm ố vàng.</div>
                  <div className="mt-3 pt-2 border-t border-slate-100 font-bold text-base text-[#005C55]">340.000đ</div>
                </label>
              </div>
            </div>

            {/* C. Tiện ích cộng thêm */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005C55] text-white flex items-center justify-center text-xs font-bold">C</span>
                  <h2 className="text-base font-bold text-slate-900">Tiện ích cộng thêm (Tùy chọn)</h2>
                </div>
                <span className="text-xs text-slate-500">Chọn theo nhu cầu</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`flex items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all ${addons.tools ? 'border-[#005C55] bg-teal-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={addons.tools}
                    onChange={(e) => setAddons({ ...addons, tools: e.target.checked })}
                    className="rounded text-[#005C55] focus:ring-[#005C55] mt-1 h-4 w-4"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Mang kèm dụng cụ & hóa chất</span>
                      <span className="text-xs text-[#005C55] font-bold">+35.000đ</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Nước tẩy sinh học organic hữu cơ, khăn vi sợi, chổi & cây lau nhà.</p>
                  </div>
                </label>

                <label className={`flex items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all ${addons.ironing ? 'border-[#005C55] bg-teal-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={addons.ironing}
                    onChange={(e) => setAddons({ ...addons, ironing: e.target.checked })}
                    className="rounded text-[#005C55] focus:ring-[#005C55] mt-1 h-4 w-4"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Ủi đồ gia đình</span>
                      <span className="text-xs text-[#005C55] font-bold">+50.000đ</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Tối đa 10 áo sơ mi hoặc quần âu với bàn ủi hơi nước chuyên dụng.</p>
                  </div>
                </label>

                <label className={`flex items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all ${addons.fridge ? 'border-[#005C55] bg-teal-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={addons.fridge}
                    onChange={(e) => setAddons({ ...addons, fridge: e.target.checked })}
                    className="rounded text-[#005C55] focus:ring-[#005C55] mt-1 h-4 w-4"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Khử khuẩn tủ lạnh & lò vi sóng</span>
                      <span className="text-xs text-[#005C55] font-bold">+80.000đ</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Dọn mốc, lau sạch khay kệ và khử mùi ozon sinh học tự nhiên.</p>
                  </div>
                </label>

                <label className={`flex items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all ${addons.window ? 'border-[#005C55] bg-teal-50/40' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    checked={addons.window}
                    onChange={(e) => setAddons({ ...addons, window: e.target.checked })}
                    className="rounded text-[#005C55] focus:ring-[#005C55] mt-1 h-4 w-4"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Lau kính mặt ngoài ban công</span>
                      <span className="text-xs text-[#005C55] font-bold">+40.000đ</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Kính ban công và cửa lùa không gian mở (đảm bảo an toàn độ cao).</p>
                  </div>
                </label>
              </div>
            </div>

            {/* D. Thời gian & Tần suất */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005C55] text-white flex items-center justify-center text-xs font-bold">D</span>
                  <h2 className="text-base font-bold text-slate-900">Thời gian & Tần suất công việc</h2>
                </div>

                <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFrequency('recurring')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                      frequency === 'recurring' ? 'bg-white text-[#005C55] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Lặp lại định kỳ (-10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('once')}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                      frequency === 'once' ? 'bg-white text-[#005C55] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đặt một lần
                  </button>
                </div>
              </div>

              {/* Date Selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 mb-2">Chọn ngày làm việc</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedDate('23/10')}
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
                      selectedDate === '23/10' ? 'border-2 border-[#005C55] bg-teal-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400">Hôm nay</div>
                    <div className="text-sm font-bold text-slate-800">23/10</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDate('24/10')}
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
                      selectedDate === '24/10' ? 'border-2 border-[#005C55] bg-teal-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400">Ngày mai</div>
                    <div className="text-sm font-bold text-slate-800">24/10</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDate('25/10')}
                    className={`p-2.5 rounded-xl border text-center relative transition-colors ${
                      selectedDate === '25/10' ? 'border-2 border-[#005C55] bg-teal-50/80 ring-1 ring-teal-200' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 bg-[#FD651E] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      Cuối tuần
                    </span>
                    <div className="text-[11px] text-[#005C55] font-bold">Thứ Bảy</div>
                    <div className="text-sm font-bold text-[#005C55]">25/10</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDate('26/10')}
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
                      selectedDate === '26/10' ? 'border-2 border-[#005C55] bg-teal-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] text-slate-400">Chủ Nhật</div>
                    <div className="text-sm font-bold text-slate-800">26/10</div>
                  </button>
                </div>
              </div>

              {/* Time Grid Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Chọn giờ nhân viên bắt đầu có mặt</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['08:00', '08:30', '09:00', '10:00', '14:00', '17:30'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 rounded-xl text-center text-xs font-bold transition-colors border ${
                        selectedTime === slot
                          ? 'border-2 border-[#005C55] bg-[#005C55] text-white shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* E. Địa chỉ thực hiện */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#005C55] text-white flex items-center justify-center text-xs font-bold">E</span>
                  <h2 className="text-base font-bold text-slate-900">Địa chỉ thực hiện dịch vụ</h2>
                </div>
                <span className="text-xs text-[#005C55] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">my_location</span>
                  Định vị chính xác
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                    Tòa nhà / Tên đường / Khu phức hợp
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#005C55]">search</span>
                    <input
                      type="text"
                      defaultValue="Chung cư Masteri Thảo Điền, Tháp T2, Số 159 Xa Lộ Hà Nội, P. Thảo Điền, TP. Thủ Đức"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:border-[#005C55] focus:ring-2 focus:ring-teal-100"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#005C55] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Số căn hộ / Tầng</label>
                    <input
                      type="text"
                      defaultValue="T2-14.08"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:border-[#005C55]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Ghi chú cho cộng tác viên</label>
                    <input
                      type="text"
                      defaultValue="Bấm chuông cửa số 1408, nhà có mèo nhỏ thân thiện"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:border-[#005C55]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary & Real-time Calculator (4 Cols) */}
          <aside className="lg:col-span-4 sticky top-20">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-[#005C55] to-[#0F766E] text-white flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#A3FAEF] font-bold">Đơn hàng dịch vụ</span>
                  <h3 className="text-lg font-bold leading-tight">Tóm tắt đặt hẹn</h3>
                </div>
                <span className="material-symbols-outlined text-white text-[32px]">receipt_long</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Snapshot Details Card */}
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-200 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      cleaning_services
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Dọn dẹp căn hộ tiêu chuẩn</div>
                      <div className="text-slate-500">Thời lượng: {duration} Giờ | 2 PN, 2 WC (65-80m²)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[20px] mt-0.5">event</span>
                    <div>
                      <div className="font-semibold text-slate-800">{selectedTime} - 11:30 | Thứ Bảy, 25/10/2025</div>
                      <div className="text-[#FD651E] font-medium">Lịch làm việc cuối tuần</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[20px] mt-0.5">pin_drop</span>
                    <div>
                      <div className="font-semibold text-slate-800">Căn T2-14.08, Masteri Thảo Điền</div>
                      <div className="text-slate-400 truncate max-w-[200px]">159 Xa Lộ Hà Nội, TP. Thủ Đức</div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 border-b border-slate-200 pb-4 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Phí dịch vụ cơ bản ({duration}h x 85k)</span>
                    <span className="font-semibold text-slate-900">{basePrice.toLocaleString()}đ</span>
                  </div>

                  {addons.tools && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Dụng cụ & chất tẩy hữu cơ</span>
                      <span className="font-semibold text-slate-900">+35.000đ</span>
                    </div>
                  )}

                  {addons.ironing && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Ủi quần áo (10 áo/quần)</span>
                      <span className="font-semibold text-slate-900">+50.000đ</span>
                    </div>
                  )}

                  {addons.fridge && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Khử khuẩn tủ lạnh & vi sóng</span>
                      <span className="font-semibold text-slate-900">+80.000đ</span>
                    </div>
                  )}

                  {addons.window && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Lau kính ngoài ban công</span>
                      <span className="font-semibold text-slate-900">+40.000đ</span>
                    </div>
                  )}

                  {weekendSurcharge > 0 && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Phụ phí ca Thứ Bảy</span>
                      <span className="font-semibold text-slate-900">+{weekendSurcharge.toLocaleString()}đ</span>
                    </div>
                  )}

                  {voucherApplied && (
                    <div className="flex justify-between items-center text-[#005C55] font-bold">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">loyalty</span>
                        Voucher CHAOBANMOI (-20%)
                      </span>
                      <span>-72.000đ</span>
                    </div>
                  )}
                </div>

                {/* Voucher Input */}
                <div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={voucher}
                        onChange={(e) => setVoucher(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-teal-300 text-[#005C55] font-bold rounded-xl text-xs uppercase tracking-wider"
                      />
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#005C55] text-[18px]">
                        check_circle
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVoucherApplied(!voucherApplied)}
                      className="px-3 py-2 bg-slate-100 text-slate-700 text-xs rounded-xl hover:bg-slate-200 transition-colors font-semibold"
                    >
                      {voucherApplied ? 'Bỏ mã' : 'Áp dụng'}
                    </button>
                  </div>
                  {voucherApplied && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[#005C55] text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[14px]">savings</span>
                      <span>Đã áp dụng giảm trực tiếp 20% cho khách hàng mới</span>
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-2">Phương thức thanh toán</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      onClick={() => setPaymentMethod('momo')}
                      className={`flex items-center p-2 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'momo' ? 'border-[#005C55] bg-teal-50/50' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'momo'}
                        onChange={() => setPaymentMethod('momo')}
                        className="text-[#005C55] focus:ring-[#005C55] h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-xs font-bold text-slate-900 flex items-center gap-1">
                        Ví MoMo
                        <span className="text-[9px] bg-orange-100 text-[#FD651E] px-1 rounded font-bold">-5%</span>
                      </span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('vnpay')}
                      className={`flex items-center p-2 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'vnpay' ? 'border-[#005C55] bg-teal-50/50' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'vnpay'}
                        onChange={() => setPaymentMethod('vnpay')}
                        className="text-[#005C55] focus:ring-[#005C55] h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-xs font-medium text-slate-700">VNPAY-QR</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center p-2 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'border-[#005C55] bg-teal-50/50' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-[#005C55] focus:ring-[#005C55] h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-xs font-medium text-slate-700">Thẻ Visa / Master</span>
                    </label>

                    <label
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center p-2 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'cash' ? 'border-[#005C55] bg-teal-50/50' : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="text-[#005C55] focus:ring-[#005C55] h-3.5 w-3.5"
                      />
                      <span className="ml-2 text-xs font-medium text-slate-700">Tiền mặt sau ca</span>
                    </label>
                  </div>
                </div>

                {/* Total Price */}
                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Tổng thanh toán (Đã gồm VAT)</span>
                    <div className="text-2xl font-extrabold text-[#005C55]">{total.toLocaleString()}đ</div>
                  </div>
                  {voucherApplied && (
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-[#FD651E] text-xs font-bold">
                      Tiết kiệm 72.000đ
                    </span>
                  )}
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="w-full py-3.5 px-4 bg-[#FD651E] hover:bg-[#EA580C] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 duration-150"
                >
                  <span>Tiến hành Xác nhận & Đặt lịch ngay</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                {/* Trust Guarantee */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[#005C55] text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span>Cam kết bồi thường & hoàn tiền 100%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Không hài lòng về chất lượng vệ sinh? Gia Đình Xanh điều phối nhân sự làm lại miễn phí trong 24 giờ.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
