// js/pages/tracking.js
// Logic giám sát đơn hàng theo thời gian thực (Live Tracking)

import { Store } from '../store.js';
import { openRatingModal } from '../components/ratingModal.js';

export function initTrackingPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId') || '#GDX-89241';
  const order = Store.getOrderById(orderId);

  // Set order headers
  const orderIdEl = document.getElementById('tracking-order-id');
  const customerNameEl = document.getElementById('tracking-customer-name');
  const addressEl = document.getElementById('tracking-address');
  const serviceNameEl = document.getElementById('tracking-service-name');
  const partnerNameEl = document.getElementById('tracking-partner-name');
  const partnerRatingEl = document.getElementById('tracking-partner-rating');
  const partnerJobsEl = document.getElementById('tracking-partner-jobs');
  const partnerAvatarEl = document.getElementById('tracking-partner-avatar');

  if (orderIdEl) orderIdEl.innerText = order.id;
  if (customerNameEl) customerNameEl.innerText = order.customerName;
  if (addressEl) addressEl.innerText = order.address;
  if (serviceNameEl) serviceNameEl.innerText = order.service;
  if (partnerNameEl) partnerNameEl.innerText = order.partnerName;
  if (partnerRatingEl) partnerRatingEl.innerText = `${order.partnerRating} ★`;
  if (partnerJobsEl) partnerJobsEl.innerText = `${order.partnerCompletedJobs} ca hoàn thành`;
  if (partnerAvatarEl && order.partnerAvatar) partnerAvatarEl.src = order.partnerAvatar;

  // Live Timer Countdown
  let secondsLeft = 1 * 3600 + 42 * 60 + 15;
  const timerDisplayEl = document.getElementById('live-timer-display');

  const timer = setInterval(() => {
    if (secondsLeft > 0) {
      secondsLeft--;
      const h = Math.floor(secondsLeft / 3600);
      const m = Math.floor((secondsLeft % 3600) / 60);
      const s = secondsLeft % 60;
      if (timerDisplayEl) {
        timerDisplayEl.innerText = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }
  }, 1000);

  // Rating modal trigger
  const ratingBtn = document.getElementById('open-rating-btn');
  if (ratingBtn) {
    ratingBtn.addEventListener('click', () => {
      openRatingModal({
        orderId: order.id,
        partnerName: order.partnerName,
        onSuccess: () => {
          const statusBadge = document.getElementById('tracking-status-badge');
          if (statusBadge) {
            statusBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700';
            statusBadge.innerText = 'Hoàn thành 5★';
          }
        }
      });
    });
  }

  // Emergency SOS button
  const sosBtn = document.getElementById('sos-hotline-btn');
  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      alert('Đang kết nối đến Trưởng ca Giám sát Vận hành Gia Đình Xanh (Hotline 24/7: 1900 6868).');
    });
  }
}

document.addEventListener('DOMContentLoaded', initTrackingPage);
