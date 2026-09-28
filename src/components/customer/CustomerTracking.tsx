import React, { useState, useEffect } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '../../types';

interface CustomerTrackingProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenRatingModal: () => void;
}

export const CustomerTracking: React.FC<CustomerTrackingProps> = ({
  onNavigate,
  onOpenRatingModal,
}) => {
  // Countdown simulation (starts at 1h 42m 15s)
  const [secondsLeft, setSecondsLeft] = useState(1 * 3600 + 42 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Checklist items state
  const [checklist, setChecklist] = useState([
    {
      id: 1,
      title: 'Thu gom rác và phân loại các phòng',
      desc: 'Đã đóng bao và mang ra phòng rác tầng 14 lúc 15:02',
      done: true,
      time: 'Hoàn tất',
    },
    {
      id: 2,
      title: 'Hút bụi và lau sàn toàn bộ căn hộ',
      desc: 'Sử dụng tinh dầu sả chanh tự nhiên sinh học',
      done: true,
      time: 'Hoàn tất',
    },
    {
      id: 3,
      title: 'Vệ sinh kính ban công và cửa sổ',
      desc: 'Đang thực hiện • Tỷ lệ lau sạch 2 mặt kính',
      done: false,
      inProgress: true,
      time: 'Đang lau dọn',
    },
    {
      id: 4,
      title: 'Ủi 10 áo quần sơ mi công sở',
      desc: 'Yêu cầu treo mắc áo phẳng nếp, cất tủ quần áo master',
      done: false,
      time: 'Chưa bắt đầu',
    },
    {
      id: 5,
      title: 'Khử khuẩn bề mặt bếp và bồn rửa',
      desc: 'Sử dụng dung dịch sát khuẩn an toàn thực phẩm chuẩn y tế',
      done: false,
      time: 'Chưa bắt đầu',
    },
  ]);

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done, inProgress: false } : item
      )
    );
  };

  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <div className="bg-[#FAF8FF] text-[#131B2E] min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('customer-landing')} className="text-xl font-bold text-[#005C55] tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              </span>
              <span>Gia Đình Xanh</span>
            </button>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
              <button onClick={() => onNavigate('customer-landing')} className="text-slate-600 hover:text-[#005C55]">Trang chủ</button>
              <button onClick={() => onNavigate('customer-booking')} className="text-slate-600 hover:text-[#005C55]">Đặt lịch mới</button>
              <button onClick={() => onNavigate('customer-appointments')} className="text-[#005C55] border-b-2 border-[#005C55] pb-1">
                Lịch hẹn của tôi
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
              <span className="material-symbols-outlined text-[#005C55] text-[18px]">location_on</span>
              <span>TP. Hồ Chí Minh / Quận 1</span>
            </div>
            <button onClick={() => onNavigate('customer-appointments')} className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img src={IMAGES.leMinhAnhCustomer} alt="Lê Minh Anh" className="w-8 h-8 rounded-full object-cover" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800">Lê Minh Anh</p>
                <p className="text-[10px] text-slate-500 font-medium">Khách hàng Platinum</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('customer-landing')} className="hover:text-[#005C55] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Trang chủ</span>
          </button>
          <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
          <button onClick={() => onNavigate('customer-appointments')} className="hover:text-[#005C55]">Lịch hẹn của tôi</button>
          <span className="material-symbols-outlined text-[14px] text-slate-300">chevron_right</span>
          <span className="text-[#005C55] font-bold">Theo dõi đơn hàng #GDX-89241</span>
        </nav>

        {/* Page Header & Live Status Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Đang theo dõi đơn hàng: Dọn dẹp căn hộ 3 Giờ
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#005C55] text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#005C55] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#005C55]"></span>
                </span>
                <span>Đang thực hiện (In Progress)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2 font-medium">
              <span>Mã đơn: <strong className="text-slate-800 font-bold">#GDX-89241</strong></span>
              <span className="text-slate-300">•</span>
              <span>Dịch vụ tiêu chuẩn: Căn hộ 2 phòng ngủ (75m²)</span>
              <span className="text-slate-300">•</span>
              <span>Hôm nay, 14:45 - 17:45</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRatingModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">grade</span>
              <span>Đánh giá nghiệm thu</span>
            </button>
            <button
              onClick={() => onNavigate('partner-shift')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#005C55] font-semibold text-xs border border-teal-200 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">timer</span>
              <span>Xem màn hình Đối tác</span>
            </button>
          </div>
        </div>

        {/* 5-Step Stepper Bar */}
        <section className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#005C55] text-[22px]">route</span>
              <span>Tiến trình phục vụ chuẩn 5 sao</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Cập nhật tự động mỗi 30s</span>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-slate-200 -z-0">
              <div className="h-full bg-[#005C55] transition-all duration-500" style={{ width: '72%' }}></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
              {/* Step 1 */}
              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                <div className="w-12 h-12 rounded-full bg-[#005C55] text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-teal-100">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <div>
                  <p className="text-xs text-[#005C55] font-bold">1. Đã tạo đơn</p>
                  <p className="text-[11px] text-slate-500">14:15 • Thành công</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                <div className="w-12 h-12 rounded-full bg-[#005C55] text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-teal-100">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <div>
                  <p className="text-xs text-[#005C55] font-bold">2. Đã nhận việc</p>
                  <p className="text-[11px] text-slate-500">14:18 • Hoàng Thị Mai</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                <div className="w-12 h-12 rounded-full bg-[#005C55] text-white flex items-center justify-center font-bold shadow-sm ring-4 ring-teal-100">
                  <span className="material-symbols-outlined text-[24px]">check</span>
                </div>
                <div>
                  <p className="text-xs text-[#005C55] font-bold">3. Đang di chuyển</p>
                  <p className="text-[11px] text-slate-500">14:35 • Đã đến nơi</p>
                </div>
              </div>

              {/* Step 4 (Active) */}
              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 bg-emerald-50/70 p-3 md:p-2 rounded-xl md:bg-transparent border border-emerald-200 md:border-transparent">
                <div className="w-12 h-12 rounded-full bg-[#FD651E] text-white flex items-center justify-center font-bold shadow-md ring-4 ring-orange-100 animate-pulse">
                  <span className="material-symbols-outlined text-[24px]">cleaning_services</span>
                </div>
                <div>
                  <p className="text-xs text-[#FD651E] font-bold">4. Đang dọn dẹp</p>
                  <p className="text-[11px] text-[#005C55] font-bold">Bắt đầu 14:45</p>
                  <p className="text-[11px] text-slate-500">Dự kiến xong 17:45</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex md:flex-col items-center md:text-center gap-4 md:gap-2 opacity-65">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold">5. Nghiệm thu & Xong</p>
                  <p className="text-[11px] text-slate-400">Chờ tiếp theo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Live status & Proof (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Countdown Timer Card */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1.5 bg-[#005C55] w-full"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-emerald-100 text-[#005C55] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">broadcast_on_home</span>
                  </span>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#005C55]">Cập nhật trực tiếp</span>
                    <h3 className="text-base font-bold text-slate-900">Tiến độ căn hộ thời gian thực</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="material-symbols-outlined text-[#FD651E] text-[20px]">timer</span>
                  <span className="text-xs text-slate-500">Thời gian còn lại:</span>
                  <span className="text-base font-mono font-bold text-[#FD651E]">{formatTimer(secondsLeft)}</span>
                </div>
              </div>

              {/* Notification Message */}
              <div className="my-4 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-[#005C55] text-[20px] mt-0.5">info</span>
                <p className="text-xs text-slate-800 leading-relaxed">
                  <strong className="font-bold text-[#005C55]">Cô Hoàng Thị Mai</strong> đã check-in lúc <span className="font-semibold">14:45</span> và đang tiến hành dọn phòng khách & bếp theo tiêu chuẩn Gia Đình Xanh.
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-500">Tiến độ hoàn thành dự kiến</span>
                  <span className="text-[#005C55]">45% (Đã làm 01h 15m / Tổng 3h 00m)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div className="h-full bg-[#005C55] rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            {/* Before / After Photos */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-[22px]">photo_library</span>
                  <h3 className="text-base font-bold text-slate-900">Hình ảnh đối chiếu Before / After</h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                  Chụp qua ứng dụng đối tác
                </span>
              </div>

              {/* Before Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Hiện trạng trước khi làm (Check-in 14:46)
                  </span>
                  <span className="text-slate-400">2 hình ảnh đã tải lên</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 aspect-video">
                    <img
                      src={IMAGES.kitchenBeforeTracking}
                      alt="Bếp trước khi dọn"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">kitchen</span>
                      <span>Khu vực bếp nấu & bồn rửa (14:46)</span>
                    </div>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 aspect-video">
                    <img
                      src={IMAGES.livingRoomBeforeTracking}
                      alt="Phòng khách trước khi dọn"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">living</span>
                      <span>Phòng khách & kệ sofa (14:47)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* After Section (Pending) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#005C55] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#005C55] animate-ping"></span>
                    Đang dọn dẹp & Sau khi làm (Nghiệm thu trực tiếp)
                  </span>
                  <span className="text-[#005C55] font-semibold">Đang đợi cập nhật khi hoàn tất</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl h-40 flex flex-col items-center justify-center p-4 text-center bg-slate-50/50">
                    <span className="material-symbols-outlined text-slate-400 text-[32px] mb-2 animate-bounce">camera_enhance</span>
                    <p className="text-xs font-bold text-slate-800">Ảnh nghiệm thu khu vực Bếp</p>
                    <p className="text-[11px] text-slate-500 mt-1">Đối tác sẽ chụp góc tương đương sau khi khử khuẩn xong.</p>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl h-40 flex flex-col items-center justify-center p-4 text-center bg-slate-50/50">
                    <span className="material-symbols-outlined text-slate-400 text-[32px] mb-2">image</span>
                    <p className="text-xs font-bold text-slate-800">Ảnh nghiệm thu Phòng khách & Kính</p>
                    <p className="text-[11px] text-slate-500 mt-1">Sẵn sàng đối chiếu độ sáng bóng trước khi bàn giao.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Checklist */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hạng mục công việc chuẩn (Checklist)</h3>
                  <p className="text-xs text-slate-500">Giúp việc đánh dấu trực tiếp sau khi hoàn thành từng phân đoạn</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-50 text-[#005C55] text-xs font-bold border border-teal-200">
                  {completedCount} / {checklist.length} hoàn tất
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                          item.done
                            ? 'bg-[#005C55] text-white'
                            : item.inProgress
                            ? 'border-2 border-[#FD651E] text-[#FD651E]'
                            : 'border-2 border-slate-300'
                        }`}
                      >
                        {item.done && <span className="material-symbols-outlined text-[18px]">done</span>}
                        {item.inProgress && !item.done && (
                          <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                        item.done
                          ? 'text-[#005C55] bg-emerald-50 border border-emerald-200'
                          : item.inProgress
                          ? 'text-[#FD651E] bg-orange-50 border border-orange-200'
                          : 'text-slate-400 bg-slate-50'
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Incident / Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => alert('Gửi yêu cầu hỗ trợ sự cố khẩn cấp đến đội ngũ CSKH Gia Đình Xanh (Hotline 1900 6868)')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">fmd_bad</span>
                <span>Báo cáo sự cố khẩn cấp</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert('Đã gửi thông báo yêu cầu đổi giờ làm tới đối tác')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                  <span>Yêu cầu đổi giờ làm</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('customer-booking')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Thêm giờ / Dịch vụ thêm</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Partner Info & Order Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card Hồ sơ Đối tác */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-[#005C55] font-bold">Đối tác phụ trách</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#005C55] text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span>Đã xác minh 100%</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={IMAGES.hoangThiMaiTrackingAvatar}
                    alt="Hoàng Thị Mai"
                    className="w-20 h-20 rounded-full object-cover border-2 border-teal-200 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white" title="Đang làm việc tại nhà">
                    <span className="material-symbols-outlined text-[14px]">home_repair_service</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Hoàng Thị Mai</h4>
                  <p className="text-xs text-slate-500">42 tuổi • 6 năm kinh nghiệm</p>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="flex items-center text-amber-500 font-bold">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      4.95
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-medium">320+ đơn xuất sắc</span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-[#005C55] text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">clean_hands</span>
                  Chuyên gia dọn dẹp chuyên sâu
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">pets</span>
                  Thân thiện với thú cưng
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">
                  Ủi đồ chuẩn khách sạn
                </span>
              </div>

              {/* Security note */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 text-[#005C55] font-bold">
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  <span>An toàn & Lý lịch minh bạch</span>
                </div>
                <p>Đã kiểm tra CCCD gắn chip, giấy khám sức khỏe và trích lục tư pháp số 2 không tiền án tiền sự.</p>
              </div>

              {/* Action Buttons: Call & Chat */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:0982888888"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white text-xs font-bold shadow-sm transition-all text-center"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  <span>0982 *** 888</span>
                </a>
                <button
                  type="button"
                  onClick={() => alert('Mở khung chat trực tiếp với đối tác Hoàng Thị Mai')}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#005C55] text-[#005C55] hover:bg-teal-50 text-xs font-bold transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Chat trực tiếp</span>
                </button>
              </div>
            </div>

            {/* Card Tóm tắt Đơn hàng & Địa chỉ */}
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[#005C55] text-[20px]">pin_drop</span>
                <span>Địa điểm & Chi tiết đơn</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#005C55] text-[20px] mt-0.5">apartment</span>
                  <div>
                    <p className="font-bold text-slate-900">Căn hộ T2-14.08 Masteri Thảo Điền</p>
                    <p className="text-slate-500">159 Xa lộ Hà Nội, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Ghi chú: Nhấn chuông cửa 14.08, gửi xe bảo vệ tháp T2.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <span className="material-symbols-outlined text-[#005C55] text-[20px] mt-0.5">schedule</span>
                  <div>
                    <p className="font-bold text-slate-900">Ca 3 Giờ (14:45 - 17:45)</p>
                    <p className="text-slate-500">Bao gồm dụng cụ lau dọn & hóa chất sinh học</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Giá dịch vụ gốc (3h):</span>
                    <span>320.000đ</span>
                  </div>
                  <div className="flex justify-between items-center text-[#005C55] font-semibold">
                    <span>Ưu đãi thành viên Platinum:</span>
                    <span>-32.000đ</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Tổng chi phí:</span>
                    <span className="text-lg font-extrabold text-[#005C55]">288.000đ</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-[8px]">M</span>
                      <span>Ví MoMo (Đã tạm giữ)</span>
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Bảo mật ký quỹ
                    </span>
                  </div>
                </div>
              </div>

              {/* Hủy hẹn button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => alert('Chính sách: Miễn phí hủy trước 2 giờ thực hiện. Đã ghi nhận yêu cầu.')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 text-xs font-bold transition-all"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">event_busy</span>
                    <span>Hủy lịch hẹn</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 font-normal">
                    (Miễn phí hủy trước 2 giờ thực hiện)
                  </span>
                </button>
              </div>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#005C55] text-[24px]">verified_user</span>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#005C55]">Cam kết hài lòng 100%</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nếu dịch vụ không đạt chuẩn, Gia Đình Xanh sẽ cử nhân sự làm lại miễn phí hoặc hoàn tiền trong 24 giờ.
                </p>
                <a className="inline-flex items-center gap-1 text-[#005C55] font-bold text-xs hover:underline pt-1" href="tel:19006868">
                  <span>Hotline 24/7: 1900 6868</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
