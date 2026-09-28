// js/components/platformSwitcher.js
// Thanh điều hướng nổi chuyển đổi tức thì 10 màn hình demo

export function initPlatformSwitcher() {
  if (document.getElementById('gdx-platform-switcher')) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const roles = [
    {
      role: 'Khách hàng (Customer)',
      icon: 'user',
      screens: [
        { file: 'index.html', label: '1. Trang chủ & Đặt nhanh', badge: 'Home' },
        { file: 'customer-booking.html', label: '2. Cấu hình dịch vụ & Đặt hẹn', badge: 'Wizard' },
        { file: 'customer-tracking.html', label: '3. Theo dõi đơn hàng Live', badge: '#GDX-89241' },
        { file: 'customer-appointments.html', label: '4. Lịch hẹn & Đánh giá 5★', badge: 'Popup' },
      ]
    },
    {
      role: 'Đối tác hiện trường (Partner)',
      icon: 'briefcase',
      screens: [
        { file: 'partner-jobs.html', label: '5. Sàn nhận việc & Radar GPS', badge: 'Radar' },
        { file: 'partner-shift.html', label: '6. Ca làm việc & Live Timer', badge: 'Live Timer' },
        { file: 'partner-wallet.html', label: '7. Quản lý Ví & Lịch rảnh', badge: '3.42tr' },
      ]
    },
    {
      role: 'Quản trị vận hành (Admin Ops)',
      icon: 'shield-check',
      screens: [
        { file: 'admin-dashboard.html', label: '8. Tổng quan điều hành & Điều phối', badge: 'Dashboard' },
        { file: 'admin-pricing.html', label: '9. Cấu hình Biểu giá & Chiết khấu', badge: 'Sandbox' },
        { file: 'admin-kyc.html', label: '10. Xét duyệt hồ sơ KYC Đối tác', badge: '4 Chờ' },
      ]
    }
  ];

  const container = document.createElement('aside');
  container.id = 'gdx-platform-switcher';
  container.setAttribute('aria-label', 'Platform Switcher');
  container.className = 'fixed bottom-4 right-4 z-[9999] print:hidden select-none max-w-[calc(100vw-2rem)]';

  container.innerHTML = `
    <!-- Switcher Panel Popup -->
    <div id="switcher-panel" class="hidden mb-2.5 bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl shadow-2xl p-3.5 w-[360px] sm:w-[440px] text-slate-800 transition-all animate-modal-pop">
      <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
        <div class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-lg bg-[#005c55] text-white flex items-center justify-center text-xs shadow-xs font-bold">
            <span class="material-symbols-outlined text-[16px]">visibility</span>
          </span>
          <span class="font-bold text-sm text-[#005c55]">Chuyển Đổi Nhanh 10 Màn Hình</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button id="switcher-close" class="w-7 h-7 rounded-full text-slate-500 hover:bg-slate-100 flex items-center justify-center text-xs" title="Thu nhỏ">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      <div class="space-y-2.5 max-h-[350px] overflow-y-auto pr-1 text-xs">
        ${roles.map(group => `
          <div class="space-y-1">
            <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i data-lucide="${group.icon}" class="w-3.5 h-3.5 text-slate-500"></i>
              <span>${group.role}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              ${group.screens.map(s => {
                const isActive = currentPath === s.file;
                return `
                  <a href="${s.file}" class="px-2.5 py-1.5 rounded-lg text-left transition-all flex items-center justify-between border ${
                    isActive 
                      ? 'bg-[#005c55] text-white border-[#005c55] font-bold shadow-xs' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-medium'
                  }">
                    <span class="truncate">${s.label}</span>
                    ${s.badge ? `
                      <span class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full shrink-0 font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }">${s.badge}</span>
                    ` : ''}
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="pt-2 mt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Gia Đình Xanh • Python Server 8000</span>
        <span class="text-emerald-700 font-semibold flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          100% Live Mock
        </span>
      </div>
    </div>

    <!-- Toggle Button -->
    <button id="switcher-toggle" class="flex items-center gap-2 bg-[#005c55] text-white px-4 py-2.5 rounded-full shadow-2xl hover:bg-[#0f766e] transition-all transform active:scale-95 border-2 border-white text-xs sm:text-sm font-semibold cursor-pointer">
      <span class="material-symbols-outlined text-base">swap_horiz</span>
      <span>10 Màn Hình Demo</span>
    </button>
  `;

  document.body.appendChild(container);

  const toggle = document.getElementById('switcher-toggle');
  const panel = document.getElementById('switcher-panel');
  const close = document.getElementById('switcher-close');

  toggle.addEventListener('click', () => {
    panel.classList.toggle('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  close.addEventListener('click', () => {
    panel.classList.add('hidden');
  });

  if (window.lucide) window.lucide.createIcons();
}
