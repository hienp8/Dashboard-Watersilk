import { 
  SKUItem, 
  ChannelPerformance, 
  RegionPerformance, 
  ReportRecord, 
  ForecastPoint,
  DailyReportSummary,
  DailyCustomerConsumption
} from '../types/dashboard';

export const INITIAL_SKUS: SKUItem[] = [
  {
    id: 'sku-01',
    skuCode: 'WS-T-10CP',
    name: 'Watersilk Soft & Pure 10 cuộn 3 lớp có lõi',
    category: 'toilet_roll',
    categoryName: 'Giấy vệ sinh cuộn',
    spec: '10 cuộn / lốc, 3 lớp, 100% bột giấy nguyên chất Virgin Pulp',
    packing: '10 lốc/thùng (100 cuộn)',
    unit: 'Thùng',
    currentPrice: 850000,
    totalQuantity: 12450,
    revenue: 10582500000, // ~10.58 tỷ VNĐ
    growthRateMoM: 14.8,
    growthRateYoY: 22.4,
    inventoryDays: 16,
    channelBreakdown: { GT: 48, MT: 36, HORECA: 8, ECOMMERCE: 6, EXPORT: 2 },
    regionBreakdown: { NORTH: 56, CENTRAL: 20, SOUTH: 24 }
  },
  {
    id: 'sku-02',
    skuCode: 'WS-T-10NP',
    name: 'Watersilk Classic 10 cuộn không lõi',
    category: 'toilet_roll',
    categoryName: 'Giấy vệ sinh cuộn',
    spec: '10 cuộn đặc không lõi, 2 lớp dập nổi viền, tiết kiệm gia đình',
    packing: '10 lốc/thùng',
    unit: 'Thùng',
    currentPrice: 620000,
    totalQuantity: 18200,
    revenue: 11284000000,
    growthRateMoM: 8.5,
    growthRateYoY: 16.2,
    inventoryDays: 12,
    channelBreakdown: { GT: 62, MT: 26, HORECA: 6, ECOMMERCE: 5, EXPORT: 1 },
    regionBreakdown: { NORTH: 52, CENTRAL: 26, SOUTH: 22 }
  },
  {
    id: 'sku-03',
    skuCode: 'WS-T-12LUX',
    name: 'Watersilk Luxury Gold 12 cuộn 4 lớp dập hoa',
    category: 'toilet_roll',
    categoryName: 'Giấy vệ sinh cuộn',
    spec: '12 cuộn 4 lớp siêu mềm mịn, công nghệ cán màng lụa tơ tằm',
    packing: '8 lốc/thùng',
    unit: 'Thùng',
    currentPrice: 940000,
    totalQuantity: 7300,
    revenue: 6862000000,
    growthRateMoM: 19.2,
    growthRateYoY: 34.5,
    inventoryDays: 19,
    channelBreakdown: { GT: 28, MT: 52, HORECA: 4, ECOMMERCE: 14, EXPORT: 2 },
    regionBreakdown: { NORTH: 48, CENTRAL: 18, SOUTH: 34 }
  },
  {
    id: 'sku-04',
    skuCode: 'WS-F-180B',
    name: 'Khăn giấy hộp Watersilk Premium 180 tờ 2 lớp',
    category: 'facial_box',
    categoryName: 'Khăn giấy hộp / rút lụa',
    spec: '180 tờ 2 lớp 200x200mm, hộp giấy mạ bạc sang trọng để bàn',
    packing: '48 hộp/thùng',
    unit: 'Thùng',
    currentPrice: 1150000,
    totalQuantity: 6200,
    revenue: 7130000000,
    growthRateMoM: 12.1,
    growthRateYoY: 18.0,
    inventoryDays: 21,
    channelBreakdown: { GT: 24, MT: 44, HORECA: 18, ECOMMERCE: 12, EXPORT: 2 },
    regionBreakdown: { NORTH: 54, CENTRAL: 16, SOUTH: 30 }
  },
  {
    id: 'sku-05',
    skuCode: 'WS-F-SP200',
    name: 'Khăn rút lụa Soft Pack Watersilk 200 tờ 3 lớp',
    category: 'facial_box',
    categoryName: 'Khăn giấy hộp / rút lụa',
    spec: 'Gói rút mềm pop-up tiện lợi, chống thấm nước, 3 lớp dày dặn',
    packing: '36 gói/thùng',
    unit: 'Thùng',
    currentPrice: 780000,
    totalQuantity: 11400,
    revenue: 8892000000,
    growthRateMoM: 26.4,
    growthRateYoY: 48.7,
    inventoryDays: 14,
    channelBreakdown: { GT: 35, MT: 35, HORECA: 10, ECOMMERCE: 18, EXPORT: 2 },
    regionBreakdown: { NORTH: 46, CENTRAL: 22, SOUTH: 32 }
  },
  {
    id: 'sku-06',
    skuCode: 'WS-N-100P',
    name: 'Khăn ăn Watersilk vuông 100 tờ (330x330mm)',
    category: 'napkin',
    categoryName: 'Khăn ăn',
    spec: 'Khăn ăn trắng ngà hoa văn dập nổi viền, định lượng 17gsm 1 lớp',
    packing: '60 gói/thùng',
    unit: 'Thùng',
    currentPrice: 540000,
    totalQuantity: 16800,
    revenue: 9072000000,
    growthRateMoM: 6.2,
    growthRateYoY: 11.5,
    inventoryDays: 10,
    channelBreakdown: { GT: 45, MT: 15, HORECA: 36, ECOMMERCE: 3, EXPORT: 1 },
    regionBreakdown: { NORTH: 50, CENTRAL: 28, SOUTH: 22 }
  },
  {
    id: 'sku-07',
    skuCode: 'WS-N-240D',
    name: 'Khăn ăn cao cấp Watersilk tiệc 240 tờ 2 lớp',
    category: 'napkin',
    categoryName: 'Khăn ăn',
    spec: 'Dòng tiệc hội nghị / tiệc cưới sang trọng, không xơ bụi',
    packing: '30 gói/thùng',
    unit: 'Thùng',
    currentPrice: 690000,
    totalQuantity: 7900,
    revenue: 5451000000,
    growthRateMoM: 15.6,
    growthRateYoY: 24.3,
    inventoryDays: 18,
    channelBreakdown: { GT: 30, MT: 25, HORECA: 40, ECOMMERCE: 4, EXPORT: 1 },
    regionBreakdown: { NORTH: 45, CENTRAL: 25, SOUTH: 30 }
  },
  {
    id: 'sku-08',
    skuCode: 'WS-K-02R',
    name: 'Khăn giấy bếp Watersilk 2 cuộn dập nổi tổ ong',
    category: 'kitchen_towel',
    categoryName: 'Giấy lau bếp',
    spec: '2 cuộn lớn dập nổi tổ ong 3D siêu thấm hút dầu mỡ và nước',
    packing: '12 lốc/thùng (24 cuộn)',
    unit: 'Thùng',
    currentPrice: 580000,
    totalQuantity: 8400,
    revenue: 4872000000,
    growthRateMoM: 18.9,
    growthRateYoY: 31.0,
    inventoryDays: 15,
    channelBreakdown: { GT: 32, MT: 50, HORECA: 10, ECOMMERCE: 7, EXPORT: 1 },
    regionBreakdown: { NORTH: 44, CENTRAL: 18, SOUTH: 38 }
  },
  {
    id: 'sku-09',
    skuCode: 'WS-J-700G',
    name: 'Giấy cuộn lớn Jumbo Watersilk JRT 700g 2 lớp',
    category: 'jumbo_roll',
    categoryName: 'Giấy cuộn lớn Jumbo',
    spec: 'Cuộn to công nghiệp 700g, chuyên dụng tòa nhà văn phòng, nhà máy, KS 4-5 sao',
    packing: '12 cuộn/thùng',
    unit: 'Thùng',
    currentPrice: 520000,
    totalQuantity: 9100,
    revenue: 4732000000,
    growthRateMoM: 9.4,
    growthRateYoY: 14.2,
    inventoryDays: 22,
    channelBreakdown: { GT: 10, MT: 5, HORECA: 80, ECOMMERCE: 3, EXPORT: 2 },
    regionBreakdown: { NORTH: 52, CENTRAL: 15, SOUTH: 33 }
  },
  {
    id: 'sku-10',
    skuCode: 'WS-P-10PK',
    name: 'Khăn giấy bỏ túi Watersilk Pocket 10 gói x 10 tờ',
    category: 'pocket_tissue',
    categoryName: 'Khăn giấy bỏ túi',
    spec: 'Gói cá nhân 4 lớp mini, hương trà xanh dịu mát, bỏ túi xách học sinh & công sở',
    packing: '24 lốc/thùng (240 gói nhỏ)',
    unit: 'Thùng',
    currentPrice: 720000,
    totalQuantity: 5800,
    revenue: 4176000000,
    growthRateMoM: 21.5,
    growthRateYoY: 39.8,
    inventoryDays: 13,
    channelBreakdown: { GT: 40, MT: 42, HORECA: 3, ECOMMERCE: 14, EXPORT: 1 },
    regionBreakdown: { NORTH: 42, CENTRAL: 20, SOUTH: 38 }
  }
];

export const INITIAL_CHANNELS: ChannelPerformance[] = [
  {
    channel: 'GT',
    channelName: 'Kênh Truyền thống (GT)',
    description: 'Hơn 220 Nhà Phân Phối Cấp 1 & mạng lưới 48,000 cửa hàng tạp hóa, chợ truyền thống',
    revenue: 29850000000, // 29.85 tỷ
    targetRevenue: 28500000000,
    attainmentRate: 104.7,
    growthMoM: 7.8,
    outletCount: 48250,
    topSKUs: ['Watersilk Classic 10 cuộn không lõi', 'Watersilk Soft & Pure 10 cuộn 3L', 'Khăn ăn Watersilk vuông 100 tờ']
  },
  {
    channel: 'MT',
    channelName: 'Kênh Hiện đại (MT)',
    description: 'Hệ thống siêu thị WinMart, Co.opmart, Big C / GO!, Lotte, Aeon & chuỗi Circle K, GS25',
    revenue: 23140000000, // 23.14 tỷ
    targetRevenue: 22000000000,
    attainmentRate: 105.2,
    growthMoM: 16.4,
    outletCount: 3420,
    topSKUs: ['Watersilk Luxury Gold 12 cuộn', 'Khăn rút lụa Soft Pack 200 tờ', 'Khăn lau bếp 2 cuộn tổ ong']
  },
  {
    channel: 'HORECA',
    channelName: 'Kênh HORECA / Tổ chức (AFH)',
    description: 'Khách sạn, Resort, Nhà hàng chuỗi, Bệnh viện, Tòa nhà hành chính, Nhà máy công nghiệp',
    revenue: 11620000000, // 11.62 tỷ
    targetRevenue: 12000000000,
    attainmentRate: 96.8,
    growthMoM: 11.2,
    outletCount: 1850,
    topSKUs: ['Giấy cuộn lớn Jumbo JRT 700g', 'Khăn ăn tiệc cao cấp 240 tờ 2L', 'Khăn ăn vuông 100 tờ']
  },
  {
    channel: 'ECOMMERCE',
    channelName: 'Thương mại Điện tử (Online)',
    description: 'Gian hàng chính hãng Shopee Mall, TikTok Shop, Lazada & B2B portal',
    revenue: 6980000000, // 6.98 tỷ
    targetRevenue: 6000000000,
    attainmentRate: 116.3,
    growthMoM: 32.5,
    outletCount: 14,
    topSKUs: ['Khăn rút lụa Soft Pack 200 tờ', 'Combo Watersilk Soft & Pure 10 cuộn', 'Khăn giấy bỏ túi Pocket']
  },
  {
    channel: 'EXPORT',
    channelName: 'Kênh Xuất khẩu (Export)',
    description: 'Thị trường Đông Nam Á (Lào, Campuchia), Nhật Bản & hợp đồng OEM gia công',
    revenue: 1461500000, // 1.46 tỷ
    targetRevenue: 1500000000,
    attainmentRate: 97.4,
    growthMoM: 4.1,
    outletCount: 8,
    topSKUs: ['Giấy cuộn lớn Jumbo JRT', 'Watersilk Soft & Pure 10 cuộn']
  }
];

export const INITIAL_REGIONS: RegionPerformance[] = [
  {
    region: 'NORTH',
    regionName: 'Miền Bắc (Trọng điểm)',
    revenue: 36240000000,
    targetRevenue: 35000000000,
    growthMoM: 11.8,
    provinces: [
      { name: 'Hà Nội', revenue: 19800000000, sharePercent: 54.6, distributorCount: 42 },
      { name: 'Hải Phòng & Quảng Ninh', revenue: 6450000000, sharePercent: 17.8, distributorCount: 18 },
      { name: 'Bắc Ninh & Bắc Giang', revenue: 4200000000, sharePercent: 11.6, distributorCount: 14 },
      { name: 'Hải Dương & Nam Định', revenue: 3100000000, sharePercent: 8.6, distributorCount: 12 },
      { name: 'Các tỉnh Tây Bắc & Đông Bắc', revenue: 2690000000, sharePercent: 7.4, distributorCount: 16 }
    ]
  },
  {
    region: 'SOUTH',
    regionName: 'Miền Nam (Tăng trưởng nhanh)',
    revenue: 21560000000,
    targetRevenue: 20500000000,
    growthMoM: 18.6,
    provinces: [
      { name: 'TP. Hồ Chí Minh', revenue: 13800000000, sharePercent: 64.0, distributorCount: 35 },
      { name: 'Bình Dương & Đồng Nai', revenue: 4400000000, sharePercent: 20.4, distributorCount: 16 },
      { name: 'Cần Thơ & Miền Tây', revenue: 2160000000, sharePercent: 10.0, distributorCount: 11 },
      { name: 'Bà Rịa - Vũng Tàu', revenue: 1200000000, sharePercent: 5.6, distributorCount: 6 }
    ]
  },
  {
    region: 'CENTRAL',
    regionName: 'Miền Trung & Tây Nguyên',
    revenue: 15251500000,
    targetRevenue: 14500000000,
    growthMoM: 8.4,
    provinces: [
      { name: 'Đà Nẵng & Quảng Nam', revenue: 6700000000, sharePercent: 43.9, distributorCount: 18 },
      { name: 'Nghệ An & Thanh Hóa', revenue: 4300000000, sharePercent: 28.2, distributorCount: 15 },
      { name: 'Khánh Hòa (Nha Trang)', revenue: 2650000000, sharePercent: 17.4, distributorCount: 9 },
      { name: 'Đắk Lắk & Gia Lai', revenue: 1601500000, sharePercent: 10.5, distributorCount: 7 }
    ]
  }
];

export const SONG_DUONG_DAILY_REPORT: DailyReportSummary = {
  reportDate: '29/10/2026',
  companyName: 'CÔNG TY GIẤY TISSUE SÔNG ĐUỐNG',
  address: 'Số 672 đường Ngô Gia Tự - P.Việt Hưng - TP.Hà Nội',
  phone: '(024) 38.271.440 / 38.770.157',
  fax: '024.38.271.607',
  website: 'www.tissuesd.com.vn',
  email: 'sales@tissuesd.com.vn',
  categories: [
    {
      name: 'Tissue cuộn lớn',
      unit: 'tấn',
      plan: 500,
      actual: 390.2,
      accumulated9Months: 4203,
      attainmentRate: 78.04,
    },
    {
      name: 'Tissue thành phẩm (Watersilk)',
      unit: 'tấn',
      plan: 360,
      actual: 268.8,
      accumulated9Months: 2798,
      attainmentRate: 74.67,
    },
    {
      name: 'Gỗ dán',
      unit: 'm³',
      plan: 150,
      actual: 54.99,
      accumulated9Months: 804,
      attainmentRate: 36.66,
    },
  ],
  totalRevenueBillions: {
    plan: 69.003,
    actual: 63.334,
    accumulated9Months: 262,
    attainmentRate: 91.78,
  },
};

export const SONG_DUONG_CUSTOMER_CONSUMPTION: DailyCustomerConsumption[] = [
  { stt: 1, customerName: 'Cty Minh Thành', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Gia công & Thương mại giấy cuộn', plan: 30, planPercent: 100, expected: 30, actual: 31.3, attainmentPercent: 104, variance: -1.3, activeDelivery: true },
  { stt: 2, customerName: 'Đông Hiệp', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Gia công giấy Tissue', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 3, customerName: 'Cty CP Tiến bảo', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Nhà máy gia công giấy & Tissue', plan: 150, planPercent: 113, expected: 170, actual: 160.3, attainmentPercent: 107, variance: 9.7, activeDelivery: true },
  { stt: 4, customerName: 'Cty Stavian', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Tập đoàn thương mại & vật tư công nghiệp', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 5, customerName: 'Cty Corelex', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Sản xuất & Chuyển đổi giấy tiêu dùng', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 6, customerName: 'Cty H Care', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Gia công tã lót & khăn giấy y tế', plan: 10, planPercent: 100, expected: 10, actual: 10.4, attainmentPercent: 104, variance: -0.4, activeDelivery: true },
  { stt: 7, customerName: 'Cty Tiến Hiếu', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Gia công khăn giấy hộp & khăn rút', plan: 0, planPercent: 0, expected: 0, actual: 0.2, attainmentPercent: 100, variance: -0.2, activeDelivery: true },
  { stt: 8, customerName: 'Minh Anh', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Thương mại giấy công nghiệp', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 9, customerName: 'Cty TNHH Giấy Đông Á', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Sản xuất & Thương mại bao bì giấy', plan: 30, planPercent: 67, expected: 20, actual: 8.4, attainmentPercent: 28, variance: 11.6, activeDelivery: true },
  { stt: 10, customerName: 'Cty Tân Đức Phát', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Gia công giấy cuộn công nghiệp', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 11, customerName: 'Cty Hưng thịnh phát', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Sản xuất & Gia công giấy tissue', plan: 90, planPercent: 167, expected: 150, actual: 99.1, attainmentPercent: 110, variance: 50.9, activeDelivery: true },
  { stt: 12, customerName: 'XNK Tổng cty', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Xuất nhập khẩu & Phân phối', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 13, customerName: 'CTY TNHH Nội Bài', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Dịch vụ Hàng không & Cung ứng sân bay', plan: 3, planPercent: 167, expected: 5, actual: 1.9, attainmentPercent: 63, variance: 3.1, activeDelivery: true },
  { stt: 14, customerName: 'Cty In hàng không', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'In ấn & Dịch vụ Bao bì Hàng không', plan: 70, planPercent: 100, expected: 70, actual: 66.0, attainmentPercent: 94, variance: 4.0, activeDelivery: true },
  { stt: 15, customerName: 'Cty In Thành Đô', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'In ấn bao bì & Giấy cuộn xuất xưởng', plan: 12, planPercent: 100, expected: 12, actual: 12.5, attainmentPercent: 104, variance: -0.5, activeDelivery: true },
  { stt: 16, customerName: 'Cty TNHH Hiếu Huyền', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Thương mại giấy bao bì', plan: 0, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 17, customerName: 'Cty Hoa Việt', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Gia công & Sản xuất giấy', plan: 2, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
  { stt: 18, customerName: 'Cty Nhựa Hàng Không', productType: 'Giấy cuộn lớn (Jumbo Roll)', industrySector: 'Vật tư & Bao bì Hàng không', plan: 1, planPercent: 0, expected: 0, actual: 0, attainmentPercent: 0, variance: 0, activeDelivery: false },
];

export const INITIAL_REPORTS: ReportRecord[] = [
  {
    id: 'rep-songduong-2910',
    fileName: 'BaoCao_TieuThu_Ngay_29102026_SongDuong.png',
    fileType: 'image',
    reportPeriod: 'daily',
    uploadDate: '29/10/2026 17:45',
    extractedDate: '29/10/2026',
    sourceEntity: 'Công ty Giấy Tissue Sông Đuống - Phòng Kinh Doanh',
    channel: 'GT',
    region: 'NORTH',
    totalRevenue: 63334000000, // 63.334 tỷ VNĐ
    itemCount: 9,
    status: 'verified',
    executiveSummary: 'Báo cáo ngày 29/10/2026: Doanh thu ngày đạt 63,334 tỷ VNĐ (91.78% kế hoạch 69 tỷ). Tissue cuộn lớn đạt 390.2 tấn / KH 500 tấn (lớn nhất là Cty CP Tiến Bảo 160.3 tấn, Hưng Thịnh Phát 99.1 tấn, In Hàng Không 66.0 tấn). Tissue thành phẩm đạt 268.8 tấn. Gỗ dán đạt 54.99 m³.',
    attachmentUrls: [
      '/public/assets/aistudio/image_3119d888.png',
      '/public/assets/aistudio/image_3ac814d8.png'
    ],
    dailyData: {
      tissueCuonLonActual: 390.2,
      tissueThanhPhamActual: 268.8,
      goDanActual: 54.99,
      tongDoanhThuTy: 63.334
    },
    items: [
      { skuName: 'Tissue cuộn lớn (Xuất xưởng đại lý & đối tác)', category: 'Giấy cuộn lớn Jumbo', quantity: 390, unit: 'Tấn', unitPrice: 28500000, totalAmount: 11115000000, growthMoM: 14.2 },
      { skuName: 'Watersilk Soft & Pure 10 cuộn 3L', category: 'Giấy vệ sinh cuộn', quantity: 1820, unit: 'Thùng', unitPrice: 850000, totalAmount: 1547000000, growthMoM: 12.8 },
      { skuName: 'Watersilk Classic 10 cuộn không lõi', category: 'Giấy vệ sinh cuộn', quantity: 2450, unit: 'Thùng', unitPrice: 620000, totalAmount: 1519000000, growthMoM: 9.4 },
      { skuName: 'Khăn rút lụa Soft Pack 200 tờ 3L', category: 'Khăn giấy hộp / rút lụa', quantity: 1120, unit: 'Thùng', unitPrice: 780000, totalAmount: 873600000, growthMoM: 26.0 },
      { skuName: 'Watersilk Luxury Gold 12 cuộn 4L', category: 'Giấy vệ sinh cuộn', quantity: 820, unit: 'Thùng', unitPrice: 940000, totalAmount: 770800000, growthMoM: 21.5 },
      { skuName: 'Khăn ăn Watersilk vuông 100 tờ 330mm', category: 'Khăn ăn', quantity: 1350, unit: 'Thùng', unitPrice: 540000, totalAmount: 729000000, growthMoM: 7.2 },
      { skuName: 'Khăn lau bếp tổ ong 2 cuộn', category: 'Giấy lau bếp', quantity: 680, unit: 'Thùng', unitPrice: 580000, totalAmount: 394400000, growthMoM: 16.4 },
      { skuName: 'Khăn giấy hộp Watersilk Premium 180 tờ', category: 'Khăn giấy hộp / rút lụa', quantity: 450, unit: 'Thùng', unitPrice: 1150000, totalAmount: 517500000, growthMoM: 11.0 },
      { skuName: 'Gỗ dán quy cách xuất xưởng', category: 'Vật tư & Gỗ dán', quantity: 55, unit: 'm³', unitPrice: 7200000, totalAmount: 395928000, growthMoM: 3.5 }
    ]
  },
  {
    id: 'rep-001',
    fileName: 'BaoCao_Ngay_NPP_HaNoi_DongAnh_2810.jpg',
    fileType: 'image',
    reportPeriod: 'daily',
    uploadDate: '28/10/2026 18:30',
    extractedDate: '28/10/2026',
    sourceEntity: 'Nhà Phân Phối Hùng Thịnh - Đông Anh, Hà Nội',
    channel: 'GT',
    region: 'NORTH',
    totalRevenue: 342600000,
    itemCount: 4,
    status: 'verified',
    executiveSummary: 'Tiêu thụ dòng Classic 10 cuộn không lõi và Soft & Pure tăng đột biến cho các đại lý bán lẻ tạp hóa trước dịp cuối tháng.',
    items: [
      { skuName: 'Watersilk Classic 10 cuộn không lõi', category: 'Giấy vệ sinh cuộn', quantity: 280, unit: 'Thùng', unitPrice: 620000, totalAmount: 173600000, growthMoM: 12.5 },
      { skuName: 'Watersilk Soft & Pure 10 cuộn 3L', category: 'Giấy vệ sinh cuộn', quantity: 140, unit: 'Thùng', unitPrice: 850000, totalAmount: 119000000, growthMoM: 14.0 },
      { skuName: 'Khăn ăn Watersilk vuông 100 tờ', category: 'Khăn ăn', quantity: 65, unit: 'Thùng', unitPrice: 540000, totalAmount: 35100000, growthMoM: 5.2 },
      { skuName: 'Khăn giấy bỏ túi Pocket 10 gói', category: 'Khăn giấy bỏ túi', quantity: 20, unit: 'Thùng', unitPrice: 745000, totalAmount: 14900000, growthMoM: 18.0 }
    ]
  },
  {
    id: 'rep-002',
    fileName: 'BaoCao_Tuan_Chuoi_WinMart_Coop_W43.pdf',
    fileType: 'pdf',
    reportPeriod: 'weekly',
    uploadDate: '27/10/2026 10:15',
    extractedDate: '26/10/2026',
    sourceEntity: 'Trung tâm Thu mua WinCommerce & Saigon Co.op Miền Bắc',
    channel: 'MT',
    region: 'NORTH',
    totalRevenue: 1285400000,
    itemCount: 5,
    status: 'verified',
    executiveSummary: 'Chương trình Trade Promo mua 2 lốc tặng 1 hộp lụa giúp doanh số dòng Luxury Gold 12 cuộn tăng 28% so với tuần trước.',
    items: [
      { skuName: 'Watersilk Luxury Gold 12 cuộn', category: 'Giấy vệ sinh cuộn', quantity: 650, unit: 'Thùng', unitPrice: 940000, totalAmount: 611000000, growthMoM: 28.4 },
      { skuName: 'Khăn rút lụa Soft Pack 200 tờ', category: 'Khăn giấy hộp / rút lụa', quantity: 480, unit: 'Thùng', unitPrice: 780000, totalAmount: 374400000, growthMoM: 31.2 },
      { skuName: 'Khăn lau bếp 2 cuộn dập nổi tổ ong', category: 'Giấy lau bếp', quantity: 240, unit: 'Thùng', unitPrice: 580000, totalAmount: 139200000, growthMoM: 16.5 },
      { skuName: 'Khăn giấy hộp Watersilk Premium 180 tờ', category: 'Khăn giấy hộp / rút lụa', quantity: 110, unit: 'Thùng', unitPrice: 1150000, totalAmount: 126500000, growthMoM: 10.4 },
      { skuName: 'Watersilk Soft & Pure 10 cuộn', category: 'Giấy vệ sinh cuộn', quantity: 40, unit: 'Thùng', unitPrice: 857500, totalAmount: 34300000, growthMoM: 6.8 }
    ]
  },
  {
    id: 'rep-003',
    fileName: 'BangKe_DoanhSo_Thang10_ChiNhanh_MienNam.xlsx',
    fileType: 'excel',
    reportPeriod: 'monthly',
    uploadDate: '25/10/2026 16:45',
    extractedDate: '25/10/2026',
    sourceEntity: 'Chi nhánh Kinh doanh TP. Hồ Chí Minh & Miền Nam',
    channel: 'MT',
    region: 'SOUTH',
    totalRevenue: 2450800000,
    itemCount: 6,
    status: 'verified',
    executiveSummary: 'Doanh số Miền Nam đạt 108% kế hoạch tháng; dòng khăn rút Soft Pack và khăn lau bếp bứt phá tại các chuỗi tiện lợi GS25 và Bách Hóa Xanh.',
    items: [
      { skuName: 'Khăn rút lụa Soft Pack 200 tờ', category: 'Khăn giấy hộp / rút lụa', quantity: 1200, unit: 'Thùng', unitPrice: 780000, totalAmount: 936000000, growthMoM: 34.0 },
      { skuName: 'Watersilk Soft & Pure 10 cuộn 3L', category: 'Giấy vệ sinh cuộn', quantity: 820, unit: 'Thùng', unitPrice: 850000, totalAmount: 697000000, growthMoM: 15.2 },
      { skuName: 'Watersilk Luxury Gold 12 cuộn', category: 'Giấy vệ sinh cuộn', quantity: 390, unit: 'Thùng', unitPrice: 940000, totalAmount: 366600000, growthMoM: 22.1 },
      { skuName: 'Khăn lau bếp 2 cuộn dập nổi tổ ong', category: 'Giấy lau bếp', quantity: 380, unit: 'Thùng', unitPrice: 580000, totalAmount: 220400000, growthMoM: 19.8 },
      { skuName: 'Khăn giấy bỏ túi Pocket 10 gói', category: 'Khăn giấy bỏ túi', quantity: 180, unit: 'Thùng', unitPrice: 720000, totalAmount: 129600000, growthMoM: 25.5 },
      { skuName: 'Khăn ăn tiệc cao cấp 240 tờ 2L', category: 'Khăn ăn', quantity: 147, unit: 'Thùng', unitPrice: 688000, totalAmount: 101200000, growthMoM: 11.0 }
    ]
  },
  {
    id: 'rep-004',
    fileName: 'BanTin_TieuThu_Kenh_HORECA_Resort_DaNang.docx',
    fileType: 'word',
    reportPeriod: 'weekly',
    uploadDate: '24/10/2026 09:20',
    extractedDate: '23/10/2026',
    sourceEntity: 'Đại diện Kênh HORECA Miền Trung (Đà Nẵng - Hội An - Nha Trang)',
    channel: 'HORECA',
    region: 'CENTRAL',
    totalRevenue: 685200000,
    itemCount: 3,
    status: 'verified',
    executiveSummary: 'Ký mới hợp đồng cung cấp giấy Jumbo Roll JRT và khăn ăn tiệc 240 tờ cho 4 resort 5 sao tại Sơn Trà và Bãi Dài Cam Ranh.',
    items: [
      { skuName: 'Giấy cuộn lớn Jumbo JRT 700g', category: 'Giấy cuộn lớn Jumbo', quantity: 680, unit: 'Thùng', unitPrice: 520000, totalAmount: 353600000, growthMoM: 18.2 },
      { skuName: 'Khăn ăn tiệc cao cấp 240 tờ 2L', category: 'Khăn ăn', quantity: 340, unit: 'Thùng', unitPrice: 690000, totalAmount: 234600000, growthMoM: 14.5 },
      { skuName: 'Khăn giấy hộp Watersilk Premium 180 tờ', category: 'Khăn giấy hộp / rút lụa', quantity: 84, unit: 'Thùng', unitPrice: 1155000, totalAmount: 97000000, growthMoM: 8.9 }
    ]
  }
];

export const INITIAL_FORECASTS: ForecastPoint[] = [
  { period: 'T07/2026', actualRevenue: 63500000000, predictedRevenue: 63500000000, lowerBound: 62000000000, upperBound: 65000000000, seasonalFactorName: 'Mùa hè bình thường', notes: 'Duy trì ổn định' },
  { period: 'T08/2026', actualRevenue: 65200000000, predictedRevenue: 65200000000, lowerBound: 63800000000, upperBound: 66600000000, seasonalFactorName: 'Back to school', notes: 'Khăn giấy bỏ túi & khăn rút tăng' },
  { period: 'T09/2026', actualRevenue: 68400000000, predictedRevenue: 68400000000, lowerBound: 66900000000, upperBound: 69900000000, seasonalFactorName: 'Tết Trung Thu', notes: 'Kênh GT & quà tặng doanh nghiệp' },
  { period: 'T10/2026 (Hiện tại)', actualRevenue: 73051500000, predictedRevenue: 73051500000, lowerBound: 71500000000, upperBound: 74600000000, seasonalFactorName: 'Đầu vụ mua sắm cuối năm', notes: 'Tăng 12.3% MoM, toàn kênh vượt target' },
  { period: 'T11/2026 (+30 ngày)', predictedRevenue: 79800000000, lowerBound: 76200000000, upperBound: 83400000000, seasonalFactorName: 'Mùa tiệc cưới & Lễ hội 20/11', notes: 'Kênh HORECA và khăn ăn cao cấp tăng trưởng dự kiến +18%' },
  { period: 'T12/2026 (+60 ngày)', predictedRevenue: 88500000000, lowerBound: 84000000000, upperBound: 93000000000, seasonalFactorName: 'Đỉnh điểm tích trữ hàng Tết GT/MT', notes: 'Đại lý gom hàng giấy cuộn & hộp lụa quà Tết' },
  { period: 'T01/2027 (+90 ngày)', predictedRevenue: 96200000000, lowerBound: 90500000000, upperBound: 10190000000, seasonalFactorName: 'Đại tiệc Tết Nguyên Đán', notes: 'Đỉnh doanh số năm - khăn giấy hộp, giấy cuộn Luxury đạt công suất tối đa' }
];

export const PRESET_SAMPLE_DOCUMENTS = [
  {
    id: 'sample-songduong-real',
    name: 'Báo cáo ngày 29/10/2026 - Cty Giấy Tissue Sông Đuống (Ảnh thực tế)',
    type: 'image' as const,
    fileExt: 'png',
    description: 'Bảng tổng hợp tiêu thụ: Cuộn lớn 390.2T, Thành phẩm 268.8T, Doanh thu 63.334 tỷ và danh sách 18 khách hàng',
    mimeType: 'image/png',
    attachmentUrls: ['/public/assets/aistudio/image_3119d888.png', '/public/assets/aistudio/image_3ac814d8.png'],
    sampleText: 'CÔNG TY GIẤY TISSUE SÔNG ĐUỐNG\nĐịa chỉ: số 672 đường Ngô Gia Tự - P.Việt Hưng - TP.Hà Nội\nĐiện thoại: (024) 38.271.440 / 38.770.157 - Website: www.tissuesd.com.vn\nBáo cáo tiêu thụ ngày 29/10/2026:\n1. Tissue cuộn lớn: ĐVT tấn - Kế hoạch: 500 - Thực hiện: 390.2 - Lũy kế 9 tháng: 4.203 (Đạt 78.04%)\n2. Tissue thành phẩm: ĐVT tấn - Kế hoạch: 360 - Thực hiện: 268.8 - Lũy kế 9 tháng: 2.798 (Đạt 74.67%)\n3. Gỗ dán: ĐVT m³ - Kế hoạch: 150 - Thực hiện: 54.99 - Lũy kế 9 tháng: 804 (Đạt 36.66%)\n4. Tổng doanh thu cả vật tư: ĐVT Tỷ - Kế hoạch: 69.003 - Thực hiện: 63.334 - Lũy kế: 262 (Đạt 91.78%)\nChi tiết khách hàng nhận hàng ngày 29/10:\n- Cty CP Tiến bảo: 160.3 tấn (107%)\n- Cty Hưng thịnh phát: 99.1 tấn (110%)\n- Cty In hàng không: 66.0 tấn (94%)\n- Cty Minh Thành: 31.3 tấn (104%)\n- Cty In Thành Đô: 12.5 tấn (104%)\n- Cty H Care: 10.4 tấn (104%)\n- Cty TNHH Giấy Đông Á: 8.4 tấn (28%)\n- CTY TNHH Nội Bài: 1.9 tấn (63%)\n- Cty Tiến Hiếu: 0.2 tấn\nTổng cộng xuất hàng cuộn lớn: 390.1 tấn (Kế hoạch 398 tấn, dự kiến 467 tấn).'
  },
  {
    id: 'sample-image',
    name: 'Ảnh phiếu xuất kho / Hóa đơn bán hàng NPP Miền Bắc',
    type: 'image' as const,
    fileExt: 'jpg',
    description: 'Hóa đơn viết tay & phiếu xuất kho ngày của NPP Hưng Yên (Watersilk Soft & Pure, Classic 10 cuộn)',
    mimeType: 'image/jpeg',
    sampleText: 'PHIẾU XUẤT KHO & BIÊN BẢN GIAO HÀNG ĐẠI LÝ WATERSILK\nSố: PXK-2026/10-889\nĐơn vị nhận: NPP Minh Khang - Kho Khoái Châu, Hưng Yên\nKênh phân phối: GT (Đại lý cấp 1)\nNgày xuất: 29/10/2026\n1. Watersilk Soft & Pure 10 cuộn 3L - SL: 320 Thùng - Đơn giá: 850.000 đ - Thành tiền: 272.000.000 đ\n2. Watersilk Classic 10 cuộn không lõi - SL: 450 Thùng - Đơn giá: 620.000 đ - Thành tiền: 279.000.000 đ\n3. Khăn ăn vuông 100 tờ 330x330mm - SL: 120 Thùng - Đơn giá: 540.000 đ - Thành tiền: 64.800.000 đ\nTổng cộng doanh số: 615.800.000 VNĐ. Tăng 14.2% so với đơn tuần trước.'
  },
  {
    id: 'sample-pdf',
    name: 'Báo cáo tuần PDF - Hệ thống Siêu thị WinMart & Lotte Mart',
    type: 'pdf' as const,
    fileExt: 'pdf',
    description: 'Báo cáo tổng kết tuần kênh bán lẻ Hiện đại MT (142 siêu thị WinMart toàn quốc)',
    mimeType: 'application/pdf',
    sampleText: 'CÔNG TY CP TISSUE SÔNG ĐUỐNG - WATERSILK\nBÁO CÁO TUẦN KÊNH SIÊU THỊ HIỆN ĐẠI (MT) - TUẦN 43/2026\nĐối tác: WinCommerce, Lotte Mart, AEON Mall\nThời gian: 20/10/2026 - 27/10/2026\nKhu vực: Toàn quốc (Bắc 55%, Nam 35%, Trung 10%)\nChi tiết tiêu thụ:\n- Watersilk Luxury Gold 12 cuộn 4L: 840 Thùng, Doanh thu: 789.600.000 đ (Tăng trưởng MoM: +24.8%)\n- Khăn rút lụa Soft Pack 200 tờ: 720 Thùng, Doanh thu: 561.600.000 đ (Tăng trưởng MoM: +32.0%)\n- Khăn giấy hộp Watersilk Premium 180 tờ: 260 Thùng, Doanh thu: 299.000.000 đ (Tăng trưởng MoM: +15.1%)\n- Khăn lau bếp đa năng tổ ong 2 cuộn: 350 Thùng, Doanh thu: 203.000.000 đ (Tăng trưởng MoM: +19.4%)\nTổng doanh thu tuần: 1.853.200.000 VNĐ. Nhận xét: Dòng Soft Pack và Luxury tăng đột biến nhờ vị trí trưng bày ụ đảo đầu kệ.'
  },
  {
    id: 'sample-excel',
    name: 'Bảng kê Excel (.xlsx) - Tổng hợp 10 SKUs toàn quốc',
    type: 'excel' as const,
    fileExt: 'xlsx',
    description: 'Bảng tính Excel kế toán bán hàng: mã hàng, số lượng thùng, đơn giá, doanh thu, tăng trưởng',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sampleText: 'MÃ SKU,TÊN SẢN PHẨM WATERSILK,NGÀNH HÀNG,ĐƠN VỊ,SỐ LƯỢNG THÙNG,ĐƠN GIÁ (VNĐ),DOANH THU (VNĐ),TĂNG TRƯỞNG MoM (%),KÊNH CHỦ LỰC\nWS-T-10CP,Watersilk Soft & Pure 10 cuộn 3L,Giấy vệ sinh,Thùng,1500,850000,1275000000,16.5,GT\nWS-T-10NP,Watersilk Classic 10 cuộn không lõi,Giấy vệ sinh,Thùng,2100,620000,1302000000,10.2,GT\nWS-T-12LUX,Watersilk Luxury Gold 12 cuộn 4L,Giấy vệ sinh,Thùng,950,940000,893000000,24.1,MT\nWS-F-SP200,Khăn rút lụa Soft Pack 200 tờ 3L,Khăn hộp rút,Thùng,1400,780000,1092000000,35.6,MT & Online\nWS-N-100P,Khăn ăn Watersilk vuông 100 tờ,Khăn ăn,Thùng,1850,540000,999000000,8.7,GT & HORECA\nWS-J-700G,Giấy cuộn lớn Jumbo JRT 700g,Giấy Jumbo,Thùng,1100,520000,572000000,12.0,HORECA\nWS-K-02R,Khăn lau bếp tổ ong 2 cuộn,Khăn lau bếp,Thùng,920,580000,533600000,21.3,MT'
  },
  {
    id: 'sample-word',
    name: 'Bản tin điều hành Word (.docx) - Báo cáo Kênh HORECA',
    type: 'word' as const,
    fileExt: 'docx',
    description: 'Biên bản tóm tắt thị trường khách sạn nhà hàng HORECA Miền Nam và Miền Trung',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sampleText: 'BÁO CÁO ĐIỀU HÀNH KINH DOANH KÊNH HORECA / TỔ CHỨC\nThời điểm: Tháng 10/2026\nNgười lập: Trưởng phòng Kinh doanh Kênh Thể chế (AFH)\nKhu vực báo cáo: Miền Trung & Miền Nam\n1. Kết quả khai thác:\n- Cung ứng thành công cho chuỗi 24 nhà hàng lẩu nướng Golden Gate miền Nam: 450 thùng khăn ăn vuông và 280 thùng cuộn Jumbo JRT, doanh số đạt 388.600.000 VNĐ.\n- Ký mới hợp đồng trọn gói 2 năm với Khách sạn Mường Thanh Đà Nẵng & Vinpearl Nha Trang: 520 thùng Jumbo JRT 700g và 180 thùng khăn hộp để bàn mạ bạc Watersilk Luxury, doanh số đạt 477.400.000 VNĐ.\n2. Tổng hợp doanh thu kênh HORECA tuần qua: 866.000.000 VNĐ, tăng 17.5% so với cùng kỳ tháng trước.\n3. Đề xuất & Kiến nghị: Chuẩn bị tồn kho tăng 30% cuộn Jumbo JRT cho các trung tâm hội nghị tiệc cưới tháng 11 và 12.'
  }
];
