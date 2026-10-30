import React, { useState } from 'react';
import { 
  WEEKLY_NATIONAL_SUMMARY, 
  NATIONAL_TOTAL, 
  INVENTORY_XNT_DATA, 
  TOTAL_INVENTORY_XNT,
  USER_ATTACHMENT_IMAGES 
} from '../data/weeklyReportData';
import { formatVND, formatNumber, formatPercent } from '../utils/formatters';
import { 
  FileSpreadsheet, 
  Package, 
  TrendingUp, 
  Boxes, 
  Search, 
  Image as ImageIcon, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers, 
  Calendar 
} from 'lucide-react';

export const WeeklyReportView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'xnt' | 'national' | 'regions'>('xnt');
  const [selectedXntRegion, setSelectedXntRegion] = useState<string>('ALL');
  const [xntSearch, setXntSearch] = useState<string>('');
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Sub-tabs list matching Excel structure
  const subTabs = [
    { id: 'xnt', label: 'Xuất Nhập Tồn & Dự Kiến NPP (3 ảnh cuối)', count: '5 vùng · 25.9B tồn' },
    { id: 'national', label: 'Thành Phẩm Toàn Quốc (5 tuần)', count: 'Tổng hợp T1 - T5' },
    { id: 'regions', label: 'Chi Tiết Từng Vùng (NPP & Siêu Thị)', count: 'Hà Nội, ĐBSH, MT...' },
  ];

  // Filter XNT data
  const filteredXntGroups = INVENTORY_XNT_DATA.filter((group) => {
    if (selectedXntRegion === 'ALL') return true;
    return group.regionCode === selectedXntRegion;
  });

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider font-mono">
              BÁO CÁO TUẦN & XUẤT NHẬP TỒN
            </span>
            <span aria-hidden="true">·</span>
            <span>Tháng 10/2026 (Từ ngày 01 đến 24/10)</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">10 bảng tính Excel đã số hóa</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
            Báo Cáo Tiêu Thụ Tuần & Xuất Nhập Tồn Nhà Phân Phối
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Hệ thống hóa toàn bộ báo cáo doanh số nhập 5 tuần và tình hình luân chuyển tồn kho (Tồn đầu kỳ, Nhập/Xuất 01-24, Tồn cuối kỳ, Dự kiến nhập) của các Nhà phân phối Watersilk toàn quốc.
          </p>
        </div>

        <button
          onClick={() => setGalleryOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm shrink-0"
        >
          <ImageIcon className="w-4 h-4" />
          <span>Xem 10 Ảnh Gốc File Excel</span>
        </button>
      </div>

      {/* 4 Inventory Health Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tồn Kho Cuối Kỳ Của NPP (ngày 24)</span>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
              {formatVND(TOTAL_INVENTORY_XNT.endingInventory)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Đầu kỳ: {formatVND(TOTAL_INVENTORY_XNT.beginningInventory)}</span>
            <span className="text-emerald-400 font-mono font-medium">Giảm 13.1%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Đại Lý Xuất Bán (ngày 01 - 24)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {formatVND(TOTAL_INVENTORY_XNT.periodOut)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Gấp 2.03x lượng nhập xưởng</span>
            <span className="text-slate-300">Giải phóng tồn tốt</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dự Kiến Nhập (ngày 26 - cuối tháng)</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-amber-300 font-mono tabular-nums">
              {formatVND(TOTAL_INVENTORY_XNT.expectedInLateMonth)}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Bù kho đón tháng 11</span>
            <span className="text-amber-400 font-mono font-semibold">+6.79 tỷ</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Chỉ Tiêu Hoàn Thành Dự Kiến</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-teal-300 font-mono tabular-nums">
              {TOTAL_INVENTORY_XNT.expectedTargetPercent.toFixed(1)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Chỉ tiêu: {formatVND(TOTAL_INVENTORY_XNT.monthlyTarget)}</span>
            <span className="text-slate-300 font-mono">10.58 tỷ dự kiến</span>
          </div>
        </div>
      </div>

      {/* Main Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-cyan-800/80 text-cyan-200' : 'bg-slate-800 text-slate-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: XUẤT NHẬP TỒN & DỰ KIẾN NPP (3 ảnh cuối từ Excel) */}
      {activeSubTab === 'xnt' && (
        <div className="space-y-5">
          {/* Filter and Search */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs text-slate-400 shrink-0">Khu vực:</span>
              <button
                onClick={() => setSelectedXntRegion('ALL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedXntRegion === 'ALL' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tất cả 5 vùng
              </button>
              {INVENTORY_XNT_DATA.map((g) => (
                <button
                  key={g.regionCode}
                  onClick={() => setSelectedXntRegion(g.regionCode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedXntRegion === g.regionCode ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {g.regionName.replace('Khu vực ', '')}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên Nhà Phân Phối / Tỉnh..."
                value={xntSearch}
                onChange={(e) => setXntSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Regional Groups Tables */}
          {filteredXntGroups.map((group) => {
            const filteredDistributors = group.distributors.filter(
              (d) =>
                d.distributorName.toLowerCase().includes(xntSearch.toLowerCase()) ||
                d.subRegion.toLowerCase().includes(xntSearch.toLowerCase())
            );

            if (filteredDistributors.length === 0 && xntSearch) return null;

            return (
              <div key={group.regionCode} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-2">
                {/* Region Title Strip */}
                <div className="p-4 bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                      {group.regionName}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({filteredDistributors.length} NPP)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">
                      Tồn CK: <strong className="text-slate-200 font-mono">{formatVND(group.endingInventory)}</strong>
                    </span>
                    <span className="text-slate-400">
                      Dự kiến nhập: <strong className="text-amber-300 font-mono">{formatVND(group.expectedInLateMonth)}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-mono font-bold">
                      {group.expectedTargetPercent.toFixed(1)}% KH
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400">
                        <th className="py-2.5 px-3 font-semibold text-center w-10">Stt</th>
                        <th className="py-2.5 px-3 font-semibold">Tên Nhà PP</th>
                        <th className="py-2.5 px-3 font-semibold">Khu Vực</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Chỉ Tiêu Tháng</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Tồn Đầu Kỳ</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Nhập Kỳ (01-24)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Xuất Kỳ (01-24)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Tồn Cuối Kỳ (24)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Dự Kiến Nhập (26-31)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">% Đạt Dự Kiến</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredDistributors.map((d) => (
                        <tr key={d.stt} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                            {d.stt}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-100">
                            {d.distributorName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {d.subRegion}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                            {d.monthlyTarget > 0 ? formatNumber(d.monthlyTarget) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                            {d.beginningInventory > 0 ? formatNumber(d.beginningInventory) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-cyan-300">
                            {d.periodIn > 0 ? formatNumber(d.periodIn) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                            {d.periodOut > 0 ? formatNumber(d.periodOut) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-100">
                            {d.endingInventory > 0 ? formatNumber(d.endingInventory) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-300">
                            {d.expectedInLateMonth > 0 ? formatNumber(d.expectedInLateMonth) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                            {d.expectedTargetPercent > 0 ? (
                              <span className={d.expectedTargetPercent >= 100 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                                {d.expectedTargetPercent.toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Group Summary Row */}
                      <tr className="bg-slate-800/40 font-bold border-t-2 border-slate-700">
                        <td colSpan={3} className="py-3 px-3 text-slate-200">
                          Tổng cộng {group.regionName}:
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                          {formatNumber(group.monthlyTarget)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                          {formatNumber(group.beginningInventory)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-cyan-300 font-extrabold">
                          {formatNumber(group.periodIn)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400 font-extrabold">
                          {formatNumber(group.periodOut)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-100 font-extrabold">
                          {formatNumber(group.endingInventory)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-300 font-extrabold">
                          {formatNumber(group.expectedInLateMonth)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-cyan-400">
                          {group.expectedTargetPercent.toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* National Grand Total Row Banner */}
          <div className="p-5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-slate-900 to-slate-800 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <span className="text-sm font-extrabold text-slate-100 uppercase tracking-wide">
                TỔNG CỘNG TOÀN QUỐC (XUẤT NHẬP TỒN 5 VÙNG)
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Tỷ lệ dự kiến đạt kế hoạch: {TOTAL_INVENTORY_XNT.expectedTargetPercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Chỉ tiêu tháng:</span>
                <div className="font-bold text-slate-200 font-mono mt-0.5">{formatVND(TOTAL_INVENTORY_XNT.monthlyTarget)}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Tồn đầu kỳ (01/10):</span>
                <div className="font-bold text-slate-300 font-mono mt-0.5">{formatVND(TOTAL_INVENTORY_XNT.beginningInventory)}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Nhập trong kỳ (01-24):</span>
                <div className="font-bold text-cyan-300 font-mono mt-0.5">{formatVND(TOTAL_INVENTORY_XNT.periodIn)}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Đại lý xuất bán (01-24):</span>
                <div className="font-bold text-emerald-400 font-mono mt-0.5">{formatVND(TOTAL_INVENTORY_XNT.periodOut)}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Tồn cuối kỳ (24/10):</span>
                <div className="font-bold text-slate-100 font-mono mt-0.5">{formatVND(TOTAL_INVENTORY_XNT.endingInventory)}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Dự kiến nhập (26-31):</span>
                <div className="font-bold text-amber-300 font-mono mt-0.5">{formatVND(TOTAL_INVENTORY_XNT.expectedInLateMonth)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THÀNH PHẨM TOÀN QUỐC (Image 1 từ Excel) */}
      {activeSubTab === 'national' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Báo Cáo Tiêu Thụ Thành Phẩm Toàn Quốc Tháng 10/2026 (Theo Tuần)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Khu vực: Thành Phẩm Toàn Quốc · Đơn vị tính: Đồng
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-slate-800 px-3 py-1 rounded-lg">
              Tổng thực hiện MTD: {formatVND(NATIONAL_TOTAL.totalActual)} ({NATIONAL_TOTAL.attainmentPercent}% KH)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold text-center w-10">Stt</th>
                  <th className="py-2.5 px-3 font-semibold">Tên Trưởng Vùng</th>
                  <th className="py-2.5 px-3 font-semibold">Khu Vực</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Doanh Số Chỉ Tiêu</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Doanh Số Dự Kiến</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tuần 1</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tuần 2</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tuần 3</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tuần 4</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Tổng Cộng</th>
                  <th className="py-2.5 px-3 font-semibold text-right">% Đạt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {WEEKLY_NATIONAL_SUMMARY.map((row) => (
                  <tr key={row.stt} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-slate-500">{row.stt}</td>
                    <td className="py-3 px-3 font-semibold text-slate-100">{row.leaderName}</td>
                    <td className="py-3 px-3 text-cyan-300 font-medium">{row.region}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{formatNumber(row.monthlyTarget)}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400">{formatNumber(row.expectedRevenue)}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{row.week1 > 0 ? formatNumber(row.week1) : '-'}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{row.week2 > 0 ? formatNumber(row.week2) : '-'}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{row.week3 > 0 ? formatNumber(row.week3) : '-'}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{row.week4 > 0 ? formatNumber(row.week4) : '-'}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-cyan-300">{formatNumber(row.totalActual)}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-emerald-400">{row.attainmentPercent.toFixed(1)}%</td>
                  </tr>
                ))}

                {/* Grand Total Row */}
                <tr className="bg-slate-800/50 font-bold border-t-2 border-slate-700">
                  <td colSpan={3} className="py-3 px-3 text-slate-100">
                    Tổng cộng Thành phẩm:
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-100">{formatNumber(NATIONAL_TOTAL.monthlyTarget)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{formatNumber(NATIONAL_TOTAL.expectedRevenue)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{formatNumber(NATIONAL_TOTAL.week1)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{formatNumber(NATIONAL_TOTAL.week2)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{formatNumber(NATIONAL_TOTAL.week3)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">{formatNumber(NATIONAL_TOTAL.week4)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-base text-cyan-300 font-extrabold">{formatNumber(NATIONAL_TOTAL.totalActual)}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400">{NATIONAL_TOTAL.attainmentPercent.toFixed(1)}%</td>
                </tr>

                {/* Jumbo Roll (Cuộn lớn) Row */}
                <tr className="bg-slate-900 font-bold border-t border-slate-700">
                  <td className="py-3 px-3 text-center font-mono text-slate-500">7</td>
                  <td className="py-3 px-3 text-slate-100">Mai Thế Quang</td>
                  <td className="py-3 px-3 text-amber-400 font-medium">Tissue Cuộn Lớn (ĐVT: Tấn)</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">500 tấn</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400">400 tấn</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">26.8 T</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">81.4 T</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">104.6 T</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">78.5 T</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-base text-amber-300 font-extrabold">291.3 tấn</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400 font-bold">58.3%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHI TIẾT TỪNG VÙNG */}
      {activeSubTab === 'regions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Khu vực Hà Nội (11 Nhà Phân Phối)</h3>
            <p className="text-xs text-slate-400">
              Trưởng vùng: <strong>Thạch Nghĩa Hiếu</strong> · Chỉ tiêu: <strong>4.14 tỷ</strong> · Thực hiện: <strong>1.29 tỷ (31.2%)</strong>
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>• <strong>Hưng Thịnh Phát</strong> (Gia Lâm): 736.8 triệu VNĐ (105.3% kế hoạch tháng)</div>
              <div>• <strong>Việt Phát</strong> (Từ Liêm): 242.0 triệu VNĐ (53.8%)</div>
              <div>• <strong>BHTT Long Biên</strong>: 210.2 triệu VNĐ (105.1%)</div>
              <div>• <strong>Phan Nhân & Huy Hoàng</strong>: gom đơn tập trung tuần 4</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Khu vực ĐB Sông Hồng (14 Nhà Phân Phối)</h3>
            <p className="text-xs text-slate-400">
              Trưởng vùng: <strong>Hoàng Văn Lân</strong> · Chỉ tiêu: <strong>3.58 tỷ</strong> · Thực hiện: <strong>520 triệu (14.5%)</strong>
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>• <strong>Minh Hoà</strong> (Nam Định): 276.3 triệu VNĐ (110.5% kế hoạch)</div>
              <div>• <strong>Phương Liên</strong> (Thái Bình): 115.7 triệu VNĐ (57.8%)</div>
              <div>• <strong>Hoàng Phúc</strong> (Hà Nam): 69.0 triệu VNĐ (17.2%)</div>
              <div>• <strong>Phương Hướng</strong> (Hải Phòng): dự kiến nhập lớn 935 triệu cuối tháng</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Khu vực Miền Núi (14 Nhà Phân Phối)</h3>
            <p className="text-xs text-slate-400">
              Trưởng vùng: <strong>Lê Hải</strong> · Chỉ tiêu: <strong>2.31 tỷ</strong> · Thực hiện: <strong>960.6 triệu (41.6%)</strong>
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>• <strong>Kiên Tư</strong> (Bắc Ninh): 286.6 triệu VNĐ (73.5%)</div>
              <div>• <strong>An Bình Đăng</strong> (Việt Trì): 255.2 triệu VNĐ (76.2%)</div>
              <div>• <strong>Sông Hương</strong> (Vĩnh Phúc): 195.1 triệu VNĐ (46.4%)</div>
              <div>• <strong>Bùi Thị Thuỷ</strong> (Bắc Giang): 193.9 triệu VNĐ (114.0%)</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-100">Kênh Siêu Thị Hiện Đại (MT)</h3>
            <p className="text-xs text-slate-400">
              Trưởng kênh: <strong>Nguyễn Trí Sơn</strong> · Chỉ tiêu: <strong>1.26 tỷ</strong> · Thực hiện: <strong>257.7 triệu (20.4%)</strong>
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <div>• <strong>Siêu thị Fuji, Lan Chi, Co.op Miền Bắc</strong>: 106.3 triệu VNĐ (40.9%)</div>
              <div>• <strong>MM Mega Market</strong>: 101.0 triệu VNĐ (59.4%)</div>
              <div>• <strong>Hệ thống WinMart, WinMart+, Aeon Mall</strong>: 37.4 triệu VNĐ</div>
              <div>• Khách sạn Hòa Bình, KS Mường Thanh tiêu thụ ổn định</div>
            </div>
          </div>
        </div>
      )}

      {/* 10 User Images Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-6 space-y-4 max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">
                  {USER_ATTACHMENT_IMAGES[activeImageIndex].title}
                </h3>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                ✕ Đóng cửa sổ
              </button>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {USER_ATTACHMENT_IMAGES.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                    activeImageIndex === i
                      ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {img.id}. {img.title.split('(')[0]}
                </button>
              ))}
            </div>

            {/* Big Image Viewer */}
            <div className="flex-1 overflow-auto rounded-xl bg-black/60 p-2 flex flex-col items-center justify-center border border-slate-800">
              <img
                src={USER_ATTACHMENT_IMAGES[activeImageIndex].path}
                alt={USER_ATTACHMENT_IMAGES[activeImageIndex].title}
                className="max-h-[60vh] w-auto object-contain rounded"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs text-slate-400 mt-2 text-center">
                {USER_ATTACHMENT_IMAGES[activeImageIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
