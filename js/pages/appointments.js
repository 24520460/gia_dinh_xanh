// js/pages/appointments.js
// Logic danh sách lịch hẹn & lịch sử dịch vụ của khách hàng

import { Store } from '../store.js';
import { openRatingModal } from '../components/ratingModal.js';

export function initAppointmentsPage() {
  let activeTab = 'all'; // 'all' | 'upcoming' | 'completed'
  const listContainer = document.getElementById('appointments-list');

  function renderAppointments() {
    if (!listContainer) return;

    const orders = Store.getOrders();
    const filteredOrders = orders.filter(order => {
      if (activeTab === 'upcoming') {
        return order.status === 'in_progress' || order.status === 'waiting_partner' || order.status === 'in_transit';
      }
      if (activeTab === 'completed') {
        return order.status === 'completed';
      }
      return true;
    });

    if (filteredOrders.length === 0) {
      listContainer.innerHTML = `
        <div class="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">event_busy</span>
          </div>
          <h4 class="font-bold text-slate-700 text-sm">Chưa có lịch hẹn nào trong mục này</h4>
          <p class="text-xs text-slate-400">Bạn có thể dễ dàng đặt lịch dọn dẹp hoặc nấu ăn chỉ với vài thao tác.</p>
          <a href="customer-booking.html" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005c55] text-white text-xs font-bold shadow-xs hover:bg-[#0f766e] transition-colors mt-2">
            <span class="material-symbols-outlined text-sm">add</span>
            <span>Đặt Lịch Ngay</span>
          </a>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filteredOrders.map(order => {
      const isCompleted = order.status === 'completed';
      const isLive = order.status === 'in_progress' || order.status === 'in_transit';
      const isDispute = order.status === 'dispute';

      const statusBadge = isLive ? `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ${order.statusLabel || 'Đang thực hiện'}
        </span>
      ` : isCompleted ? `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
          <span class="material-symbols-outlined text-xs text-emerald-600">check_circle</span>
          ${order.statusLabel || 'Hoàn thành'}
        </span>
      ` : isDispute ? `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <span class="material-symbols-outlined text-xs">warning</span>
          ${order.statusLabel || 'Khiếu nại đổi thợ'}
        </span>
      ` : `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <span class="material-symbols-outlined text-xs">hourglass_empty</span>
          ${order.statusLabel || 'Chờ tiếp nhận'}
        </span>
      `;

      return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div class="flex items-center gap-3">
              <span class="font-extrabold text-sm text-[#005c55]">${order.id}</span>
              ${statusBadge}
            </div>
            <div class="text-xs font-bold text-slate-500 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">calendar_today</span>
              <span>${order.date} • ${order.timeSlot}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <!-- Order Details -->
            <div class="md:col-span-7 space-y-1.5">
              <h3 class="font-extrabold text-slate-900 text-base">${order.service}</h3>
              <p class="text-xs text-slate-600 flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-slate-400">location_on</span>
                <span>${order.address}</span>
              </p>
              <div class="text-xs text-slate-500 flex items-center gap-3 pt-1">
                <span>Thanh toán: <strong class="text-slate-700">${order.paymentMethod}</strong></span>
                <span>•</span>
                <span class="font-black text-[#005c55] text-sm">${order.amount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <!-- Partner info & actions -->
            <div class="md:col-span-5 flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div class="flex items-center gap-3">
                <img src="${order.partnerAvatar}" alt="${order.partnerName}" class="w-10 h-10 rounded-full object-cover border border-teal-300" />
                <div class="text-xs">
                  <div class="font-bold text-slate-900">${order.partnerName}</div>
                  <div class="text-amber-600 font-bold">${order.partnerRating} ★ <span class="text-slate-400 font-normal">(${order.partnerCompletedJobs} ca)</span></div>
                </div>
              </div>

              <div class="flex items-center gap-2 w-full sm:w-auto">
                ${isLive ? `
                  <a href="customer-tracking.html?orderId=${encodeURIComponent(order.id)}" class="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#005c55] hover:bg-[#004742] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-sm">visibility</span>
                    <span>Theo dõi live</span>
                  </a>
                ` : `
                  <button type="button" data-order-id="${order.id}" data-partner="${order.partnerName}" class="review-btn w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1">
                    <span class="material-symbols-outlined text-sm">grade</span>
                    <span>Đánh giá</span>
                  </button>
                  <a href="customer-booking.html" class="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors text-center">
                    Đặt lại
                  </a>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach review listeners
    listContainer.querySelectorAll('.review-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openRatingModal({
          orderId: btn.dataset.orderId,
          partnerName: btn.dataset.partner,
          onSuccess: renderAppointments
        });
      });
    });
  }

  // Filter tab buttons
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      tabBtns.forEach(b => {
        b.className = 'tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-colors text-slate-600 hover:bg-slate-100 cursor-pointer';
      });
      btn.className = 'tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-colors bg-[#005c55] text-white shadow-xs cursor-pointer';
      renderAppointments();
    });
  });

  // Listen for storage changes
  window.addEventListener('gdx_orders_updated', renderAppointments);

  renderAppointments();
}

document.addEventListener('DOMContentLoaded', initAppointmentsPage);
