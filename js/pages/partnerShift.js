// js/pages/partnerShift.js
// Logic quản lý ca làm việc trực tiếp, đồng hồ đếm giờ & checklist 5 sao

import { Store } from '../store.js';

export function initPartnerShiftPage() {
  let totalSeconds = 1 * 3600 + 42 * 60 + 11;
  let isPaused = false;

  const timerDisplayEl = document.getElementById('shift-timer-display');
  const pauseBtn = document.getElementById('pause-timer-btn');
  const pauseIcon = document.getElementById('pause-icon');
  const pauseText = document.getElementById('pause-text');

  // Countdown timer
  const shiftInterval = setInterval(() => {
    if (!isPaused && totalSeconds > 0) {
      totalSeconds--;
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      if (timerDisplayEl) {
        timerDisplayEl.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }
  }, 1000);

  // Pause / Resume handler
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      if (pauseIcon && pauseText) {
        pauseIcon.innerText = isPaused ? 'play_arrow' : 'pause';
        pauseText.innerText = isPaused ? 'Tiếp tục ca' : 'Tạm dừng';
      }
      Store.showToast(isPaused ? 'Đã tạm dừng đếm giờ ca làm việc.' : 'Tiếp tục tính giờ ca làm việc.');
    });
  }

  // Checklist items handling
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  const progressText = document.getElementById('shift-progress-percent');
  const progressBar = document.getElementById('shift-progress-bar');
  const finishBtn = document.getElementById('finish-shift-btn');

  function updateProgress() {
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / checkboxes.length) * 100);
    if (progressText) progressText.innerText = `${percent}% Hoàn Tất`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    if (finishBtn) {
      if (percent === 100) {
        finishBtn.className = 'w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-sm font-extrabold shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer';
      } else {
        finishBtn.className = 'w-full py-4 bg-[#005c55] hover:bg-[#0f766e] text-white rounded-2xl text-sm font-extrabold shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer';
      }
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateProgress();
      Store.showToast(cb.checked ? 'Đã lưu bước hoàn thành lên hệ thống!' : 'Đã bỏ đánh dấu bước này.');
    });
  });

  // Finish shift
  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      Store.updateOrderStatus('#GDX-89241', 'completed', {
        statusLabel: 'Hoàn thành'
      });
      Store.showToast('Chúc mừng cô Mai đã hoàn thành ca làm việc xuất sắc! Thù lao +236.160đ đã cộng vào ví.');
      setTimeout(() => {
        window.location.href = 'partner-wallet.html';
      }, 900);
    });
  }

  updateProgress();
}

document.addEventListener('DOMContentLoaded', initPartnerShiftPage);
