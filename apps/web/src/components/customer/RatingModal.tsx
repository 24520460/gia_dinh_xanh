import React, { useState } from 'react';
import { IMAGES } from '../../data/mockData';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Đúng giờ',
    'Nhà sạch bóng',
    'Thân thiện & Lễ phép',
    'Cẩn thận với đồ đạc',
  ]);
  const [feedback, setFeedback] = useState(
    'Cô Mai làm việc rất tỉ mỉ, lau dọn từng ngóc ngách sạch tinh tươm. Bé mèo nhà mình cũng rất quấn cô. Lần sau mình sẽ tiếp tục book cô Mai!'
  );
  const [tipAmount, setTipAmount] = useState<number>(50000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const allTags = [
    'Đúng giờ',
    'Nhà sạch bóng',
    'Thân thiện & Lễ phép',
    'Cẩn thận với đồ đạc',
    'Thao tác nhanh nhẹn',
    'Nấu ăn hợp khẩu vị',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        if (onSubmitSuccess) onSubmitSuccess();
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">rate_review</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Đánh giá chất lượng dịch vụ</h2>
              <p className="text-xs text-slate-500 font-medium">
                Đơn #GDX-89241 • Dọn dẹp căn hộ tiêu chuẩn 3 Giờ (Hoàn thành lúc 17:45 hôm nay)
              </p>
            </div>
          </div>
          <button
            aria-label="Đóng"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Cảm ơn bạn đã gửi đánh giá 5 Sao!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Đã ghi nhận nhận xét và chuyển phần tiền thưởng tip <strong className="text-amber-600">+{tipAmount.toLocaleString()}đ</strong> trực tiếp vào ví của cô Hoàng Thị Mai.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Partner Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={IMAGES.hoangThiMaiModalAvatar}
                    alt="Cô Hoàng Thị Mai"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-200"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#005C55] text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-xs">verified</span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-bold text-slate-900">Cô Hoàng Thị Mai</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">military_tech</span>
                      Đối tác 5 Sao • 184 ca
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Tác phong chu đáo, cẩn thận, chuyên dọn căn hộ chung cư cao cấp</p>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[11px] text-slate-400 block font-medium">Thời gian làm việc</span>
                <span className="text-xs font-bold text-[#005C55]">3 Giờ liên tục</span>
              </div>
            </div>

            {/* 5-Star Interactive Rating */}
            <div className="text-center py-2">
              <p className="text-sm font-semibold text-slate-800 mb-2">Bạn cảm thấy dịch vụ của cô Mai như thế nào?</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-amber-400 hover:scale-110 transition-transform p-1"
                  >
                    <span
                      className="material-symbols-outlined text-4xl"
                      style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                <span className="material-symbols-outlined text-sm text-amber-500">sentiment_very_satisfied</span>
                <span>
                  {rating === 5
                    ? 'Tuyệt vời & Rất hài lòng (5/5 sao)'
                    : rating === 4
                    ? 'Hài lòng (4/5 sao)'
                    : rating === 3
                    ? 'Bình thường (3/5 sao)'
                    : 'Chưa hài lòng'}
                </span>
              </div>
            </div>

            {/* Quick Tags Multi-select */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2.5">
                Điểm bạn hài lòng nhất (Chọn nhiều điểm nổi bật):
              </label>
              <div className="flex flex-wrap gap-2.5">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-[#0F766E] text-white shadow-xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-[#0F766E]'
                      }`}
                    >
                      {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
                      {!isSelected && '+ '}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">Viết nhận xét chi tiết:</label>
                <span className="text-[11px] text-slate-400">{feedback.length}/500 ký tự</span>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100 bg-white"
                placeholder="Chia sẻ trải nghiệm thực tế để cô Mai có thêm động lực phục vụ tốt hơn..."
              />
            </div>

            {/* Tip / Bonus Gratitude Section */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Thưởng thêm (Tip tri ân cho cô Mai)</h4>
                    <p className="text-[11px] text-slate-500">100% tiền tip sẽ được chuyển trực tiếp vào ví của thợ</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-amber-600">volunteer_activism</span>
              </div>

              {/* Tip Preset Buttons */}
              <div className="grid grid-cols-4 gap-2.5 pt-1">
                {[20000, 30000, 50000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTipAmount(amount)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                      tipAmount === amount
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white border-amber-300 text-slate-800 hover:border-amber-500'
                    }`}
                  >
                    {amount.toLocaleString()}đ
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const custom = prompt('Nhập số tiền tip tùy chọn (VNĐ):', '100000');
                    if (custom && !isNaN(Number(custom))) {
                      setTipAmount(Number(custom));
                    }
                  }}
                  className="py-2 px-3 rounded-xl bg-white border border-dashed border-amber-400 text-amber-800 font-bold text-xs hover:border-amber-600 transition-colors text-center"
                >
                  {tipAmount !== 20000 && tipAmount !== 30000 && tipAmount !== 50000 && tipAmount > 0
                    ? `${tipAmount.toLocaleString()}đ`
                    : 'Số khác'}
                </button>
              </div>

              {/* Tip Payment Source Info */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-amber-200/60">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#005C55]">account_balance_wallet</span>
                  <span>Phương thức tip: <strong>Khấu trừ ví MoMo</strong></span>
                </span>
                <span className="text-[#005C55] font-semibold text-[11px]">Bảo mật SSL</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Để sau
              </button>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <span className="text-[11px] text-slate-400 block">Thanh toán thêm tip:</span>
                  <span className="text-xs text-[#FD651E] font-bold">+{tipAmount.toLocaleString()}đ</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-[#FD651E] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang gửi...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      <span>Gửi đánh giá & Hoàn tất</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
