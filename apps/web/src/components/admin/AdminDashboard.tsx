import React, { useState } from 'react';
import { IMAGES, INITIAL_ORDERS } from '../../data/mockData';
import { OrderItem, ScreenId } from '@gdx/shared-types';

interface AdminDashboardProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(INITIAL_ORDERS[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.partnerName.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: OrderItem['status'], label: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {label}
          </span>
        );
      case 'dispute':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="material-symbols-outlined text-xs">warning</span>
            {label}
          </span>
        );
      case 'waiting_partner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="material-symbols-outlined text-xs">hourglass_empty</span>
            {label}
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <span className="material-symbols-outlined text-xs">directions_bike</span>
            {label}
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            {label}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {label}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005c55] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl">shield_person</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">GIA ĐÌNH XANH</span>
                <span className="bg-[#005c55] text-emerald-200 text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider">
                  OPS CONTROL TOWER
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Trung Tâm Giám Sát & Điều Phối Đơn Hàng 24/7</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm mã đơn, SĐT, đối tác..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 w-60"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-sm">
                search
              </span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-200">Lê Minh Tuấn</div>
                <div className="text-[10px] text-emerald-400">Operations Manager</div>
              </div>
              <img
                src={IMAGES.minhTuanAdmin}
                alt="Minh Tuấn"
                className="w-9 h-9 rounded-lg border border-slate-700 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Admin Navigation Ribbon */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 text-xs font-semibold">
            <button
              className="px-3 py-1.5 rounded-md bg-[#005c55] text-white flex items-center gap-1.5 shadow-sm"
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
              onClick={() => onNavigate('admin-kyc')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Duyệt hồ sơ KYC Đối tác (18 chờ)</span>
            </button>
            <button
              onClick={() => onNavigate('customer-tracking')}
              className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              <span>Xem App Khách hàng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh thu hôm nay</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">paid</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">42.850.000 ₫</div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+14.2% so với hôm qua</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đơn hàng đang chạy</span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">cyclist</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">128 đơn</div>
            <div className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-800">94</span> Dọn dẹp • <span className="font-semibold text-slate-800">34</span> Nấu ăn
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đối tác đang Online</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">handshake</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">86 / 110</div>
            <div className="text-xs text-slate-500 mt-1">
              Tỷ lệ sẵn sàng nhận ca: <span className="font-bold text-emerald-600">78.2%</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chỉ số hài lòng (CSAT)</span>
              <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">star</span>
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">4.92 / 5.0</div>
            <div className="text-xs text-slate-500 mt-1">
              Tỷ lệ khiếu nại: <span className="font-bold text-rose-600">0.3%</span> (1 đơn cần xử lý)
            </div>
          </div>
        </div>

        {/* Realtime Chart Section: Golden Hours & Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Golden Hours Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#005c55] text-base">monitoring</span>
                  <span>Khung Giờ Cao Điểm "Golden Hours" & Tải Phục Vụ</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dữ liệu lượng đơn đặt (Nhu cầu) so với số lượng Đối tác trực chiến theo thời gian thực
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="flex items-center gap-1 text-teal-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005c55]" /> Nhu cầu (Đơn đặt)
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Năng lực thợ sẵn sàng
                </span>
              </div>
            </div>

            {/* Visual Bar chart of peak hours */}
            <div className="h-44 pt-4 border-b border-slate-100 flex items-end justify-between gap-1.5 sm:gap-3 px-2">
              {[
                { time: '08h', demand: 35, supply: 50, surge: false },
                { time: '10h', demand: 60, supply: 65, surge: false },
                { time: '12h', demand: 45, supply: 55, surge: false },
                { time: '14h', demand: 75, supply: 70, surge: false },
                { time: '16h', demand: 98, supply: 80, surge: true },
                { time: '17h', demand: 110, supply: 85, surge: true },
                { time: '18h', demand: 95, supply: 82, surge: true },
                { time: '20h', demand: 50, supply: 60, surge: false },
              ].map((item) => (
                <div key={item.time} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  {item.surge && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 rounded border border-amber-300">
                      Surge
                    </span>
                  )}
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div
                      style={{ height: `${(item.demand / 120) * 100}%` }}
                      className={`w-1/2 rounded-t-sm transition-all ${
                        item.surge ? 'bg-amber-500' : 'bg-[#005c55]'
                      }`}
                      title={`Nhu cầu: ${item.demand} đơn`}
                    />
                    <div
                      style={{ height: `${(item.supply / 120) * 100}%` }}
                      className="w-1/2 bg-slate-300 rounded-t-sm"
                      title={`Thợ sẵn sàng: ${item.supply} đối tác`}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{item.time}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Đang áp dụng hệ số phụ thu cao điểm: <b className="text-amber-600">1.15x (16:00 - 18:30)</b></span>
              <button
                onClick={() => onNavigate('admin-pricing')}
                className="text-[#005c55] font-bold hover:underline"
              >
                Chỉnh sửa công thức biểu giá →
              </button>
            </div>
          </div>

          {/* Service Distribution Pie / Meter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Cơ Cấu Dịch Vụ Hôm Nay</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Dọn dẹp căn hộ (65%)</span>
                  <span className="font-bold text-slate-900">83 đơn</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-[#005c55] h-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Nấu ăn gia đình (25%)</span>
                  <span className="font-bold text-slate-900">32 đơn</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[25%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Tổng vệ sinh chuyên sâu (10%)</span>
                  <span className="font-bold text-slate-900">13 đơn</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-teal-400 h-full w-[10%]" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800">Khu vực đặt đơn sôi động nhất:</div>
              <div className="text-slate-600">1. Masteri Thảo Điền (34 đơn)</div>
              <div className="text-slate-600">2. Vinhomes Central Park (28 đơn)</div>
              <div className="text-slate-600">3. Sun Avenue & Sala (21 đơn)</div>
            </div>
          </div>
        </div>

        {/* Live Queue Table & Order Inspector Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Table (8 columns if drawer open, 12 if closed) */}
          <div className={`${selectedOrder ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>
            {/* Table Header & Filters */}
            <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#005c55]">list_alt</span>
                  <h3 className="font-bold text-slate-900 text-base">Hàng Đợi Vận Hành Thời Gian Thực</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    {filteredOrders.length} đơn
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrders([...INITIAL_ORDERS])}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Làm mới dữ liệu"
                  >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'in_progress', label: 'Đang dọn dẹp' },
                  { id: 'dispute', label: 'Khiếu nại / Cảnh báo', alert: true },
                  { id: 'waiting_partner', label: 'Chờ gán thợ' },
                  { id: 'in_transit', label: 'Đang di chuyển' },
                  { id: 'completed', label: 'Đã hoàn thành' },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setFilterStatus(pill.id)}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                      filterStatus === pill.id
                        ? 'bg-[#005c55] text-white shadow-sm'
                        : pill.alert
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                    <th className="p-3 pl-4">Mã Đơn</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">Dịch vụ & Địa chỉ</th>
                    <th className="p-3">Đối tác</th>
                    <th className="p-3">Thời gian</th>
                    <th className="p-3">Số tiền</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3 text-right pr-4">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50/70 border-l-4 border-l-[#005c55]'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 pl-4 font-mono font-bold text-slate-900">{order.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                        </td>
                        <td className="p-3 max-w-[180px]">
                          <div className="font-medium text-slate-900 truncate">{order.service}</div>
                          <div className="text-[11px] text-slate-500 truncate">{order.address}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={order.partnerAvatar}
                              alt={order.partnerName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-300"
                            />
                            <div>
                              <div className="font-bold text-slate-800">{order.partnerName}</div>
                              <div className="text-[10px] text-amber-600 font-bold">{order.partnerRating} ★</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{order.timeSlot}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">
                            {order.amount.toLocaleString('vi-VN')} ₫
                          </div>
                          <div className="text-[10px] text-slate-500">{order.paymentMethod}</div>
                        </td>
                        <td className="p-3">{getStatusBadge(order.status, order.statusLabel)}</td>
                        <td className="p-3 text-right pr-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#005c55] hover:text-white text-slate-700 font-semibold transition-colors"
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Inspector Drawer (Side panel for deep inspection) */}
          {selectedOrder && (
            <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xl p-5 space-y-5 sticky top-24 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Bảng Kiểm Tra Đơn Hàng (Inspector)</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="font-extrabold text-slate-900 text-lg font-mono">{selectedOrder.id}</h3>
                    {getStatusBadge(selectedOrder.status, selectedOrder.statusLabel)}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Customer & Partner Quick Dossier */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 uppercase text-[10px] font-bold">Khách hàng</div>
                  <div className="font-bold text-slate-900 mt-1">{selectedOrder.customerName}</div>
                  <div className="text-slate-600 mt-0.5">{selectedOrder.customerPhone}</div>
                  <div className="text-slate-500 mt-1 truncate">{selectedOrder.address}</div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex gap-2">
                    <button
                      onClick={() => alert(`Đang kết nối cuộc gọi tới khách hàng: ${selectedOrder.customerPhone}`)}
                      className="text-[#005c55] font-bold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">call</span> Gọi khách
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 uppercase text-[10px] font-bold">Đối tác phụ trách</div>
                  <div className="flex items-center gap-2 mt-1">
                    <img
                      src={selectedOrder.partnerAvatar}
                      alt={selectedOrder.partnerName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{selectedOrder.partnerName}</div>
                      <div className="text-amber-600 font-semibold">{selectedOrder.partnerRating} ★ (320 ca)</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex gap-2">
                    <button
                      onClick={() => setShowReassignModal(true)}
                      className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">swap_horiz</span> Gán thợ khác
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Proof Photos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Ảnh Hiện Trường (Check-in Proof)</span>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    Đã định vị GPS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={IMAGES.kitchenBefore}
                      alt="Bếp trước khi dọn"
                      className="w-full h-24 object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Khu vực bếp (14:48)
                    </span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img
                      src={IMAGES.livingRoomBefore}
                      alt="Phòng khách"
                      className="w-full h-24 object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Phòng khách (14:50)
                    </span>
                  </div>
                </div>
              </div>

              {/* Audit Timeline */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Nhật Ký Sự Kiện Thời Gian Thực (Audit Log)</div>
                <div className="space-y-2 text-xs border-l-2 border-slate-200 pl-3 ml-1">
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[17px] top-1" />
                    <div className="font-bold text-slate-800">14:48 - Check-in GPS thành công</div>
                    <div className="text-slate-500 text-[11px]">Đối tác Hoàng Thị Mai xác nhận tới căn hộ T2-14.08</div>
                  </div>
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[17px] top-1" />
                    <div className="font-bold text-slate-800">14:43 - Hệ thống gán thợ tự động</div>
                    <div className="text-slate-500 text-[11px]">Hoàng Thị Mai chấp nhận đơn trong 12s</div>
                  </div>
                  <div className="relative">
                    <span className="w-2 h-2 rounded-full bg-slate-400 absolute -left-[17px] top-1" />
                    <div className="font-bold text-slate-800">14:42 - Khách hàng tạo đơn & thanh toán</div>
                    <div className="text-slate-500 text-[11px]">Thanh toán qua Ví MoMo: 288.000 ₫</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('customer-tracking')}
                  className="w-full bg-[#005c55] hover:bg-[#0f766e] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>Mở màn hình theo dõi của khách</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Đã gửi thông báo nhắc nhở đẩy nhanh tiến độ tới đối tác ${selectedOrder.partnerName}`)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    Nhắc nhở ca làm
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn đóng ca và hoàn tất đơn hàng này thủ công?')) {
                        alert('Đơn hàng đã được đánh dấu hoàn tất!');
                      }
                    }}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2 rounded-xl text-xs border border-emerald-200 transition-colors"
                  >
                    Duyệt hoàn thành
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reassign Partner Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">Điều Phối & Đổi Thợ Khẩn Cấp</h4>
              <button onClick={() => setShowReassignModal(false)} className="text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Chọn đối tác thay thế gần nhất cho đơn hàng <b className="text-slate-900">{selectedOrder?.id}</b> tại Masteri Thảo Điền:
            </p>
            <div className="space-y-2">
              {[
                { name: 'Đặng Thị Lan', rating: 4.95, dist: '0.8 km', jobs: 205, avatar: IMAGES.chiLanCleaner },
                { name: 'Phạm Thu Hà', rating: 4.98, dist: '1.2 km', jobs: 180, avatar: IMAGES.candidateHa },
                { name: 'Nguyễn Văn Hậu', rating: 4.9, dist: '1.5 km', jobs: 489, avatar: IMAGES.candidateHung },
              ].map((sub) => (
                <div
                  key={sub.name}
                  onClick={() => {
                    alert(`Đã gán thành công đơn ${selectedOrder?.id} cho ${sub.name}`);
                    setShowReassignModal(false);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#005c55] hover:bg-emerald-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={sub.avatar} alt={sub.name} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{sub.name}</div>
                      <div className="text-[11px] text-slate-500">Cách {sub.dist} • {sub.jobs} ca hoàn thành</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                    Gán ngay
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
