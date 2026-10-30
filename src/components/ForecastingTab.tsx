import React, { useState } from 'react';
import { ForecastPoint, SKUItem, ChannelPerformance } from '../types/dashboard';
import { formatVND, formatPercent } from '../utils/formatters';
import { TrendingUp, Sparkles, Sliders, Calendar, AlertCircle, ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';

interface ForecastingTabProps {
  currentRevenue: number;
  skus: SKUItem[];
  channels: ChannelPerformance[];
  forecasts: ForecastPoint[];
}

export const ForecastingTab: React.FC<ForecastingTabProps> = ({
  currentRevenue,
  skus,
  channels,
  forecasts: initialForecasts,
}) => {
  const [forecasts, setForecasts] = useState<ForecastPoint[]>(initialForecasts);
  const [selectedScenario, setSelectedScenario] = useState<string>('tet_peak');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);

  const scenarios = [
    {
      id: 'tet_peak',
      name: 'Vụ Tết Nguyên Đán 2027 (Kịch bản cơ sở)',
      description: 'Nhu cầu khăn rút lụa, khăn ăn tiệc và giấy vệ sinh cao cấp tăng đột biến 25% - 35% từ tháng 12 đến tháng 1.',
      multiplier: 1.0,
    },
    {
      id: 'expansion_mt',
      name: 'Mở rộng 150 điểm bán MT & Chuỗi Tiện Lợi',
      description: 'Gia nhập thêm hệ sinh thái chuỗi bán lẻ miền Nam, doanh số kênh MT dự kiến tăng thêm 15%.',
      multiplier: 1.08,
    },
    {
      id: 'pulp_cost_pressure',
      name: 'Biến động giá Bột giấy Virgin Pulp (+8%)',
      description: 'Áp lực giá nguyên liệu nhập khẩu đòi hỏi điều chỉnh giá bán và tối ưu tỷ trọng dòng sản phẩm cao cấp.',
      multiplier: 0.96,
    },
    {
      id: 'aggressive_promo',
      name: 'Chiến dịch Trade Marketing & Khuyến Mãi Quý 4',
      description: 'Kích cầu mua 2 tặng 1 tại siêu thị và tăng chiết khấu đại lý GT cấp 1 nhằm chiếm thị phần đối thủ.',
      multiplier: 1.14,
    },
  ];

  const handleRunAiForecast = async () => {
    setIsSimulating(true);
    const chosenScenario = scenarios.find((s) => s.id === selectedScenario);

    try {
      const response = await fetch('/api/forecast-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRevenue: currentRevenue,
          scenarioLever: `${chosenScenario?.name}: ${chosenScenario?.description}`,
          horizonMonths: 3,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiAnalysis(resData.data);

        // Adjust forecast trajectory if monthly projections returned
        if (resData.data.monthlyProjections?.length) {
          const updated = [...initialForecasts];
          resData.data.monthlyProjections.forEach((proj: any, idx: number) => {
            const targetIndex = 4 + idx; // Forecast months are index 4, 5, 6
            if (updated[targetIndex]) {
              updated[targetIndex] = {
                ...updated[targetIndex],
                predictedRevenue: proj.projectedRevenue || updated[targetIndex].predictedRevenue,
                notes: proj.keyDriver || updated[targetIndex].notes,
              };
            }
          });
          setForecasts(updated);
        }
      }
    } catch (err) {
      console.error('Forecast error', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const currentMonthPoint = forecasts.find((f) => f.actualRevenue !== undefined && f.period.includes('T10')) || forecasts[3];
  const peakTetPoint = forecasts[forecasts.length - 1]; // T01/2027
  const projectedQuarterRevenue = forecasts.slice(4).reduce((sum, f) => sum + f.predictedRevenue, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-cyan-400">DỰ BÁO NHU CẦU & DOANH SỐ TIÊU THỤ</span>
          <span aria-hidden="true">·</span>
          <span>Mô Hình Phân Tích Chuỗi Thời Gian & Mùa Vụ Tissue Watersilk</span>
        </div>
        <h1 className="text-xl font-bold text-slate-100">
          Dự Báo Xu Hướng Doanh Thu Tương Lai & Kịch Bản Thị Trường
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Đón đầu chu kỳ tiêu thụ hàng tiêu dùng cuối năm. Hệ thống kết hợp dữ liệu lịch sử bán hàng đa kênh với yếu tố mùa vụ (Tết, lễ hội tiệc cưới HORECA) để tối ưu kế hoạch mua bột giấy và lịch trình máy cuộn.
        </p>
      </div>

      {/* 3 Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">Doanh số hiện tại (Tháng 10/2026)</span>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {formatVND(currentMonthPoint.actualRevenue || currentRevenue)}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono tabular-nums">Mức thực tế đã xác nhận</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">Dự phóng Tổng 3 Tháng Tới (Q4 & Tết)</span>
          <div className="text-2xl font-bold text-cyan-300 font-mono tabular-nums">
            {formatVND(projectedQuarterRevenue)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            Bình quân ~{formatVND(projectedQuarterRevenue / 3)} / tháng
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-xs text-slate-400">Đỉnh doanh số dự báo (Tháng 01/2027 Tết)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {formatVND(peakTetPoint.predictedRevenue)}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono tabular-nums font-semibold">
            +{(((peakTetPoint.predictedRevenue - currentRevenue) / currentRevenue) * 100).toFixed(1)}% so với hiện tại
          </span>
        </div>
      </div>

      {/* Trajectory Timeline Visualizer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Đường Xu Hướng Doanh Thu Lịch Sử & Dự Phóng 3 Tháng Tới
            </h2>
            <p className="text-xs text-slate-400">
              Từ T07/2026 đến đỉnh điểm Tết T01/2027 (Đơn vị: Tỷ VNĐ)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              Số liệu thực tế đã qua
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Dự phóng tương lai
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end min-h-[220px]">
          {forecasts.map((pt, idx) => {
            const isActual = pt.actualRevenue !== undefined;
            const rev = isActual ? pt.actualRevenue! : pt.predictedRevenue;
            // Max height reference ~100 tỷ
            const heightPercent = Math.min(Math.max((rev / 100000000000) * 100, 20), 100);

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[11px] font-mono font-bold tabular-nums text-slate-200 group-hover:text-cyan-300">
                  {(rev / 1_000_000_000).toFixed(1)}B
                </div>

                <div className="w-full bg-slate-800/40 rounded-t-lg h-36 flex items-end p-1">
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      isActual
                        ? 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                        : 'bg-gradient-to-t from-emerald-600 to-teal-400 border-t-2 border-emerald-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-center">
                  <div className="text-xs font-semibold text-slate-200 whitespace-nowrap">{pt.period.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[80px]" title={pt.seasonalFactorName}>
                    {pt.seasonalFactorName}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario Simulation Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-200">
              Mô Phỏng Kịch Bản Thị Trường & Kích Hoạt Dự Báo AI
            </h2>
          </div>

          <button
            onClick={handleRunAiForecast}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang phân tích kịch bản...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chạy Dự Báo Bằng AI</span>
              </>
            )}
          </button>
        </div>

        {/* Radio List of Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedScenario(sc.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-500 bg-slate-800/80 ring-1 ring-cyan-500/20'
                    : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{sc.name}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {sc.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Strategic Planning Result */}
      {aiAnalysis && (
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/90 p-5 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Bản Kế Hoạch Tiêu Thụ Chiến Lược (AI Demand & Supply Planning)
              </h3>
              <p className="text-xs text-slate-400">
                Khuyến nghị điều hành cho Giám đốc Kinh doanh và Ban Lãnh đạo Nhà máy Tissue Sông Đuống
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-800 text-xs text-slate-300">
            <strong className="text-cyan-400">Triển vọng tổng quan: </strong>
            {aiAnalysis.overallOutlook}
          </div>

          {/* Action Points */}
          {aiAnalysis.actionPlan && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Kế hoạch hành động khẩn cấp cho phòng kinh doanh:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {aiAnalysis.actionPlan.map((act: string, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-800/30 border border-slate-800 flex items-start gap-2 text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 flex items-center justify-center font-mono text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Advice */}
          {aiAnalysis.categoryFocus && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Điều phối sản xuất & dự trữ mặt hàng:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {aiAnalysis.categoryFocus.map((cat: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-slate-100">{cat.categoryName}</div>
                    <p className="text-slate-400 text-[11px]">{cat.recommendation}</p>
                    <div className="text-[10px] text-amber-300 pt-1 border-t border-slate-800 font-medium">
                      ⚠️ {cat.inventoryCaution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
