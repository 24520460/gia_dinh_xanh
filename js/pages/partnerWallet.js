// js/pages/partnerWallet.js
// Logic quản lý ví thu nhập, rút tiền & ma trận đăng ký lịch rảnh

import { Store } from '../store.js';

export function initPartnerWalletPage() {
  let showBalance = true;

  const balanceDisplayEl = document.getElementById('wallet-balance-display');
  const toggleEyeBtn = document.getElementById('toggle-balance-eye');
  const withdrawModal = document.getElementById('withdraw-modal');
  const openWithdrawBtn = document.getElementById('open-withdraw-btn');
  const closeWithdrawBtn = document.getElementById('close-withdraw-btn');
  const confirmWithdrawBtn = document.getElementById('confirm-withdraw-btn');
  const withdrawInput = document.getElementById('withdraw-amount-input');
  const scheduleMatrixContainer = document.getElementById('schedule-matrix');
  const transactionsListEl = document.getElementById('transactions-list');

  function renderWallet() {
    const wallet = Store.getWallet();
    if (balanceDisplayEl) {
      balanceDisplayEl.innerText = showBalance ? `${wallet.balance.toLocaleString('vi-VN')}đ` : '••••••••đ';
    }

    if (transactionsListEl) {
      transactionsListEl.innerHTML = wallet.transactions.map(tx => `
        <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full ${tx.type === 'plus' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} flex items-center justify-center font-bold text-xs">
              <span class="material-symbols-outlined text-base">${tx.type === 'plus' ? 'arrow_downward' : 'arrow_upward'}</span>
            </div>
            <div>
              <div class="font-bold text-xs text-slate-800">${tx.title}</div>
              <div class="text-[10px] text-slate-400">${tx.date}</div>
            </div>
          </div>
          <div class="font-extrabold text-xs ${tx.type === 'plus' ? 'text-emerald-700' : 'text-slate-800'}">
            ${tx.amount > 0 ? `+${tx.amount.toLocaleString('vi-VN')}đ` : `${tx.amount.toLocaleString('vi-VN')}đ`}
          </div>
        </div>
      `).join('');
    }
  }

  // Toggle balance visibility
  if (toggleEyeBtn) {
    toggleEyeBtn.addEventListener('click', () => {
      showBalance = !showBalance;
      renderWallet();
    });
  }

  // Withdraw Modal Handling
  if (openWithdrawBtn && withdrawModal) {
    openWithdrawBtn.addEventListener('click', () => {
      withdrawModal.classList.remove('hidden');
    });
  }

  if (closeWithdrawBtn && withdrawModal) {
    closeWithdrawBtn.addEventListener('click', () => {
      withdrawModal.classList.add('hidden');
    });
  }

  if (confirmWithdrawBtn && withdrawInput && withdrawModal) {
    confirmWithdrawBtn.addEventListener('click', () => {
      const amount = parseInt(withdrawInput.value.replace(/\D/g, ''), 10) || 0;
      if (amount < 100000) {
        Store.showToast('Số tiền rút tối thiểu là 100.000đ.', 'warning');
        return;
      }
      const success = Store.withdraw(amount);
      if (success) {
        withdrawModal.classList.add('hidden');
        renderWallet();
        Store.showToast(`Lệnh rút ${amount.toLocaleString('vi-VN')}đ về Vietcombank (***8921) đã thành công!`);
      } else {
        Store.showToast('Số dư khả dụng không đủ để rút.', 'warning');
      }
    });
  }

  // Availability Schedule Matrix
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const dates = ['22/10', '23/10', '24/10', '25/10', '26/10', '27/10', '28/10'];
  const slots = [
    { id: 'morning', label: 'Sáng (08:00 - 12:00)' },
    { id: 'afternoon', label: 'Chiều (13:00 - 17:00)' },
    { id: 'evening', label: 'Tối (17:30 - 21:30)' }
  ];

  function renderScheduleMatrix() {
    if (!scheduleMatrixContainer) return;
    const schedule = Store.getSchedule();

    scheduleMatrixContainer.innerHTML = days.map((day, dIdx) => `
      <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <span class="font-extrabold text-xs text-slate-800">${day}</span>
          <span class="text-[10px] text-slate-400 font-bold">${dates[dIdx]}</span>
        </div>

        <div class="space-y-1.5">
          ${slots.map(s => {
            const key = `${dIdx}-${s.id}`;
            const state = schedule[key] ?? 0;
            const isBooked = state === 2;
            const isAvailable = state === 1;

            return `
              <button type="button" data-key="${key}" class="schedule-slot-btn w-full p-2.5 rounded-xl text-left text-xs font-semibold transition-all border ${
                isBooked 
                  ? 'bg-amber-50 border-amber-300 text-amber-900 cursor-not-allowed' 
                  : isAvailable 
                    ? 'bg-teal-50 border-[#005c55] text-[#005c55] font-bold shadow-xs cursor-pointer' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300 cursor-pointer'
              }">
                <div class="flex items-center justify-between">
                  <span>${s.label}</span>
                  <span class="text-[10px] font-bold ${
                    isBooked 
                      ? 'text-amber-700' 
                      : isAvailable 
                        ? 'text-emerald-700' 
                        : 'text-slate-400'
                  }">
                    ${isBooked ? 'Có ca' : isAvailable ? 'Đăng ký rảnh' : 'Nghỉ'}
                  </span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    scheduleMatrixContainer.querySelectorAll('.schedule-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        Store.toggleScheduleSlot(key);
        renderScheduleMatrix();
        Store.showToast('Đã cập nhật lịch làm việc thành công!');
      });
    });
  }

  // Listeners
  window.addEventListener('gdx_wallet_updated', renderWallet);
  window.addEventListener('gdx_schedule_updated', renderScheduleMatrix);

  renderWallet();
  renderScheduleMatrix();
}

document.addEventListener('DOMContentLoaded', initPartnerWalletPage);
