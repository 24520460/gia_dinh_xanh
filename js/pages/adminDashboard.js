// js/pages/adminDashboard.js
// Logic bảng điều hành quản trị trung tâm & điều phối thợ khẩn cấp

import { Store } from '../store.js';

export function initAdminDashboardPage() {
  let filterStatus = 'all';
  let searchQuery = '';
  let selectedOrderId = null;

  const ordersContainer = document.getElementById('admin-orders-list');
  const searchInput = document.getElementById('admin-search-input');
  const reassignModal = document.getElementById('reassign-modal');
  const closeReassignBtn = document.getElementById('close-reassign-btn');
  const cancelReassignBtn = document.getElementById('cancel-reassign-btn');

  function renderOrders() {
    if (!ordersContainer) return;
    const orders = Store.getOrders();

    const filtered = orders.filter(o => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false;
      if (searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.partnerName.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
      );
    });

    // Update KPI counts
    const inProgressCount = orders.filter(o => o.status === 'in_progress').length;
    const disputeCount = orders.filter(o => o.status === 'dispute').length;
    const waitingCount = orders.filter(o => o.status === 'waiting_partner').length;
    
    const countTotalEl = document.getElementById('kpi-total-count');
    const countProgressEl = document.getElementById('kpi-progress-count');
    const countDisputeEl = document.getElementById('kpi-dispute-count');
    const countWaitingEl = document.getElementById('kpi-waiting-count');

    if (countTotalEl) countTotalEl.innerText = `${orders.length} Đơn`;
    if (countProgressEl) countProgressEl.innerText = `${inProgressCount} Ca`;
    if (countDisputeEl) countDisputeEl.innerText = `${disputeCount} Đơn`;
    if (countWaitingEl) countWaitingEl.innerText = `${waitingCount} Đơn`;

    if (filtered.length === 0) {
      ordersContainer.innerHTML = `
        <tr>
          <td colspan="7" class="p-8 text-center text-xs text-slate-400">
            Không tìm thấy đơn hàng nào khớp với điều kiện lọc hiện tại.
          </td>
        </tr>
      `;
      return;
    }

    ordersContainer.innerHTML = filtered.map(order => {
      const getBadge = (status, label) => {
        switch (status) {
          case 'in_progress':
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>${label}</span>`;
          case 'dispute':
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300"><span class="material-symbols-outlined text-xs">warning</span>${label}</span>`;
          case 'waiting_partner':
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300"><span class="material-symbols-outlined text-xs">hourglass_empty</span>${label}</span>`;
          case 'in_transit':
            return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300"><span class="material-symbols-outlined text-xs">directions_bike</span>${label}</span>`;
          case 'completed':
          default:
            return `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">${label}</span>`;
        }
      };

      return `
        <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
          <td class="p-4 font-mono font-bold text-[#005c55]">${order.id}</td>
          <td class="p-4">
            <div class="font-bold text-slate-900">${order.customerName}</div>
            <div class="text-[11px] text-slate-400 truncate max-w-xs">${order.address}</div>
          </td>
          <td class="p-4">
            <div class="font-bold text-slate-800">${order.service}</div>
            <div class="text-[11px] text-slate-500">${order.timeSlot}</div>
          </td>
          <td class="p-4">
            <div class="flex items-center gap-2">
              <img src="${order.partnerAvatar}" alt="${order.partnerName}" class="w-7 h-7 rounded-full object-cover border border-slate-200" />
              <div>
                <div class="font-bold text-slate-900">${order.partnerName}</div>
                <div class="text-[10px] text-amber-600 font-bold">${order.partnerRating} ★</div>
              </div>
            </div>
          </td>
          <td class="p-4 font-mono font-extrabold text-slate-900">${order.amount.toLocaleString('vi-VN')}đ</td>
          <td class="p-4">${getBadge(order.status, order.statusLabel)}</td>
          <td class="p-4 text-right">
            <button type="button" onclick="openReassignModal('${order.id}')" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#005c55] text-slate-700 hover:text-[#005c55] font-bold transition-all text-xs cursor-pointer">
              Điều phối
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Open Reassign Modal
  window.openReassignModal = function (orderId) {
    selectedOrderId = orderId;
    const targetOrderEl = document.getElementById('reassign-target-order');
    if (targetOrderEl) targetOrderEl.innerText = orderId;
    if (reassignModal) reassignModal.classList.remove('hidden');
  };

  // Execute Reassign Partner
  window.executeReassign = function (partnerName, avatarUrl) {
    if (!selectedOrderId) return;
    Store.updateOrderStatus(selectedOrderId, 'in_transit', {
      partnerName,
      partnerAvatar: avatarUrl,
      statusLabel: 'Đang di chuyển'
    });
    if (reassignModal) reassignModal.classList.add('hidden');
    renderOrders();
    Store.showToast(`Đã điều phối đơn ${selectedOrderId} thành công cho chuyên viên ${partnerName}!`);
  };

  // Close Modal
  if (closeReassignBtn && reassignModal) closeReassignBtn.addEventListener('click', () => reassignModal.classList.add('hidden'));
  if (cancelReassignBtn && reassignModal) cancelReassignBtn.addEventListener('click', () => reassignModal.classList.add('hidden'));

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderOrders();
    });
  }

  // Filter Buttons
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterStatus = pill.dataset.status;
      filterPills.forEach(p => {
        p.className = 'filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors';
      });
      pill.className = 'filter-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-[#005c55] text-white shadow-xs cursor-pointer transition-colors';
      renderOrders();
    });
  });

  window.addEventListener('gdx_orders_updated', renderOrders);
  renderOrders();
}

document.addEventListener('DOMContentLoaded', initAdminDashboardPage);
