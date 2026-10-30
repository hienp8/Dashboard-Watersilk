/**
 * Type definitions for Watersilk Tissue Sales & Intelligence Dashboard
 */

export type ChannelType = 'GT' | 'MT' | 'HORECA' | 'ECOMMERCE' | 'EXPORT';
export type RegionType = 'NORTH' | 'CENTRAL' | 'SOUTH';

export type ProductCategory = 
  | 'toilet_roll'       // Giấy cuộn vệ sinh
  | 'facial_box'        // Khăn giấy hộp / rút lụa
  | 'napkin'            // Khăn ăn
  | 'kitchen_towel'     // Giấy lau bếp
  | 'jumbo_roll'        // Giấy cuộn lớn Jumbo (JRT)
  | 'pocket_tissue';    // Khăn giấy bỏ túi

export interface SKUItem {
  id: string;
  skuCode: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  spec: string; // e.g., '10 cuộn 3 lớp có lõi', '180 tờ 2 lớp'
  packing: string; // e.g., '10 lốc/thùng', '48 hộp/thùng'
  unit: string; // Thùng, Lốc, Cuộn, Hộp
  currentPrice: number; // VNĐ
  totalQuantity: number; // Volume sold
  revenue: number; // VNĐ
  growthRateMoM: number; // % MoM growth
  growthRateYoY: number; // % YoY growth
  inventoryDays: number; // Số ngày tồn kho
  channelBreakdown: Record<ChannelType, number>; // % revenue by channel
  regionBreakdown: Record<RegionType, number>; // % revenue by region
}

export interface ChannelPerformance {
  channel: ChannelType;
  channelName: string;
  description: string;
  revenue: number; // VNĐ
  targetRevenue: number;
  attainmentRate: number; // %
  growthMoM: number;
  outletCount: number; // Số điểm bán / đại lý
  topSKUs: string[];
}

export interface RegionPerformance {
  region: RegionType;
  regionName: string;
  revenue: number; // VNĐ
  targetRevenue: number;
  growthMoM: number;
  provinces: {
    name: string;
    revenue: number;
    sharePercent: number;
    distributorCount: number;
  }[];
}

export interface DailyReportSummary {
  reportDate: string;
  companyName: string;
  address: string;
  phone: string;
  fax: string;
  website: string;
  email: string;
  categories: {
    name: string;
    unit: string;
    plan: number;
    actual: number;
    accumulated9Months: number;
    attainmentRate: number;
  }[];
  totalRevenueBillions: {
    plan: number;
    actual: number;
    accumulated9Months: number;
    attainmentRate: number;
  };
}

export interface DailyCustomerConsumption {
  stt: number;
  customerName: string;
  productType?: string; // Giấy cuộn lớn (Jumbo Roll)
  industrySector?: string; // Gia công giấy tissue, In ấn hàng không...
  plan: number;
  planPercent: number;
  expected: number;
  actual: number;
  attainmentPercent: number;
  variance: number;
  activeDelivery: boolean;
}

export interface ReportRecord {
  id: string;
  fileName: string;
  fileType: 'image' | 'pdf' | 'excel' | 'word';
  reportPeriod: 'daily' | 'weekly' | 'monthly';
  uploadDate: string;
  extractedDate: string;
  sourceEntity: string;
  channel: ChannelType;
  region: RegionType;
  totalRevenue: number;
  itemCount: number;
  status: 'verified' | 'pending';
  executiveSummary: string;
  attachmentUrls?: string[];
  dailyData?: {
    tissueCuonLonActual: number;
    tissueThanhPhamActual: number;
    goDanActual: number;
    tongDoanhThuTy: number;
  };
  items: {
    skuName: string;
    category: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalAmount: number;
    growthMoM?: number;
  }[];
}

export interface ForecastPoint {
  period: string; // "T11/2026", "T12/2026", "T01/2027 (Tết)"
  actualRevenue?: number;
  predictedRevenue: number;
  lowerBound: number;
  upperBound: number;
  seasonalFactorName: string;
  notes: string;
}

