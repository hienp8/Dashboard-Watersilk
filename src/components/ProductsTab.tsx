import React, { useState, useMemo } from 'react';
import { SKUItem, ProductCategory } from '../types/dashboard';
import { formatVND, formatFullVND, formatNumber, formatPercent } from '../utils/formatters';
import { Search, Filter, TrendingUp, PackageCheck, Layers, ArrowUpDown } from 'lucide-react';

interface ProductsTabProps {
  skus: SKUItem[];
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ skus }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'revenue' | 'growth' | 'quantity'>('revenue');

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: 'Tất cả mặt hàng' },
    { id: 'toilet_roll', label: 'Giấy vệ sinh cuộn' },
    { id: 'facial_box', label: 'Khăn hộp & rút lụa' },
    { id: 'napkin', label: 'Khăn ăn cao cấp' },
    { id: 'kitchen_towel', label: 'Giấy lau bếp' },
    { id: 'jumbo_roll', label: 'Giấy cuộn lớn Jumbo' },
    { id: 'pocket_tissue', label: 'Khăn giấy bỏ túi' },
  ];

  const filteredSKUs = useMemo(() => {
    return skus
      .filter((sku) => {
        const matchesCategory = selectedCategory === 'ALL' || sku.category === selectedCategory;
        const matchesQuery =
          sku.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sku.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sku.spec.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'growth') {
          return b.growthRateMoM - a.growthRateMoM;
        }
        if (sortBy === 'quantity') {
          return b.totalQuantity - a.totalQuantity;
        }
        return b.revenue - a.revenue;
      });
  }, [skus, selectedCategory, searchQuery, sortBy]);

  const totalFilteredRevenue = filteredSKUs.reduce((sum, s) => sum + s.revenue, 0);
  const totalFilteredQuantity = filteredSKUs.reduce((sum, s) => sum + s.totalQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Product Hero Spotlight */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden flex flex-col md:flex-row items-stretch">
        <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <span className="text-cyan-400 font-semibold uppercase tracking-wider">DANH MỤC SẢN PHẨM WATERSILK</span>
              <span aria-hidden="true">·</span>
              <span>100% Bột Giấy Nguyên Chất Virgin Pulp</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              Tổng Hợp & Đánh Giá Tăng Trưởng Chi Tiết Từng Mặt Hàng
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Theo dõi chi tiết số lượng bán ra, doanh thu, đơn giá, chỉ số tăng trưởng thời gian thực (MoM / YoY) và cơ cấu kênh phân phối của từng mã SKU giấy lụa Watersilk.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Số mặt hàng</span>
              <div className="text-lg font-bold text-slate-100 font-mono">{filteredSKUs.length} SKUs</div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Tổng sản lượng</span>
              <div className="text-lg font-bold text-cyan-400 font-mono tabular-nums">{formatNumber(totalFilteredQuantity)} thùng</div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Tổng doanh thu</span>
              <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">{formatVND(totalFilteredRevenue)}</div>
            </div>
          </div>
        </div>

        <div className="relative md:w-2/5 min-h-[180px] overflow-hidden">
          <img
            src="/src/assets/images/watersilk_product_hero_1793343489207.jpg"
            alt="Các dòng sản phẩm giấy lụa cao cấp Watersilk"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SKU (ví dụ: WS-T-10CP, Classic, Soft Pack...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sắp xếp:
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setSortBy('revenue')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                sortBy === 'revenue' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Doanh thu
            </button>
            <button
              onClick={() => setSortBy('growth')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                sortBy === 'growth' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tăng trưởng MoM
            </button>
            <button
              onClick={() => setSortBy('quantity')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                sortBy === 'quantity' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sản lượng thùng
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Detailed SKU Master Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                <th className="py-3 px-4 font-semibold">Mã & Tên Mặt Hàng Watersilk</th>
                <th className="py-3 px-4 font-semibold">Phân Loại & Quy Cách</th>
                <th className="py-3 px-4 font-semibold text-right">Đơn Giá</th>
                <th className="py-3 px-4 font-semibold text-right">Sản Lượng Bán</th>
                <th className="py-3 px-4 font-semibold text-right">Doanh Thu (VNĐ)</th>
                <th className="py-3 px-4 font-semibold text-right">Tăng MoM</th>
                <th className="py-3 px-4 font-semibold text-right">Tăng YoY</th>
                <th className="py-3 px-4 font-semibold text-center">Tồn Kho</th>
                <th className="py-3 px-4 font-semibold">Kênh Phân Bổ (GT / MT / HORECA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredSKUs.map((sku) => (
                <tr key={sku.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Name and Code */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100 text-[13px]">{sku.name}</div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{sku.skuCode}</div>
                  </td>

                  {/* Spec */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="text-slate-200 font-medium">{sku.categoryName}</div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5" title={sku.spec}>
                      {sku.spec} · {sku.packing}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                    {formatFullVND(sku.currentPrice)}
                  </td>

                  {/* Volume */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-100">
                    {formatNumber(sku.totalQuantity)} <span className="text-[10px] text-slate-400 font-normal">{sku.unit.toLowerCase()}</span>
                  </td>

                  {/* Revenue */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-cyan-300">
                    {formatVND(sku.revenue)}
                  </td>

                  {/* MoM Growth */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-mono tabular-nums font-bold inline-flex items-center gap-0.5 ${
                        sku.growthRateMoM >= 15
                          ? 'text-emerald-400'
                          : sku.growthRateMoM > 0
                          ? 'text-teal-300'
                          : 'text-rose-400'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {formatPercent(sku.growthRateMoM)}
                    </span>
                  </td>

                  {/* YoY Growth */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-emerald-500">
                    {formatPercent(sku.growthRateYoY)}
                  </td>

                  {/* Inventory days */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        sku.inventoryDays <= 12
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                      title={sku.inventoryDays <= 12 ? 'Cảnh báo tồn kho nhanh hết' : 'Tồn kho an toàn'}
                    >
                      {sku.inventoryDays} ngày
                    </span>
                  </td>

                  {/* Channel mini breakdown */}
                  <td className="py-3.5 px-4 min-w-[150px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>GT {sku.channelBreakdown.GT}%</span>
                        <span>MT {sku.channelBreakdown.MT}%</span>
                        <span>HORECA {sku.channelBreakdown.HORECA}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 flex overflow-hidden">
                        <div className="bg-cyan-500 h-full" style={{ width: `${sku.channelBreakdown.GT}%` }} title={`GT: ${sku.channelBreakdown.GT}%`} />
                        <div className="bg-teal-400 h-full" style={{ width: `${sku.channelBreakdown.MT}%` }} title={`MT: ${sku.channelBreakdown.MT}%`} />
                        <div className="bg-indigo-400 h-full" style={{ width: `${sku.channelBreakdown.HORECA}%` }} title={`HORECA: ${sku.channelBreakdown.HORECA}%`} />
                        <div className="bg-amber-400 h-full" style={{ width: `${sku.channelBreakdown.ECOMMERCE}%` }} title={`Online: ${sku.channelBreakdown.ECOMMERCE}%`} />
                      </div>
                    </div>
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
