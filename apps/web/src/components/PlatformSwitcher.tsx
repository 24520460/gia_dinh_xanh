import React, { useState } from 'react';
import { ScreenId, UserRole } from '@gdx/shared-types';

interface PlatformSwitcherProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  openRatingModal?: () => void;
}

export const PlatformSwitcher: React.FC<PlatformSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
  openRatingModal,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // Group screens by role
  const roles: { role: UserRole; title: string; icon: string; screens: { id: ScreenId; label: string; badge?: string }[] }[] = [
    {
      role: 'customer',
      title: 'Phân hệ Khách Hàng (Customer App)',
      icon: 'person',
      screens: [
        { id: 'customer-landing', label: '1. Trang chủ & Đặt nhanh' },
        { id: 'customer-booking', label: '2. Cấu hình dịch vụ & Đặt hẹn', badge: 'Wizard' },
        { id: 'customer-tracking', label: '3. Theo dõi đơn hàng Live', badge: '#GDX-89241' },
        { id: 'customer-appointments', label: '4. Lịch hẹn & Đánh giá 5★', badge: 'Popup' },
      ],
    },
    {
      role: 'partner',
      title: 'Phân hệ Đối Tác Thực Thi (Partner App - Cô Mai)',
      icon: 'handshake',
      screens: [
        { id: 'partner-shift', label: '5. Ca làm việc & Timer hiện trường', badge: 'Live Timer' },
        { id: 'partner-board', label: '6. Sàn nhận việc & Radar GPS', badge: 'Radar' },
        { id: 'partner-wallet', label: '7. Quản lý Ví & Lịch rảnh', badge: '3.42tr' },
      ],
    },
    {
      role: 'admin',
      title: 'Phân hệ Quản Trị Vận Hành (Admin Ops - Minh Tuấn)',
      icon: 'admin_panel_settings',
      screens: [
        { id: 'admin-dashboard', label: '8. Tổng quan điều hành & Điều phối', badge: 'Dashboard' },
        { id: 'admin-pricing', label: '9. Cấu hình Biểu giá & Chiết khấu', badge: 'Sandbox' },
        { id: 'admin-kyc', label: '10. Xét duyệt hồ sơ KYC Đối tác', badge: '18 Chờ' },
      ],
    },
  ];

  return (
    <aside aria-label="Platform Switcher" className="fixed bottom-4 right-4 z-50 print:hidden select-none max-w-[calc(100vw-2rem)]">
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 bg-[#005c55] text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-[#0f766e] transition-all transform active:scale-95 border-2 border-white text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-base">swap_horiz</span>
          <span>Chọn Màn Hình ({currentScreen.split('-')[1]})</span>
        </button>
      ) : (
        <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl shadow-2xl p-3.5 w-[380px] sm:w-[460px] text-slate-800 transition-all animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#005c55] text-white flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[16px]">visibility</span>
              </span>
              <span className="font-bold text-sm text-[#005c55]">Chuyển Đổi Nhanh 10 Màn Hình</span>
            </div>
            <div className="flex items-center gap-1.5">
              {openRatingModal && (
                <button
                  onClick={openRatingModal}
                  className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full hover:bg-amber-600 transition-colors flex items-center gap-0.5"
                  title="Mở popup đánh giá dịch vụ"
                >
                  <span className="material-symbols-outlined text-[13px]">grade</span>
                  Đánh giá
                </button>
              )}
              <button
                onClick={() => setCollapsed(true)}
                className="w-7 h-7 rounded-full text-slate-500 hover:bg-slate-100 flex items-center justify-center text-xs"
                title="Thu nhỏ thanh điều hướng"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 text-xs">
            {roles.map((group) => (
              <div key={group.role} className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-slate-500">{group.icon}</span>
                  {group.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {group.screens.map((screen) => {
                    const isActive = currentScreen === screen.id;
                    return (
                      <button
                        key={screen.id}
                        onClick={() => onSelectScreen(screen.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-left transition-all flex items-center justify-between border ${
                          isActive
                            ? 'bg-[#005c55] text-white border-[#005c55] font-bold shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-medium'
                        }`}
                      >
                        <span className="truncate">{screen.label}</span>
                        {screen.badge && (
                          <span
                            className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full shrink-0 font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {screen.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Ứng dụng Gia Đình Xanh • Đầy đủ 3 vai trò</span>
            <span className="text-emerald-700 font-semibold">100% Tương tác sống</span>
          </div>
        </div>
      )}
    </aside>
  );
};
