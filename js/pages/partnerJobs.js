// js/pages/partnerJobs.js
// Logic sàn nhận việc khẩn cấp & radar GPS cho đối tác

import { Store } from '../store.js';

export function initPartnerJobsPage() {
  let flashSeconds = 100; // 01:40
  let radiusFilter = '5km';
  let serviceFilter = 'all';

  // Flash Countdown Timer
  const timerDisplayEl = document.getElementById('flash-timer-display');
  const timerProgressEl = document.getElementById('flash-timer-progress');

  const flashInterval = setInterval(() => {
    if (flashSeconds > 0) {
      flashSeconds--;
      const m = Math.floor(flashSeconds / 60);
      const s = flashSeconds % 60;
      if (timerDisplayEl) {
        timerDisplayEl.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
      if (timerProgressEl) {
        timerProgressEl.style.width = `${(flashSeconds / 100) * 100}%`;
      }
    } else {
      if (timerDisplayEl) timerDisplayEl.innerText = '00:00 (Hết hạn)';
    }
  }, 1000);

  // Claim Job Handler
  window.claimJob = function (jobId) {
    Store.updateOrderStatus(jobId, 'in_progress', {
      partnerName: 'Hoàng Thị Mai',
      partnerRating: 4.95,
      partnerCompletedJobs: 320,
      statusLabel: 'Đang dọn dẹp'
    });
    Store.showToast(`Chúc mừng cô Mai đã nhận việc thành công đơn ${jobId}!`);
    setTimeout(() => {
      window.location.href = 'partner-shift.html';
    }, 700);
  };

  // Radius Filter Buttons
  const radiusBtns = document.querySelectorAll('.radius-btn');
  radiusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      radiusFilter = btn.dataset.radius;
      radiusBtns.forEach(b => {
        b.className = 'radius-btn px-3 py-1 rounded-full text-xs font-bold transition-all bg-white text-slate-600 border border-slate-200 hover:border-teal-500 cursor-pointer';
      });
      btn.className = 'radius-btn px-3 py-1 rounded-full text-xs font-bold transition-all bg-[#005c55] text-white border border-[#005c55] cursor-pointer shadow-xs';
      renderJobList();
    });
  });

  // Service Filter Buttons
  const serviceBtns = document.querySelectorAll('.service-filter-btn');
  serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceFilter = btn.dataset.filter;
      serviceBtns.forEach(b => {
        b.className = 'service-filter-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors';
      });
      btn.className = 'service-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-[#005c55] border border-teal-200 cursor-pointer transition-colors';
      renderJobList();
    });
  });

  // Render Available Jobs List
  function renderJobList() {
    const listContainer = document.getElementById('available-jobs-list');
    if (!listContainer) return;

    const orders = Store.getOrders();
    const availableOrders = orders.filter(o => o.status === 'waiting_partner' || o.status === 'dispute');

    if (availableOrders.length === 0) {
      listContainer.innerHTML = `
        <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
          <span class="material-symbols-outlined text-3xl text-slate-400">task_alt</span>
          <p class="text-xs text-slate-600 font-bold mt-2">Hiện tại không có đơn hàng nào chờ nhận trong bán kính ${radiusFilter}</p>
          <p class="text-[11px] text-slate-400">Bạn đang ở chế độ trực tuyến, đơn mới sẽ tự động rung chuông báo.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = availableOrders.map(job => `
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#005c55] transition-all space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-xs text-[#005c55]">${job.id}</span>
            <span class="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded-full animate-pulse">Cần thợ gấp</span>
          </div>
          <span class="text-xs font-extrabold text-emerald-700 font-mono">${job.amount.toLocaleString('vi-VN')}đ</span>
        </div>

        <div>
          <h4 class="font-bold text-sm text-slate-900">${job.service}</h4>
          <p class="text-xs text-slate-600 flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-sm text-slate-400">location_on</span>
            <span>${job.address}</span>
            <span class="text-teal-700 font-bold ml-1">(Cách 1.8km)</span>
          </p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <div class="text-[11px] text-slate-500">
            Khung giờ: <strong>${job.timeSlot}</strong>
          </div>
          <button type="button" onclick="claimJob('${job.id}')" class="px-4 py-2 bg-[#005c55] hover:bg-[#004742] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-sm">touch_app</span>
            <span>Nhận Ca Này</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  renderJobList();
}

document.addEventListener('DOMContentLoaded', initPartnerJobsPage);
