import React from 'react';
import { SKUItem, ChannelPerformance, RegionPerformance, ReportRecord } from '../types/dashboard';
import { formatVND, formatNumber, formatPercent } from '../utils/formatters';
import { TrendingUp, Layers, Store, MapPin, ArrowUpRight, FileCheck2, ArrowRight } from 'lucide-react';

interface OverviewTabProps {
  skus: SKUItem[];
  channels: ChannelPerformance[];
  regions: RegionPerformance[];
  reports: ReportRecord[];
  onNavigateTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  skus,
  channels,
  regions,
  reports,
  onNavigateTab,
}) => {
  // Aggregate stats
  const totalRevenue = channels.reduce((sum, ch) => sum + ch.revenue, 0);
  const totalTarget = channels.reduce((sum, ch) => sum + ch.targetRevenue, 0);
  const totalQuantity = skus.reduce((sum, sku) => sum + sku.totalQuantity, 0);
  const averageAttainment = (totalRevenue / totalTarget) * 100;

  // Top fast growing SKUs
  const topGrowthSKUs = [...skus].sort((a, b) => b.growthRateMoM - a.growthRateMoM).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Executive Briefing Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">THƯƠNG HIỆU WATERSILK</span>
              <span aria-hidden="true">·</span>
              <span>Kỳ đối soát: Tháng 10/2026</span>
              <span aria-hidden="true">·</span>
              <span>Tự động tổng hợp từ {reports.length} tệp báo cáo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
              Bảng Điều Hành Tiêu Thụ Toàn Quốc & Phân Tích Đa Kênh
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hệ thống hóa toàn bộ báo cáo doanh số từ kênh Đại lý (GT), Siêu thị hiện đại (MT), Kênh cơ quan/HORECA, và TMĐT.
              Tốc độ tăng trưởng toàn hệ thống đạt <span className="text-emerald-400 font-semibold">+12.3% MoM</span>, vượt tiến độ kế hoạch tháng.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('daily')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>Xem Báo Cáo Ngày Gốc (29/10)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('ingestion')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 rounded-lg transition-colors"
            >
              <span>Nạp thêm Báo cáo AI</span>
            </button>
          </div>
        </div>

        {/* Live Daily Report Notification Strip */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-slate-300">
              <strong>Số liệu ngày 29/10/2026:</strong> Doanh thu ngày đạt <strong className="text-emerald-400 font-mono">63,334 tỷ VNĐ</strong> · Xuất xưởng <strong className="text-cyan-300 font-mono">390,2 tấn</strong> cuộn lớn.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('daily')}
            className="text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap text-left sm:text-right"
          >
            Mở báo cáo ngày gốc ➔
          </button>
        </div>

        {/* Weekly & Inventory XNT Strip */}
        <div className="mt-2 pt-2 border-t border-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-300">
              <strong>Báo cáo Xuất Nhập Tồn NPP:</strong> Tồn cuối kỳ <strong className="text-slate-100 font-mono">25,91 tỷ VNĐ</strong> · Xuất bán đại lý <strong className="text-emerald-400 font-mono">7,72 tỷ VNĐ</strong> · Dự kiến nhập tuần cuối <strong className="text-amber-300 font-mono">6,79 tỷ VNĐ</strong>.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('weekly')}
            className="text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap text-left sm:text-right"
          >
            Mở bảng Xuất Nhập Tồn (10 ảnh) ➔
          </button>
        </div>
      </div>

      {/* KPI 4-Card Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Doanh thu MTD */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tổng Doanh Thu MTD</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tabular-nums">
              {formatVND(totalRevenue)}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-emerald-400 font-medium font-mono tabular-nums">+12.3% MoM</span>
            <span className="text-slate-400 font-mono tabular-nums">{averageAttainment.toFixed(1)}% Kế hoạch</span>
          </div>
        </div>

        {/* Card 2: Tổng sản lượng */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sản Lượng Bán Ra</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tabular-nums">
              {formatNumber(totalQuantity)} <span className="text-sm font-normal text-slate-400">thùng</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-emerald-400 font-medium font-mono tabular-nums">+14.7% YoY</span>
            <span className="text-slate-400">10 dòng sản phẩm chính</span>
          </div>
        </div>

        {/* Card 3: Kênh dẫn đầu */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Kênh Chủ Lực (GT)</span>
            <Store className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tabular-nums">
              {formatVND(channels[0]?.revenue || 0)}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-300 font-mono tabular-nums">
              {((channels[0]?.revenue / totalRevenue) * 100).toFixed(1)}% tỷ trọng
            </span>
            <span className="text-slate-400">48,250 điểm bán</span>
          </div>
        </div>

        {/* Card 4: Khu vực số 1 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Khu Vực Dẫn Đầu</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono tabular-nums">
              {formatVND(regions[0]?.revenue || 0)}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-300">Miền Bắc ({((regions[0]?.revenue / totalRevenue) * 100).toFixed(1)}%)</span>
            <span className="text-emerald-400 font-mono tabular-nums">+11.8%</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Channel Breakdown & Regional Dynamics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Channel Breakdown (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Cơ Cấu Doanh Số Theo Kênh Phân Phối
              </h2>
              <p className="text-xs text-slate-400">
                Đánh giá mức độ đóng góp và tỷ lệ đạt chỉ tiêu kế hoạch tháng
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('channels')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>Chi tiết kênh</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {channels.map((ch) => {
              const share = (ch.revenue / totalRevenue) * 100;
              return (
                <div key={ch.channel} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{ch.channelName}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono tabular-nums">{share.toFixed(1)}%</span>
                      <span className="font-bold text-slate-100 font-mono tabular-nums">{formatVND(ch.revenue)}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ch.channel === 'GT'
                          ? 'bg-cyan-500'
                          : ch.channel === 'MT'
                          ? 'bg-teal-400'
                          : ch.channel === 'HORECA'
                          ? 'bg-indigo-400'
                          : ch.channel === 'ECOMMERCE'
                          ? 'bg-amber-400'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${share}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[280px]">{ch.description}</span>
                    <span className={ch.attainmentRate >= 100 ? 'text-emerald-400 font-medium font-mono tabular-nums' : 'text-amber-400 font-medium font-mono tabular-nums'}>
                      {ch.attainmentRate.toFixed(1)}% KPI
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Regional Geography & Fast Growing Products (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Regional Summary Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">
                  Địa Bàn Tiêu Thụ Toàn Quốc
                </h2>
                <p className="text-xs text-slate-400">Phân bổ 3 miền địa lý chính</p>
              </div>
              <button
                onClick={() => onNavigateTab('regions')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
              >
                <span>Xem bản đồ</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {regions.map((reg) => {
                const regShare = (reg.revenue / totalRevenue) * 100;
                return (
                  <div key={reg.region} className="p-3 rounded-lg bg-slate-800/30 border border-slate-800/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{reg.regionName}</div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {reg.provinces.length} cụm tỉnh thành trọng điểm
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-100 font-mono tabular-nums">
                        {formatVND(reg.revenue)}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono tabular-nums">
                        {formatPercent(reg.growthMoM)} MoM ({regShare.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Facility & Supply Chain Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden relative group">
            <div className="relative h-36 w-full overflow-hidden">
              <img
                src="/src/assets/images/watersilk_logistics_1793343490998.jpg"
                alt="Nhà máy và hệ thống logistics Tissue Sông Đuống Watersilk"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[11px] font-semibold text-cyan-300">NĂNG LỰC SẢN XUẤT & ĐIỀU VẬN</span>
                <div className="text-sm font-bold text-slate-100">
                  Nhà Máy Giấy Tissue Sông Đuống & Trung Tâm Kho Vận
                </div>
              </div>
            </div>
            <div className="p-4 text-xs text-slate-400 space-y-2">
              <p>
                Dây chuyền sản xuất tự động công suất 45,000 tấn/năm. Đảm bảo chuỗi cung ứng liên tục cho 220 nhà phân phối cấp 1 và hơn 3,400 siêu thị toàn quốc.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span>Vòng quay tồn kho bình quân: <strong className="text-slate-200 font-mono">16.4 ngày</strong></span>
                <span className="text-emerald-400 font-medium">Sẵn sàng mùa cao điểm Tết</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Top Growth Products Matrix */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">
              Top Mặt Hàng Tăng Trưởng Bứt Phá (Real-time Growth)
            </h2>
            <p className="text-xs text-slate-400">
              Các sản phẩm Watersilk có tốc độ tăng trưởng doanh số theo tháng cao nhất
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>Tất cả 10 SKUs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Mã SKU & Sản Phẩm</th>
                <th className="py-2.5 px-3 font-medium">Phân Loại</th>
                <th className="py-2.5 px-3 font-medium text-right">Sản Lượng</th>
                <th className="py-2.5 px-3 font-medium text-right">Doanh Thu (VNĐ)</th>
                <th className="py-2.5 px-3 font-medium text-right">Tăng MoM</th>
                <th className="py-2.5 px-3 font-medium text-right">Tăng YoY</th>
                <th className="py-2.5 px-3 font-medium text-center">Kênh Chủ Lực</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {topGrowthSKUs.map((sku) => (
                <tr key={sku.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{sku.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{sku.skuCode} · {sku.spec}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{sku.categoryName}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                    {formatNumber(sku.totalQuantity)} {sku.unit.toLowerCase()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-100">
                    {formatVND(sku.revenue)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono tabular-nums font-semibold text-emerald-400">
                      {formatPercent(sku.growthRateMoM)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-500">
                    {formatPercent(sku.growthRateYoY)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[11px] text-cyan-300 font-medium">
                      {sku.channelBreakdown.GT > 40 ? 'GT (Đại lý)' : sku.channelBreakdown.MT > 40 ? 'MT (Siêu thị)' : 'HORECA'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
