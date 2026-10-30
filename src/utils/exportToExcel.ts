import * as XLSX from 'xlsx';
import { SKUItem, ChannelPerformance, RegionPerformance, ReportRecord } from '../types/dashboard';
import { INVENTORY_XNT_DATA, WEEKLY_NATIONAL_SUMMARY } from '../data/weeklyReportData';

export function exportDashboardToExcel(
  skus: SKUItem[],
  channels: ChannelPerformance[],
  regions: RegionPerformance[],
  reports: ReportRecord[]
) {
  const wb = XLSX.utils.book_new();

  // 1. Sheet: Chi tiết SKU
  const skuData = skus.map((s) => ({
    'Mã SKU': s.skuCode,
    'Tên Sản Phẩm': s.name,
    'Ngành Hàng': s.categoryName,
    'Quy Cách & Đóng Gói': `${s.spec} (${s.packing})`,
    'Đơn Vị': s.unit,
    'Đơn Giá (VNĐ)': s.currentPrice,
    'Sản Lượng Bán (Thùng)': s.totalQuantity,
    'Doanh Thu (VNĐ)': s.revenue,
    'Tăng Trưởng MoM (%)': s.growthRateMoM,
    'Tăng Trưởng YoY (%)': s.growthRateYoY,
    'Số Ngày Tồn Kho': s.inventoryDays,
    '% Kênh GT': s.channelBreakdown.GT,
    '% Kênh MT': s.channelBreakdown.MT,
    '% Kênh HORECA': s.channelBreakdown.HORECA,
  }));
  const wsSKU = XLSX.utils.json_to_sheet(skuData);
  XLSX.utils.book_append_sheet(wb, wsSKU, 'Chi Tiết Mặt Hàng Watersilk');

  // 2. Sheet: Kênh Phân Phối
  const channelData = channels.map((c) => ({
    'Kênh Phân Phối': c.channelName,
    'Mã Kênh': c.channel,
    'Doanh Thu Thực Tế (VNĐ)': c.revenue,
    'Chỉ Tiêu Target (VNĐ)': c.targetRevenue,
    'Tỷ Lệ Hoàn Thành (%)': c.attainmentRate,
    'Tăng Trưởng MoM (%)': c.growthMoM,
    'Số Điểm Bán / Đại Lý': c.outletCount,
    'Mô Tả': c.description,
  }));
  const wsChannel = XLSX.utils.json_to_sheet(channelData);
  XLSX.utils.book_append_sheet(wb, wsChannel, 'Kênh Phân Phối');

  // 3. Sheet: Khu Vực Địa Lý
  const regionRows: any[] = [];
  regions.forEach((r) => {
    r.provinces.forEach((p) => {
      regionRows.push({
        'Khu Vực': r.regionName,
        'Tỉnh / Thành Phố': p.name,
        'Doanh Thu (VNĐ)': p.revenue,
        'Tỷ Trọng Trong Vùng (%)': p.sharePercent,
        'Số Nhà Phân Phối': p.distributorCount,
      });
    });
  });
  const wsRegion = XLSX.utils.json_to_sheet(regionRows);
  XLSX.utils.book_append_sheet(wb, wsRegion, 'Khu Vực Địa Lý');

  // 4. Sheet: Xuất Nhập Tồn Nhà Phân Phối (XNT)
  const xntRows: any[] = [];
  INVENTORY_XNT_DATA.forEach((grp) => {
    grp.distributors.forEach((d) => {
      xntRows.push({
        'Vùng': grp.regionName,
        'Tên Nhà Phân Phối': d.distributorName,
        'Khu Vực': d.subRegion,
        'Chỉ Tiêu Tháng (VNĐ)': d.monthlyTarget,
        'Tồn Đầu Kỳ (VNĐ)': d.beginningInventory,
        'Nhập Kỳ 01-24 (VNĐ)': d.periodIn,
        'Xuất Bán Kỳ 01-24 (VNĐ)': d.periodOut,
        'Tồn Cuối Kỳ (VNĐ)': d.endingInventory,
        'Dự Kiến Nhập 26-31 (VNĐ)': d.expectedInLateMonth,
        'Tỷ Lệ Đạt Dự Kiến (%)': d.expectedTargetPercent,
      });
    });
  });
  const wsXNT = XLSX.utils.json_to_sheet(xntRows);
  XLSX.utils.book_append_sheet(wb, wsXNT, 'Xuất Nhập Tồn NPP');

  // 5. Sheet: Thành Phẩm Toàn Quốc Theo Tuần
  const weeklyRows = WEEKLY_NATIONAL_SUMMARY.map((w) => ({
    'Stt': w.stt,
    'Trưởng Vùng': w.leaderName,
    'Khu Vực': w.region,
    'Chỉ Tiêu Tháng (VNĐ)': w.monthlyTarget,
    'Doanh Số Dự Kiến (VNĐ)': w.expectedRevenue,
    'Tuần 1 (VNĐ)': w.week1,
    'Tuần 2 (VNĐ)': w.week2,
    'Tuần 3 (VNĐ)': w.week3,
    'Tuần 4 (VNĐ)': w.week4,
    'Tổng Thực Hiện (VNĐ)': w.totalActual,
    'Tỷ Lệ Hoàn Thành (%)': w.attainmentPercent,
  }));
  const wsWeekly = XLSX.utils.json_to_sheet(weeklyRows);
  XLSX.utils.book_append_sheet(wb, wsWeekly, 'Tiêu Thụ TP Theo Tuần');

  // 6. Sheet: Nhật Ký Báo Cáo Đã Nạp
  const reportData = reports.map((rep) => ({
    'Mã Báo Cáo': rep.id,
    'Tên Tệp': rep.fileName,
    'Định Dạng': rep.fileType,
    'Kỳ Báo Cáo': rep.reportPeriod,
    'Ngày Đồng Bộ': rep.uploadDate,
    'Nguồn Phát Hành': rep.sourceEntity,
    'Kênh': rep.channel,
    'Khu Vực': rep.region,
    'Tổng Doanh Thu (VNĐ)': rep.totalRevenue,
    'Số Mặt Hàng': rep.itemCount,
    'Tóm Tắt': rep.executiveSummary,
  }));
  const wsReports = XLSX.utils.json_to_sheet(reportData);
  XLSX.utils.book_append_sheet(wb, wsReports, 'Lịch Sử Báo Cáo Nạp');

  // Download file
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `BaoCao_TongHop_Watersilk_Tissue_${dateStr}.xlsx`);
}
