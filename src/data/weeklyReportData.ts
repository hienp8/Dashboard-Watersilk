/**
 * Structured Data from the 10 authentic Excel Report Images of Tissue Song Duong
 */

export interface WeeklyRegionalSummary {
  stt: number;
  leaderName: string;
  region: string;
  monthlyTarget: number;
  expectedPercent: number;
  expectedRevenue: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  totalActual: number;
  attainmentPercent: number;
}

export interface InventoryXNTRecord {
  stt: number;
  distributorName: string;
  subRegion: string;
  monthlyTarget: number;
  beginningInventory: number; // Tồn đầu kỳ
  periodIn: number;           // Nhập trong kỳ (01 - 24)
  periodOut: number;          // Xuất trong kỳ (01 - 24)
  endingInventory: number;    // Tồn cuối kỳ (ngày 24)
  expectedInLateMonth: number;// Dự kiến nhập (26 - cuối tháng)
  expectedTargetPercent: number;
}

export interface RegionalXNTGroup {
  regionCode: string;
  regionName: string;
  monthlyTarget: number;
  beginningInventory: number;
  periodIn: number;
  periodOut: number;
  endingInventory: number;
  expectedInLateMonth: number;
  expectedTargetPercent: number;
  distributors: InventoryXNTRecord[];
}

export interface DistributorDetail {
  stt: number;
  salesRep: string;
  distributorName: string;
  monthlyTarget: number;
  expectedPercent: number;
  expectedRevenue: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  totalActual: number;
  attainmentPercent: number;
}

// 1. Data Sheet: Thành Phẩm Toàn Quốc (Image 1)
export const WEEKLY_NATIONAL_SUMMARY: WeeklyRegionalSummary[] = [
  {
    stt: 1,
    leaderName: 'Thạch Nghĩa Hiếu',
    region: 'Hà Nội',
    monthlyTarget: 4140000000,
    expectedPercent: 77.4,
    expectedRevenue: 3205400000,
    week1: 154528468,
    week2: 535103158,
    week3: 229782596,
    week4: 373881899,
    week5: 0,
    totalActual: 1293296121,
    attainmentPercent: 31.2,
  },
  {
    stt: 2,
    leaderName: 'Hoàng Văn Lân',
    region: 'ĐBSH (Đồng Bằng Sông Hồng)',
    monthlyTarget: 3580000000,
    expectedPercent: 75.3,
    expectedRevenue: 2696650000,
    week1: 0,
    week2: 76380000,
    week3: 44462000,
    week4: 399314000,
    week5: 0,
    totalActual: 520156000,
    attainmentPercent: 14.5,
  },
  {
    stt: 3,
    leaderName: 'Lê Hải',
    region: 'Miền Núi',
    monthlyTarget: 2310000000,
    expectedPercent: 85.5,
    expectedRevenue: 1975800000,
    week1: 55044000,
    week2: 108742000,
    week3: 362210400,
    week4: 434598148,
    week5: 0,
    totalActual: 960594548,
    attainmentPercent: 41.6,
  },
  {
    stt: 4,
    leaderName: 'Nguyễn Tôn Anh Vũ',
    region: 'Miền Trung',
    monthlyTarget: 2280000000,
    expectedPercent: 85.6,
    expectedRevenue: 1952120000,
    week1: 240000000,
    week2: 243058000,
    week3: 396154000,
    week4: 3768000,
    week5: 0,
    totalActual: 882980000,
    attainmentPercent: 38.7,
  },
  {
    stt: 5,
    leaderName: 'Trần Thanh Quang',
    region: 'Miền Nam',
    monthlyTarget: 1410000000,
    expectedPercent: 75.4,
    expectedRevenue: 1063140000,
    week1: 0,
    week2: 0,
    week3: 246843300,
    week4: 165641238,
    week5: 0,
    totalActual: 412484538,
    attainmentPercent: 29.3,
  },
  {
    stt: 6,
    leaderName: 'Nguyễn Trí Sơn',
    region: 'Kênh Siêu Thị (MT)',
    monthlyTarget: 1260000000,
    expectedPercent: 48.0,
    expectedRevenue: 604800000,
    week1: 6808890,
    week2: 75858940,
    week3: 110599185,
    week4: 64402479,
    week5: 0,
    totalActual: 257669494,
    attainmentPercent: 20.4,
  },
];

// National Finished Goods Grand Total
export const NATIONAL_TOTAL = {
  monthlyTarget: 14980000000, // 14.98 tỷ
  expectedPercent: 76.8,
  expectedRevenue: 11497910000, // 11.50 tỷ
  week1: 456381358,
  week2: 1039142098,
  week3: 1390051481,
  week4: 1441605764,
  week5: 0,
  totalActual: 4327180701, // 4.33 tỷ
  attainmentPercent: 28.9,
  jumboRollTons: {
    monthlyTarget: 500,
    expectedPercent: 80.0,
    expectedTons: 400,
    week1: 26.8,
    week2: 81.4,
    week3: 104.6,
    week4: 78.5,
    totalActualTons: 291.3,
    attainmentPercent: 58.3,
  },
};

// 2. Data Sheet: Xuất Nhập Tồn & Dự Kiến Nhập Hàng (Images 8, 9, 10)
export const INVENTORY_XNT_DATA: RegionalXNTGroup[] = [
  {
    regionCode: 'DBSH',
    regionName: 'Khu vực Đồng Bằng Sông Hồng',
    monthlyTarget: 3580000000,
    beginningInventory: 7976604510,
    periodIn: 520156000,
    periodOut: 1620040890,
    endingInventory: 6876719620,
    expectedInLateMonth: 2176570000,
    expectedTargetPercent: 75.3,
    distributors: [
      { stt: 1, distributorName: 'Minh Hoà', subRegion: 'Nam Định', monthlyTarget: 250000000, beginningInventory: 763240400, periodIn: 276264000, periodOut: 180093600, endingInventory: 859410800, expectedInLateMonth: 0, expectedTargetPercent: 110.5 },
      { stt: 2, distributorName: 'Hoàng Phúc', subRegion: 'Hà Nam', monthlyTarget: 400000000, beginningInventory: 932561200, periodIn: 68988000, periodOut: 215444800, endingInventory: 786104400, expectedInLateMonth: 371012000, expectedTargetPercent: 110.0 },
      { stt: 3, distributorName: 'Huy Loan', subRegion: 'Hưng Yên', monthlyTarget: 120000000, beginningInventory: 301668670, periodIn: 0, periodOut: 35181700, endingInventory: 266486970, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 4, distributorName: 'Phương Hướng', subRegion: 'Hải Phòng', monthlyTarget: 850000000, beginningInventory: 1875580400, periodIn: 0, periodOut: 608882800, endingInventory: 1266697600, expectedInLateMonth: 935000000, expectedTargetPercent: 110.0 },
      { stt: 5, distributorName: 'An Đức QN', subRegion: 'Quảng Ninh', monthlyTarget: 100000000, beginningInventory: 702459500, periodIn: 14784000, periodOut: 90519600, endingInventory: 626723900, expectedInLateMonth: 95216000, expectedTargetPercent: 110.0 },
      { stt: 6, distributorName: 'Vũ Thị Oanh', subRegion: 'Quảng Ninh', monthlyTarget: 100000000, beginningInventory: 101648150, periodIn: 0, periodOut: 0, endingInventory: 101648150, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 7, distributorName: 'Gia Phúc Minh', subRegion: 'Ninh Bình', monthlyTarget: 250000000, beginningInventory: 1404481390, periodIn: 0, periodOut: 198332790, endingInventory: 1206148600, expectedInLateMonth: 275000000, expectedTargetPercent: 110.0 },
      { stt: 8, distributorName: 'Linh Chi', subRegion: 'Thanh Hóa', monthlyTarget: 200000000, beginningInventory: 409613600, periodIn: 44462000, periodOut: 19055800, endingInventory: 435019800, expectedInLateMonth: 0, expectedTargetPercent: 22.2 },
      { stt: 9, distributorName: 'Tổng Xuân Hòa', subRegion: 'Thanh Hóa', monthlyTarget: 100000000, beginningInventory: 88278000, periodIn: 0, periodOut: 22802000, endingInventory: 65476000, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 10, distributorName: 'Phương Liên', subRegion: 'Thái Bình', monthlyTarget: 200000000, beginningInventory: 329772000, periodIn: 115658000, periodOut: 61130000, endingInventory: 384300000, expectedInLateMonth: 104342000, expectedTargetPercent: 110.0 },
      { stt: 11, distributorName: 'Thái Anh', subRegion: 'Hải Dương', monthlyTarget: 400000000, beginningInventory: 0, periodIn: 0, periodOut: 0, endingInventory: 0, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 12, distributorName: 'Long Hoa', subRegion: 'Thanh Hoá', monthlyTarget: 250000000, beginningInventory: 554209200, periodIn: 0, periodOut: 120901200, endingInventory: 433308000, expectedInLateMonth: 275000000, expectedTargetPercent: 110.0 },
      { stt: 13, distributorName: 'Phạm Thị Nhung', subRegion: 'Quảng Ninh', monthlyTarget: 110000000, beginningInventory: 513092000, periodIn: 0, periodOut: 67696600, endingInventory: 445395400, expectedInLateMonth: 121000000, expectedTargetPercent: 110.0 },
      { stt: 14, distributorName: 'Khác', subRegion: 'Khác', monthlyTarget: 250000000, beginningInventory: 0, periodIn: 0, periodOut: 0, endingInventory: 0, expectedInLateMonth: 0, expectedTargetPercent: 0 },
    ],
  },
  {
    regionCode: 'HANOI',
    regionName: 'Khu vực Hà Nội',
    monthlyTarget: 4140000000,
    beginningInventory: 8670305088,
    periodIn: 1293296121,
    periodOut: 2318562098,
    endingInventory: 7645039111,
    expectedInLateMonth: 1912103879,
    expectedTargetPercent: 77.4,
    distributors: [
      { stt: 1, distributorName: 'Đức Mạnh', subRegion: 'Đông Anh', monthlyTarget: 350000000, beginningInventory: 882215000, periodIn: 0, periodOut: 108000000, endingInventory: 774215000, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 2, distributorName: 'Việt Phát', subRegion: 'Từ Liêm', monthlyTarget: 450000000, beginningInventory: 864526818, periodIn: 241992600, periodOut: 375677260, endingInventory: 730842158, expectedInLateMonth: 253007400, expectedTargetPercent: 110.0 },
      { stt: 3, distributorName: 'Thuận Phát', subRegion: 'Sơn Tây', monthlyTarget: 350000000, beginningInventory: 1410524000, periodIn: 0, periodOut: 185098000, endingInventory: 1225426000, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 4, distributorName: 'BHTT Long Biên', subRegion: 'Long Biên', monthlyTarget: 200000000, beginningInventory: 0, periodIn: 210236221, periodOut: 210236221, endingInventory: 0, expectedInLateMonth: 39763779, expectedTargetPercent: 125.0 },
      { stt: 5, distributorName: 'Hưng Thịnh Phát', subRegion: 'Gia Lâm', monthlyTarget: 700000000, beginningInventory: 1220644500, periodIn: 736783300, periodOut: 559038800, endingInventory: 1398389000, expectedInLateMonth: 33216700, expectedTargetPercent: 110.0 },
      { stt: 6, distributorName: 'Hà Đông', subRegion: 'Hà Đông', monthlyTarget: 350000000, beginningInventory: 0, periodIn: 0, periodOut: 0, endingInventory: 0, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 7, distributorName: 'Huy Hoàng', subRegion: 'H.Mai-HBT', monthlyTarget: 780000000, beginningInventory: 2193018500, periodIn: 48716000, periodOut: 440978000, endingInventory: 1800756500, expectedInLateMonth: 871684000, expectedTargetPercent: 118.0 },
      { stt: 8, distributorName: 'Phan Nhân', subRegion: 'Đống Đa', monthlyTarget: 250000000, beginningInventory: 315219000, periodIn: 55568000, periodOut: 102301000, endingInventory: 268486000, expectedInLateMonth: 219432000, expectedTargetPercent: 110.0 },
      { stt: 9, distributorName: 'Ngọc Viên', subRegion: 'Cầu Giấy', monthlyTarget: 450000000, beginningInventory: 1749450000, periodIn: 0, periodOut: 327626000, endingInventory: 1421824000, expectedInLateMonth: 495000000, expectedTargetPercent: 110.0 },
      { stt: 10, distributorName: 'Thường Tín', subRegion: 'Thường Tín', monthlyTarget: 120000000, beginningInventory: 0, periodIn: 0, periodOut: 0, endingInventory: 0, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 11, distributorName: 'Việt Nguyên', subRegion: 'Hoàng Mai', monthlyTarget: 140000000, beginningInventory: 34707270, periodIn: 0, periodOut: 9606817, endingInventory: 25100453, expectedInLateMonth: 0, expectedTargetPercent: 0 },
    ],
  },
  {
    regionCode: 'MIENTRUNG',
    regionName: 'Khu vực Miền Trung',
    monthlyTarget: 2280000000,
    beginningInventory: 4851634900,
    periodIn: 882980000,
    periodOut: 1954329800,
    endingInventory: 3780285100,
    expectedInLateMonth: 1068978000,
    expectedTargetPercent: 85.6,
    distributors: [
      { stt: 1, distributorName: 'Thịnh Linh', subRegion: 'Nghệ An', monthlyTarget: 300000000, beginningInventory: 526333000, periodIn: 88448000, periodOut: 202678800, endingInventory: 412102200, expectedInLateMonth: 241552000, expectedTargetPercent: 110.0 },
      { stt: 2, distributorName: 'Lâm Bản', subRegion: 'Hà Tĩnh', monthlyTarget: 130000000, beginningInventory: 126497000, periodIn: 0, periodOut: 32951000, endingInventory: 93546000, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 3, distributorName: 'Tuấn Việt', subRegion: 'Quảng Bình', monthlyTarget: 250000000, beginningInventory: 357790000, periodIn: 0, periodOut: 116311200, endingInventory: 241478800, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 4, distributorName: 'Khoa Hồng', subRegion: 'Quảng Trị', monthlyTarget: 150000000, beginningInventory: 198746400, periodIn: 165600000, periodOut: 108574000, endingInventory: 255772400, expectedInLateMonth: 0, expectedTargetPercent: 110.4 },
      { stt: 5, distributorName: 'Hải Thắng', subRegion: 'Huế', monthlyTarget: 150000000, beginningInventory: 272813200, periodIn: 0, periodOut: 82669800, endingInventory: 190143400, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 6, distributorName: 'Hưng Phước', subRegion: 'Đà Nẵng', monthlyTarget: 650000000, beginningInventory: 1224813000, periodIn: 3768000, periodOut: 509648000, endingInventory: 718933000, expectedInLateMonth: 711232000, expectedTargetPercent: 110.0 },
      { stt: 7, distributorName: 'Hoàng Kim Phát', subRegion: 'Đà Nẵng', monthlyTarget: 390000000, beginningInventory: 1639920300, periodIn: 455358000, periodOut: 712260000, endingInventory: 1383018300, expectedInLateMonth: 0, expectedTargetPercent: 116.8 },
      { stt: 8, distributorName: 'Lộc Thịnh Phát', subRegion: 'Quảng Nam', monthlyTarget: 260000000, beginningInventory: 504722000, periodIn: 169806000, periodOut: 189237000, endingInventory: 485291000, expectedInLateMonth: 116194000, expectedTargetPercent: 110.0 },
    ],
  },
  {
    regionCode: 'MIENNUI',
    regionName: 'Khu vực Miền Núi',
    monthlyTarget: 2310000000,
    beginningInventory: 6314835595,
    periodIn: 960594548,
    periodOut: 1256277200,
    endingInventory: 6019152943,
    expectedInLateMonth: 1015271452,
    expectedTargetPercent: 85.5,
    distributors: [
      { stt: 1, distributorName: 'An Bình Đăng', subRegion: 'Việt Trì', monthlyTarget: 335000000, beginningInventory: 471820470, periodIn: 255214000, periodOut: 239822400, endingInventory: 487212070, expectedInLateMonth: 113286000, expectedTargetPercent: 110.0 },
      { stt: 2, distributorName: 'Hà Loan', subRegion: 'Lâm Thao', monthlyTarget: 130000000, beginningInventory: 190871496, periodIn: 0, periodOut: 32712000, endingInventory: 158159496, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 3, distributorName: 'Vũ Khánh Long', subRegion: 'Tuyên Quang', monthlyTarget: 60000000, beginningInventory: 101132400, periodIn: 0, periodOut: 0, endingInventory: 101132400, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 4, distributorName: 'Tâm Độ', subRegion: 'Yên Bái', monthlyTarget: 150000000, beginningInventory: 389116000, periodIn: 0, periodOut: 141373200, endingInventory: 247742800, expectedInLateMonth: 165000000, expectedTargetPercent: 110.0 },
      { stt: 5, distributorName: 'Sông Hương', subRegion: 'Vĩnh Phúc', monthlyTarget: 420000000, beginningInventory: 1357832837, periodIn: 195082148, periodOut: 215946000, endingInventory: 1336968985, expectedInLateMonth: 266917852, expectedTargetPercent: 110.0 },
      { stt: 6, distributorName: 'Kiên Tư', subRegion: 'Bắc Ninh', monthlyTarget: 390000000, beginningInventory: 1152020800, periodIn: 286576400, periodOut: 270038400, endingInventory: 1168558800, expectedInLateMonth: 142423600, expectedTargetPercent: 110.0 },
      { stt: 7, distributorName: 'Bùi Thị Thuỷ', subRegion: 'Bắc Giang', monthlyTarget: 170000000, beginningInventory: 673975059, periodIn: 193866000, periodOut: 111531600, endingInventory: 756309459, expectedInLateMonth: 0, expectedTargetPercent: 114.0 },
      { stt: 8, distributorName: 'Phương Phát', subRegion: 'Thái Nguyên', monthlyTarget: 140000000, beginningInventory: 764957800, periodIn: 29856000, periodOut: 148515000, endingInventory: 646298800, expectedInLateMonth: 124144000, expectedTargetPercent: 110.0 },
      { stt: 9, distributorName: 'Dương Văn Cát', subRegion: 'Bắc Kạn', monthlyTarget: 80000000, beginningInventory: 249570200, periodIn: 0, periodOut: 0, endingInventory: 249570200, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 10, distributorName: 'BTH', subRegion: 'Sơn La', monthlyTarget: 110000000, beginningInventory: 245913800, periodIn: 0, periodOut: 24990000, endingInventory: 220923800, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 11, distributorName: 'Tiến Toán', subRegion: 'Điện Biên', monthlyTarget: 105000000, beginningInventory: 263228800, periodIn: 0, periodOut: 39600000, endingInventory: 223628800, expectedInLateMonth: 115500000, expectedTargetPercent: 110.0 },
      { stt: 12, distributorName: 'An Lộc Phát', subRegion: 'Lào Cai', monthlyTarget: 70000000, beginningInventory: 243022889, periodIn: 0, periodOut: 0, endingInventory: 243022889, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 13, distributorName: 'Hưng Thịnh', subRegion: 'Lai Châu', monthlyTarget: 80000000, beginningInventory: 167406600, periodIn: 0, periodOut: 31748600, endingInventory: 135658000, expectedInLateMonth: 88000000, expectedTargetPercent: 110.0 },
      { stt: 14, distributorName: 'Tú Hiệp', subRegion: 'Lạng Sơn', monthlyTarget: 70000000, beginningInventory: 43966444, periodIn: 0, periodOut: 0, endingInventory: 43966444, expectedInLateMonth: 0, expectedTargetPercent: 0 },
    ],
  },
  {
    regionCode: 'MIENNAM',
    regionName: 'Khu vực Miền Nam',
    monthlyTarget: 910000000,
    beginningInventory: 2017715430,
    periodIn: 144835000,
    periodOut: 573807000,
    endingInventory: 1588743430,
    expectedInLateMonth: 612828000,
    expectedTargetPercent: 83.3,
    distributors: [
      { stt: 1, distributorName: 'Phước Thọ', subRegion: 'TP.HCM', monthlyTarget: 75000000, beginningInventory: 144262037, periodIn: 0, periodOut: 7539600, endingInventory: 136722437, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 2, distributorName: 'Hoàng Phương', subRegion: 'TP.HCM', monthlyTarget: 420000000, beginningInventory: 1211462000, periodIn: 14172000, periodOut: 396814600, endingInventory: 828819400, expectedInLateMonth: 447828000, expectedTargetPercent: 110.0 },
      { stt: 3, distributorName: 'NPP Hiển Đạt', subRegion: 'Nha Trang', monthlyTarget: 50000000, beginningInventory: 93046400, periodIn: 0, periodOut: 0, endingInventory: 93046400, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 4, distributorName: 'Hà An', subRegion: 'Vũng Tàu', monthlyTarget: 150000000, beginningInventory: 386058400, periodIn: 0, periodOut: 107114200, endingInventory: 278944200, expectedInLateMonth: 165000000, expectedTargetPercent: 110.0 },
      { stt: 5, distributorName: 'Mỹ Hoa', subRegion: 'Đà Lạt', monthlyTarget: 50000000, beginningInventory: 9163637, periodIn: 0, periodOut: 0, endingInventory: 9163637, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 6, distributorName: 'Tứ Quý (Gia Lai)', subRegion: 'Trung Bộ', monthlyTarget: 50000000, beginningInventory: 85953864, periodIn: 0, periodOut: 0, endingInventory: 85953864, expectedInLateMonth: 0, expectedTargetPercent: 0 },
      { stt: 7, distributorName: 'NPP Kiều Loan', subRegion: 'An Giang', monthlyTarget: 115000000, beginningInventory: 68640000, periodIn: 130663000, periodOut: 62338600, endingInventory: 136964400, expectedInLateMonth: 0, expectedTargetPercent: 113.6 },
      { stt: 8, distributorName: 'Thành Anh Phát', subRegion: 'Lâm Đồng', monthlyTarget: 0, beginningInventory: 19129092, periodIn: 0, periodOut: 0, endingInventory: 19129092, expectedInLateMonth: 0, expectedTargetPercent: 0 },
    ],
  },
];

// Grand Total of Inventory XNT across all 5 regions
export const TOTAL_INVENTORY_XNT = {
  monthlyTarget: 13220000000,     // 13.22 tỷ
  beginningInventory: 29831095523,// 29.83 tỷ
  periodIn: 3801861669,          // 3.80 tỷ
  periodOut: 7723016988,         // 7.72 tỷ
  endingInventory: 25909940204,  // 25.91 tỷ
  expectedInLateMonth: 6785751331,// 6.79 tỷ
  expectedTargetPercent: 83.3,   // 83.3%
};

// 10 User Uploaded Images Metadata for Quick Inspection
export const USER_ATTACHMENT_IMAGES = [
  { id: 1, title: 'Thành Phẩm Toàn Quốc (Ảnh 1)', path: '/public/assets/aistudio/_17038363-D2D2-4FD9-867B-C3EA4E56F324__3290bdd2.png', description: 'Báo cáo tổng hợp tiêu thụ thành phẩm toàn quốc 5 tuần' },
  { id: 2, title: 'Khu vực ĐBSH (Ảnh 2)', path: '/public/assets/aistudio/_6B8C4AFD-D6A1-42CC-95DC-F81D9C4B9911__87813d92.png', description: 'Chi tiết NPP Đồng Bằng Sông Hồng theo từng tuần' },
  { id: 3, title: 'Khu vực Miền Nam (Ảnh 3)', path: '/public/assets/aistudio/_1780E0EB-C83A-4269-AF2C-BE8C355DF88C__f38cf177.png', description: 'Chi tiết NPP và Siêu thị Miền Nam theo tuần' },
  { id: 4, title: 'Khu vực Hà Nội (Ảnh 4)', path: '/public/assets/aistudio/_81E6A7DA-9175-489E-9ACF-C45A9EFEFCC2__e6a62167.png', description: 'Chi tiết 11 NPP Hà Nội tuần 1 - tuần 5' },
  { id: 5, title: 'Khu vực Miền Núi (Ảnh 5)', path: '/public/assets/aistudio/_A2FF4C50-9205-4142-B700-9979F1310A5D__0ec392cc.png', description: 'Chi tiết 14 NPP khu vực Miền Núi' },
  { id: 6, title: 'Kênh Siêu Thị (Ảnh 6)', path: '/public/assets/aistudio/_F19E4138-6D05-4405-ADA7-86F93936B681__a383d6ad.png', description: 'Báo cáo chuỗi WinMart, Lan Chi, Mega Market, Fuji' },
  { id: 7, title: 'Khu vực Miền Trung (Ảnh 7)', path: '/public/assets/aistudio/_79A3C0FB-9B53-4EFD-A9CC-4410C19340D9__d813f945.png', description: 'Chi tiết 8 NPP Miền Trung tuần 1 - tuần 4' },
  { id: 8, title: 'Xuất Nhập Tồn: ĐBSH & Hà Nội (Ảnh 8)', path: '/public/assets/aistudio/_D0A6A4F6-21E5-4133-B8A4-2E70F8B70952__fd6c54db.png', description: 'Tồn đầu kỳ, Nhập/Xuất 01-24, Tồn cuối kỳ ngày 24, Dự kiến nhập' },
  { id: 9, title: 'Xuất Nhập Tồn: Hà Nội & Miền Trung (Ảnh 9)', path: '/public/assets/aistudio/_D6692260-5939-43ED-A5F3-FC2B2151AA38__aa966da3.png', description: 'Tổng hợp Tồn kho Hà Nội 7.64 tỷ & Miền Trung 3.78 tỷ' },
  { id: 10, title: 'Xuất Nhập Tồn: Miền Núi, Miền Nam & Tổng (Ảnh 10)', path: '/public/assets/aistudio/_510C5453-16D9-421B-BA5B-7B3DC26E316B__938c70dd.png', description: 'Tổng toàn quốc: Tồn ĐK 29.83 tỷ, Xuất 7.72 tỷ, Tồn CK 25.91 tỷ' },
];
