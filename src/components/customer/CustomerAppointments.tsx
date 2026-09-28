import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '../../types';

interface CustomerAppointmentsProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenRatingModal: () => void;
}

export const CustomerAppointments: React.FC<CustomerAppointmentsProps> = ({
  onNavigate,
  onOpenRatingModal,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  return (
    <div className="bg-[#FAF8FF] text-[#131B2E] min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('customer-landing')} className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-xs">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
              <div>
                <span className="text-xl font-bold text-[#005C55] tracking-tight block">Gia Đình Xanh</span>
                <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-[#005C55]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Dịch vụ gia đình chuẩn 5 sao
                </span>
              </div>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <button onClick={() => onNavigate('customer-landing')} className="text-slate-600 hover:text-[#005C55] transition-colors">Trang chủ</button>
            <button onClick={() => onNavigate('customer-booking')} className="text-slate-600 hover:text-[#005C55] transition-colors">Đặt lịch</button>
            <button className="text-[#005C55] font-bold border-b-2 border-[#005C55] pb-1 flex items-center gap-1.5">
              <span>Lịch hẹn của tôi</span>
              <span className="w-2 h-2 rounded-full bg-[#FD651E]"></span>
            </button>
            <button onClick={() => onNavigate('customer-tracking')} className="text-slate-600 hover:text-[#005C55] transition-colors">
              Theo dõi đơn (#GDX-89241)
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FD651E] rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-2 pl-2 py-1 pr-3 rounded-full bg-slate-100 border border-slate-200">
              <img
                src={IMAGES.leMinhAnhCustomer}
                alt="Lê Minh Anh"
                className="w-8 h-8 rounded-full object-cover border border-teal-200"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800">Lê Minh Anh</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] uppercase font-bold">VIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1.5">
              <span>Tài khoản</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-700">Lịch hẹn của tôi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Quản lý lịch hẹn dịch vụ</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Đang kết nối tổng đài hỗ trợ 1900 6868...')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs bg-white hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[#005C55] text-lg">help_outline</span>
              <span>Hỗ trợ đơn hàng</span>
            </button>
            <button
              onClick={() => onNavigate('customer-booking')}
              className="px-5 py-2.5 rounded-xl bg-[#005C55] text-white font-bold text-xs hover:bg-[#0F766E] transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Đặt lịch mới</span>
            </button>
          </div>
        </div>

        {/* 2-Column Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bookings Feed (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-[#005C55] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Sắp tới & Đang chạy</span>
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  1
                </span>
              </button>

              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'completed'
                    ? 'bg-[#005C55] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Đã hoàn thành</span>
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === 'completed' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  12
                </span>
              </button>

              <button
                onClick={() => setActiveTab('cancelled')}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'cancelled'
                    ? 'bg-[#005C55] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Đã hủy</span>
                <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                  activeTab === 'cancelled' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  0
                </span>
              </button>
            </div>

            {/* CARD 1: ĐƠN VỪA HOÀN THÀNH - CHỜ ĐÁNH GIÁ (Action Card Hero) */}
            <article className="bg-white rounded-2xl border-2 border-orange-300 p-6 shadow-md relative overflow-hidden transition-all hover:shadow-lg">
              <div className="absolute -right-12 -top-12 w-36 h-36 bg-orange-100 rounded-full blur-2xl pointer-events-none"></div>

              {/* Header badge & ID */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FD651E] text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FD651E] animate-ping"></span>
                    Chờ đánh giá chất lượng
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-bold">#GDX-89241</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>Hoàn thành lúc 17:45 hôm nay</span>
                </div>
              </div>

              {/* Main Info */}
              <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-8 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-[#005C55] flex items-center justify-center flex-shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>cleaning_services</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-1">Dọn dẹp căn hộ tiêu chuẩn 3 Giờ</h2>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#005C55]">apartment</span>
                        <span>Căn hộ 3PN (94m²) - Tòa T5, Masteri Thảo Điền, TP. Thủ Đức</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#005C55]">person_outline</span>
                        <span>Đối tác: <strong className="text-slate-800">Cô Hoàng Thị Mai</strong> (Huy hiệu 5 sao)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                  <span className="text-xs text-slate-400 block mb-0.5">Tổng thanh toán</span>
                  <span className="text-xl font-extrabold text-[#005C55] block">270.000đ</span>
                  <span className="text-[11px] text-slate-400">Đã trừ ví MoMo</span>
                </div>
              </div>

              {/* Action Banner to Review */}
              <div className="mt-2 p-4 rounded-xl bg-teal-50/60 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-full bg-[#FD651E] text-white flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Ca làm vừa kết thúc hoàn hảo. Hãy đánh giá để nhận <strong className="text-[#FD651E]">+20 điểm Xanh</strong> và giúp cô Mai nhận thưởng nhé!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenRatingModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FD651E] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>Đánh giá dịch vụ ngay</span>
                </button>
              </div>
            </article>

            {/* CARD 2: ĐƠN SẮP TỚI NGÀY MAI (#GDX-89302) */}
            <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-[#005C55] text-xs font-bold flex items-center gap-1.5 border border-teal-200">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Đã phân công đối tác
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#GDX-89302</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#005C55] text-xs font-bold">
                  <span className="material-symbols-outlined text-base">event</span>
                  <span>17:30 - Ngày mai (26/10/2024)</span>
                </div>
              </div>

              <div className="py-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-8 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>soup_kitchen</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-1">Nấu ăn gia đình chuẩn vị Bắc (4 người)</h2>
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-[#005C55]">location_on</span>
                        <span>Căn hộ 3PN - Tòa T5, Masteri Thảo Điền, TP. Thủ Đức</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={IMAGES.coHoaChef} alt="Cô Bùi Thu Cúc" className="w-5 h-5 rounded-full object-cover" />
                        <span>Đối tác phụ trách: <strong className="text-slate-800">Cô Bùi Thu Cúc</strong> (4.95 ★ - 320 ca)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 md:text-right border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                  <span className="text-xs text-slate-400 block mb-0.5">Dự tính thanh toán</span>
                  <span className="text-xl font-extrabold text-slate-900 block">250.000đ</span>
                  <span className="text-[11px] text-slate-400">Giữ chỗ thẻ Visa **8821</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Mở khung chat trực tiếp với đối tác Cô Bùi Thu Cúc')}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>Nhắn tin đối tác</span>
                  </button>
                  <button
                    onClick={() => onNavigate('customer-booking')}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">edit_calendar</span>
                    <span>Đổi lịch</span>
                  </button>
                  <button
                    onClick={() => alert('Đã gửi yêu cầu hủy lịch')}
                    className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                  >
                    Hủy hẹn
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('customer-tracking')}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-[#005C55] font-bold text-xs hover:bg-teal-50 transition-colors flex items-center gap-1.5"
                >
                  <span>Xem chi tiết hợp đồng</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </article>

            {/* CARD 3: ĐƠN LỊCH SỬ TRƯỚC ĐÓ */}
            <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    Hoàn tất trọn vẹn
                  </span>
                  <span className="text-xs text-slate-400 font-mono">#GDX-88902</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  20/10/2024 • 14:00 - 17:00
                </div>
              </div>

              <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Dọn dẹp nhà chuyên sâu & Khử khuẩn Nano</h3>
                  <p className="text-xs text-slate-500 mt-1">Đối tác: <strong>Cô Hoàng Thị Mai</strong> • Phí dịch vụ: 360.000đ</p>
                </div>

                {/* Rated Stars */}
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">5.0 / 5</span>
                  <span className="text-[11px] text-slate-400">"Rất sạch & ưng ý"</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onNavigate('customer-booking')}
                  className="text-xs font-bold text-[#005C55] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  <span>Đặt lại dịch vụ này với cùng đối tác</span>
                </button>
              </div>
            </article>
          </div>

          {/* Right Column: Account Insights & Benefits (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* VIP Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-[#005C55] shadow-xs">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block">Hội viên đặc quyền</span>
                  <h4 className="text-base font-bold text-slate-900">Khách hàng Kim Cương</h4>
                  <p className="text-xs text-[#005C55] font-semibold">3.450 Điểm Xanh tích lũy</p>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className="bg-[#005C55] h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-[11px] text-slate-500 mb-4">Cần thêm 550 điểm để nhận voucher ưu đãi 100.000đ</p>

              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Số ca dịch vụ đã dùng:</span>
                  <strong className="text-slate-900 font-bold">13 ca</strong>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Đối tác tin dùng nhiều nhất:</span>
                  <strong className="text-[#005C55] font-bold">Cô Hoàng Thị Mai (9 ca)</strong>
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="bg-teal-50/70 rounded-2xl border border-teal-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#005C55] font-bold text-sm">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span>Cam kết an tâm tuyệt đối</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tất cả đối tác Gia Đình Xanh đều có hồ sơ lý lịch tư pháp số 2, khám sức khỏe định kỳ và bảo hiểm rủi ro tài sản lên đến 20.000.000đ cho mỗi ca làm việc.
              </p>
              <button
                onClick={() => alert('Chính sách bảo hiểm: Đền bù 100% tài sản trong 24h làm việc đối với mọi sự cố.')}
                className="inline-flex items-center gap-1 text-xs text-[#005C55] font-bold hover:underline"
              >
                <span>Xem chính sách bảo hiểm & bồi hoàn</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
