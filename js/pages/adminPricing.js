// js/pages/adminPricing.js
// Logic sandbox mô phỏng chính sách giá động & tỷ lệ chia sẻ doanh thu

import { Store } from '../store.js';

export function initAdminPricingPage() {
  const pricing = Store.getPricing();

  let cleaningRate = pricing.cleaningRate;
  let cookingRate = pricing.cookingRate;
  let deepCleanRate = pricing.deepCleanRate;
  let peakMultiplier = pricing.peakMultiplier;
  let weekendSurcharge = pricing.weekendSurcharge;
  let partnerSplit = pricing.partnerSplit;

  // Simulator state
  let simService = 'clean';
  let simHours = 3;
  let simIsPeak = true;
  let simIsWeekend = false;

  // Input elements
  const cleanInput = document.getElementById('rate-clean-input');
  const cookInput = document.getElementById('rate-cook-input');
  const deepInput = document.getElementById('rate-deep-input');
  const peakInput = document.getElementById('multiplier-peak-input');
  const weekendInput = document.getElementById('surcharge-weekend-input');
  const splitInput = document.getElementById('split-partner-input');

  const cleanValEl = document.getElementById('rate-clean-val');
  const cookValEl = document.getElementById('rate-cook-val');
  const deepValEl = document.getElementById('rate-deep-val');
  const peakValEl = document.getElementById('multiplier-peak-val');
  const weekendValEl = document.getElementById('surcharge-weekend-val');
  const splitValEl = document.getElementById('split-partner-val');

  // Simulator outputs
  const simTotalPayEl = document.getElementById('sim-total-pay');
  const simPartnerEarnEl = document.getElementById('sim-partner-earn');
  const simPlatformFeeEl = document.getElementById('sim-platform-fee');
  const simBaseEl = document.getElementById('sim-base-amount');
  const simPeakExtraEl = document.getElementById('sim-peak-extra');
  const simWeekendExtraEl = document.getElementById('sim-weekend-extra');

  function calculateSimulation() {
    const baseRate = simService === 'clean' ? cleaningRate : simService === 'cook' ? cookingRate : deepCleanRate;
    const rawSubtotal = baseRate * simHours;
    const peakExtra = simIsPeak ? rawSubtotal * (peakMultiplier - 1) : 0;
    const weekendExtra = simIsWeekend ? weekendSurcharge * simHours : 0;
    const totalCustomerPays = Math.round((rawSubtotal + peakExtra + weekendExtra) / 1000) * 1000;
    const partnerEarnings = Math.round((totalCustomerPays * (partnerSplit / 100)) / 1000) * 1000;
    const platformFee = totalCustomerPays - partnerEarnings;

    if (simTotalPayEl) simTotalPayEl.innerText = `${totalCustomerPays.toLocaleString('vi-VN')}đ`;
    if (simPartnerEarnEl) simPartnerEarnEl.innerText = `${partnerEarnings.toLocaleString('vi-VN')}đ`;
    if (simPlatformFeeEl) simPlatformFeeEl.innerText = `${platformFee.toLocaleString('vi-VN')}đ`;

    if (simBaseEl) simBaseEl.innerText = `${rawSubtotal.toLocaleString('vi-VN')}đ`;
    if (simPeakExtraEl) simPeakExtraEl.innerText = `+${Math.round(peakExtra).toLocaleString('vi-VN')}đ`;
    if (simWeekendExtraEl) simWeekendExtraEl.innerText = `+${weekendExtra.toLocaleString('vi-VN')}đ`;
  }

  // Bind slider controls
  function bindSlider(input, valEl, setter, formatter) {
    if (!input) return;
    input.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      setter(val);
      if (valEl) valEl.innerText = formatter(val);
      calculateSimulation();
    });
  }

  bindSlider(cleanInput, cleanValEl, v => cleaningRate = v, v => `${v.toLocaleString('vi-VN')}đ`);
  bindSlider(cookInput, cookValEl, v => cookingRate = v, v => `${v.toLocaleString('vi-VN')}đ`);
  bindSlider(deepInput, deepValEl, v => deepCleanRate = v, v => `${v.toLocaleString('vi-VN')}đ`);
  bindSlider(peakInput, peakValEl, v => peakMultiplier = v, v => `${v.toFixed(2)}x`);
  bindSlider(weekendInput, weekendValEl, v => weekendSurcharge = v, v => `+${v.toLocaleString('vi-VN')}đ/h`);
  bindSlider(splitInput, splitValEl, v => partnerSplit = v, v => `${v}% (Thợ)`);

  // Simulator controls
  const simServiceBtns = document.querySelectorAll('.sim-service-btn');
  simServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simService = btn.dataset.service;
      simServiceBtns.forEach(b => {
        b.className = 'sim-service-btn p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-[#005c55] cursor-pointer';
      });
      btn.className = 'sim-service-btn p-2 rounded-xl border-2 border-[#005c55] text-xs font-bold text-[#005c55] bg-teal-50 cursor-pointer';
      calculateSimulation();
    });
  });

  const simHourBtns = document.querySelectorAll('.sim-hour-btn');
  simHourBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      simHours = parseInt(btn.dataset.hours, 10);
      simHourBtns.forEach(b => {
        b.className = 'sim-hour-btn py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:border-[#005c55] cursor-pointer';
      });
      btn.className = 'sim-hour-btn py-1.5 rounded-lg border-2 border-[#005c55] text-xs font-bold text-[#005c55] bg-teal-50 cursor-pointer';
      calculateSimulation();
    });
  });

  const simPeakCb = document.getElementById('sim-peak-cb');
  if (simPeakCb) {
    simPeakCb.addEventListener('change', () => {
      simIsPeak = simPeakCb.checked;
      calculateSimulation();
    });
  }

  const simWeekendCb = document.getElementById('sim-weekend-cb');
  if (simWeekendCb) {
    simWeekendCb.addEventListener('change', () => {
      simIsWeekend = simWeekendCb.checked;
      calculateSimulation();
    });
  }

  // Save Pricing Policy
  const saveBtn = document.getElementById('save-pricing-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      Store.savePricing({
        cleaningRate,
        cookingRate,
        deepCleanRate,
        peakMultiplier,
        weekendSurcharge,
        partnerSplit
      });
      Store.showToast('Đã lưu và đồng bộ chính sách biểu giá mới cho toàn hệ thống!');
    });
  }

  calculateSimulation();
}

document.addEventListener('DOMContentLoaded', initAdminPricingPage);
