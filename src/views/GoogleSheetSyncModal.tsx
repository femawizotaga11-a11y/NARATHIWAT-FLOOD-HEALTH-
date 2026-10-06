import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  Code2,
  Lock,
  Unlock,
  Key,
  CheckCircle2,
  Activity,
  FileCode,
  Database,
  Layers,
  Sparkles,
  Server,
} from 'lucide-react';
import {
  SheetConfigState,
  generateGasCodeSnippet,
  testSheetConnection,
  downloadFullDatabaseJson,
  DEFAULT_SHEET_ID,
  FullDatabase1To11,
} from '../services/apiService';
import {
  VulnerablePatient,
  ReferralRouteItem,
  BcpResourceItem,
  StaffTeamItem,
  HospitalStatus,
  ShphItem,
  CommunicationLayer,
  ReplenishmentPlan,
  WaterStation,
  DistrictRisk,
  RoadCutIncident,
} from '../types/dashboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfigState;
  onSaveConfig: (config: SheetConfigState) => void;
  patients: VulnerablePatient[];
  referrals: ReferralRouteItem[];
  bcp: BcpResourceItem[];
  staff: StaffTeamItem[];
  hospitals: HospitalStatus[];
  shph: ShphItem[];
  communications: CommunicationLayer[];
  replenishments: ReplenishmentPlan[];
  waterStations: WaterStation[];
  districts: DistrictRisk[];
  roadCuts: RoadCutIncident[];
  onBulkPush4To11: () => Promise<void>;
  onCreateFullDb1To11: () => Promise<void>;
  onPullFromSheet: () => Promise<void>;
  onPushToSheet: () => Promise<void>;
  isSyncing: boolean;
}

export const GoogleSheetSyncModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  patients = [],
  referrals = [],
  bcp = [],
  staff = [],
  hospitals = [],
  shph = [],
  communications = [],
  replenishments = [],
  waterStations = [],
  districts = [],
  roadCuts = [],
  onBulkPush4To11,
  onCreateFullDb1To11,
  onPullFromSheet,
  onPushToSheet,
  isSyncing,
}) => {
  const [sheetIdInput, setSheetIdInput] = useState(config?.sheetId || DEFAULT_SHEET_ID);
  const [gasUrlInput, setGasUrlInput] = useState(config?.gasWebAppUrl || '');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    sheetPublicAccessible: boolean;
    gasOnline: boolean;
    message: string;
  }>({
    tested: false,
    sheetPublicAccessible: false,
    gasOnline: false,
    message: '',
  });

  const [activeTab, setActiveTab] = useState<'sync' | 'createdb' | 'unlock' | 'code'>('sync');

  useEffect(() => {
    if (isOpen) {
      setSheetIdInput(config?.sheetId || DEFAULT_SHEET_ID);
      setGasUrlInput(config?.gasWebAppUrl || '');
    }
  }, [isOpen, config]);

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      const res = await testSheetConnection(sheetIdInput.trim(), gasUrlInput.trim());
      setTestResult({
        tested: true,
        sheetPublicAccessible: res.sheetPublicAccessible,
        gasOnline: res.gasOnline,
        message: res.message,
      });
    } catch (e) {
      setTestResult({
        tested: true,
        sheetPublicAccessible: false,
        gasOnline: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบการเชื่อมต่อ: ' + String(e),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      sheetId: sheetIdInput.trim(),
      gasWebAppUrl: gasUrlInput.trim(),
    });
    setMessage('บันทึกการตั้งค่ารหัส Sheet และ Web App URL เรียบร้อยแล้ว');
    setTimeout(() => setMessage(null), 3000);
  };

  const copyScript = () => {
    const code = generateGasCodeSnippet(sheetIdInput.trim());
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const downloadCodeGsFile = () => {
    const code = generateGasCodeSnippet(sheetIdInput.trim());
    const blob = new Blob([code], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Code.gs';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullDatabase = () => {
    const fullDb: FullDatabase1To11 = {
      waterStations,
      districts,
      roadCuts,
      patients,
      referrals,
      bcp,
      staff,
      hospitals,
      shph,
      communications,
      replenishments,
    };
    downloadFullDatabaseJson(fullDb);
  };

  // Total records in 4-11
  const total4To11Records =
    patients.length +
    referrals.length +
    bcp.length +
    staff.length +
    hospitals.length +
    shph.length +
    communications.length +
    replenishments.length;

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-sky-600/50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-300">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>จัดการและสร้างฐานข้อมูล Google Sheets (GAS)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                  ข้อ 1 - 11 เต็มรูปแบบ
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                รองรับการบันทึกข้อ 4-11 ลง Sheet, สร้างฐานข้อมูลใหม่ทั้งหมด 1-11, และไฟล์ Code.gs ปลดล็อคสิทธิ์
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 sm:px-5 pt-3 border-b border-slate-800/80 bg-slate-950/40 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'sync'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>1. บันทึกข้อ 4-11 ลง Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('createdb')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'createdb'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. สร้างฐานข้อมูลใหม่ 1-11</span>
          </button>

          <button
            onClick={() => setActiveTab('unlock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'unlock'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>3. ปลดล็อคสิทธิ์การเข้าถึง</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>4. โค้ด Code.gs ฉบับสมบูรณ์</span>
          </button>
        </div>

        {message && (
          <div className="mx-4 sm:mx-5 mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Modal Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
          {/* ======================================================== */}
          {/* TAB 1: BULK SYNC & SINGLE CRUD (ข้อ 4 - 11)              */}
          {/* ======================================================== */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              {/* Big Highlight Box: 1-Click Push All 4-11 */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/50 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 text-[10px] font-bold font-mono">
                      RECOMMENDED ACTION (ข้อ 1)
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span>นำข้อมูลในเมนู บันทึกใน Google Sheet ทั้งหมด (ข้อ 4 - ข้อ 11)</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      ส่งข้อมูลรวมทั้ง 8 เมนู (ผู้ป่วยเปราะบาง, เส้นทางส่งต่อ, BCP, บุคลากร, 13 รพ., รพ.สต., ระบบสื่อสาร, แผนนำเข้า) รวม {total4To11Records} รายการ
                    </p>
                  </div>

                  <button
                    onClick={onBulkPush4To11}
                    disabled={isSyncing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Upload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <span>{isSyncing ? 'กำลังบันทึกลง Sheet...' : '⚡ บันทึกข้อ 4-11 ลง Sheet ทั้งหมดทันที'}</span>
                  </button>
                </div>
              </div>

              {/* Status & Test Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>สถานะการเชื่อมต่อ Google Sheet ID: {sheetIdInput}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      รอบซิงค์ล่าสุด: {config.lastSyncTime || 'ยังไม่มีรอบซิงค์'} | จำนวนข้อมูลในระบบ: {total4To11Records} รายการ
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunTest}
                      disabled={isTesting}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}</span>
                    </button>

                    <a
                      href={`https://docs.google.com/spreadsheets/d/${sheetIdInput}/edit`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1 transition"
                    >
                      <span>เปิด Google Sheets</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    </a>
                  </div>
                </div>

                {/* Test Result Feedback */}
                {testResult.tested && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">สิทธิ์อ่านสาธารณะ:</span>
                        {testResult.sheetPublicAccessible ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ปลดล็อคแล้ว (พร้อมดึงข้อมูล)
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> ติดสิทธิ์ Private (ต้องปลดล็อคตามแท็บ 3)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">สถานะ Apps Script Web App:</span>
                        {testResult.gasOnline ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ออนไลน์ 100% (Two-way Read/Write)
                          </span>
                        ) : (
                          <span className="text-slate-400">ยังไม่พบ URL หรือยังไม่ Deploy</span>
                        )}
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300">{testResult.message}</div>
                  </div>
                )}

                {/* Single Pull & Push Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    ดึงหรืออัปเดตข้อมูลผู้ป่วยเปราะบางเฉพาะแท็บ:
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPullFromSheet}
                      disabled={isSyncing}
                      className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <Download className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                      <span>{isSyncing ? 'กำลังดึง...' : 'ดึงผู้ป่วยเปราะบาง (Pull)'}</span>
                    </button>

                    <button
                      onClick={onPushToSheet}
                      disabled={isSyncing}
                      className="px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow transition flex items-center gap-2"
                    >
                      <Upload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                      <span>ส่งเฉพาะผู้ป่วยเปราะบาง (Push)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 8-Sheet Database Inventory Breakdown (ข้อ 4 - 11) */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-sky-200 text-xs flex items-center justify-between">
                  <span>สถานะความพร้อมของทั้ง 8 แท็บชีต (ข้อ 4 - 11):</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    CRUD 100% Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 4: ผู้ป่วยเปราะบาง</span>
                    <span className="font-mono text-cyan-300 font-bold">VulnerableRegistry</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{patients.length} รายการ</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 5: ส่งต่อ & OPOH</span>
                    <span className="font-mono text-cyan-300 font-bold">ReferralRoutes</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{referrals.length} เส้นทาง</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 6: ทรัพยากร BCP</span>
                    <span className="font-mono text-cyan-300 font-bold">BcpResources</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{bcp.length} รายการ</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 7: Staff & บุคลากร</span>
                    <span className="font-mono text-cyan-300 font-bold">StaffRoster</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{staff.length} ทีม</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 8: 13 รพ. & RTO</span>
                    <span className="font-mono text-cyan-300 font-bold">HospitalStatus</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{hospitals.length} โรงพยาบาล</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 9: 111 รพ.สต.</span>
                    <span className="font-mono text-cyan-300 font-bold">ShphNetwork</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{shph.length} แห่ง</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 10: สื่อสาร 4 ระดับ</span>
                    <span className="font-mono text-cyan-300 font-bold">CommunicationLayers</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{communications.length} ระดับ</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
                    <span className="text-slate-400 text-[10px]">ข้อ 11: นำเข้าเมื่อเกิน RTO</span>
                    <span className="font-mono text-cyan-300 font-bold">ReplenishmentPlans</span>
                    <span className="text-[10px] text-emerald-400 mt-1">{replenishments.length} แผน</span>
                  </div>
                </div>
              </div>

              {/* ID & Web App URL Configuration Inputs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-sky-300 text-xs flex items-center justify-between">
                  <span>การตั้งค่ารหัสชีตและ Web App Endpoint</span>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition"
                  >
                    บันทึกการตั้งค่า
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1 text-xs">
                      Google Sheet ID (ตามข้อกำหนดของระบบ):
                    </label>
                    <input
                      type="text"
                      value={sheetIdInput}
                      onChange={(e) => setSheetIdInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 text-xs">
                      Google Apps Script (GAS) Web App Deployment URL:
                    </label>
                    <input
                      type="text"
                      value={gasUrlInput}
                      onChange={(e) => setGasUrlInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      * เมื่อ Deploy ใน Apps Script เป็น Web App (Who has access: Anyone) ให้นำ URL มาวางเพื่อเปิดการบันทึกกลับลงชีตแบบ 100%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CREATE FULL DATABASE 1-11 (ข้อ 2)                 */}
          {/* ======================================================== */}
          {activeTab === 'createdb' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/50 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-[10px] font-bold font-mono">
                      REQUIREMENT 2: สร้างฐานข้อมูลใหม่ทั้งหมด (1-11)
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>สร้างโครงสร้างและข้อมูลฐานข้อมูลใหม่ครบทั้ง 11 หมวดหมู่</span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      ระบบจะสร้างแท็บชีตทั้ง 11 แท็บ + บันทึกประวัติ (EOC_Logs) พร้อมลงฟอร์แมตหัวตารางและข้อมูลตั้งต้นทางการ
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadFullDatabase}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ดาวน์โหลด Full DB (JSON)</span>
                    </button>

                    <button
                      onClick={onCreateFullDb1To11}
                      disabled={isSyncing}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs shadow-xl transition flex items-center gap-2"
                    >
                      <Database className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'กำลังสร้างฐานข้อมูล...' : '⚡ สั่งสร้างฐานข้อมูลบน Sheet ทันที'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Full Schema Table 1-11 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>โครงสร้าง 11 แท็บฐานข้อมูลมาตรฐาน EOC สสจ.นราธิวาส:</span>
                  <span className="text-[10px] text-cyan-400 font-mono">11 Datasets + 1 Audit Log</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">1. WaterStations_Gistda:</b>
                      <span className="text-slate-400 ml-2">สถานีวัดน้ำลุ่มน้ำโก-ลก, บางนรา, สายบุรี (ข้อ 1)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{waterStations.length} สถานี</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">2. DistrictRisk:</b>
                      <span className="text-slate-400 ml-2">ความเสี่ยง 13 อำเภอ คาดการณ์ 6/12/24 ชม. (ข้อ 2)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{districts.length} อำเภอ</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">3. RoadCutIncidents:</b>
                      <span className="text-slate-400 ml-2">เส้นทางตัดขาด 3 ปีย้อนหลัง & เส้นทางเลี่ยง (ข้อ 3)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{roadCuts.length} จุด</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">4. VulnerableRegistry:</b>
                      <span className="text-slate-400 ml-2">ทะเบียนผู้ป่วยเปราะบาง 7 กลุ่ม & EVAC (ข้อ 4)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{patients.length} ราย</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">5. ReferralRoutes:</b>
                      <span className="text-slate-400 ml-2">แผนส่งต่อ Dynamic Referral & OPOH ทางเลี่ยง (ข้อ 5)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{referrals.length} เส้นทาง</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">6. BcpResources:</b>
                      <span className="text-slate-400 ml-2">ทรัพยากร BCP สำรองภาพรวมจังหวัด 9 ด้าน (ข้อ 6)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{bcp.length} หมวด</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">7. StaffRoster:</b>
                      <span className="text-slate-400 ml-2">กำลังคนบุคลากรทางการแพทย์ ทีม A-B-C (ข้อ 7)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{staff.length} ทีม</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">8. HospitalStatus:</b>
                      <span className="text-slate-400 ml-2">ทรัพยากร & Safe Operating RTO 13 รพ. (ข้อ 8)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{hospitals.length} รพ.</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">9. ShphNetwork:</b>
                      <span className="text-slate-400 ml-2">เครือข่าย 111 รพ.สต. ปฐมภูมิด่านหน้า (ข้อ 9)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{shph.length} แห่ง</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">10. CommunicationLayers:</b>
                      <span className="text-slate-400 ml-2">ระบบสื่อสารสำรอง 4 ระดับ & หลักฐานจริง (ข้อ 10)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{communications.length} ระดับ</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <b className="text-white">11. ReplenishmentPlans:</b>
                      <span className="text-slate-400 ml-2">แผนนำเข้าจังหวัดเมื่อเกิน RTO หรือสำรองหมด (ข้อ 11)</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-semibold">{replenishments.length} แผน</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: UNLOCK PERMISSIONS GUIDE                          */}
          {/* ======================================================== */}
          {activeTab === 'unlock' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Unlock className="w-5 h-5" />
                  <span>คู่มือการปลดล็อคสิทธิ์การเข้าถึง (Permission Unlock Guide 100%)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  เพื่อให้ Google Sheet (ID: <code className="text-cyan-300 font-mono">{sheetIdInput}</code>) สามารถรับการบันทึก Two-way CRUD จากเว็บได้อย่างอิสระ โปรดทำ 2 ขั้นตอนนี้:
                </p>

                {/* Step 1: Sheet Sharing */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">
                      1
                    </span>
                    <span>ปลดล็อคสิทธิ์บน Google Sheet ให้ทุกคนที่มีลิงก์เข้าถึงได้</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-2 leading-relaxed">
                    <li>เปิด Google Sheet (ID: <code className="text-cyan-300 font-mono">{sheetIdInput}</code>)</li>
                    <li>คลิกปุ่ม <b>"แชร์ (Share)"</b> สีเขียว/น้ำเงิน ที่มุมบนขวา</li>
                    <li>ในหัวข้อ <b>"การเข้าถึงทั่วไป (General access)"</b> เปลี่ยนจาก <i>จำกัด (Restricted)</i> เป็น <b className="text-emerald-400">"ทุกคนที่มีลิงก์ (Anyone with the link)"</b></li>
                    <li>กำหนดสิทธิ์เป็น <b className="text-emerald-400">"ผู้แก้ไข (Editor)"</b></li>
                    <li>กด <b>"เสร็จสิ้น (Done)"</b></li>
                  </ol>
                </div>

                {/* Step 2: Apps Script Web App Deployment */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">
                      2
                    </span>
                    <span>Deploy เป็น Web App เพื่อรองรับการบันทึกข้อมูล (Write/Update)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-2 leading-relaxed">
                    <li>บนชีต ไปที่เมนู <b>"ส่วนขยาย (Extensions)"</b> ➜ <b>"Apps Script"</b></li>
                    <li>ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดจากแท็บ <b>"4. โค้ด Code.gs"</b> ลงไปแทน แล้วกด Save</li>
                    <li>กดปุ่ม <b>"ทำให้ใช้งานได้ (Deploy)"</b> ➜ <b>"การทำให้ใช้งานได้รายการใหม่ (New deployment)"</b></li>
                    <li>เลือกประเภทเป็น <b>"เว็บแอป (Web app)"</b></li>
                    <li>
                      <b className="text-amber-300">ตั้งค่าสำคัญ 2 จุด:</b>
                      <ul className="list-disc list-inside pl-4 mt-0.5 space-y-0.5 text-slate-300">
                        <li>ดำเนินการในฐานะ (Execute as): <b className="text-white">"ฉัน (Me)"</b></li>
                        <li>ผู้ที่มีสิทธิ์เข้าถึง (Who has access): <b className="text-emerald-400">"ทุกคน (Anyone)"</b> <span className="text-rose-400">(สำคัญที่สุด ห้ามเลือก Only myself)</span></li>
                      </ul>
                    </li>
                    <li>กด <b>"ทำให้ใช้งานได้ (Deploy)"</b> ➜ กดยอมรับสิทธิ์ (Authorize access) ➜ Advanced ➜ Go to Script (Unsafe) ➜ Allow</li>
                    <li>คัดลอก <b>Web App URL</b> นำมาวางในช่อง <i>Google Apps Script (GAS) Web App Deployment URL</i> ได้ทันที!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: CODE.GS FULL SCRIPT                               */}
          {/* ======================================================== */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>ไฟล์ Code.gs ฉบับสมบูรณ์ 100% (รองรับข้อ 1-11 และ Bulk Sync 4-11)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    มีไฟล์ต้นฉบับอยู่ที่โฟลเดอร์ราก (<code className="text-cyan-300">/Code.gs</code>) สามารถดาวน์โหลดหรือคัดลอกได้ทันที
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadCodeGsFile}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด Code.gs</span>
                  </button>

                  <button
                    onClick={copyScript}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      copiedSnippet
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                    }`}
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ดทั้งหมด'}</span>
                  </button>
                </div>
              </div>

              {/* Code display block */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-80 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                <pre>{generateGasCodeSnippet(sheetIdInput)}</pre>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-sky-900/40 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-white">คำสั่งในเมนูลัดบน Google Sheet เมื่อติดตั้ง Code.gs:</div>
                <div>✓ <b>"⚡ สร้างฐานข้อมูลใหม่ทั้งหมด 1-11"</b> สร้างและขึ้นตาราง 11 แท็บอัตโนมัติ</div>
                <div>✓ <b>"📥 นำเข้าข้อมูลเริ่มต้นข้อ 4-11"</b> นำเข้าข้อมูลจริงของ สสจ.นราธิวาส</div>
                <div>✓ <b>"📊 ล้างและรีเซ็ตโครงสร้างตาราง"</b> จัดฟอร์แมตหัวตาราง สี และตรึงแถว</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>Google Sheet ID: {sheetIdInput}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
