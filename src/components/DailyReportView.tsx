import React, { useState } from 'react';
import { SONG_DUONG_DAILY_REPORT, SONG_DUONG_CUSTOMER_CONSUMPTION } from '../data/watersilkData';
import { formatNumber } from '../utils/formatters';
import { Building2, Calendar, FileText, Image as ImageIcon, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const DailyReportView: React.FC = () => {
  const [showOriginalImages, setShowOriginalImages] = useState<boolean>(false);
  const [filterActiveOnly, setFilterActiveOnly] = useState<boolean>(false);

  const report = SONG_DUONG_DAILY_REPORT;
  const customers = SONG_DUONG_CUSTOMER_CONSUMPTION;

  const filteredCustomers = filterActiveOnly
    ? customers.filter((c) => c.activeDelivery)
    : customers;

  const totalDelivered = customers.reduce((sum, c) => sum + c.actual, 0);
  const totalPlanned = customers.reduce((sum, c) => sum + c.plan, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider font-mono">
              BẢN GỐC TISSUE SÔNG ĐUỐNG
            </span>
            <span aria-hidden="true">·</span>
            <span>Ngày báo cáo: 29/10/2026</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-medium">Đã số hóa tự động từ 2 ảnh báo cáo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
            Báo Cáo Tiêu Thụ Hàng Ngày & Phân Bổ Khách Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Hệ thống hóa nguyên bản bảng số liệu tiêu thụ ngày của Công ty Giấy Tissue Sông Đuống (Watersilk).
            Tổng doanh thu ngày đạt <strong className="text-slate-100 font-mono">63,334 tỷ VNĐ</strong>, sản lượng cuộn lớn xuất xưởng <strong className="text-slate-100 font-mono">390,2 tấn</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowOriginalImages(!showOriginalImages)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
            showOriginalImages
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{showOriginalImages ? 'Ẩn ảnh gốc' : 'Xem 2 ảnh gốc đã gửi'}</span>
        </button>
      </div>

      {/* Original Image Viewers (if toggled) */}
      {showOriginalImages && (
        <div className="p-5 rounded-xl border border-cyan-500/30 bg-slate-900/95 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
              <ImageIcon className="w-4 h-4" />
              <span>Hai hình ảnh báo cáo thực tế đính kèm của Công ty Giấy Tissue Sông Đuống:</span>
            </div>
            <span className="text-[11px] text-slate-400">Ngày chụp: 29/10/2026</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Image 1 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Ảnh 1: Bảng tổng hợp tiêu thụ & doanh thu (63,334 Tỷ)
              </span>
              <div className="rounded overflow-hidden bg-white/5 flex items-center justify-center">
                <img
                  src="/public/assets/aistudio/image_3119d888.png"
                  alt="Báo cáo tiêu thụ ngày 29/10/2026 - Công ty Giấy Tissue Sông Đuống"
                  className="w-full h-auto max-h-[340px] object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Image 2 */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-2 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">
                Ảnh 2: Bảng chi tiết tiêu thụ theo 18 khách hàng (390,1 Tấn)
              </span>
              <div className="rounded overflow-hidden bg-white/5 flex items-center justify-center">
                <img
                  src="/public/assets/aistudio/image_3ac814d8.png"
                  alt="Bảng chi tiết tiêu thụ theo khách hàng ngày 29/10/2026"
                  className="w-full h-auto max-h-[340px] object-contain rounded"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE 1: Bảng Tổng Hợp Tiêu Thụ Ngày (Ảnh 1 chuẩn hóa) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        {/* Company Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                {report.companyName}
              </h2>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 space-x-2">
              <span>Địa chỉ: {report.address}</span>
              <span aria-hidden="true">·</span>
              <span>Website: {report.website}</span>
              <span aria-hidden="true">·</span>
              <span>Email: {report.email}</span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-mono">
            <span className="text-slate-400">Thời điểm: </span>
            <strong className="text-cyan-300 font-bold">{report.reportDate}</strong>
          </div>
        </div>

        {/* Product Consumption Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                <th className="py-3 px-4 font-semibold">Sản Phẩm</th>
                <th className="py-3 px-4 font-semibold text-center">ĐVT</th>
                <th className="py-3 px-4 font-semibold text-right">Kế Hoạch Ngày</th>
                <th className="py-3 px-4 font-semibold text-right">Thực Hiện Ngày</th>
                <th className="py-3 px-4 font-semibold text-right">% Đạt Kế Hoạch</th>
                <th className="py-3 px-4 font-semibold text-right">Lũy Kế 9 Tháng</th>
                <th className="py-3 px-4 font-semibold">Thanh Hoàn Thành</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {report.categories.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-100 text-[13px]">
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                    {cat.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                    {formatNumber(cat.plan)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-cyan-300 text-sm">
                    {formatNumber(cat.actual)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-emerald-400">
                    {cat.attainmentRate.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    {formatNumber(cat.accumulated9Months)} {cat.unit}
                  </td>
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${Math.min(cat.attainmentRate, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Revenue Row */}
              <tr className="bg-slate-800/40 font-bold border-t-2 border-slate-700">
                <td className="py-4 px-4 text-slate-100 text-[13px]">
                  Tổng doanh thu (cả vật tư)
                </td>
                <td className="py-4 px-4 text-center font-mono text-cyan-400">
                  Tỷ VNĐ
                </td>
                <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-200">
                  {report.totalRevenueBillions.plan.toFixed(3)}
                </td>
                <td className="py-4 px-4 text-right font-mono tabular-nums text-base text-emerald-400 font-extrabold">
                  {report.totalRevenueBillions.actual.toFixed(3)} Tỷ
                </td>
                <td className="py-4 px-4 text-right font-mono tabular-nums text-emerald-400">
                  {report.totalRevenueBillions.attainmentRate.toFixed(2)}%
                </td>
                <td className="py-4 px-4 text-right font-mono tabular-nums text-slate-100">
                  {report.totalRevenueBillions.accumulated9Months} Tỷ
                </td>
                <td className="py-4 px-4">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${Math.min(report.totalRevenueBillions.attainmentRate, 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 2: Bảng Chi Tiết Theo Khách Hàng / Đối Tác (Ảnh 2 chuẩn hóa) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[11px] font-semibold text-cyan-300 uppercase">
                Mặt hàng: Giấy Cuộn Lớn (Jumbo Roll)
              </span>
              <span className="text-xs text-slate-400">Kênh B2B Khách Hàng Công Nghiệp & Gia Công</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              Chi Tiết Sản Lượng Tiêu Thụ Theo 18 Khách Hàng Giấy Cuộn Lớn (Jumbo Roll)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tổng sản lượng xuất xưởng ngày 29/10: <strong className="text-cyan-300 font-mono font-bold">{totalDelivered.toFixed(1)} tấn</strong> / Kế hoạch {totalPlanned} tấn ({((totalDelivered / totalPlanned) * 100).toFixed(1)}%)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterActiveOnly(!filterActiveOnly)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filterActiveOnly
                  ? 'bg-cyan-600 text-white border-cyan-500 font-semibold'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {filterActiveOnly ? 'Hiển thị tất cả 18 đối tác' : 'Chỉ lọc đối tác có phát sinh giao (9/18)'}
            </button>
          </div>
        </div>

        {/* Informative Callout for Jumbo Roll Customers */}
        <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-slate-300 flex items-start gap-2.5">
          <span className="text-cyan-400 font-bold shrink-0 mt-0.5">ℹ️ Ghi chú nghiệp vụ:</span>
          <p className="text-slate-300 leading-relaxed">
            Đây là danh sách các <strong>Khách hàng Giấy cuộn lớn (Jumbo Roll)</strong> thuộc phân khúc khách hàng công nghiệp B2B (Industrial Converters). Nhà máy Tissue Sông Đuống cung cấp cuộn phôi giấy tissue kích thước lớn theo tấn cho các nhà máy sản xuất giấy thành phẩm (Tiến Bảo, Hưng Thịnh Phát, Minh Thành, Đông Á...), các doanh nghiệp in ấn bao bì & dịch vụ hàng không (Cty In Hàng Không, Cty Nội Bài, Nhựa Hàng Không...), và các đơn vị gia công khăn ướt, tã lót (H Care).
          </p>
        </div>

        {/* Customer Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                <th className="py-2.5 px-3 font-semibold text-center w-10">STT</th>
                <th className="py-2.5 px-3 font-semibold">Khách Hàng Giấy Cuộn Lớn (Jumbo Roll)</th>
                <th className="py-2.5 px-3 font-semibold">Lĩnh Vực / Ngành Hàng Hoạt Động</th>
                <th className="py-2.5 px-3 font-semibold text-right">Kế Hoạch (Tấn)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Dự Kiến (Tấn)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Thực Hiện Ngày (Tấn)</th>
                <th className="py-2.5 px-3 font-semibold text-right">% Đạt KH</th>
                <th className="py-2.5 px-3 font-semibold text-right">Chênh Lệch (+/-)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Trạng Thái Giao Hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCustomers.map((c) => {
                const isOverPlan = c.actual >= c.plan && c.plan > 0;
                return (
                  <tr
                    key={c.stt}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      c.activeDelivery ? 'bg-slate-900/30' : 'opacity-60'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                      {c.stt}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-100">{c.customerName}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">Tissue cuộn lớn (JRT)</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {c.industrySector || 'Gia công giấy Tissue'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      {c.plan > 0 ? c.plan.toFixed(1) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                      {c.expected > 0 ? c.expected.toFixed(1) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-cyan-300 text-[13px]">
                      {c.actual > 0 ? c.actual.toFixed(1) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {c.plan > 0 ? (
                        <span
                          className={`font-mono tabular-nums font-semibold ${
                            isOverPlan ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {c.attainmentPercent}%
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-300">
                      {c.variance !== 0 ? (
                        <span className={c.variance > 0 ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
                          {c.variance > 0 ? `+${c.variance.toFixed(1)}` : c.variance.toFixed(1)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {c.activeDelivery ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Xuất xưởng
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">Không có chuyến</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* Total Row */}
              <tr className="bg-slate-800/60 font-bold border-t-2 border-slate-700">
                <td colSpan={3} className="py-3 px-3 text-slate-100 text-right">
                  Tổng cộng Giấy cuộn lớn (Jumbo Roll):
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                  398.0
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                  467.0
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums font-extrabold text-cyan-300 text-sm">
                  390.1 tấn
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-400">
                  98.0%
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-cyan-400">
                  +76.9
                </td>
                <td className="py-3 px-3 text-center text-xs text-slate-400">
                  9 đối tác nhận
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
