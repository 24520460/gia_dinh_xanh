// js/store.js
// Centralized LocalStorage Data Store & Event Bus for Gia Đình Xanh

import { INITIAL_ORDERS, KYC_CANDIDATES } from './data/mockData.js';

const STORAGE_KEYS = {
  ORDERS: 'gdx_orders',
  KYC: 'gdx_kyc_candidates',
  WALLET: 'gdx_partner_wallet',
  SCHEDULE: 'gdx_partner_schedule',
  PRICING: 'gdx_admin_pricing'
};

const DEFAULT_SCHEDULE = {
  '0-morning': 2,
  '0-afternoon': 2,
  '0-evening': 0,
  '1-morning': 1,
  '1-afternoon': 2,
  '1-evening': 0,
  '2-morning': 2,
  '2-afternoon': 1,
  '2-evening': 1,
  '3-morning': 1,
  '3-afternoon': 2,
  '3-evening': 0,
  '4-morning': 2,
  '4-afternoon': 2,
  '4-evening': 1,
  '5-morning': 1,
  '5-afternoon': 1,
  '5-evening': 0,
  '6-morning': 0,
  '6-afternoon': 0,
  '6-evening': 0,
};

const DEFAULT_WALLET = {
  balance: 3420000,
  pending: 1200000,
  rating: 4.95,
  completedJobs: 320,
  transactions: [
    { id: 'TX-901', date: '25/10/2025 17:50', title: 'Thù lao ca #GDX-89241', amount: 236160, type: 'plus' },
    { id: 'TX-900', date: '24/10/2025 14:15', title: 'Thù lao ca #GDX-89237', amount: 311600, type: 'plus' },
    { id: 'TX-899', date: '22/10/2025 09:30', title: 'Rút tiền về Vietcombank (***8921)', amount: -1500000, type: 'minus' }
  ]
};

const DEFAULT_PRICING = {
  cleaningRate: 80000,
  cookingRate: 110000,
  deepCleanRate: 130000,
  peakMultiplier: 1.15,
  weekendSurcharge: 10000,
  holidayMultiplier: 2.0,
  partnerSplit: 82,
  platinumBonus: 3
};

export const Store = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.KYC)) {
      localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(KYC_CANDIDATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WALLET)) {
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(DEFAULT_WALLET));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE)) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(DEFAULT_SCHEDULE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRICING)) {
      localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
    }
  },

  // Orders API
  getOrders() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || orders[0];
  },

  saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('gdx_orders_updated', { detail: orders }));
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  },

  updateOrderStatus(orderId, newStatus, extraData = {}) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], status: newStatus, ...extraData };
      this.saveOrders(orders);
      return orders[index];
    }
    return null;
  },

  // KYC Candidates API
  getKYCCandidates() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.KYC)) || KYC_CANDIDATES;
    } catch {
      return KYC_CANDIDATES;
    }
  },

  updateKYCStatus(id, newStatus, newLabel) {
    const list = this.getKYCCandidates();
    const target = list.find(c => c.id === id);
    if (target) {
      target.status = newStatus;
      if (newLabel) target.statusLabel = newLabel;
      localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('gdx_kyc_updated', { detail: list }));
    }
  },

  // Wallet API
  getWallet() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WALLET)) || DEFAULT_WALLET;
    } catch {
      return DEFAULT_WALLET;
    }
  },

  withdraw(amount) {
    const wallet = this.getWallet();
    if (wallet.balance < amount) return false;
    wallet.balance -= amount;
    wallet.transactions.unshift({
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      date: 'Vừa xong',
      title: 'Rút tiền về Vietcombank (***8921)',
      amount: -amount,
      type: 'minus'
    });
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
    window.dispatchEvent(new CustomEvent('gdx_wallet_updated', { detail: wallet }));
    return true;
  },

  // Schedule API
  getSchedule() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULE)) || DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  },

  toggleScheduleSlot(key) {
    const schedule = this.getSchedule();
    const current = schedule[key] ?? 0;
    if (current === 2) return schedule; // Không đổi ca đã khóa
    schedule[key] = current === 1 ? 0 : 1;
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    window.dispatchEvent(new CustomEvent('gdx_schedule_updated', { detail: schedule }));
    return schedule;
  },

  // Pricing API
  getPricing() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRICING)) || DEFAULT_PRICING;
    } catch {
      return DEFAULT_PRICING;
    }
  },

  savePricing(pricing) {
    localStorage.setItem(STORAGE_KEYS.PRICING, JSON.stringify(pricing));
    window.dispatchEvent(new CustomEvent('gdx_pricing_updated', { detail: pricing }));
  },

  // Toast UI Utility
  showToast(message, type = 'success') {
    const existing = document.querySelector('.gdx-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `gdx-toast gdx-toast-${type}`;
    const iconName = type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'info';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[20px]">${iconName}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toast-slide-out 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};
