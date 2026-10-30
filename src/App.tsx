/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { ChannelsTab } from './components/ChannelsTab';
import { RegionsTab } from './components/RegionsTab';
import { ProductsTab } from './components/ProductsTab';
import { DailyReportView } from './components/DailyReportView';
import { WeeklyReportView } from './components/WeeklyReportView';
import { ReportIngestionTab } from './components/ReportIngestionTab';
import { ForecastingTab } from './components/ForecastingTab';

import { 
  INITIAL_SKUS, 
  INITIAL_CHANNELS, 
  INITIAL_REGIONS, 
  INITIAL_REPORTS, 
  INITIAL_FORECASTS 
} from './data/watersilkData';
import { SKUItem, ChannelPerformance, RegionPerformance, ReportRecord } from './types/dashboard';
import { exportDashboardToExcel } from './utils/exportToExcel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [skus, setSkus] = useState<SKUItem[]>(INITIAL_SKUS);
  const [channels, setChannels] = useState<ChannelPerformance[]>(INITIAL_CHANNELS);
  const [regions, setRegions] = useState<RegionPerformance[]>(INITIAL_REGIONS);
  const [reports, setReports] = useState<ReportRecord[]>(INITIAL_REPORTS);
  const [lastUpdated, setLastUpdated] = useState<string>('29/10/2026 23:45');

  // Merges a newly parsed report into active dashboard state
  const handleCommitReport = (newReport: ReportRecord) => {
    // 1. Add to reports history
    setReports((prev) => [newReport, ...prev]);

    // 2. Update Channel revenue
    setChannels((prevChannels) =>
      prevChannels.map((ch) => {
        if (ch.channel === newReport.channel) {
          const updatedRev = ch.revenue + newReport.totalRevenue;
          return {
            ...ch,
            revenue: updatedRev,
            attainmentRate: (updatedRev / ch.targetRevenue) * 100,
            growthMoM: ch.growthMoM + 0.8,
          };
        }
        return ch;
      })
    );

    // 3. Update Region revenue
    setRegions((prevRegions) =>
      prevRegions.map((reg) => {
        if (reg.region === newReport.region) {
          return {
            ...reg,
            revenue: reg.revenue + newReport.totalRevenue,
            growthMoM: reg.growthMoM + 0.6,
          };
        }
        return reg;
      })
    );

    // 4. Update SKU metrics
    setSkus((prevSkus) =>
      prevSkus.map((sku) => {
        const matchingItem = newReport.items.find(
          (it) =>
            it.skuName.toLowerCase().includes(sku.name.toLowerCase()) ||
            sku.name.toLowerCase().includes(it.skuName.toLowerCase()) ||
            sku.skuCode.toLowerCase() === it.skuName.toLowerCase()
        );

        if (matchingItem) {
          const addedQty = matchingItem.quantity || 0;
          const addedAmount = matchingItem.totalAmount || addedQty * sku.currentPrice;
          return {
            ...sku,
            totalQuantity: sku.totalQuantity + addedQty,
            revenue: sku.revenue + addedAmount,
            growthRateMoM: matchingItem.growthMoM ? (sku.growthRateMoM + matchingItem.growthMoM) / 2 : sku.growthRateMoM + 1.2,
          };
        }
        return sku;
      })
    );

    setLastUpdated(new Date().toLocaleString('vi-VN'));
    setActiveTab('overview');
  };

  const handleExport = () => {
    exportDashboardToExcel(skus, channels, regions, reports);
  };

  const totalRevenue = channels.reduce((sum, ch) => sum + ch.revenue, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header adhering to 3-zone contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExport={handleExport}
        onOpenQuickIngest={() => setActiveTab('ingestion')}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            skus={skus}
            channels={channels}
            regions={regions}
            reports={reports}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'daily' && (
          <DailyReportView />
        )}

        {activeTab === 'weekly' && (
          <WeeklyReportView />
        )}

        {activeTab === 'channels' && (
          <ChannelsTab channels={channels} skus={skus} />
        )}

        {activeTab === 'regions' && (
          <RegionsTab regions={regions} />
        )}

        {activeTab === 'products' && (
          <ProductsTab skus={skus} />
        )}

        {activeTab === 'ingestion' && (
          <ReportIngestionTab
            reports={reports}
            onCommitReport={handleCommitReport}
          />
        )}

        {activeTab === 'forecast' && (
          <ForecastingTab
            currentRevenue={totalRevenue}
            skus={skus}
            channels={channels}
            forecasts={INITIAL_FORECASTS}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">WATERSILK TISSUE</span>
            <span aria-hidden="true">·</span>
            <span>Hệ thống Giám sát & Quản trị Kinh doanh Tiêu thụ</span>
            <span aria-hidden="true">·</span>
            <span>Công ty Cổ phần Tissue Sông Đuống</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Cập nhật lần cuối: <strong className="text-slate-300 font-mono">{lastUpdated}</strong></span>
            <button
              onClick={handleExport}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
            >
              Tải tệp Excel tổng hợp (.xlsx)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
