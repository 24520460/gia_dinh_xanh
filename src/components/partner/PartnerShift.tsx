import React, { useState, useEffect } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '../../types';

interface PartnerShiftProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PartnerShift: React.FC<PartnerShiftProps> = ({ onNavigate }) => {
  // Live Countdown timer
  const [totalSeconds, setTotalSeconds] = useState(1 * 3600 + 42 * 60 + 11);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setTotalSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Checklist items
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      title: 'Check-in vị trí và chụp 2 ảnh hiện trạng Before',
      desc: 'Đã lưu ảnh hiện trạng lên hệ thống máy chủ',
      time: '14:46 Xong',
      checked: true,
      inProgress: false,
    },
    {
      id: 2,
      title: 'Thu gom rác và phân loại các phòng',
      desc: '2 túi rác đã gom gọn gàng tại cửa logia',
      time: '15:05 Xong',
      checked: true,
      inProgress: false,
    },
    {
      id: 3,
      title: 'Hút bụi và lau sàn toàn bộ căn hộ',
      desc: 'Sử dụng dung dịch lau sàn hữu cơ sả chanh sinh học',
      time: '15:35 Xong',
      checked: true,
      inProgress: false,
    },
    {
      id: 4,
      title: 'Lau chùi vách kính ban công và lau bụi rèm',
      desc: 'Yêu cầu từ khách: Lau sạch dấu tay và vệt ố mép kính hướng sông',
      time: 'Đang thực hiện',
      checked: false,
      inProgress: true,
    },
    {
      id: 5,
      title: 'Vệ sinh khử khuẩn bồn rửa chén và bề mặt bếp nấu',
      desc: 'Làm sạch dầu mỡ khu vực bếp mở, tẩy cặn vôi vòi nước',
      time: '',
      checked: false,
      inProgress: false,
    },
    {
      id: 6,
      title: 'Sắp xếp gọn gàng phòng ngủ master và thay drap giường',
      desc: 'Drap sạch mới được để sẵn trên bàn trang điểm',
      time: '',
      checked: false,
      inProgress: false,
    },
  ]);

  const toggleItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
              inProgress: false,
              time: !item.checked ? 'Vừa xong' : '',
            }
          : item
      )
    );
  };

  const doneCount = checklist.filter((item) => item.checked).length;

  // Uploaded after photos state
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);

  const handleSimulatePhotoUpload = () => {
    const sample = IMAGES.livingRoomBeforeTracking;
    setAfterPhotos((prev) => [...prev, sample]);
    alert('Đã chụp và lưu thành công ảnh nghiệm thu phòng khách!');
  };

  return (
    <div className="bg-[#F8FAFC] text-[#131B2E] min-h-screen flex flex-col font-sans">
      {/* TOP BAR ĐỐI TÁC */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          {/* Brand & Partner Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#005C55] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#005C55] tracking-tight">Gia Đình Xanh</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[#005C55] text-[11px] font-bold border border-teal-200">
                    Đối tác 5 Sao
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  Phân hệ Thực thi Hiện trường • <span className="font-bold text-[#005C55]">#GDX-89241</span>
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200">
              <span className="relative flex h-3 w-3">
                <span className="pulse-effect absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#005C55]"></span>
              </span>
              <span className="text-xs text-[#005C55] font-bold">Đang thực hiện công việc</span>
            </div>
          </div>

          {/* Center Quick Stats */}
          <div className="hidden md:flex items-center gap-6 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
            <button
              onClick={() => onNavigate('partner-wallet')}
              className="flex items-center gap-2 hover:opacity-80 text-left transition-opacity"
            >
              <span className="material-symbols-outlined text-amber-700 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>wallet</span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ví khả dụng</p>
                <p className="text-sm font-bold text-slate-900">3.420.000đ</p>
              </div>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FD651E] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Đánh giá hiện tại</p>
                <p className="text-sm font-bold text-slate-900">4.95 <span className="text-slate-400 text-[11px] font-normal">(184 ca)</span></p>
              </div>
            </div>
          </div>

          {/* Partner Profile & SOS Hotline */}
          <div className="flex items-center gap-3">
            {/* SOS Button */}
            <a
              href="tel:19008899"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all text-xs font-bold shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
              <span className="hidden sm:inline">SOS Ops 24/7</span>
            </a>

            {/* Profile Badge */}
            <button
              onClick={() => onNavigate('partner-wallet')}
              className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 text-left"
            >
              <div className="relative">
                <img
                  src={IMAGES.hoangThiMaiAvatar}
                  alt="Cô Hoàng Thị Mai"
                  className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 shadow-xs"
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-[#005C55] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Cô Hoàng Thị Mai</p>
                <p className="text-[11px] text-slate-500">Mã ĐT: <span className="font-mono text-[#005C55] font-bold">DT-8892</span></p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN OPERATIONAL WORKSPACE */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TOP STEPPER: 4-STEP SERVICE STANDARDIZATION WORKFLOW */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005C55]">linear_scale</span>
              <h2 className="text-base font-bold text-slate-900">Tiến trình dịch vụ chuẩn hóa</h2>
            </div>
            <span className="text-xs text-[#005C55] font-bold px-3 py-1 bg-teal-50 rounded-full border border-teal-200">
              Bước 3 / 4 Đang diễn ra
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#005C55] text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">1. Đã nhận việc</p>
                <p className="text-[11px] text-slate-500">Đã xác nhận lúc 13:50</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#005C55] text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900">2. Check-in GPS</p>
                  <span className="material-symbols-outlined text-[#005C55] text-[14px]">done_all</span>
                </div>
                <p className="text-[11px] text-slate-500">14:35 tại Masteri Thảo Điền</p>
              </div>
            </div>

            {/* Step 3 (Active) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-50 border-2 border-[#005C55] shadow-xs relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#005C55] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[18px] animate-spin">autorenew</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#005C55]">3. Đang thực hiện</p>
                <p className="text-[11px] text-teal-800 font-semibold">Bắt đầu lúc 14:45</p>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#005C55]"></div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-dashed border-slate-300 opacity-80">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">4. Nghiệm thu & Chụp ảnh</p>
                <p className="text-[11px] text-slate-400">Chờ hoàn tất checklist</p>
              </div>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN WORKSPACE: LEFT (TIMER & TASKS) / RIGHT (CUSTOMER & PROOF) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN (7 COLS): INTERACTIVE TIMER & LIVE ACTIONS */}
          <div className="lg:col-span-7 space-y-6">
            {/* LIVE COUNTDOWN TIMER CARD */}
            <div className="bg-gradient-to-br from-[#005C55] to-[#004741] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm flex items-center gap-1.5 text-xs font-medium">
                    <span className="material-symbols-outlined text-[16px] text-orange-200">timer</span>
                    <span>Thời gian thực ca làm</span>
                  </div>
                  <span className="text-white/80 text-xs">• Khởi tạo: 14:45</span>
                </div>
                <div className="text-right">
                  <span className="text-white/70 text-[11px] block">Dự kiến hoàn tất</span>
                  <span className="text-xs font-bold text-orange-200">17:45 Hôm nay</span>
                </div>
              </div>

              {/* Big Countdown Display */}
              <div className="text-center my-4 sm:my-6">
                <div className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-white drop-shadow-sm flex items-center justify-center gap-2">
                  <span className="px-3.5 py-1.5 bg-white/10 rounded-2xl backdrop-blur-md">
                    {String(hours).padStart(2, '0')}
                  </span>
                  <span className="text-orange-200 opacity-80">:</span>
                  <span className="px-3.5 py-1.5 bg-white/10 rounded-2xl backdrop-blur-md">
                    {String(minutes).padStart(2, '0')}
                  </span>
                  <span className="text-orange-200 opacity-80">:</span>
                  <span className="px-3.5 py-1.5 bg-white/10 rounded-2xl backdrop-blur-md text-orange-200">
                    {String(seconds).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-3 font-medium">
                  Thời gian còn lại của gói dịch vụ <span className="text-white font-bold">3 Giờ</span> (Đã thực hiện: 01h 17m 45s)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-xs text-white/90 font-medium">
                  <span>Tiến độ ca làm (43%)</span>
                  <span>3 Giờ tiêu chuẩn</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5">
                  <div className="bg-[#FD651E] h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: '43%' }}></div>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3 mt-7">
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition active:scale-95 border border-white/15"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPaused ? 'play_arrow' : 'pause_circle'}
                  </span>
                  <span>{isPaused ? 'Tiếp tục ca làm' : 'Nghỉ giữa ca (10p)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Đã gửi thông báo gia hạn thêm giờ tới khách hàng Lê Minh Anh')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition active:scale-95 border border-white/15"
                >
                  <span className="material-symbols-outlined text-[18px]">more_time</span>
                  <span>Gia hạn thêm giờ</span>
                </button>
              </div>

              {/* Primary Big CTA */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    alert('Chuyển sang bước chụp ảnh nghiệm thu hoàn tất ca làm việc!');
                    onNavigate('customer-tracking');
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-[#FD651E] hover:bg-[#EA580C] text-white text-base font-bold shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-98"
                >
                  <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                  <span>Hoàn thành công việc & Chụp ảnh nghiệm thu</span>
                </button>
              </div>
            </div>

            {/* CHECKLIST CÔNG VIỆC CHUẨN HOÁ */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55]">checklist_rtl</span>
                    Quy chuẩn Checklist làm sạch
                  </h3>
                  <p className="text-xs text-slate-500">Đánh dấu sau khi hoàn thành từng hạng mục cụ thể</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-[#005C55] border border-teal-200">
                  {doneCount} / {checklist.length} Mục đã xong
                </span>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition cursor-pointer ${
                      item.checked
                        ? 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
                        : item.inProgress
                        ? 'bg-teal-50/50 border-2 border-[#005C55]/60 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-[#005C55] focus:ring-[#005C55] h-5 w-5 border-slate-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.title}
                        </p>
                        {item.inProgress && !item.checked && (
                          <span className="px-2 py-0.5 rounded-md bg-[#FD651E] text-white text-[10px] font-bold">
                            Đang thực hiện
                          </span>
                        )}
                        {item.time && !item.inProgress && (
                          <span className="text-[11px] text-[#005C55] font-semibold">{item.time}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* SAFETY & OPS INCIDENT ASSISTANCE */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#005C55] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">shield</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Bảo hiểm trách nhiệm & Thao tác an toàn</p>
                  <p className="text-[11px] text-slate-500">Gặp đồ vật nứt vỡ từ trước hoặc khách vắng mặt ngoài ý muốn?</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Mở cửa sổ ghi nhận sự cố: Chụp ảnh hiện trường & gọi ngay Dispatcher')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span className="material-symbols-outlined text-[18px]">report_problem</span>
                <span>Báo cáo sự cố ngay</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN (5 COLS): ORDER INFO, CLIENT CARD, NAVIGATION & PHOTO PROOF */}
          <div className="lg:col-span-5 space-y-6">
            {/* THU NHẬP THỰC NHẬN CỦA ĐỐI TÁC */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-600">Thu nhập thực nhận của cô Mai:</span>
                <span className="px-2 py-0.5 rounded bg-teal-50 text-[#005C55] text-[11px] font-bold border border-teal-200">
                  Cộng ví sau khi hoàn tất
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#005C55]">
                  244.800 đ
                </div>
                <div className="text-right text-xs text-slate-500 leading-relaxed">
                  Đơn giá: <span className="font-bold text-slate-900">288.000đ</span> <br />
                  Hoa hồng sàn 15%: <span className="text-red-600 font-semibold">-43.200đ</span>
                </div>
              </div>
            </div>

            {/* THÔNG TIN KHÁCH HÀNG & LIÊN HỆ AN TOÀN */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FD651E] flex items-center justify-center font-bold text-base">
                    MA
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900">Lê Minh Anh</p>
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#005C55] text-[10px] font-bold border border-teal-200">
                        VIP Platinum
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">SĐT liên hệ: 0912 ••• 456</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Contact */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:0912000000"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#005C55] text-white text-xs font-bold hover:bg-[#0F766E] transition shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
                  <span>Gọi ẩn số an toàn</span>
                </a>
                <button
                  type="button"
                  onClick={() => alert('Mở chat nội bộ với khách hàng Lê Minh Anh')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#005C55] text-xs font-bold transition border border-teal-200"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Mở Chat nội bộ</span>
                </button>
              </div>

              {/* Address & Navigation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-[20px] flex-shrink-0 mt-0.5">home_pin</span>
                  <div>
                    <p className="font-bold text-slate-900">Căn hộ T2-14.08 Masteri Thảo Điền</p>
                    <p className="text-slate-500">159 Xa Lộ Hà Nội, P. Thảo Điền, TP. Thủ Đức, TP.HCM</p>
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-[11px]">
                  <span className="text-[#005C55] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    Đã check-in (Toạ độ 10.8038° N, 106.7383° E)
                  </span>
                  <a
                    className="text-[#005C55] font-bold flex items-center gap-0.5 hover:underline"
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Bản đồ chỉ đường
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Ghi chú đặc biệt từ khách hàng */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
                  <span className="material-symbols-outlined text-[18px]">pets</span>
                  <span>Ghi chú quan trọng của gia chủ:</span>
                </div>
                <p className="italic leading-relaxed">
                  "Nhấn chuông cửa số 1408, nhà có nuôi 1 bé mèo Anh lông ngắn rất thân thiện. Cần lau kỹ khu vực bếp mở và cửa kính ban công hướng sông."
                </p>
              </div>
            </div>

            {/* PHOTO PROOF UPLOAD SECTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55]">add_a_photo</span>
                  Khu vực hình ảnh nghiệm thu
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Bắt buộc trước & sau</span>
              </div>

              {/* Before Photos Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                    Ảnh Hiện trạng Trước khi làm (Before - 2 Ảnh)
                  </span>
                  <span className="text-[#005C55] font-semibold text-[11px]">14:46 Đã xác thực</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
                    <img
                      src={IMAGES.kitchenBefore}
                      alt="Bếp trước khi làm"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                      Khu vực bếp 14:46
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 group">
                    <img
                      src={IMAGES.livingRoomBefore}
                      alt="Phòng khách trước khi làm"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium">
                      Phòng khách 14:46
                    </span>
                  </div>
                </div>
              </div>

              {/* After Photos Gallery */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-[#005C55] uppercase tracking-wider text-[10px]">
                    Ảnh Nghiệm thu Hoàn thành (After - Cần 2-4 ảnh)
                  </span>
                  <span className="text-[#FD651E] font-bold text-[11px]">
                    {afterPhotos.length > 0 ? `Đã chụp ${afterPhotos.length} ảnh` : 'Chờ chụp'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSimulatePhotoUpload}
                    className="border-2 border-dashed border-teal-300 hover:border-[#005C55] rounded-xl aspect-video flex flex-col items-center justify-center p-3 text-[#005C55] bg-teal-50/50 hover:bg-teal-50 transition group"
                  >
                    <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">photo_camera</span>
                    <span className="text-xs font-bold mt-1 text-center">Chụp ảnh mới</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulatePhotoUpload}
                    className="border border-dashed border-slate-300 hover:border-slate-400 rounded-xl aspect-video flex flex-col items-center justify-center p-3 text-slate-600 bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <span className="material-symbols-outlined text-[28px]">image</span>
                    <span className="text-xs font-semibold mt-1 text-center">Tải từ thư viện</span>
                  </button>
                </div>

                {afterPhotos.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {afterPhotos.map((url, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-emerald-300 aspect-video">
                        <img src={url} alt={`After photo ${i + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                          <span className="material-symbols-outlined text-xs">check</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[11px] text-slate-400 mt-2 text-center sm:text-left">
                  Khuyên dùng: 1 ảnh bếp sạch bóng, 1 ảnh phòng khách ngăn nắp, 1 ảnh kính ban công.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM DISPATCH & HELPER ACTION BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#005C55] text-[28px]">support_agent</span>
            <div>
              <p className="text-xs font-bold text-slate-900">Đội điều phối khu vực Thảo Điền - Quận 2</p>
              <p className="text-[11px] text-slate-500">Dispatcher phụ trách: Nguyễn Văn Quân • Trực tuyến hỗ trợ dụng cụ & đổi ca</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => alert('Mở tài liệu: Hướng dẫn sơ cứu vết cắt, xử lý dị ứng & số cấp cứu khẩn cấp')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              Quy trình sơ cứu & An toàn
            </button>
            <a
              href="tel:0901234567"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-[#005C55] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span>Gọi Điều Phối Viên</span>
            </a>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-xs">
          <div>© 2025 Gia Đình Xanh Việt Nam • Ứng dụng dành riêng cho Đối tác Đội Ngũ Dịch Vụ Gia Đình.</div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Phiên bản v2.4.2-partner</span>
            <span>•</span>
            <span className="text-[#005C55] font-semibold">Tín hiệu GPS: Rất mạnh (0m)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
