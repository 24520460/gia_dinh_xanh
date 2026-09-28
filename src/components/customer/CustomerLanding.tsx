import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';
import { ScreenId } from '../../types';

interface CustomerLandingProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CustomerLanding: React.FC<CustomerLandingProps> = ({ onNavigate }) => {
  const [bookingType, setBookingType] = useState<'clean' | 'cook'>('clean');
  const [selectedService, setSelectedService] = useState('standard');
  const [date, setDate] = useState('2025-05-18');
  const [time, setTime] = useState('08:00 - Sáng (Phổ biến)');
  const [address, setAddress] = useState('Chung cư Vinhomes Central Park, Bình Thạnh');

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('customer-booking');
  };

  return (
    <div className="bg-[#FAF8FF] text-[#131B2E] min-h-screen flex flex-col font-sans">
      {/* Top App Bar */}
      <header className="bg-white shadow-xs border-b border-slate-200 sticky top-0 z-40 transition-colors">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('customer-landing')} className="flex items-center gap-2 group text-left">
              <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>yard</span>
              </div>
              <span className="text-xl font-bold text-[#005C55] tracking-tight">Gia Đình Xanh</span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 ml-4 text-sm font-semibold">
              <button onClick={() => onNavigate('customer-landing')} className="text-[#005C55] border-b-2 border-[#005C55] pb-1">
                Trang chủ
              </button>
              <button onClick={() => onNavigate('customer-booking')} className="text-slate-600 hover:text-[#005C55] transition-colors">
                Dọn dẹp
              </button>
              <button onClick={() => onNavigate('customer-booking')} className="text-slate-600 hover:text-[#005C55] transition-colors">
                Nấu ăn
              </button>
              <a href="#pricing" className="text-slate-600 hover:text-[#005C55] transition-colors">
                Bảng giá
              </a>
              <button onClick={() => onNavigate('customer-tracking')} className="text-slate-600 hover:text-[#005C55] transition-colors">
                Theo dõi đơn (#GDX-89241)
              </button>
            </nav>
          </div>

          {/* Trailing Controls & User Portal Identity */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Location Picker */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:border-[#005C55] transition-colors cursor-pointer text-xs font-semibold">
              <span className="material-symbols-outlined text-[#005C55] text-[18px]">location_on</span>
              <span>TP. Hồ Chí Minh / Quận 1</span>
              <span className="material-symbols-outlined text-slate-400 text-[16px]">expand_more</span>
            </div>

            {/* Trailing Icon Actions */}
            <button
              aria-label="Thông báo"
              onClick={() => onNavigate('customer-appointments')}
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FD651E] rounded-full"></span>
            </button>

            <button
              aria-label="Lịch sử đặt đơn"
              onClick={() => onNavigate('customer-appointments')}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors hidden md:inline-flex"
            >
              <span className="material-symbols-outlined">history</span>
            </button>

            {/* Customer Identity Pill */}
            <button
              onClick={() => onNavigate('customer-appointments')}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-[#005C55] transition-colors"
            >
              <img
                src={IMAGES.leMinhAnhCustomer}
                alt="Lê Minh Anh"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="hidden xl:inline-block text-xs font-bold text-slate-800">Lê Minh Anh</span>
            </button>

            {/* Primary Trailing Action CTA */}
            <button
              onClick={() => onNavigate('customer-booking')}
              className="bg-[#005C55] hover:bg-[#0F766E] text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Đặt lịch ngay</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* HERO SECTION WITH QUICK BOOKING COMPONENT */}
        <section className="relative bg-gradient-to-b from-[#F2F3FF] via-[#FAF8FF] to-white pt-8 pb-16 md:py-16 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#9CF2E8]/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#FFDBCE]/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Narrative Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAEDFF] border border-[#80D5CB] text-[#005C55] font-bold text-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#005C55]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span>Dịch vụ gia đình chuẩn 5 sao tại TP.HCM & Hà Nội</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Không gian sạch tinh tươm - <br className="hidden sm:block" />
                  <span className="text-[#005C55]">Bữa cơm chuẩn vị mẹ nấu</span>
                </h1>

                <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                  Dịch vụ dọn dẹp nhà cửa và đầu bếp tại gia hàng đầu, đối tác xác thực lý lịch 100%, bảo hiểm đền bù toàn diện. Mang lại sự an tâm tuyệt đối cho tổ ấm thân yêu.
                </p>

                {/* Trust Metrics Bar */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 max-w-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">4.9 / 5.0</div>
                      <div className="text-xs text-slate-500">45,000+ hộ tin dùng</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800">
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">100% Hồ sơ</div>
                      <div className="text-xs text-slate-500">Xác minh lý lịch tư pháp</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Booking Hub Card */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 backdrop-blur-md relative">
                  {/* Tab Navigation Switcher */}
                  <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingType('clean');
                        setSelectedService('standard');
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        bookingType === 'clean'
                          ? 'bg-[#0F766E] text-white shadow-sm'
                          : 'text-slate-600 hover:text-[#005C55]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
                      <span>Dọn dẹp nhà cửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingType('cook');
                        setSelectedService('meal');
                      }}
                      className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        bookingType === 'cook'
                          ? 'bg-[#FD651E] text-white shadow-sm'
                          : 'text-slate-600 hover:text-[#FD651E]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">restaurant</span>
                      <span>Nấu ăn gia đình</span>
                    </button>
                  </div>

                  {/* Form Dynamic Body */}
                  <form className="space-y-4" onSubmit={handleQuickBook}>
                    {/* Package Option Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hình thức dịch vụ</label>
                      <div className="grid grid-cols-2 gap-2">
                        {bookingType === 'clean' ? (
                          <>
                            <label
                              onClick={() => setSelectedService('standard')}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedService === 'standard'
                                  ? 'border-[#005C55] bg-teal-50'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <input
                                type="radio"
                                checked={selectedService === 'standard'}
                                onChange={() => setSelectedService('standard')}
                                className="text-[#005C55] focus:ring-[#005C55] h-4 w-4"
                              />
                              <div>
                                <div className="text-xs font-bold text-slate-900">Dọn theo giờ tiêu chuẩn</div>
                                <div className="text-[11px] text-[#005C55] font-semibold">Từ 75.000đ/giờ</div>
                              </div>
                            </label>

                            <label
                              onClick={() => setSelectedService('deep')}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedService === 'deep'
                                  ? 'border-[#005C55] bg-teal-50'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <input
                                type="radio"
                                checked={selectedService === 'deep'}
                                onChange={() => setSelectedService('deep')}
                                className="text-[#005C55] focus:ring-[#005C55] h-4 w-4"
                              />
                              <div>
                                <div className="text-xs font-bold text-slate-900">Tổng vệ sinh chuyên sâu</div>
                                <div className="text-[11px] text-slate-500 font-semibold">Khử khuẩn toàn diện</div>
                              </div>
                            </label>
                          </>
                        ) : (
                          <>
                            <label
                              onClick={() => setSelectedService('meal')}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedService === 'meal'
                                  ? 'border-[#FD651E] bg-orange-50'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <input
                                type="radio"
                                checked={selectedService === 'meal'}
                                onChange={() => setSelectedService('meal')}
                                className="text-[#FD651E] focus:ring-[#FD651E] h-4 w-4"
                              />
                              <div>
                                <div className="text-xs font-bold text-slate-900">Nấu ăn theo bữa (Trưa/Tối)</div>
                                <div className="text-[11px] text-[#FD651E] font-semibold">Từ 180.000đ/bữa</div>
                              </div>
                            </label>

                            <label
                              onClick={() => setSelectedService('grocery')}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedService === 'grocery'
                                  ? 'border-[#FD651E] bg-orange-50'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <input
                                type="radio"
                                checked={selectedService === 'grocery'}
                                onChange={() => setSelectedService('grocery')}
                                className="text-[#FD651E] focus:ring-[#FD651E] h-4 w-4"
                              />
                              <div>
                                <div className="text-xs font-bold text-slate-900">Đi chợ siêu thị + Nấu ăn</div>
                                <div className="text-[11px] text-slate-500 font-semibold">Thực đơn theo yêu cầu</div>
                              </div>
                            </label>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Date & Time Slot Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ngày thực hiện</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">calendar_today</span>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005C55]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Khung giờ bắt đầu</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">schedule</span>
                          <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005C55] appearance-none"
                          >
                            <option>08:00 - Sáng (Phổ biến)</option>
                            <option>10:00 - Trưa</option>
                            <option>14:00 - Chiều</option>
                            <option>17:00 - Chiều tối</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">unfold_more</span>
                        </div>
                      </div>
                    </div>

                    {/* Location Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Khu vực sinh sống / Địa chỉ nhận dịch vụ</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#005C55] text-[20px]">pin_drop</span>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Nhập số nhà, tên đường, Quận/Huyện..."
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005C55]"
                        />
                      </div>
                    </div>

                    {/* Instant Booking Submit CTA */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 px-6 rounded-xl bg-[#FD651E] hover:bg-[#EA580C] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">flash_on</span>
                        <span>Đặt dịch vụ ngay trong 60s</span>
                      </button>
                      <p className="text-center text-xs text-slate-500 mt-2 font-medium">
                        Miễn phí hủy lịch trước 2 giờ • Không cần đặt cọc trước
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE SERVICES */}
        <section className="py-16 bg-white max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#005C55] text-xs uppercase tracking-wider font-bold">Chất Lượng Vàng Chuẩn 5 Sao</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Dịch vụ cốt lõi dành cho tổ ấm</h2>
            <p className="text-sm text-slate-600 mt-2">
              Đội ngũ chuyên nghiệp, kiểm định kỹ năng gắt gao cùng trang thiết bị sinh thái bảo vệ sức khỏe cả gia đình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Dọn dẹp */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/40 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-[#005C55] text-xs font-bold">Phổ biến nhất</span>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span>4.95</span>
                    <span className="text-slate-500 font-normal">(28,400+ đánh giá)</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">mop</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Dọn dẹp tiêu chuẩn & chuyên sâu</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Giải pháp giữ gìn không gian sống thơm mát, gọn gàng, khử trùng mọi bề mặt tiếp xúc.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 my-6 border-y border-slate-100 py-4 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Dọn theo giờ linh hoạt (Phòng khách, bếp, toilet, phòng ngủ)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Tổng vệ sinh nhà mới, căn hộ sau tân trang toàn diện</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Ủi đồ lụa cao cấp, gấp xếp quần áo phân loại khoa học</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Giặt hấp khử khuẩn sâu sofa, nệm kymdan, rèm cửa</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-[12px] text-slate-500 font-medium">Bảng giá tham khảo</div>
                  <div className="text-xl font-extrabold text-[#005C55]">
                    từ 75.000đ <span className="text-xs font-normal text-slate-500">/ giờ</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('customer-booking')}
                  className="px-5 py-2.5 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Xem chi tiết & Đặt</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Service 2: Nấu ăn */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/40 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FD651E] text-xs font-bold">Tiện lợi & Tươi ngon</span>
                  <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span>4.92</span>
                    <span className="text-slate-500 font-normal">(16,800+ bữa ăn)</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#FD651E] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">skillet</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Nấu ăn gia đình & Đi chợ hộ</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Bữa cơm nóng hổi, chuẩn khẩu vị từng miền, an toàn thực phẩm từ nguồn gốc rau củ sạch.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 my-6 border-y border-slate-100 py-4 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#FD651E] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Nấu theo bữa trưa / tối từ 2 - 6 món theo yêu cầu gia đình</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#FD651E] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Lên thực đơn dinh dưỡng theo tuần cho trẻ nhỏ & người lớn tuổi</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#FD651E] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Đi chợ siêu thị (Co.opmart, WinMart), có hóa đơn minh bạch</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#FD651E] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Dọn sạch gian bếp, rửa chén bát và khử khuẩn mặt bàn sau khi nấu</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-[12px] text-slate-500 font-medium">Bảng giá tham khảo</div>
                  <div className="text-xl font-extrabold text-[#FD651E]">
                    từ 180.000đ <span className="text-xs font-normal text-slate-500">/ bữa cơm</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('customer-booking')}
                  className="px-5 py-2.5 rounded-xl bg-[#FD651E] hover:bg-[#EA580C] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>Xem chi tiết & Đặt</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4-STEP PROCESS */}
        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[#005C55] text-xs uppercase tracking-wider font-bold">Thao Tác Tối Giản</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Trải nghiệm dịch vụ trong 4 bước</h2>
              <p className="text-sm text-slate-600 mt-2">
                Chủ động hoàn toàn thời gian, an tâm minh bạch từ khâu đặt ca tới khi hoàn tất nghiệm thu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#005C55] flex items-center justify-center font-bold text-lg mb-4">
                  <span className="material-symbols-outlined text-[24px]">touch_app</span>
                </div>
                <span className="text-xs font-bold text-[#005C55] tracking-widest uppercase mb-1">Bước 01</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">Đặt lịch trong 60s</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lựa chọn gói dọn dẹp hoặc nấu ăn, chọn ngày giờ và địa điểm thuận tiện nhất với gia đình bạn.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#005C55] flex items-center justify-center font-bold text-lg mb-4">
                  <span className="material-symbols-outlined text-[24px]">radar</span>
                </div>
                <span className="text-xs font-bold text-[#005C55] tracking-widest uppercase mb-1">Bước 02</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">Kết nối thợ gần nhất</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hệ thống thông minh tự động kết nối đối tác có đánh giá 4.9+ nằm trong bán kính gần bạn nhất.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#005C55] flex items-center justify-center font-bold text-lg mb-4">
                  <span className="material-symbols-outlined text-[24px]">task_alt</span>
                </div>
                <span className="text-xs font-bold text-[#005C55] tracking-widest uppercase mb-1">Bước 03</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">Thực hiện & Check-in</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nhân viên check-in đúng giờ bằng GPS, mang đầy đủ đồng phục, dụng cụ và thực hiện theo checklist.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FD651E] flex items-center justify-center font-bold text-lg mb-4">
                  <span className="material-symbols-outlined text-[24px]">verified_user</span>
                </div>
                <span className="text-xs font-bold text-[#FD651E] tracking-widest uppercase mb-1">Bước 04</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">Nghiệm thu & An tâm</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khách hàng kiểm tra hài lòng mới thanh toán. Đánh giá chất lượng trực tiếp qua ứng dụng.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SAFETY COMMITMENT BANNER */}
        <section className="py-16 bg-white max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-gradient-to-r from-[#005C55] to-[#0F766E] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
            <div className="max-w-3xl mb-10">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A3FAEF] text-xs font-bold tracking-wider">
                TIÊU CHUẨN AN TOÀN TUYỆT ĐỐI
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold mt-2">Cam kết bảo vệ & Tôn trọng tổ ấm</h2>
              <p className="text-white/90 text-sm mt-2 leading-relaxed">
                Mỗi nhân viên bước vào ngôi nhà của bạn đều được tuyển chọn và huấn luyện khắt khe như người chăm sóc gia đình mình.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 rounded-xl bg-white text-[#005C55] flex items-center justify-center mb-4 shadow">
                  <span className="material-symbols-outlined text-[26px]">policy</span>
                </div>
                <h3 className="text-base font-bold mb-2">Lý lịch trong sạch</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  100% đối tác có giấy xác nhận hạnh kiểm công an phường & kiểm tra sức khỏe định kỳ.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 rounded-xl bg-white text-[#005C55] flex items-center justify-center mb-4 shadow">
                  <span className="material-symbols-outlined text-[26px]">security</span>
                </div>
                <h3 className="text-base font-bold mb-2">Bồi thường tới 100%</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Bảo hiểm trách nhiệm tài sản toàn diện đối với mọi rủi ro hư hỏng hay thất thoát trong ca làm.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 rounded-xl bg-white text-[#005C55] flex items-center justify-center mb-4 shadow">
                  <span className="material-symbols-outlined text-[26px]">workspace_premium</span>
                </div>
                <h3 className="text-base font-bold mb-2">Đào tạo chuẩn 5 sao</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Khóa huấn luyện 120 giờ về nghiệp vụ dọn dẹp, giao tiếp lịch thiệp và an toàn vệ sinh món ăn.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 rounded-xl bg-white text-[#005C55] flex items-center justify-center mb-4 shadow">
                  <span className="material-symbols-outlined text-[26px]">published_with_changes</span>
                </div>
                <h3 className="text-base font-bold mb-2">Đổi thợ tức thì</h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  Không hài lòng với chất lượng? Chúng tôi lập tức cử đối tác khác hoàn toàn miễn phí.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[#005C55] text-xs uppercase tracking-wider font-bold">Người Thật - Trải Nghiệm Thật</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Đánh giá khách hàng & Đối tác tiêu biểu</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Sự hài lòng của khách hàng và tinh thần trách nhiệm của người lao động là tôn chỉ của Gia Đình Xanh.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    “Công việc bận rộn nên mình đặt dịch vụ nấu ăn tối 3 buổi/tuần. Cô Hoa nấu các món miền Trung cực kỳ vừa miệng, canh chua và cá kho tộ ngon như mẹ nấu. Bếp núc sau đó được dọn sạch bóng!”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Chị Lê Hoàng Yến</div>
                    <div className="text-xs text-slate-500">Căn hộ Sunrise City, Q.7</div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                    <img src={IMAGES.coHoaChef} alt="Cô Hoa" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-[#005C55]">Cô Hoa (520+ ca)</div>
                      <div className="text-[10px] text-slate-500">Đầu bếp 5 sao</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    “Dịch vụ dọn dẹp theo giờ quá chuyên nghiệp. Thợ đến đúng giờ, mang đầy đủ bộ lau sàn chuyên dụng và nước tẩy hữu cơ không bị hắc mùi hóa chất. Nhà có em bé nhỏ nên cực kỳ an tâm.”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Anh Trần Minh Quang</div>
                    <div className="text-xs text-slate-500">Biệt thự Thảo Điền, TP. Thủ Đức</div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                    <img src={IMAGES.chiLanCleaner} alt="Chị Lan" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-[#005C55]">Chị Lan (680+ ca)</div>
                      <div className="text-[10px] text-slate-500">Thợ chính vệ sinh</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    “Gia đình tôi đã dùng gói định kỳ 6 tháng nay. Rất ưng ý tính năng theo dõi lịch sử ca làm và được cố định nhân viên quen việc. Chị giúp việc ủi áo sơ mi phẳng tắp như ngoài tiệm giặt ủi!”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Bác Đặng Văn Hùng</div>
                    <div className="text-xs text-slate-500">Phố Bà Triệu, Hoàn Kiếm, HN</div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                    <img src={IMAGES.coThuyIroning} alt="Cô Thủy" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-[#005C55]">Cô Thủy (940+ ca)</div>
                      <div className="text-[10px] text-slate-500">Chuyên viên ủi cao cấp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & PACKAGES */}
        <section className="py-16 bg-white max-w-7xl mx-auto px-4 md:px-8" id="pricing">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[#005C55] text-xs uppercase tracking-wider font-bold">Minh Bạch & Tiết Kiệm</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Bảng giá & Gói cước định kỳ</h2>
            <p className="text-sm text-slate-600 mt-2">Báo giá cố định trọn gói, không phụ thu giờ cao điểm hay ngày cuối tuần.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Lẻ theo nhu cầu</h3>
                <p className="text-xs text-slate-500 mt-1">Phù hợp nhu cầu đột xuất khi nhà có tiệc hoặc cần dọn tức thời.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-[#005C55]">75.000đ</span>
                  <span className="text-xs text-slate-500"> / giờ làm việc</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Đặt tối thiểu 2 giờ/ca</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Tự chọn dụng cụ hoặc thợ mang theo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Hỗ trợ đổi thợ nếu chưa vừa ý</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('customer-booking')}
                className="mt-8 w-full py-2.5 rounded-xl border border-[#005C55] text-[#005C55] font-bold text-xs hover:bg-teal-50 transition-colors"
              >
                Chọn gói theo giờ
              </button>
            </div>

            {/* Card 2: Featured */}
            <div className="bg-white p-6 rounded-2xl border-2 border-[#005C55] shadow-lg flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#005C55] text-white text-[11px] px-4 py-1 rounded-full uppercase tracking-wider font-bold">
                Tiết kiệm 20% - Gia đình khuyên dùng
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Gói Tuần Hạnh Phúc</h3>
                <p className="text-xs text-slate-500 mt-1">Duy trì nhà cửa sạch bóng và bữa cơm đều đặn 3 buổi mỗi tuần.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-[#005C55]">1.650.000đ</span>
                  <span className="text-xs text-slate-500"> / tháng</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>3 buổi/tuần (3 giờ/buổi dọn hoặc nấu)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Cố định 1 nhân viên quen nếp nhà</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Tặng gói khử khuẩn sofa mỗi quý</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Bảo hiểm trách nhiệm 100.000.000đ</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('customer-booking')}
                className="mt-8 w-full py-3 rounded-xl bg-[#005C55] hover:bg-[#0F766E] text-white font-bold text-xs shadow transition-all"
              >
                Đăng ký gói tuần ngay
              </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Toàn diện VIP</h3>
                <p className="text-xs text-slate-500 mt-1">Quản gia gia đình trọn vẹn từ thứ 2 tới thứ 7 cả ngày.</p>
                <div className="my-6">
                  <span className="text-3xl font-extrabold text-[#005C55]">4.900.000đ</span>
                  <span className="text-xs text-slate-500"> / tháng</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Chăm sóc trọn gói 5 buổi/tuần</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Bao gồm cả đi chợ + nấu 2 bữa + giặt ủi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#005C55] text-[18px]">check</span>
                    <span>Quản lý giám sát ca định kỳ hàng tuần</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('customer-booking')}
                className="mt-8 w-full py-2.5 rounded-xl border border-[#005C55] text-[#005C55] font-bold text-xs hover:bg-teal-50 transition-colors"
              >
                Liên hệ tư vấn VIP
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>yard</span>
                </div>
                <span className="text-lg font-bold text-[#005C55]">Gia Đình Xanh</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Nền tảng kết nối dịch vụ giúp việc, dọn dẹp nhà cửa và nấu ăn gia đình chuẩn mực, hướng tới chuẩn sống xanh và tiện nghi trọn vẹn cho gia đình hiện đại.
              </p>
              <div className="flex items-center gap-2 text-[#005C55] text-xs font-semibold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Đã đăng ký với Bộ Công Thương</span>
              </div>
            </div>

            <div className="md:col-span-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 mb-2">Chính sách & Pháp lý an toàn</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-[16px]">shield</span>
                  <span>Chứng nhận an toàn vệ sinh & lý lịch nhân viên</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-[16px]">health_and_safety</span>
                  <span>Cam kết bồi thường 100%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-[16px]">receipt_long</span>
                  <span>Quy định thanh toán & Hoàn tiền</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005C55] text-[16px]">lock</span>
                  <span>Chính sách bảo mật thông tin</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <h4 className="text-sm font-bold text-slate-800 mb-2">Hỗ trợ khẩn cấp 24/7</h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <div className="text-xs text-slate-500">Tổng đài tiếp nhận dịch vụ</div>
                <a className="text-lg font-extrabold text-[#FD651E] flex items-center gap-2 mt-1" href="tel:19006868">
                  <span className="material-symbols-outlined">call</span>
                  <span>Hotline CSKH: 1900 6868</span>
                </a>
                <div className="text-[11px] text-slate-400 mt-1">Hoạt động từ 06:00 - 22:00 hàng ngày (kể cả Lễ, Tết)</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2025 Gia Đình Xanh Co., Ltd. Bảo lưu mọi quyền. Chuẩn mực giúp việc & nấu ăn gia đình tiêu chuẩn tại Việt Nam.</p>
            <div className="flex items-center gap-3">
              <span>Hà Nội: 109 Trần Duy Hưng, Cầu Giấy</span>
              <span>•</span>
              <span>TP.HCM: 26 Lê Thánh Tôn, Bến Nghé, Q.1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
