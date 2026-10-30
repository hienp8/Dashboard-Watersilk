import React, { useState } from 'react';
import { ChannelPerformance, SKUItem } from '../types/dashboard';
import { formatVND, formatNumber, formatPercent } from '../utils/formatters';
import { Store, ShoppingCart, Hotel, Globe2, Truck, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface ChannelsTabProps {
  channels: ChannelPerformance[];
  skus: SKUItem[];
}

export const ChannelsTab: React.FC<ChannelsTabProps> = ({ channels, skus }) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');

  const totalRevenue = channels.reduce((sum, ch) => sum + ch.revenue, 0);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'GT':
        return <Store className="w-5 h-5 text-cyan-400" />;
      case 'MT':
        return <ShoppingCart className="w-5 h-5 text-teal-400" />;
      case 'HORECA':
        return <Hotel className="w-5 h-5 text-indigo-400" />;
      case 'ECOMMERCE':
        return <Globe2 className="w-5 h-5 text-amber-400" />;
      case 'EXPORT':
        return <Truck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Store className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredChannels = selectedChannel === 'ALL'
    ? channels
    : channels.filter((c) => c.channel === selectedChannel);

  return (
    <div className="space-y-6">
      {/* Tab Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-800 bg-slate-900/60">
        <div>
          <h1 className="text-lg font-bold text-slate-100">
            Phân Tích Doanh Số Theo Kênh Phân Phối Watersilk
          </h1>
          <p className="text-xs text-slate-400">
            Chi tiết 5 kênh phân phối: Truyền thống (GT), Hiện đại (MT), Thể chế HORECA, Online và Xuất khẩu
          </p>
        </div>

        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedChannel('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedChannel === 'ALL'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất cả kênh
          </button>
          {channels.map((ch) => (
            <button
              key={ch.channel}
              onClick={() => setSelectedChannel(ch.channel)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedChannel === ch.channel
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch.channel}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChannels.map((ch) => {
          const share = (ch.revenue / totalRevenue) * 100;
          const isOverTarget = ch.attainmentRate >= 100;

          // Find top SKUs for this channel
          const channelSkus = skus
            .map((sku) => {
              const channelShare = (sku.channelBreakdown as any)[ch.channel] || 0;
              const channelRev = (sku.revenue * channelShare) / 100;
              return { ...sku, channelRev, channelShare };
            })
            .sort((a, b) => b.channelRev - a.channelRev)
            .slice(0, 3);

          return (
            <div
              key={ch.channel}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60">
                      {getChannelIcon(ch.channel)}
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-100">{ch.channelName}</h2>
                      <span className="text-[11px] text-slate-400">
                        {formatNumber(ch.outletCount)} điểm bán / đại lý
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-mono tabular-nums font-semibold px-2 py-0.5 rounded ${
                      isOverTarget ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/40' : 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
                    }`}
                  >
                    {isOverTarget ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {ch.attainmentRate.toFixed(1)}% KPI
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {ch.description}
                </p>

                {/* Revenue stats */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-800/40 border border-slate-800/60">
                  <div>
                    <span className="text-[11px] text-slate-400">Doanh số thực tế</span>
                    <div className="text-base font-bold text-slate-100 font-mono tabular-nums">
                      {formatVND(ch.revenue)}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Chỉ tiêu Target</span>
                    <div className="text-base font-semibold text-slate-400 font-mono tabular-nums">
                      {formatVND(ch.targetRevenue)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Tỷ trọng toàn quốc: <strong className="text-slate-200 font-mono">{share.toFixed(1)}%</strong></span>
                    <span className="text-emerald-400 font-mono tabular-nums">{formatPercent(ch.growthMoM)} MoM</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${Math.min(share * 2.2, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Top Products in this channel */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Top 3 Mặt hàng bán chạy nhất
                </span>
                <div className="space-y-1.5">
                  {channelSkus.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[180px]">
                        {idx + 1}. {item.name}
                      </span>
                      <span className="text-slate-400 font-mono tabular-nums">
                        {formatVND(item.channelRev)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Channel Insights */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200">
            Đánh Giá Chiến Lược Kênh Phân Phối Watersilk Quý 4/2026
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-lg bg-slate-800/30 border border-slate-800/50 space-y-1.5">
            <span className="font-semibold text-cyan-400">1. Kênh Truyền thống (GT - Trụ cột)</span>
            <p className="text-slate-400 leading-relaxed">
              Chiếm 40.8% doanh số. Sản phẩm chủ lực là dòng Classic không lõi và Soft & Pure 10 cuộn. Cần kiểm soát chặt công nợ đại lý cấp 1 và chuẩn bị chính sách thưởng sản lượng vụ Tết (Target Tết +25%).
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-800/30 border border-slate-800/50 space-y-1.5">
            <span className="font-semibold text-teal-400">2. Kênh Hiện đại (MT - Tăng trưởng giá trị)</span>
            <p className="text-slate-400 leading-relaxed">
              Chiếm 31.7% doanh số nhưng đóng góp biên lợi nhuận cao nhất nhờ các sản phẩm cao cấp: Luxury Gold 12 cuộn và Khăn rút lụa Soft Pack. Cần duy trì ụ đảo khuyến mãi tại WinMart và Co.opmart.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-800/30 border border-slate-800/50 space-y-1.5">
            <span className="font-semibold text-indigo-400">3. Kênh HORECA (Tổ chức - Sản lượng đều)</span>
            <p className="text-slate-400 leading-relaxed">
              Cuộn Jumbo JRT 700g và Khăn ăn tiệc đạt mức tiêu thụ ổn định tại các chuỗi nhà hàng và khách sạn nghỉ dưỡng. Dự kiến tháng 11-12 vào mùa cưới và hội nghị cuối năm sẽ tăng trên 20%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
