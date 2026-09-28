// js/pages/booking.js
// Logic cấu hình dịch vụ, tính giá động & tạo đơn hàng

import { Store } from '../store.js';
import { IMAGES } from '../data/mockData.js';

export function initBookingPage() {
  let apartmentScale = '2pn';
  let duration = 3;
  let addons = {
    tools: true,
    ironing: true,
    fridge: false,
    window: false
  };
  let frequency = 'once';
  let selectedDate = '25/10';
  let selectedTime = '08:30';
  let paymentMethod = 'momo';
  let voucherApplied = true;

  const baseRate = 85000;

  // UI Elements
  const basePriceEl = document.getElementById('base-price-display');
  const toolsPriceEl = document.getElementById('tools-price-display');
  const ironingPriceEl = document.getElementById('ironing-price-display');
  const fridgePriceEl = document.getElementById('fridge-price-display');
  const windowPriceEl = document.getElementById('window-price-display');
  const discountDisplayEl = document.getElementById('discount-display');
  const totalPriceEl = document.getElementById('total-price-display');
  const summaryHoursEl = document.getElementById('summary-hours');

  function calculatePrice() {
    const basePrice = duration * baseRate;
    const toolsPrice = addons.tools ? 35000 : 0;
    const ironingPrice = addons.ironing ? 50000 : 0;
    const fridgePrice = addons.fridge ? 80000 : 0;
    const windowPrice = addons.window ? 40000 : 0;
    const weekendSurcharge = (selectedDate === '25/10' || selectedDate === '26/10') ? 20000 : 0;

    const subtotal = basePrice + toolsPrice + ironingPrice + fridgePrice + windowPrice + weekendSurcharge;
    const discount = voucherApplied ? 72000 : 0;
    const total = Math.max(0, subtotal - discount);

    if (basePriceEl) basePriceEl.innerText = `${basePrice.toLocaleString('vi-VN')}đ`;
    if (summaryHoursEl) summaryHoursEl.innerText = `${duration} Giờ`;

    if (toolsPriceEl) toolsPriceEl.style.display = addons.tools ? 'flex' : 'none';
    if (ironingPriceEl) ironingPriceEl.style.display = addons.ironing ? 'flex' : 'none';
    if (fridgePriceEl) fridgePriceEl.style.display = addons.fridge ? 'flex' : 'none';
    if (windowPriceEl) windowPriceEl.style.display = addons.window ? 'flex' : 'none';

    if (discountDisplayEl) {
      discountDisplayEl.style.display = voucherApplied ? 'flex' : 'none';
    }

    if (totalPriceEl) totalPriceEl.innerText = `${total.toLocaleString('vi-VN')}đ`;
    return { subtotal, discount, total };
  }

  // Apartment scale buttons
  const scaleBtns = document.querySelectorAll('.scale-btn');
  scaleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      apartmentScale = btn.dataset.scale;
      scaleBtns.forEach(b => {
        b.className = 'scale-btn p-3 rounded-xl border border-slate-200 text-center font-medium text-xs hover:border-[#005c55] cursor-pointer transition-all bg-white text-slate-700';
      });
      btn.className = 'scale-btn p-3 rounded-xl border-2 border-[#005c55] bg-teal-50 text-center font-bold text-xs text-[#005c55] shadow-xs cursor-pointer transition-all';
      calculatePrice();
    });
  });

  // Duration buttons
  const durationBtns = document.querySelectorAll('.duration-btn');
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      duration = parseInt(btn.dataset.duration, 10);
      durationBtns.forEach(b => {
        b.className = 'duration-btn py-2.5 rounded-xl border border-slate-200 text-center font-medium text-xs hover:border-[#005c55] cursor-pointer transition-all bg-white text-slate-700';
      });
      btn.className = 'duration-btn py-2.5 rounded-xl border-2 border-[#005c55] bg-teal-50 text-center font-bold text-xs text-[#005c55] shadow-xs cursor-pointer transition-all';
      calculatePrice();
    });
  });

  // Addons checkboxes
  ['tools', 'ironing', 'fridge', 'window'].forEach(key => {
    const cb = document.getElementById(`addon-${key}`);
    if (cb) {
      cb.addEventListener('change', () => {
        addons[key] = cb.checked;
        calculatePrice();
      });
    }
  });

  // Payment method radio buttons
  const payRadios = document.querySelectorAll('input[name="paymentMethod"]');
  payRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      paymentMethod = radio.value;
    });
  });

  // Date buttons
  const dateBtns = document.querySelectorAll('.date-btn');
  dateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedDate = btn.dataset.date;
      dateBtns.forEach(b => {
        b.className = 'date-btn py-2 px-3 rounded-xl border border-slate-200 text-center font-medium text-xs hover:border-[#005c55] cursor-pointer transition-all bg-white text-slate-700';
      });
      btn.className = 'date-btn py-2 px-3 rounded-xl border-2 border-[#005c55] bg-teal-50 text-center font-bold text-xs text-[#005c55] shadow-xs cursor-pointer transition-all';
      calculatePrice();
    });
  });

  // Voucher apply
  const applyVoucherBtn = document.getElementById('apply-voucher-btn');
  const voucherInput = document.getElementById('voucher-input');
  if (applyVoucherBtn && voucherInput) {
    applyVoucherBtn.addEventListener('click', () => {
      if (voucherInput.value.trim().toUpperCase() === 'CHAOBANMOI') {
        voucherApplied = true;
        Store.showToast('Áp dụng mã CHAOBANMOI thành công: -72.000đ!');
      } else {
        voucherApplied = false;
        Store.showToast('Mã khuyến mãi không hợp lệ.', 'warning');
      }
      calculatePrice();
    });
  }

  // Booking submit
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { total } = calculatePrice();
      const customerName = document.getElementById('customer-name')?.value || 'Lê Minh Anh';
      const customerPhone = document.getElementById('customer-phone')?.value || '0912***456';
      const address = document.getElementById('customer-address')?.value || 'Căn hộ T2-14.08 Masteri Thảo Điền, TP. Thủ Đức';

      const newOrderId = `#GDX-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder = {
        id: newOrderId,
        customerName,
        customerPhone,
        address,
        service: `Dọn dẹp căn hộ ${duration} Giờ`,
        serviceType: 'clean',
        partnerName: 'Hoàng Thị Mai',
        partnerRating: 4.95,
        partnerCompletedJobs: 320,
        partnerAvatar: IMAGES.hoangThiMaiAvatar,
        timeSlot: `${selectedTime} - 11:30`,
        date: selectedDate === '25/10' ? 'Hôm nay' : selectedDate,
        amount: total,
        paymentMethod: paymentMethod === 'momo' ? 'Ví MoMo' : paymentMethod === 'vnpay' ? 'Ví VNPay' : 'Thẻ Visa',
        status: 'in_progress',
        statusLabel: 'Đang dọn dẹp'
      };

      Store.addOrder(newOrder);
      Store.showToast(`Đặt lịch thành công! Mã đơn: ${newOrderId}`);

      setTimeout(() => {
        window.location.href = `customer-tracking.html?orderId=${encodeURIComponent(newOrderId)}`;
      }, 600);
    });
  }

  // Initial calculation
  calculatePrice();
}

document.addEventListener('DOMContentLoaded', initBookingPage);
