import React, { useState, useRef } from 'react';
import { ReportRecord, SKUItem, ChannelType, RegionType } from '../types/dashboard';
import { PRESET_SAMPLE_DOCUMENTS } from '../data/watersilkData';
import { formatVND, formatNumber, formatPercent } from '../utils/formatters';
import { 
  Upload, FileText, Image, FileSpreadsheet, FileQuestion, Sparkles, 
  CheckCircle2, ArrowRight, Loader2, AlertCircle, RefreshCw, Eye, Plus 
} from 'lucide-react';

interface ReportIngestionTabProps {
  reports: ReportRecord[];
  onCommitReport: (newReport: ReportRecord) => void;
}

export const ReportIngestionTab: React.FC<ReportIngestionTabProps> = ({
  reports,
  onCommitReport,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected file or sample
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'pdf' | 'excel' | 'word'>('image');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string | null>(null);
  const [fileTextContent, setFileTextContent] = useState<string>('');
  const [manualNotes, setManualNotes] = useState<string>('');
  const [sampleAttachmentUrls, setSampleAttachmentUrls] = useState<string[] | undefined>(undefined);

  // Parsed result preview before committing
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [viewingArchiveReport, setViewingArchiveReport] = useState<ReportRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load a preset sample
  const handleSelectSample = (sample: typeof PRESET_SAMPLE_DOCUMENTS[0]) => {
    setUploadedFileName(sample.name + `.${sample.fileExt}`);
    setUploadedFileType(sample.type);
    setFileTextContent(sample.sampleText);
    setFileBase64(null);
    setFileMimeType(sample.mimeType);
    setSampleAttachmentUrls((sample as any).attachmentUrls);
    setManualNotes(`Tệp mẫu thử nghiệm hệ thống: ${sample.description}`);
    setParsedResult(null);
    setErrorMessage(null);
  };

  // Handle user uploading actual file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setErrorMessage(null);
    setParsedResult(null);

    const ext = file.name.split('.').pop()?.toLowerCase();
    let detectedType: 'image' | 'pdf' | 'excel' | 'word' = 'image';

    if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext || '')) {
      detectedType = 'image';
    } else if (ext === 'pdf') {
      detectedType = 'pdf';
    } else if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
      detectedType = 'excel';
    } else if (['docx', 'doc', 'txt'].includes(ext || '')) {
      detectedType = 'word';
    }
    setUploadedFileType(detectedType);

    // Read as Base64 for Gemini
    const reader = new FileReader();
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      reader.onload = () => {
        const resultStr = reader.result as string;
        // strip data:mime/type;base64,
        const base64Data = resultStr.split(',')[1];
        setFileBase64(base64Data);
        setFileMimeType(file.type || (ext === 'pdf' ? 'application/pdf' : 'image/jpeg'));
        setFileTextContent('');
      };
      reader.readAsDataURL(file);
    } else {
      // For CSV / Text / Spreadsheets read text or pass file metadata
      reader.onload = () => {
        setFileTextContent(reader.result as string);
        setFileBase64(null);
        setFileMimeType(file.type || 'text/plain');
      };
      reader.readAsText(file);
    }
  };

  // Trigger Gemini parsing
  const handleStartExtraction = async () => {
    if (!uploadedFileName && !fileTextContent && !fileBase64) {
      setErrorMessage('Vui lòng chọn một file báo cáo hoặc chọn mẫu thử nghiệm bên dưới.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStatus('Đang gửi dữ liệu đến Gemini 3.8 Flash AI...');

    try {
      setProcessingStatus('Đang nhận diện định dạng (ảnh/PDF/bảng biểu) và trích xuất số liệu Watersilk...');

      const response = await fetch('/api/parse-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: uploadedFileName,
          fileType: uploadedFileType,
          fileBase64: fileBase64,
          mimeType: fileMimeType,
          fileText: fileTextContent,
          manualNotes: manualNotes,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Trích xuất thất bại.');
      }

      setProcessingStatus('Đã trích xuất thành công! Kiểm tra số liệu trước khi lưu.');
      setParsedResult(resData.data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Lỗi khi gửi yêu cầu phân tích.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm and commit into dashboard
  const handleCommitParsedData = () => {
    if (!parsedResult) return;

    const newReport: ReportRecord = {
      id: `rep-${Date.now()}`,
      fileName: uploadedFileName || parsedResult.reportTitle || 'Bao_cao_kinh_doanh.xlsx',
      fileType: uploadedFileType,
      reportPeriod: parsedResult.reportPeriod || 'weekly',
      uploadDate: new Date().toLocaleString('vi-VN'),
      extractedDate: parsedResult.extractedDate || new Date().toLocaleDateString('vi-VN'),
      sourceEntity: parsedResult.sourceEntity || 'Kênh phân phối Watersilk',
      channel: (parsedResult.channel as ChannelType) || 'GT',
      region: (parsedResult.region as RegionType) || 'NORTH',
      totalRevenue: Number(parsedResult.totalRevenue) || 0,
      itemCount: parsedResult.items?.length || 0,
      status: 'verified',
      executiveSummary: parsedResult.executiveSummary || 'Báo cáo đã được xử lý và hợp nhất thành công.',
      items: (parsedResult.items || []).map((it: any) => ({
        skuName: it.skuName,
        category: it.category || 'Giấy vệ sinh cuộn',
        quantity: Number(it.quantity) || 0,
        unit: it.unit || 'Thùng',
        unitPrice: Number(it.unitPrice) || 0,
        totalAmount: Number(it.totalAmount) || 0,
        growthMoM: it.growthMoM ? Number(it.growthMoM) : undefined,
      })),
    };

    onCommitReport(newReport);
    setParsedResult(null);
    setUploadedFileName('');
    setFileBase64(null);
    setFileTextContent('');
    setManualNotes('');
    alert('Đã cập nhật số liệu báo cáo thành công vào Dashboard điều hành!');
  };

  const getFormatBadge = (type: string) => {
    switch (type) {
      case 'image':
        return <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-mono"><Image className="w-3.5 h-3.5" /> File Ảnh / Hóa đơn</span>;
      case 'pdf':
        return <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-mono"><FileText className="w-3.5 h-3.5" /> Tài liệu PDF</span>;
      case 'excel':
        return <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono"><FileSpreadsheet className="w-3.5 h-3.5" /> Bảng tính Excel</span>;
      case 'word':
        return <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-mono"><FileQuestion className="w-3.5 h-3.5" /> Bản tin Word / Text</span>;
      default:
        return <span className="text-[11px] text-slate-400">Tệp dữ liệu</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-cyan-400">CÔNG NGHỆ GEMINI MULTIMODAL 3.8 FLASH</span>
          <span aria-hidden="true">·</span>
          <span>Tự Động Hóa Xử Lý Báo Cáo Kinh Doanh Đa Định Dạng</span>
        </div>
        <h1 className="text-xl font-bold text-slate-100">
          Nạp & Chuyển Hóa Báo Cáo (Ảnh, PDF, Excel, Word) Thành Số Liệu Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Không cần nhập tay thủ công từng con số từ hóa đơn hay báo cáo giấy. Hệ thống tự động trích xuất các sản phẩm giấy tissue Watersilk, nhận diện số lượng, doanh số, phân loại kênh (GT, MT, HORECA) và khu vực địa lý.
        </p>
      </div>

      {/* Preset 1-Click Samples Strip */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Thử nghiệm nhanh với 4 mẫu báo cáo thực tế Watersilk:
          </span>
          <span className="text-[11px] text-slate-400">Bấm 1 chạm để nạp mẫu</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="text-left p-3 rounded-lg border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  {getFormatBadge(sample.type)}
                  <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono">Nạp mẫu ➔</span>
                </div>
                <div className="text-xs font-bold text-slate-200 line-clamp-1">{sample.name}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{sample.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload & Configuration Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
        <h2 className="text-sm font-bold text-slate-200">
          Tải Lên Hoặc Kéo Thả Tệp Báo Cáo Thực Tế
        </h2>

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-950/40 group flex flex-col items-center justify-center space-y-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".jpg,.jpeg,.png,.webp,.pdf,.xlsx,.xls,.csv,.docx,.doc,.txt"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-cyan-950/50 flex items-center justify-center transition-colors">
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">
              {uploadedFileName ? (
                <span className="text-cyan-300 font-mono">{uploadedFileName}</span>
              ) : (
                'Nhấn vào đây để tải lên tệp báo cáo'
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hỗ trợ: File ảnh chụp (.JPG, .PNG), Tài liệu .PDF, Bảng tính .XLSX / .CSV, Bản tin .DOCX
            </p>
          </div>
        </div>

        {/* Selected File Details & Manual Context */}
        {uploadedFileName && (
          <div className="p-4 rounded-lg bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tệp đang chọn: <strong className="text-slate-200 font-mono">{uploadedFileName}</strong></span>
              {getFormatBadge(uploadedFileType)}
            </div>

            {/* Image Attachments Thumbnail preview if sample */}
            {sampleAttachmentUrls && sampleAttachmentUrls.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-700/60">
                <span className="text-[11px] font-semibold text-cyan-300">
                  Hình ảnh báo cáo đính kèm ({sampleAttachmentUrls.length} ảnh):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleAttachmentUrls.map((url, i) => (
                    <div key={i} className="rounded border border-slate-700 overflow-hidden bg-black/40 p-1">
                      <img
                        src={url}
                        alt={`Ảnh đính kèm ${i + 1}`}
                        className="w-full h-28 object-contain rounded"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Notes for AI */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">
                Ghi chú thêm cho AI (Ví dụ: &ldquo;Báo cáo của NPP Hải Phòng tuần 43&rdquo;, &ldquo;Chiết khấu thêm 3%&rdquo;...):
              </label>
              <input
                type="text"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                placeholder="Nhập ghi chú hoặc để trống để AI tự động nhận diện..."
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {fileTextContent && (
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-slate-400">Nội dung văn bản trích xuất:</span>
                <pre className="p-3 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap font-mono">
                  {fileTextContent}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Extraction Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartExtraction}
            disabled={isProcessing || !uploadedFileName}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isProcessing || !uploadedFileName
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white active:bg-cyan-700'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý qua AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Bắt Đầu Trích Xuất & Hệ Thống Hóa Số Liệu</span>
              </>
            )}
          </button>

          {isProcessing && (
            <span className="text-xs text-cyan-400 font-mono animate-pulse">
              {processingStatus}
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* AI Parsed Result Verification Section */}
      {parsedResult && (
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/90 p-5 space-y-5 ring-1 ring-cyan-500/20 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-slate-100">
                  Kết Quả Nhận Diện & Hệ Thống Hóa Từ Báo Cáo
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kiểm tra thông tin đã được chuẩn hóa trước khi sáp nhập vào cơ sở dữ liệu
              </p>
            </div>

            <button
              onClick={handleCommitParsedData}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <span>Duyệt & Đồng Bộ Vào Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400">Tiêu đề báo cáo</span>
              <div className="font-bold text-slate-100 truncate mt-0.5">{parsedResult.reportTitle}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400">Đơn vị phát hành / Kênh</span>
              <div className="font-bold text-cyan-300 truncate mt-0.5">{parsedResult.sourceEntity} ({parsedResult.channel})</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400">Khu vực địa lý</span>
              <div className="font-bold text-slate-100 mt-0.5">
                {parsedResult.region === 'NORTH' ? 'Miền Bắc' : parsedResult.region === 'SOUTH' ? 'Miền Nam' : 'Miền Trung'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-800">
              <span className="text-slate-400">Tổng doanh thu nhận diện</span>
              <div className="font-bold text-emerald-400 font-mono tabular-nums text-sm mt-0.5">
                {formatVND(parsedResult.totalRevenue)}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {parsedResult.executiveSummary && (
            <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-semibold text-cyan-400">Tóm tắt điều hành từ báo cáo:</span>
              <p className="text-slate-300 leading-relaxed">{parsedResult.executiveSummary}</p>
            </div>
          )}

          {/* Extracted Items Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Danh mục {parsedResult.items?.length || 0} mặt hàng Watersilk trích xuất:
            </span>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Tên Mặt Hàng</th>
                    <th className="py-2.5 px-3 font-semibold">Phân Loại</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Số Lượng</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Đơn Giá</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Thành Tiền (VNĐ)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Tăng MoM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {parsedResult.items?.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-medium text-slate-100">{item.skuName}</td>
                      <td className="py-2.5 px-3 text-slate-400">{item.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-200">
                        {formatNumber(item.quantity)} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                        {formatVND(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-cyan-300">
                        {formatVND(item.totalAmount)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-400">
                        {item.growthMoM ? formatPercent(item.growthMoM) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Processed Reports Archive / History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-200">
              Lịch Sử Báo Cáo Đã Đồng Bộ Vào Hệ Thống
            </h2>
            <p className="text-xs text-slate-400">
              Danh sách các báo cáo hàng ngày, hàng tuần, hàng tháng đã được kiểm chứng
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Tổng cộng: <strong className="text-slate-200">{reports.length}</strong> báo cáo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Tên Báo Cáo & Nguồn</th>
                <th className="py-2.5 px-3 font-medium">Định Dạng</th>
                <th className="py-2.5 px-3 font-medium">Kỳ Báo Cáo</th>
                <th className="py-2.5 px-3 font-medium">Kênh & Khu Vực</th>
                <th className="py-2.5 px-3 font-medium text-right">Doanh Số (VNĐ)</th>
                <th className="py-2.5 px-3 font-medium text-center">Trạng Thái</th>
                <th className="py-2.5 px-3 font-medium text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100">{rep.fileName}</div>
                    <div className="text-[11px] text-slate-400">{rep.sourceEntity}</div>
                  </td>
                  <td className="py-3 px-3">{getFormatBadge(rep.fileType)}</td>
                  <td className="py-3 px-3">
                    <span className="capitalize text-slate-300 font-mono">
                      {rep.reportPeriod === 'daily' ? 'Hàng ngày' : rep.reportPeriod === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
                    </span>
                    <div className="text-[10px] text-slate-500">{rep.uploadDate}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{rep.channel}</div>
                    <div className="text-[11px] text-slate-400">
                      {rep.region === 'NORTH' ? 'Miền Bắc' : rep.region === 'SOUTH' ? 'Miền Nam' : 'Miền Trung'}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-100">
                    {formatVND(rep.totalRevenue)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setViewingArchiveReport(rep)}
                      className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Xem chi tiết các mặt hàng"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archive Detail Inspection Modal */}
      {viewingArchiveReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">{viewingArchiveReport.fileName}</h3>
                <span className="text-xs text-slate-400">{viewingArchiveReport.sourceEntity} · {viewingArchiveReport.uploadDate}</span>
              </div>
              <button
                onClick={() => setViewingArchiveReport(null)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm rounded bg-slate-800"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/40 text-xs text-slate-300">
              <strong className="text-cyan-400">Tóm tắt điều hành: </strong>
              {viewingArchiveReport.executiveSummary}
            </div>

            {viewingArchiveReport.attachmentUrls && viewingArchiveReport.attachmentUrls.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-cyan-300">Ảnh báo cáo gốc đính kèm ({viewingArchiveReport.attachmentUrls.length} ảnh):</span>
                <div className="grid grid-cols-2 gap-3">
                  {viewingArchiveReport.attachmentUrls.map((url, idx) => (
                    <div key={idx} className="rounded border border-slate-700 bg-black/60 p-1 overflow-hidden">
                      <img
                        src={url}
                        alt={`Ảnh báo cáo ${idx + 1}`}
                        className="w-full h-44 object-contain rounded"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300">Chi tiết sản phẩm trong báo cáo:</span>
              <table className="w-full text-left text-xs border border-slate-800">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-2 px-3">Mặt hàng</th>
                    <th className="py-2 px-3 text-right">Số lượng</th>
                    <th className="py-2 px-3 text-right">Đơn giá</th>
                    <th className="py-2 px-3 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {viewingArchiveReport.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium text-slate-100">{it.skuName}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatNumber(it.quantity)} {it.unit}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatVND(it.unitPrice)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-cyan-300">{formatVND(it.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingArchiveReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
