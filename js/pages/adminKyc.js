// js/pages/adminKyc.js
// Logic thẩm định hồ sơ đối tác 4 bước chuẩn KYC 5 sao

import { Store } from '../store.js';
import { IMAGES } from '../data/mockData.js';

export function initAdminKycPage() {
  let candidates = Store.getKYCCandidates();
  let selectedCandidate = candidates[0];
  let activeTab = 'id'; // 'id' | 'judicial' | 'health' | 'test'

  const candidatesListEl = document.getElementById('kyc-candidates-list');
  const detailsContainer = document.getElementById('kyc-details-container');

  function renderCandidatesList() {
    if (!candidatesListEl) return;
    candidates = Store.getKYCCandidates();

    candidatesListEl.innerHTML = candidates.map(c => {
      const isSelected = selectedCandidate && selectedCandidate.id === c.id;
      const getBadge = (status, label) => {
        if (status === 'approved') return `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">${label}</span>`;
        if (status === 'rejected') return `<span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">${label}</span>`;
        if (status === 'needs_update') return `<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">${label}</span>`;
        return `<span class="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">${label}</span>`;
      };

      return `
        <div data-id="${c.id}" class="candidate-item p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
          isSelected 
            ? 'bg-teal-50/80 border-[#005c55] shadow-xs' 
            : 'bg-white border-slate-200 hover:border-slate-300'
        }">
          <div class="flex items-center gap-3">
            <img src="${c.avatar}" alt="${c.name}" class="w-11 h-11 rounded-xl object-cover border border-slate-200" />
            <div>
              <div class="font-bold text-xs text-slate-900">${c.name}</div>
              <div class="text-[11px] text-slate-500">${c.age} tuổi • ${c.location}</div>
            </div>
          </div>
          <div class="text-right">
            ${getBadge(c.status, c.statusLabel)}
            <div class="text-[10px] text-slate-400 mt-1">${c.submittedTime}</div>
          </div>
        </div>
      `;
    }).join('');

    candidatesListEl.querySelectorAll('.candidate-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        selectedCandidate = candidates.find(c => c.id === id) || candidates[0];
        renderCandidatesList();
        renderDetails();
      });
    });
  }

  function renderDetails() {
    if (!detailsContainer || !selectedCandidate) return;

    const tabContent = () => {
      switch (activeTab) {
        case 'id':
          return `
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <div class="text-xs font-bold text-slate-700">Mặt trước CCCD gắn chip</div>
                  <div class="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-xs">
                    <img src="${IMAGES.cccdFront}" alt="CCCD Mặt trước" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div class="space-y-1.5">
                  <div class="text-xs font-bold text-slate-700">Mặt sau CCCD gắn chip</div>
                  <div class="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-xs">
                    <img src="${IMAGES.cccdBack}" alt="CCCD Mặt sau" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span class="text-slate-400 font-medium">Số định danh cá nhân:</span>
                  <div class="font-mono font-bold text-slate-800">${selectedCandidate.cccdNumber}</div>
                </div>
                <div>
                  <span class="text-slate-400 font-medium">Ngày sinh:</span>
                  <div class="font-bold text-slate-800">${selectedCandidate.dob}</div>
                </div>
                <div class="col-span-2">
                  <span class="text-slate-400 font-medium">Ngày cấp & Nơi cấp:</span>
                  <div class="font-bold text-slate-800">${selectedCandidate.cccdIssueDate}</div>
                </div>
              </div>
            </div>
          `;
        case 'judicial':
          return `
            <div class="space-y-4">
              <div class="space-y-1.5">
                <div class="text-xs font-bold text-slate-700">Bản sao công chứng Phiếu Lý lịch tư pháp số 2</div>
                <div class="rounded-xl overflow-hidden aspect-video max-h-64 bg-slate-100 border border-slate-200 shadow-xs flex items-center justify-center">
                  <img src="${IMAGES.judicialRecord}" alt="Lý lịch tư pháp" class="h-full object-contain" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span class="text-slate-400 font-medium">Số phiếu xác nhận:</span>
                  <div class="font-mono font-bold text-slate-800">${selectedCandidate.judicialRecordNumber}</div>
                </div>
                <div>
                  <span class="text-slate-400 font-medium">Kết luận pháp lý:</span>
                  <div class="font-bold text-emerald-700 flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">verified</span>
                    Không có án tích (Đạt chuẩn)
                  </div>
                </div>
              </div>
            </div>
          `;
        case 'health':
          return `
            <div class="space-y-4 text-xs">
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span class="text-slate-400 font-medium">Cơ sở khám bệnh:</span>
                  <div class="font-bold text-slate-800">${selectedCandidate.hospital}</div>
                </div>
                <div>
                  <span class="text-slate-400 font-medium">Ngày khám:</span>
                  <div class="font-bold text-slate-800">${selectedCandidate.examDate}</div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div class="font-bold text-slate-700">Xét nghiệm Viêm Gan B:</div>
                  <div class="font-extrabold text-emerald-800 text-sm mt-1">${selectedCandidate.hepBResult}</div>
                  <div class="text-[10px] text-slate-400 mt-1">Đạt yêu cầu chuẩn chế biến nấu ăn</div>
                </div>
                <div class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <div class="font-bold text-slate-700">Chụp X-Quang Phổi:</div>
                  <div class="font-extrabold text-emerald-800 text-sm mt-1">${selectedCandidate.xrayResult}</div>
                  <div class="text-[10px] text-slate-400 mt-1">Không mắc bệnh truyền nhiễm đường hô hấp</div>
                </div>
              </div>
            </div>
          `;
        case 'test':
        default:
          return `
            <div class="space-y-4 text-xs">
              <div class="grid grid-cols-3 gap-3">
                <div class="p-4 rounded-xl bg-teal-50 border border-teal-200 text-center">
                  <div class="text-[11px] text-teal-800 font-semibold">Điểm Lý Thuyết 5★</div>
                  <div class="text-2xl font-black text-[#005c55] mt-1">${selectedCandidate.theoryScore}/100</div>
                  <div class="text-[10px] text-emerald-700 font-bold mt-0.5">Xuất sắc</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div class="text-[11px] text-slate-500 font-semibold">Giảng viên sát hạch</div>
                  <div class="font-extrabold text-slate-800 text-xs mt-2">${selectedCandidate.interviewer}</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div class="text-[11px] text-slate-500 font-semibold">Thời gian thi</div>
                  <div class="font-bold text-slate-700 text-xs mt-2">${selectedCandidate.interviewDate}</div>
                </div>
              </div>

              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div class="font-bold text-slate-700">Nhận xét chi tiết từ Trưởng bộ phận Đào tạo:</div>
                <p class="text-xs text-slate-600 leading-relaxed italic">"${selectedCandidate.evalComments}"</p>
              </div>
            </div>
          `;
      }
    };

    detailsContainer.innerHTML = `
      <!-- Candidate Profile Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div class="flex items-center gap-3.5">
          <img src="${selectedCandidate.avatar}" alt="${selectedCandidate.name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs" />
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-lg text-slate-900">${selectedCandidate.name}</h3>
              <span class="font-mono text-xs text-slate-400">ID: ${selectedCandidate.id}</span>
            </div>
            <div class="text-xs text-slate-500">${selectedCandidate.age} tuổi • ${selectedCandidate.location}</div>
            <div class="flex gap-1.5 mt-1">
              ${selectedCandidate.specialties.map(s => `<span class="bg-teal-50 text-[#005c55] font-bold text-[10px] px-2 py-0.2 rounded-full border border-teal-200">${s}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Approval / Rejection Actions -->
        <div class="flex items-center gap-2">
          <button id="reject-kyc-btn" type="button" class="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer">
            Từ Chối / Bổ Sung
          </button>
          <button id="approve-kyc-btn" type="button" class="px-4 py-2 rounded-xl bg-[#005c55] hover:bg-[#0f766e] text-white text-xs font-extrabold shadow-md transition-transform active:scale-95 flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-base">verified</span>
            <span>Duyệt & Kích Hoạt 5★</span>
          </button>
        </div>
      </div>

      <!-- 4 Verification Tabs -->
      <div class="flex border-b border-slate-200 text-xs font-bold">
        <button type="button" data-tab="id" class="kyc-tab-btn py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'id' ? 'border-[#005c55] text-[#005c55]' : 'border-transparent text-slate-500 hover:text-slate-800'}">
          1. Định Danh CCCD
        </button>
        <button type="button" data-tab="judicial" class="kyc-tab-btn py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'judicial' ? 'border-[#005c55] text-[#005c55]' : 'border-transparent text-slate-500 hover:text-slate-800'}">
          2. Lý Lịch Tư Pháp
        </button>
        <button type="button" data-tab="health" class="kyc-tab-btn py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'health' ? 'border-[#005c55] text-[#005c55]' : 'border-transparent text-slate-500 hover:text-slate-800'}">
          3. Khám Sức Khỏe
        </button>
        <button type="button" data-tab="test" class="kyc-tab-btn py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${activeTab === 'test' ? 'border-[#005c55] text-[#005c55]' : 'border-transparent text-slate-500 hover:text-slate-800'}">
          4. Bài Thi Sát Hạch
        </button>
      </div>

      <!-- Tab Content Panel -->
      <div class="pt-2">
        ${tabContent()}
      </div>
    `;

    // Tab buttons listener
    detailsContainer.querySelectorAll('.kyc-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        renderDetails();
      });
    });

    // Approve button
    const approveBtn = document.getElementById('approve-kyc-btn');
    if (approveBtn) {
      approveBtn.addEventListener('click', () => {
        Store.updateKYCStatus(selectedCandidate.id, 'approved', 'Đã kích hoạt 5★');
        selectedCandidate.status = 'approved';
        selectedCandidate.statusLabel = 'Đã kích hoạt 5★';
        renderCandidatesList();
        renderDetails();
        Store.showToast(`Chúc mừng! Hồ sơ ${selectedCandidate.name} (${selectedCandidate.id}) đã được phê duyệt và kích hoạt quyền nhận đơn!`);
      });
    }

    // Reject button
    const rejectBtn = document.getElementById('reject-kyc-btn');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        Store.updateKYCStatus(selectedCandidate.id, 'rejected', 'Từ chối');
        selectedCandidate.status = 'rejected';
        selectedCandidate.statusLabel = 'Từ chối';
        renderCandidatesList();
        renderDetails();
        Store.showToast(`Đã chuyển trạng thái hồ sơ ${selectedCandidate.id} sang từ chối bổ sung giấy tờ.`, 'warning');
      });
    }
  }

  window.addEventListener('gdx_kyc_updated', () => {
    candidates = Store.getKYCCandidates();
    renderCandidatesList();
    renderDetails();
  });

  renderCandidatesList();
  renderDetails();
}

document.addEventListener('DOMContentLoaded', initAdminKycPage);
