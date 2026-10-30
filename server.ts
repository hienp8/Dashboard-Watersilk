import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Support large payloads for base64 images / PDFs / spreadsheets
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * POST /api/parse-report
 * Analyzes report files (images, PDFs, Excel/Word data or text) and extracts structured sales data
 */
app.post('/api/parse-report', async (req, res) => {
  try {
    const { fileBase64, mimeType, fileName, fileText, manualNotes } = req.body;

    const systemPrompt = `Bạn là chuyên gia phân tích dữ liệu kinh doanh cấp cao phụ trách thương hiệu giấy tissue Watersilk (sản phẩm của Công ty Cổ phần Tissue Sông Đuống).
Nhiệm vụ của bạn là đọc báo cáo bán hàng/tiêu thụ (ảnh chụp hóa đơn, bảng kê kho, PDF siêu thị, file Excel, hoặc biên bản Word) và trích xuất số liệu chuẩn xác, hệ thống hóa vào hệ cơ sở dữ liệu.

Danh mục sản phẩm Watersilk thường gặp:
- Giấy vệ sinh cuộn: Watersilk Soft & Pure 10 cuộn 3L có lõi, Watersilk Classic 10 cuộn không lõi, Watersilk Luxury Gold 12 cuộn 4L, v.v.
- Khăn giấy hộp / rút lụa: Khăn giấy hộp Watersilk Premium 180 tờ 2L, Khăn rút lụa Soft Pack 200 tờ 3L.
- Khăn ăn: Khăn ăn Watersilk vuông 100 tờ (330x330mm), Khăn ăn tiệc cao cấp 240 tờ 2L.
- Giấy lau bếp: Khăn lau bếp 2 cuộn dập nổi tổ ong siêu thấm dầu mỡ.
- Giấy cuộn lớn Jumbo: Giấy cuộn lớn Jumbo Watersilk JRT 700g (chuyên tòa nhà, bệnh viện, khách sạn HORECA).
- Khăn giấy bỏ túi: Watersilk Pocket 10 gói x 10 tờ.

Kênh phân phối chuẩn:
- GT: Kênh Truyền thống (Đại lý cấp 1, cửa hàng tạp hóa, chợ)
- MT: Kênh Hiện đại (Siêu thị WinMart, Co.opmart, Big C/GO!, Lotte, AEON, Circle K, GS25)
- HORECA: Kênh Tổ chức / AFH (Khách sạn, Resort, Nhà hàng, Quán cafe, Tòa nhà, Bệnh viện)
- ECOMMERCE: Thương mại điện tử (Shopee, TikTok Shop, Lazada, B2B)
- EXPORT: Kênh Xuất khẩu

Khu vực địa lý:
- NORTH: Miền Bắc (Hà Nội, Hải Phòng, Quảng Ninh, Bắc Ninh, v.v.)
- CENTRAL: Miền Trung (Đà Nẵng, Huế, Nghệ An, Khánh Hòa, v.v.)
- SOUTH: Miền Nam (TP.HCM, Bình Dương, Đồng Nai, Cần Thơ, v.v.)

Hãy phân tích toàn bộ văn bản/hình ảnh/dữ liệu và xuất ra JSON theo đúng cấu trúc yêu cầu. Nếu thiếu trường cụ thể, hãy ước tính hợp lý dựa trên bối cảnh thị trường giấy FMCG tại Việt Nam.`;

    const userPromptText = `Phân tích báo cáo tiêu thụ Watersilk sau đây:
Tên tệp: ${fileName || 'Báo cáo tiêu thụ'}
Ghi chú bổ sung từ người dùng: ${manualNotes || 'Không có'}
${fileText ? `Nội dung trích xuất thô:\n${fileText}` : 'Vui lòng nhận diện trực tiếp từ nội dung đính kèm.'}`;

    // Build contents for @google/genai
    const contents: any[] = [];
    
    if (fileBase64 && mimeType) {
      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: fileBase64,
        },
      });
    }
    contents.push({
      text: userPromptText,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportTitle: { type: Type.STRING, description: 'Tiêu đề ngắn gọn của báo cáo' },
            reportPeriod: { type: Type.STRING, description: 'daily | weekly | monthly' },
            sourceEntity: { type: Type.STRING, description: 'Đơn vị phát hành hoặc kênh báo cáo (ví dụ: NPP Hà Nội, Chuỗi WinMart)' },
            channel: { type: Type.STRING, description: 'GT | MT | HORECA | ECOMMERCE | EXPORT' },
            region: { type: Type.STRING, description: 'NORTH | CENTRAL | SOUTH' },
            extractedDate: { type: Type.STRING, description: 'Ngày ghi nhận số liệu định dạng DD/MM/YYYY' },
            totalRevenue: { type: Type.NUMBER, description: 'Tổng doanh thu tính bằng VNĐ' },
            totalQuantity: { type: Type.NUMBER, description: 'Tổng sản lượng tiêu thụ' },
            executiveSummary: { type: Type.STRING, description: 'Đánh giá điều hành ngắn gọn 2-3 câu' },
            keyHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Các điểm nhấn nổi bật, cơ hội hoặc rủi ro ghi nhận được'
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skuName: { type: Type.STRING, description: 'Tên mặt hàng Watersilk đầy đủ' },
                  category: { type: Type.STRING, description: 'Phân loại: Giấy vệ sinh cuộn | Khăn ăn | Khăn giấy hộp / rút lụa | Giấy lau bếp | Giấy cuộn lớn Jumbo | Khăn giấy bỏ túi' },
                  quantity: { type: Type.NUMBER, description: 'Số lượng' },
                  unit: { type: Type.STRING, description: 'Đơn vị tính: Thùng | Lốc | Cuộn | Hộp | Gói' },
                  unitPrice: { type: Type.NUMBER, description: 'Đơn giá VNĐ' },
                  totalAmount: { type: Type.NUMBER, description: 'Thành tiền VNĐ' },
                  growthMoM: { type: Type.NUMBER, description: 'Tỷ lệ tăng trưởng % so với kỳ trước (nếu có, ví dụ 15.5)' }
                },
                required: ['skuName', 'category', 'quantity', 'unit', 'unitPrice', 'totalAmount']
              }
            }
          },
          required: ['reportTitle', 'reportPeriod', 'sourceEntity', 'channel', 'region', 'totalRevenue', 'executiveSummary', 'items']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error parsing report with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Không thể trích xuất dữ liệu báo cáo qua AI.'
    });
  }
});

/**
 * POST /api/forecast-trends
 * Forecasts sales trends and scenarios for Watersilk Tissue
 */
app.post('/api/forecast-trends', async (req, res) => {
  try {
    const { currentRevenue, currentSKUs, horizonMonths, scenarioLever } = req.body;

    const prompt = `Bạn là Giám đốc Phân tích Doanh thu & Kế hoạch Tiêu thụ (Revenue & Demand Planning Director) ngành giấy tiêu dùng FMCG cho thương hiệu Watersilk.
Dựa trên bối cảnh kinh doanh hiện tại:
- Doanh thu tháng gần nhất: ${currentRevenue ? currentRevenue.toLocaleString('vi-VN') + ' VNĐ' : 'Khoảng 73 tỷ VNĐ/tháng'}
- Kịch bản mô phỏng tác động: "${scenarioLever || 'Tăng trưởng tự nhiên theo mùa vụ cuối năm và vụ Tết Nguyên Đán'}"
- Khoảng thời gian dự báo: ${horizonMonths || 3} tháng tới.

Hãy đưa ra dự báo xu hướng doanh thu chi tiết từng tháng, phân tích động lực tăng trưởng theo từng kênh phân phối (GT, MT, HORECA, E-Commerce), dự báo các dòng sản phẩm bùng nổ (ví dụ khăn hộp rút Tết, giấy cuộn gia đình, giấy ăn tiệc), và các khuyến nghị chiến lược về sản xuất, tồn kho nguyên liệu bột giấy Virgin Pulp.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallOutlook: { type: Type.STRING, description: 'Nhận định tổng quan về triển vọng thị trường' },
            growthForecastPercent: { type: Type.NUMBER, description: 'Tăng trưởng doanh thu bình quân kỳ tới (%)' },
            monthlyProjections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  monthLabel: { type: Type.STRING, description: 'Ví dụ: T11/2026, T12/2026, T01/2027 (Tết)' },
                  projectedRevenue: { type: Type.NUMBER, description: 'Doanh thu dự kiến (VNĐ)' },
                  growthRate: { type: Type.NUMBER, description: 'Tăng trưởng so với cùng kỳ hoặc tháng trước (%)' },
                  keyDriver: { type: Type.STRING, description: 'Yếu tố dẫn dắt chính' }
                },
                required: ['monthLabel', 'projectedRevenue', 'growthRate', 'keyDriver']
              }
            },
            channelDynamics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  channel: { type: Type.STRING, description: 'GT | MT | HORECA | E-Commerce | Export' },
                  forecastTrend: { type: Type.STRING, description: 'Xu hướng dự báo' },
                  expectedSharePercent: { type: Type.NUMBER, description: 'Tỷ trọng đóng góp kỳ vọng (%)' },
                  opportunity: { type: Type.STRING, description: 'Cơ hội bứt phá' }
                },
                required: ['channel', 'forecastTrend', 'expectedSharePercent', 'opportunity']
              }
            },
            categoryFocus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  categoryName: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  inventoryCaution: { type: Type.STRING }
                },
                required: ['categoryName', 'recommendation', 'inventoryCaution']
              }
            },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 hành động khẩn cấp cho phòng kinh doanh và nhà máy'
            }
          },
          required: ['overallOutlook', 'growthForecastPercent', 'monthlyProjections', 'channelDynamics', 'categoryFocus', 'actionPlan']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating forecast:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Không thể tạo dự báo xu hướng.'
    });
  }
});

// Serve frontend with Vite in dev, or dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Watersilk Intelligence Server running on port ${PORT}`);
  });
}

startServer();
