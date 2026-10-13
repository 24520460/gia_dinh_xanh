import React, { useState, useEffect } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '@gdx/shared-types';

interface PartnerJobBoardProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PartnerJobBoard: React.FC<PartnerJobBoardProps> = ({ onNavigate }) => {
  // Urgent order countdown timer
  const [flashSeconds, setFlashSeconds] = useState(100); // 01:40
  const [radiusFilter, setRadiusFilter] = useState<'2km' | '5km' | '10km' | 'all'>('5km');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'clean' | 'cook'>('all');
  const [acceptedOrders, setAcceptedOrders] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatFlashTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAcceptJob = (jobId: string) => {
    setAcceptedOrders((prev) => [...prev, jobId]);
    alert(`Chúc mừng cô Mai đã nhận việc thành công đơn ${jobId}! Hệ thống đã điều hướng đến ca làm.`);
    onNavigate('partner-shift');
  };

  return (
    <div className="bg-[#FAF8FF] text-[#131B2E] min-h-screen flex flex-col font-sans">
      {/* Partner Global Header */}
      <header className="bg-white sticky top-0 z-40 shadow-xs border-b border-slate-200">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          {/* Brand & Status */}
          <div className="flex items-center gap-5">
            <button onClick={() => onNavigate('partner-shift')} className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
              <div>
                <span className="text-lg font-bold text-[#005C55] tracking-tight block">Gia Đình Xanh Partner</span>
                <span className="text-[11px] text-slate-500 font-semibold block">Cổng việc làm gia đình chuẩn 5 sao</span>
              </div>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#005C55]"></span>
              </span>
              <span className="text-xs font-bold text-[#005C55]">Đang bật nhận việc (Trực tuyến)</span>
            </div>
          </div>

          {/* Center GPS */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs">
            <span className="material-symbols-outlined text-[#005C55] text-[18px]">location_on</span>
            <span className="text-slate-600 font-medium">Toạ độ:</span>
            <span className="text-[#005C55] font-bold">Masteri Thảo Điền, TP. Thủ Đức</span>
            <button className="text-slate-400 hover:text-[#005C55] transition-colors ml-1" title="Cập nhật GPS">
              <span className="material-symbols-outlined text-[16px]">sync</span>
            </button>
          </div>

          {/* Trailing Controls */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Quick Wallet */}
            <button
              onClick={() => onNavigate('partner-wallet')}
              className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 transition-colors px-3 py-1.5 rounded-xl border border-teal-200"
            >
              <span className="material-symbols-outlined text-[#0F766E] text-xl">account_balance_wallet</span>
              <div className="text-right">
                <div className="text-[9px] uppercase font-bold text-slate-400 leading-none">Số dư ví</div>
                <div className="text-xs font-bold text-[#0F766E] leading-tight">3.420.000 đ</div>
              </div>
            </button>

            <button
              aria-label="Thông báo"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">3</span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            <button
              onClick={() => onNavigate('partner-wallet')}
              className="flex items-center gap-2 pl-1 group text-left"
            >
              <div className="relative">
                <img
                  src={IMAGES.hoangThiMaiPartnerAvatar}
                  alt="Cô Hoàng Thị Mai"
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shadow-xs"
                />
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#005C55] text-white rounded-full p-0.5 border border-white">
                  <span className="material-symbols-outlined text-[10px]">verified</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#005C55] transition-colors flex items-center gap-1">
                  Cô Hoàng Thị Mai
                  <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-full">
                    4.95 ★
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Đã duyệt KYC • 5 sao</div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* SUB-NAV */}
      <nav className="bg-white border-b border-slate-200 shadow-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8 text-sm font-semibold">
            <button className="text-[#005C55] border-b-2 border-[#005C55] py-3 flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-lg">work</span>
              <span>Cơ hội nhận việc</span>
              <span className="bg-[#005C55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">18</span>
            </button>
            <button onClick={() => onNavigate('partner-wallet')} className="text-slate-600 hover:text-[#005C55] py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              <span>Lịch làm & Ví</span>
            </button>
            <button onClick={() => onNavigate('partner-shift')} className="text-slate-600 hover:text-[#005C55] py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">event_available</span>
              <span>Ca hiện tại (#GDX-89241)</span>
            </button>
            <button onClick={() => onNavigate('admin-kyc')} className="text-slate-600 hover:text-[#005C55] py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">verified_user</span>
              <span>Hồ sơ KYC</span>
            </button>
          </div>

          <div className="flex items-center gap-3 py-2 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="material-symbols-outlined text-sm">bolt</span>
              <span>Tỷ lệ ghép ca thành công: 98.4%</span>
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Filter Ribbon */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#005C55]">
                <span className="material-symbols-outlined text-2xl animate-spin" style={{ animationDuration: '9s' }}>radar</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight">Sàn Nhận Việc & Bảng Tin Cơ Hội</h1>
                  <span className="bg-teal-50 text-[#005C55] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-200">Chế độ tức thì</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đang có <strong className="text-[#005C55] font-bold">18 đơn chờ tiếp nhận</strong> trong bán kính khả dụng quanh <span className="font-semibold text-slate-800">Masteri Thảo Điền</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Tự động làm mới:</span>
              <span className="inline-flex items-center gap-1 font-bold text-[#005C55] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                <span className="material-symbols-outlined text-sm">autorenew</span> 15s
              </span>
              <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600" title="Âm thanh">
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-4 items-center text-xs">
            {/* Radius */}
            <div className="md:col-span-4 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Bán kính:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                {(['2km', '5km', '10km', 'all'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadiusFilter(r)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      radiusFilter === r
                        ? 'bg-[#005C55] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#005C55]'
                    }`}
                  >
                    {r === 'all' ? 'Toàn TP' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Service */}
            <div className="md:col-span-5 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Dịch vụ:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setServiceFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                    serviceFilter === 'all' ? 'bg-[#005C55] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Tất cả</span>
                  <span className="bg-white/20 text-white text-[10px] px-1.5 rounded-full">18</span>
                </button>
                <button
                  type="button"
                  onClick={() => setServiceFilter('clean')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                    serviceFilter === 'clean' ? 'bg-[#005C55] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Dọn dẹp</span>
                  <span className="bg-slate-200 text-[#005C55] text-[10px] px-1.5 rounded-full">12</span>
                </button>
                <button
                  type="button"
                  onClick={() => setServiceFilter('cook')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                    serviceFilter === 'cook' ? 'bg-[#005C55] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>Nấu ăn & Đi chợ</span>
                  <span className="bg-slate-200 text-[#005C55] text-[10px] px-1.5 rounded-full">6</span>
                </button>
              </div>
            </div>

            {/* Time */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Khung giờ:</span>
              <select className="bg-white border border-slate-300 text-xs font-semibold rounded-xl py-1.5 px-3 focus:ring-2 focus:ring-[#005C55] text-slate-800">
                <option>Hôm nay (Ca chiều & tối)</option>
                <option>Hôm nay (Ca trưa)</option>
                <option>Ngày mai (Tất cả ca)</option>
                <option>Tuần này</option>
              </select>
            </div>
          </div>
        </section>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT RAIL: Job Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* CARD 1: FLASH URGENT JOB OFFER */}
            <article className="bg-white rounded-2xl border-2 border-[#FD651E] shadow-md overflow-hidden relative transition-all hover:shadow-lg">
              {/* Urgent Top Ribbon */}
              <div className="bg-gradient-to-r from-[#FD651E] via-orange-600 to-amber-600 px-4 py-2 text-white flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg leading-none animate-bounce">electric_bolt</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Cơ hội khẩn cấp: Giữ ca ưu tiên cho bạn</span>
                  <span className="bg-black/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Bắt đầu sau 35 phút</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white text-[#FD651E] px-2.5 py-0.5 rounded-full shadow-xs">
                  <span className="material-symbols-outlined text-sm animate-pulse">timer</span>
                  <span className="text-xs font-black tracking-wider">{formatFlashTime(flashSeconds)}</span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Mã: #GDX-90142</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005C55] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-xs">near_me</span>
                        Cách bạn 0.8 km
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Khoảng 4 phút đi xe máy</span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Dọn dẹp căn hộ 3PN (3 Giờ tiêu chuẩn)
                    </h2>

                    <div className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#0F766E] text-base">apartment</span>
                      <span>Chung cư Masteri An Phú, Tháp B, Phường Thảo Điền, TP. Thủ Đức</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:text-right bg-teal-50/70 p-3 rounded-xl border border-teal-200 min-w-[200px]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thu nhập thực nhận (Net)</div>
                    <div className="text-2xl font-extrabold text-[#005C55] tracking-tight leading-tight">255.000 đ</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Giá gốc: <span className="line-through">300.000đ</span> (Chiết khấu 15%)
                    </div>
                  </div>
                </div>

                {/* Job Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-4 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-lg mt-0.5">schedule</span>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Khung giờ</div>
                      <div className="font-bold text-slate-900">14:00 - 17:00 (Hôm nay)</div>
                      <div className="text-[11px] text-[#FD651E] font-semibold">Bắt đầu sau 35 phút</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-lg mt-0.5">person_pin</span>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Khách hàng</div>
                      <div className="font-bold text-slate-900 flex items-center gap-1">
                        Trần Thu Thảo
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded">VIP</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Đã đặt 24 ca dọn dẹp</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-lg mt-0.5">pets</span>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Lưu ý căn hộ</div>
                      <div className="font-bold text-slate-900">Có nuôi mèo hiền lành</div>
                      <div className="text-[11px] text-slate-500">Không gây dị ứng, rất dạn người</div>
                    </div>
                  </div>
                </div>

                {/* Add-on Alert Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-800">
                    <span className="material-symbols-outlined text-amber-700 text-base">cleaning_services</span>
                    <span>Yêu cầu đối tác mang dụng cụ lau dọn cơ bản & máy hút bụi cầm tay.</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-900 bg-white border border-amber-200 px-2 py-0.5 rounded shrink-0">
                    +35.000đ đã cộng vào Net
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => alert('Đã bỏ qua ca này')}
                    className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Bỏ qua đơn này
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptJob('#GDX-90142')}
                    className="px-8 py-3.5 rounded-xl bg-[#FD651E] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    <span>Nhận việc ngay (255.000đ)</span>
                  </button>
                </div>
              </div>
            </article>

            {/* CARD 2: #GDX-90155 Nấu ăn */}
            <article className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#005C55] transition-all p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Mã: #GDX-90155</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      <span className="material-symbols-outlined text-xs">navigation</span>
                      Cách 2.3 km (Mai Chí Thọ)
                    </span>
                    <span className="text-[11px] font-bold text-[#FD651E] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                      Nấu ăn & Đi chợ hộ
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900">
                    Nấu ăn gia đình 4 người + Đi chợ hộ
                  </h2>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 text-base">home</span>
                    <span>Căn hộ The Sun Avenue, Tháp 4, Phường An Phú, TP. Thủ Đức</span>
                  </div>
                </div>

                <div className="sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[190px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thu nhập thực nhận</div>
                  <div className="text-xl font-extrabold text-[#005C55] leading-tight">280.000 đ</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Gói nấu 250k + phụ phí chợ 30k</div>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed text-slate-800">
                  <strong className="font-bold text-[#005C55] block mb-0.5">Thực đơn yêu cầu chuẩn bị:</strong>
                  Canh chua cá bớp bông điên điển, thịt heo kho tàu trứng cút, rau củ luộc thập cẩm chấm kho quẹt Nam Bộ.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#005C55]">schedule</span>
                    <span>Khung giờ: <strong>Hôm nay 16:30 - 18:30</strong> (2 Giờ)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#005C55]">shopping_basket</span>
                    <span>Khách đã chuyển khoản ứng trước 250.000đ</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="text-slate-400 font-medium">Hạn nhận việc trước: <strong className="text-slate-800">15:45 hôm nay</strong></div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAcceptJob('#GDX-90155')}
                    className="px-5 py-2.5 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Xem chi tiết & Nhận việc</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            </article>

            {/* CARD 3: #GDX-90160 Dọn dẹp tiêu chuẩn */}
            <article className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#005C55] transition-all p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Mã: #GDX-90160</span>
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      Cách 1.2 km
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      Ca sáng mai
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Dọn dẹp tiêu chuẩn 2 Giờ (Căn hộ 1PN + 1)
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 text-base">apartment</span>
                    <span>Chung cư Thảo Điền Pearl, Số 12 Quốc Hương, Thảo Điền</span>
                  </div>
                </div>

                <div className="sm:text-right bg-slate-50 p-2.5 rounded-xl border border-slate-200 min-w-[170px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thu nhập thực nhận</div>
                  <div className="text-lg font-bold text-[#005C55]">150.000 đ</div>
                  <div className="text-[11px] text-slate-500">Net về ví sau ca làm</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2 text-xs">
                <div className="flex items-center gap-4 text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#005C55] text-base">calendar_month</span>
                    <strong>Sáng mai 08:30 - 10:30</strong>
                  </span>
                  <span>Dụng cụ khách đã chuẩn bị sẵn</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAcceptJob('#GDX-90160')}
                  className="px-5 py-2 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-xs transition-all shadow-xs"
                >
                  Nhận việc
                </button>
              </div>
            </article>

            {/* CARD 4: #GDX-90168 Tổng vệ sinh */}
            <article className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#005C55] transition-all p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Mã: #GDX-90168</span>
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      Cách 3.5 km (Bình Thạnh)
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Tổng vệ sinh sâu 4 Giờ
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Dọn dẹp nhà phố 4 Giờ (Tổng vệ sinh sâu + Lau kính)
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-slate-400 text-base">villa</span>
                    <span>Khu biệt thự Vinhomes Central Park, 208 Nguyễn Hữu Cảnh</span>
                  </div>
                </div>

                <div className="sm:text-right bg-teal-50 p-2.5 rounded-xl border border-teal-200 min-w-[170px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thu nhập thực nhận</div>
                  <div className="text-lg font-bold text-[#005C55]">340.000 đ</div>
                  <div className="text-[11px] text-[#005C55] font-semibold">Bao gồm phụ phí lau kính</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2 my-2 border border-slate-200">
                <span className="material-symbols-outlined text-[#005C55] text-base">info</span>
                <span>Yêu cầu có kinh nghiệm vệ sinh kính ban công cao tầng và hút bụi rèm cửa cao cấp.</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4 text-slate-600">
                  <span>Khung giờ: <strong>Hôm nay 13:30 - 17:30</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Khách quen tip cao (+50k tip mặt)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAcceptJob('#GDX-90168')}
                  className="px-5 py-2 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-xs transition-all shadow-xs"
                >
                  Nhận việc
                </button>
              </div>
            </article>
          </div>

          {/* RIGHT RAIL: Radar Map, Income Goal, Golden Rules (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* WIDGET 1: MINI BẢN ĐỒ NHIỆT RADAR */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-xl">my_location</span>
                  <h3 className="text-sm font-bold text-slate-900">Radar Đơn Xung Quanh</h3>
                </div>
                <span className="text-[11px] font-bold text-[#005C55] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  Bán kính 5km
                </span>
              </div>

              {/* Radar Visual Box */}
              <div className="relative w-full h-52 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
                  style={{ backgroundImage: `url('${IMAGES.radarMapSatellite}')` }}
                ></div>

                {/* Concentric radar circles */}
                <div className="absolute w-44 h-44 rounded-full border border-teal-500/30 radar-pulse pointer-events-none"></div>
                <div className="absolute w-28 h-28 rounded-full border border-teal-500/40 pointer-events-none"></div>
                <div className="absolute w-12 h-12 rounded-full border border-teal-400/60 pointer-events-none"></div>

                {/* Worker Current Position */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-teal-400 opacity-60"></span>
                    <div className="w-8 h-8 rounded-full bg-[#005C55] border-2 border-white flex items-center justify-center text-white shadow-lg">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                  </div>
                  <span className="mt-1 bg-black/80 backdrop-blur text-[10px] font-bold text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40">
                    Vị trí của bạn (Thảo Điền)
                  </span>
                </div>

                {/* Job Pins */}
                <div
                  onClick={() => handleAcceptJob('#90142')}
                  className="absolute top-10 right-10 z-10 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                >
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FD651E]"></span>
                  </span>
                  <span className="text-[9px] bg-[#FD651E] text-white font-bold px-1.5 py-0.2 rounded shadow">
                    255k • #90142
                  </span>
                </div>

                <div className="absolute bottom-8 right-10 z-10 flex items-center gap-1 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400 border border-white"></div>
                  <span className="text-[9px] bg-slate-800 text-teal-200 font-medium px-1.5 py-0.2 rounded border border-teal-700">
                    280k
                  </span>
                </div>

                <div className="absolute top-12 left-10 z-10 flex items-center gap-1 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400 border border-white"></div>
                  <span className="text-[9px] bg-slate-800 text-teal-200 font-medium px-1.5 py-0.2 rounded border border-teal-700">
                    150k
                  </span>
                </div>

                <div className="absolute bottom-10 left-12 z-10 flex items-center gap-1 cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></div>
                  <span className="text-[9px] bg-slate-800 text-amber-200 font-medium px-1.5 py-0.2 rounded border border-amber-700">
                    340k
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 text-[10px] text-teal-200/70 font-mono flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  GPS: 10.8031° N, 106.7380° E
                </div>
              </div>

              {/* Radar legend */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FD651E]"></span> Đơn khẩn cấp
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#005C55]"></span> Đơn thường
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Đơn ca sâu
                </span>
              </div>
            </div>

            {/* WIDGET 2: MỤC TIÊU THU NHẬP HÔM NAY */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-xl">savings</span>
                  <h3 className="text-sm font-bold text-slate-900">Mục Tiêu Thu Nhập Hôm Nay</h3>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Mục tiêu hiện tại: 600.000đ/ngày')}
                  className="text-slate-400 hover:text-[#005C55] text-xs font-semibold"
                >
                  Đổi mục tiêu
                </button>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-extrabold text-[#005C55] tracking-tight">499.800 đ</span>
                  <span className="text-xs text-slate-400 font-medium"> / 600.000 đ</span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Đạt 83%
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div className="bg-gradient-to-r from-[#005C55] via-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '83.3%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Đã hoàn thành 2 ca sáng</span>
                  <span>Còn thiếu 100.200 đ</span>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
                <span className="material-symbols-outlined text-[#005C55] text-xl mt-0.5">celebration</span>
                <div>
                  <strong className="text-[#005C55] font-bold block mb-0.5">Sắp hoàn thành ngày làm việc!</strong>
                  Chỉ cần nhận thêm <strong className="text-[#FD651E]">1 đơn dọn dẹp bất kỳ</strong> để vượt mục tiêu và nhận thưởng chuyên cần <span className="font-bold text-[#005C55]">+50.000đ</span> vào ví.
                </div>
              </div>
            </div>

            {/* WIDGET 3: QUY TẮC VÀNG KHI NHẬN VIỆC */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-xl">gavel</span>
                <h3 className="text-sm font-bold text-slate-900">Quy Tắc Vàng Khi Nhận Việc</h3>
              </div>
              <p className="text-xs text-slate-500">
                Để bảo vệ đánh giá 5 sao và thứ hạng ưu tiên hiển thị đơn ngon của đối tác:
              </p>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-[#005C55] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="font-bold text-slate-900 block">Giữ ca ưu tiên trong 2 phút</strong>
                    Sau thời gian đếm ngược, đơn sẽ chuyển sang sàn chung cho đối tác khác.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-[#005C55] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="font-bold text-slate-900 block">Tuyệt đối không tự ý hủy ca</strong>
                    Hủy đơn sau xác nhận sẽ ảnh hưởng tỷ lệ hoàn thành và giảm điểm tín nhiệm ví.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-[#005C55] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="font-bold text-slate-900 block">Check-in đúng giờ bằng GPS</strong>
                    Có mặt trước 10 phút, bấm 'Đã đến nơi' tại cổng căn hộ để thông báo cho khách.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
