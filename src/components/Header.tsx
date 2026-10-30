import React from 'react';
import { Download, RefreshCw, Sparkles, Calendar } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExport: () => void;
  onOpenQuickIngest: () => void;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onExport,
  onOpenQuickIngest,
  lastUpdated,
}) => {
  const navTabs = [
    { id: 'overview', label: 'Tổng quan Điều hành' },
    { id: 'daily', label: 'Báo Cáo Ngày Gốc' },
    { id: 'weekly', label: 'Báo Cáo Tuần & Xuất Nhập Tồn' },
    { id: 'channels', label: 'Kênh Phân Phối' },
    { id: 'regions', label: 'Khu Vực Địa Lý' },
    { id: 'products', label: 'Chi Tiết Mặt Hàng' },
    { id: 'ingestion', label: 'Nạp & Xử Lý Báo Cáo' },
    { id: 'forecast', label: 'Dự Báo & Xu Hướng' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-700 flex items-center justify-center shadow-sm">
            <span className="font-bold text-white text-base tracking-wider font-mono">WS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-100 tracking-tight whitespace-nowrap">
              WATERSILK INTELLIGENCE
            </span>
            <span className="text-[11px] text-cyan-400 font-medium">
              Báo cáo & Giám sát Tiêu thụ Tissue
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuickIngest}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nạp Báo Cáo AI</span>
          </button>

          <button
            onClick={onExport}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="Xuất bảng Excel tổng hợp"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Xuất Excel</span>
          </button>

          {/* User profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src="/src/assets/images/avatar_sales_director_1793343490471.jpg"
              alt="Giám đốc Kinh doanh Watersilk"
              className="w-8 h-8 rounded-full object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-200 leading-tight">Phan Hiển</span>
              <span className="text-[10px] text-slate-400">GĐ Kinh doanh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-900/95 scrollbar-none">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
