// js/components/ratingModal.js
// Modal Đánh giá dịch vụ 5 sao & Tip tiền thưởng cho Đối tác

import { Store } from '../store.js';

export function openRatingModal(options = {}) {
  const {
    orderId = '#GDX-89241',
    partnerName = 'Hoàng Thị Mai',
    onSuccess = null
  } = options;

  const existingModal = document.getElementById('gdx-rating-modal');
  if (existingModal) existingModal.remove();

  let rating = 5;
  let tipAmount = 50000;
  const selectedTags = new Set(['Đúng giờ', 'Nhà sạch bóng', 'Thân thiện & Lễ phép', 'Cẩn thận với đồ đạc']);
  const allTags = [
    'Đúng giờ',
    'Nhà sạch bóng',
    'Thân thiện & Lễ phép',
    'Cẩn thận với đồ đạc',
    'Thao tác nhanh nhẹn',
    'Nấu ăn hợp khẩu vị'
  ];

  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'gdx-rating-modal';
  modalBackdrop.className = 'fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in';

  modalBackdrop.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-modal-pop">
      <!-- Modal Header -->
      <div class="relative bg-gradient-to-br from-[#005c55] to-[#0f766e] text-white p-6 pb-8 text-center">
        <button id="modal-close-btn" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-colors">
          <span class="material-symbols-outlined text-lg">close</span>
        </button>
        <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-amber-300 mx-auto flex items-center justify-center mb-3 shadow-lg border border-white/30">
          <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">grade</span>
        </div>
        <h3 class="text-xl font-bold">Đánh Giá Dịch Vụ 5 Sao</h3>
        <p class="text-xs text-teal-100 mt-1">Đơn hàng <span class="font-bold underline">${orderId}</span> • Đối tác: <span class="font-bold">${partnerName}</span></p>
      </div>

      <div class="p-6 -mt-4 bg-white rounded-t-3xl space-y-5">
        <!-- Star Rating -->
        <div class="text-center">
          <div class="text-xs font-semibold text-slate-500 mb-2">Chất lượng phục vụ của cô ${partnerName}</div>
          <div id="star-container" class="flex justify-center items-center gap-2">
            ${[1, 2, 3, 4, 5].map(star => `
              <button type="button" data-star="${star}" class="star-btn transition-transform hover:scale-110 active:scale-95 text-amber-400">
                <span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">star</span>
              </button>
            `).join('')}
          </div>
          <div id="rating-text" class="text-xs font-bold text-amber-700 mt-1.5">Xuất sắc - Tuyệt đối hài lòng 5.0★</div>
        </div>

        <!-- Tag Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2">Điểm bạn ưng ý nhất:</label>
          <div id="tags-container" class="flex flex-wrap gap-1.5">
            ${allTags.map(tag => `
              <button type="button" data-tag="${tag}" class="tag-btn text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedTags.has(tag) 
                  ? 'bg-teal-50 text-[#005c55] border-2 border-[#005c55] font-bold' 
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }">
                ${tag}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Feedback Textarea -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Cảm nhận chi tiết:</label>
          <textarea id="feedback-input" rows="2" class="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005c55] focus:border-transparent text-slate-800" placeholder="Viết vài dòng khen ngợi giúp cô có thêm động lực..."></textarea>
        </div>

        <!-- Tip Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>Thưởng thêm tiền Tip cho thợ (Tùy chọn):</span>
            <span id="selected-tip-display" class="text-xs text-[#005c55] font-black">+50.000đ</span>
          </label>
          <div class="grid grid-cols-4 gap-2">
            ${[20000, 50000, 100000, 0].map(tip => `
              <button type="button" data-tip="${tip}" class="tip-btn py-2 rounded-xl text-xs font-bold transition-all ${
                tip === 50000 
                  ? 'bg-[#005c55] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }">
                ${tip === 0 ? 'Không tip' : `${tip / 1000}k`}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 flex gap-3">
          <button id="cancel-rating-btn" type="button" class="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
            Để sau
          </button>
          <button id="submit-rating-btn" type="button" class="w-2/3 py-2.5 rounded-xl bg-[#005c55] text-white text-xs font-bold hover:bg-[#0f766e] transition-colors flex items-center justify-center gap-1.5 shadow-md">
            <span class="material-symbols-outlined text-base">send</span>
            <span>Gửi Đánh Giá 5★</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);

  // Set default comment
  const feedbackInput = document.getElementById('feedback-input');
  feedbackInput.value = 'Cô Mai làm việc rất tỉ mỉ, lau dọn từng ngóc ngách sạch tinh tươm. Bé mèo nhà mình cũng rất quấn cô. Lần sau mình sẽ tiếp tục book cô Mai!';

  // Star handling
  const starBtns = modalBackdrop.querySelectorAll('.star-btn');
  const ratingText = document.getElementById('rating-text');
  const ratingLabels = {
    1: 'Chưa hài lòng 1.0★',
    2: 'Cần cải thiện 2.0★',
    3: 'Tạm ổn 3.0★',
    4: 'Hài lòng 4.0★',
    5: 'Xuất sắc - Tuyệt đối hài lòng 5.0★'
  };

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rating = parseInt(btn.dataset.star, 10);
      ratingText.innerText = ratingLabels[rating] || `${rating}.0★`;
      starBtns.forEach((b, idx) => {
        const starIcon = b.querySelector('.material-symbols-outlined');
        if (idx < rating) {
          starIcon.style.fontVariationSettings = "'FILL' 1";
          b.className = 'star-btn transition-transform hover:scale-110 active:scale-95 text-amber-400';
        } else {
          starIcon.style.fontVariationSettings = "'FILL' 0";
          b.className = 'star-btn transition-transform hover:scale-110 active:scale-95 text-slate-300';
        }
      });
    });
  });

  // Tag handling
  const tagBtns = modalBackdrop.querySelectorAll('.tag-btn');
  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.className = 'tag-btn text-xs px-3 py-1.5 rounded-full font-medium transition-all bg-slate-100 text-slate-600 border border-slate-200';
      } else {
        selectedTags.add(tag);
        btn.className = 'tag-btn text-xs px-3 py-1.5 rounded-full font-medium transition-all bg-teal-50 text-[#005c55] border-2 border-[#005c55] font-bold';
      }
    });
  });

  // Tip handling
  const tipBtns = modalBackdrop.querySelectorAll('.tip-btn');
  const selectedTipDisplay = document.getElementById('selected-tip-display');
  tipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tipAmount = parseInt(btn.dataset.tip, 10);
      selectedTipDisplay.innerText = tipAmount === 0 ? '0đ' : `+${tipAmount.toLocaleString('vi-VN')}đ`;
      tipBtns.forEach(b => {
        b.className = 'tip-btn py-2 rounded-xl text-xs font-bold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200';
      });
      btn.className = 'tip-btn py-2 rounded-xl text-xs font-bold transition-all bg-[#005c55] text-white shadow-xs';
    });
  });

  // Close actions
  const closeModal = () => modalBackdrop.remove();
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('cancel-rating-btn').addEventListener('click', closeModal);

  // Submit action
  document.getElementById('submit-rating-btn').addEventListener('click', () => {
    Store.updateOrderStatus(orderId, 'completed', {
      statusLabel: 'Hoàn thành 5★',
      customerReview: {
        rating,
        tags: Array.from(selectedTags),
        comment: feedbackInput.value,
        tipAmount
      }
    });
    closeModal();
    Store.showToast(`Cảm ơn bạn đã gửi đánh giá ${rating}★ cho cô ${partnerName}!`);
    if (typeof onSuccess === 'function') onSuccess();
  });
}
