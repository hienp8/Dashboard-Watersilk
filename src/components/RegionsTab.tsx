import React, { useState } from 'react';
import { RegionPerformance } from '../types/dashboard';
import { formatVND, formatPercent } from '../utils/formatters';
import { MapPin, Building, Users, TrendingUp } from 'lucide-react';

interface RegionsTabProps {
  regions: RegionPerformance[];
}

export const RegionsTab: React.FC<RegionsTabProps> = ({ regions }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('NORTH');

  const totalNationalRevenue = regions.reduce((sum, r) => sum + r.revenue, 0);

  const activeRegionData = regions.find((r) => r.region === selectedRegion) || regions[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Regional Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h1 className="text-lg font-bold text-slate-100">
            Doanh Số Theo Khu Vực Địa Lý & Địa Bàn Tỉnh Thành
          </h1>
          <p className="text-xs text-slate-400">
            Giám sát mức độ phủ thị trường, mạng lưới nhà phân phối và doanh thu theo 3 miền
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg">
          {regions.map((reg) => {
            const isSelected = selectedRegion === reg.region;
            return (
              <button
                key={reg.region}
                onClick={() => setSelectedRegion(reg.region)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {reg.regionName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Regional Macro Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {regions.map((reg) => {
          const share = (reg.revenue / totalNationalRevenue) * 100;
          const isSelected = selectedRegion === reg.region;
          return (
            <div
              key={reg.region}
              onClick={() => setSelectedRegion(reg.region)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-cyan-500 bg-slate-900/90 shadow-md ring-1 ring-cyan-500/20'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{reg.regionName}</span>
                <span className="text-emerald-400 font-mono tabular-nums">{formatPercent(reg.growthMoM)} MoM</span>
              </div>
              <div className="my-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-100 font-mono tabular-nums">
                  {formatVND(reg.revenue)}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                <span>Tỷ trọng toàn quốc: <strong className="text-slate-200 font-mono">{share.toFixed(1)}%</strong></span>
                <span className="text-cyan-400 font-medium">Chi tiết ➔</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region Deep Dive */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">
                Phân Bổ Tỉnh Thành Thuộc {activeRegionData.regionName}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tổng doanh thu vùng: <strong className="text-slate-200 font-mono">{formatVND(activeRegionData.revenue)}</strong> · Đạt {((activeRegionData.revenue / activeRegionData.targetRevenue) * 100).toFixed(1)}% kế hoạch
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Tổng số nhà phân phối cấp 1:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono font-bold text-slate-200">
              {activeRegionData.provinces.reduce((sum, p) => sum + p.distributorCount, 0)} NPP
            </span>
          </div>
        </div>

        {/* Detailed Province Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Tỉnh / Cụm Địa Bàn Trọng Điểm</th>
                <th className="py-2.5 px-3 font-medium text-right">Số Lượng NPP</th>
                <th className="py-2.5 px-3 font-medium text-right">Doanh Thu Thực Tế (VNĐ)</th>
                <th className="py-2.5 px-3 font-medium text-right">Tỷ Trọng Trong Vùng</th>
                <th className="py-2.5 px-3 font-medium">Thanh Tỷ Trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {activeRegionData.provinces.map((prov) => (
                <tr key={prov.name} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{prov.name}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                    {prov.distributorCount} NPP
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-100">
                    {formatVND(prov.revenue)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-cyan-400">
                    {prov.sharePercent.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 min-w-[160px]">
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: `${prov.sharePercent}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Region specific operational notes */}
        <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800/70 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Đặc thù thị trường {activeRegionData.regionName}:</span>
          </div>
          {activeRegionData.region === 'NORTH' && (
            <p>
              Hà Nội và Hải Phòng chiếm hơn 72% thị phần miền Bắc. Dòng sản phẩm Watersilk Soft & Pure 10 cuộn và Classic không lõi chiếm ưu thế tuyệt đối ở các chợ đầu mối và siêu thị bán lẻ. Dòng khăn hộp rút để bàn bán chạy mạnh vào mùa thu đông.
            </p>
          )}
          {activeRegionData.region === 'SOUTH' && (
            <p>
              TP.HCM và Bình Dương có tốc độ tăng trưởng nhanh nhất (+18.6% MoM). Người tiêu dùng trẻ chuộng khăn rút tiện lợi Soft Pack và khăn giấy lau bếp dập nổi tổ ong. Cần tăng cường độ phủ tại chuỗi Bách Hóa Xanh và GS25.
            </p>
          )}
          {activeRegionData.region === 'CENTRAL' && (
            <p>
              Đà Nẵng và Khánh Hòa là 2 mũi nhọn tiêu thụ chính nhờ ngành du lịch, khách sạn nghỉ dưỡng HORECA phục vụ khách quốc tế. Dòng cuộn lớn Jumbo JRT và khăn ăn tiệc 240 tờ là 2 mặt hàng tạo doanh số chủ đạo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
