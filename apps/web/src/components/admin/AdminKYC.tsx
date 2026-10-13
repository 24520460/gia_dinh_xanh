import React, { useState } from 'react';
import { IMAGES, KYC_CANDIDATES } from '../../data/mockData';
import { KYCCandidate, ScreenId } from '@gdx/shared-types';

interface AdminKYCProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminKYC: React.FC<AdminKYCProps> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<KYCCandidate[]>(KYC_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<KYCCandidate>(KYC_CANDIDATES[0]);
  const [activeTab, setActiveTab] = useState<'id' | 'judicial' | 'health' | 'test'>('id');
  const [approvalModal, setApprovalModal] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'approved', statusLabel: 'Đã kích hoạt 5★' } : c
      )
    );
    setSelectedCandidate((prev) => ({
      ...prev,
      status: 'approved',
      statusLabel: 'Đã kích hoạt 5★',
    }));
    setApprovalModal('approved');
  };

  const handleReject = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'rejected', statusLabel: 'Từ chối' } : c
      )
    );
    setSelectedCandidate((prev) => ({
      ...prev,
      status: 'rejected',
      statusLabel: 'Từ chối',
    }));
    setApprovalModal('rejected');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005c55] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">GIA ĐÌNH XANH</span>
                <span className="bg-[#005c55] text-emerald-200 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider">
                  KYC VERIFICATION
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Thẩm Định Hồ Sơ & Sát Hạch Đối Tác 5 Sao</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Còn 18 hồ sơ đang chờ duyệt</span>
            </div>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <img
                src={IMAGES.minhTuanKYCAdmin}
                alt="Minh Tuấn"
                className="w-9 h-9 rounded-lg border border-slate-700 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sub Navigation Ribbon */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 text-xs font-semibold">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Tổng quan & Điều phối Live</span>
            </button>
            <button
              onClick={() => onNavigate('admin-pricing')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Biểu giá & Chiết khấu (Pricing Engine)</span>
            </button>
            <button
              className="px-3 py-1.5 rounded-md bg-[#005c55] text-white flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Duyệt hồ sơ KYC Đối tác ({candidates.length})</span>
            </button>
            <button
              onClick={() => onNavigate('partner-board')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Xem Sàn nhận việc Đối tác</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Candidate List (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Danh Sách Ứng Viên ({candidates.length})</h3>
              <span className="text-xs text-slate-500">Mới nhất</span>
            </div>

            <div className="space-y-2.5">
              {candidates.map((cand) => {
                const isSelected = selectedCandidate.id === cand.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#005c55] bg-emerald-50/70 shadow-sm ring-1 ring-[#005c55]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{cand.name}</h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                              cand.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cand.status === 'needs_update'
                                ? 'bg-amber-100 text-amber-800'
                                : cand.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {cand.statusLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {cand.age} tuổi • {cand.location}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cand.specialties.map((s) => (
                            <span
                              key={s}
                              className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dossier Details & Verification View (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
            {/* Dossier Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedCandidate.name}</h2>
                    <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {selectedCandidate.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {selectedCandidate.age} tuổi • Thường trú: {selectedCandidate.location}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Hồ sơ nộp: <b className="text-slate-700">{selectedCandidate.submittedTime}</b>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(selectedCandidate.id)}
                  className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleApprove(selectedCandidate.id)}
                  className="px-4 py-2 bg-[#005c55] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Phê duyệt & Kích hoạt 5★</span>
                </button>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="px-6 border-b border-slate-200 flex gap-4 text-xs font-bold overflow-x-auto">
              {[
                { id: 'id', label: '1. CCCD & Sinh trắc học', icon: 'badge' },
                { id: 'judicial', label: '2. Lý lịch tư pháp số 2', icon: 'policy' },
                { id: 'health', label: '3. Giấy khám sức khỏe', icon: 'medical_services' },
                { id: 'test', label: '4. Sát hạch tay nghề & Phỏng vấn', icon: 'checklist' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 pt-1 flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#005c55] text-[#005c55]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 pt-0 space-y-6">
              {/* TAB 1: CCCD & Sinh trắc học */}
              {activeTab === 'id' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Ảnh CCCD Gắn Chip & OCR Trích Xuất:</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      OCR Khớp 99.8%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-500">Mặt trước CCCD</div>
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={IMAGES.cccdFront}
                          alt="CCCD Front"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-500">Mặt sau CCCD (Có vân tay & chip)</div>
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                          src={IMAGES.cccdBack}
                          alt="CCCD Back"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* OCR Fields */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-slate-500 text-[11px]">Số định danh cá nhân:</div>
                      <div className="font-mono font-bold text-slate-900 mt-0.5">{selectedCandidate.cccdNumber}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Ngày sinh:</div>
                      <div className="font-bold text-slate-900 mt-0.5">{selectedCandidate.dob}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[11px]">Cơ quan cấp:</div>
                      <div className="font-bold text-slate-900 mt-0.5">{selectedCandidate.cccdIssueDate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Lý lịch tư pháp số 2 */}
              {activeTab === 'judicial' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Phiếu Lý Lịch Tư Pháp Số 2 (Sở Tư Pháp Cấp):</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      Không có tiền án tiền sự
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={IMAGES.judicialRecord}
                        alt="Phiếu lý lịch tư pháp"
                        className="w-full h-64 object-cover"
                      />
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
                      <div>
                        <div className="text-slate-500 text-[11px]">Số văn bản:</div>
                        <div className="font-mono font-bold text-slate-900">{selectedCandidate.judicialRecordNumber}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Cơ quan xác thực:</div>
                        <div className="font-bold text-slate-900">Sở Tư Pháp TP. Hồ Chí Minh</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-[11px]">Kết quả xác minh hình sự:</div>
                        <div className="text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Trong sạch 100% • Đủ điều kiện làm việc trong gia đình</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Giấy khám sức khỏe */}
              {activeTab === 'health' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Hồ Sơ Sức Khỏe & Truyền Nhiễm:</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      Sức khỏe loại 1
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Bệnh viện thăm khám:</div>
                      <div className="font-bold text-slate-900 mt-1">{selectedCandidate.hospital}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">{selectedCandidate.examDate}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-slate-500 text-[11px]">Viêm gan B (HBsAg):</div>
                      <div className="font-bold text-emerald-700 mt-1">{selectedCandidate.hepBResult}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Không lây nhiễm</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-slate-500 text-[11px]">X-Quang Phổi & Lao:</div>
                      <div className="font-bold text-emerald-700 mt-1">{selectedCandidate.xrayResult}</div>
                      <div className="text-slate-500 text-[10px] mt-0.5">Đạt tiêu chuẩn y tế</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Sát hạch tay nghề */}
              {activeTab === 'test' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Đánh Giá Thực Hành Tại Trung Tâm Đào Tạo:</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
                      Điểm thi: {selectedCandidate.theoryScore}/100
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-slate-500 text-[11px]">Giảng viên sát hạch:</div>
                        <div className="font-bold text-slate-900">{selectedCandidate.interviewer}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-500 text-[11px]">Thời gian kiểm tra:</div>
                        <div className="font-bold text-slate-800">{selectedCandidate.interviewDate}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-slate-600 font-bold mb-1">Nhận xét chi tiết của giám khảo:</div>
                      <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 italic">
                        "{selectedCandidate.evalComments}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Approval Notification Modal */}
      {approvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl ${
                approvalModal === 'approved'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              <span className="material-symbols-outlined text-3xl">
                {approvalModal === 'approved' ? 'verified' : 'cancel'}
              </span>
            </div>

            <h4 className="font-bold text-slate-900 text-base">
              {approvalModal === 'approved' ? 'Đã Kích Hoạt Đối Tác Thành Công!' : 'Đã Từ Chối Hồ Sơ'}
            </h4>

            <p className="text-xs text-slate-600">
              {approvalModal === 'approved'
                ? `Hồ sơ của đối tác ${selectedCandidate.name} (${selectedCandidate.id}) đã được phê duyệt chuẩn 5 sao. Tài khoản đã có thể mở app để nhận đơn ngay.`
                : `Hồ sơ đã được lưu trữ trạng thái từ chối. Một email thông báo lý do đã được gửi tới ứng viên.`}
            </p>

            <button
              onClick={() => setApprovalModal(null)}
              className="w-full bg-[#005c55] text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
