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
} from 'lucide-react';
import { SheetConfigState, generateGasCodeSnippet, testSheetConnection } from '../services/apiService';
import { VulnerablePatient } from '../types/dashboard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfigState;
  onSaveConfig: (config: SheetConfigState) => void;
  patients: VulnerablePatient[];
  onPullFromSheet: () => Promise<void>;
  onPushToSheet: () => Promise<void>;
  isSyncing: boolean;
}

export const GoogleSheetSyncModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  patients,
  onPullFromSheet,
  onPushToSheet,
  isSyncing,
}) => {
  const [sheetIdInput, setSheetIdInput] = useState(config.sheetId);
  const [gasUrlInput, setGasUrlInput] = useState(config.gasWebAppUrl);
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

  const [activeTab, setActiveTab] = useState<'sync' | 'unlock' | 'code'>('sync');

  useEffect(() => {
    if (isOpen) {
      setSheetIdInput(config.sheetId);
      setGasUrlInput(config.gasWebAppUrl);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

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
    setMessage('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    setTimeout(() => setMessage(null), 3000);
  };

  const copyScript = () => {
    const code = generateGasCodeSnippet(sheetIdInput);
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  const downloadCodeGsFile = () => {
    const code = generateGasCodeSnippet(sheetIdInput);
    const blob = new Blob([code], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Code.gs';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-sky-700/60 rounded-2xl p-5 sm:p-6 w-full max-w-4xl shadow-2xl text-xs text-slate-200 my-6 flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>เชื่อมต่อ Google Sheets & Google Apps Script (GAS)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  PROD READY
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ฐานข้อมูลหลัก EOC สสจ.นราธิวาส (Sheet ID: <code className="text-cyan-300 font-mono">{sheetIdInput}</code>)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 mt-3 pb-2 shrink-0">
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'sync'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>1. สถานะ & ซิงค์ข้อมูล (Pull/Push)</span>
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
            <span>2. ปลดล็อคสิทธิ์การเข้าถึง</span>
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
            <span>3. ไฟล์ Code.gs ฉบับสมบูรณ์ 100%</span>
          </button>
        </div>

        {message && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Modal Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
          {/* TAB 1: SYNC & STATUS */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              {/* Status & Test Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ตรวจสอบสถานะการเชื่อมต่อชีตจริง (Connection Monitor)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      ซิงค์ล่าสุด: {config.lastSyncTime || 'ยังไม่มีรอบซิงค์'} | จำนวนผู้ป่วยเปราะบางในระบบ: {patients.length} ราย
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
                            <Lock className="w-3.5 h-3.5" /> ติดสิทธิ์ Private (ต้องปลดล็อค)
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

                {/* Primary Action Buttons: Pull & Push */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    คลิกเพื่อนำเข้าข้อมูลจริงจากชีต หรืออัปเดตข้อมูลผู้ป่วยทั้งหมดขึ้นชีต
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={onPullFromSheet}
                      disabled={isSyncing}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <Download className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                      <span>{isSyncing ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูล (Pull from Sheet)'}</span>
                    </button>

                    <button
                      onClick={onPushToSheet}
                      disabled={isSyncing}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
                    >
                      <Upload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
                      <span>{isSyncing ? 'กำลังบันทึก...' : 'ส่งข้อมูล (Push CRUD to Sheet)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ID & Web App URL Configuration Inputs */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="font-bold text-sky-300 text-xs">
                  การตั้งค่ารหัสชีตและ Web App Endpoint
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Google Sheet ID (ตามข้อกำหนด):
                    </label>
                    <input
                      type="text"
                      value={sheetIdInput}
                      onChange={(e) => setSheetIdInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
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
                      * นำ URL ที่ได้จากการ Deploy เป็น Web App (Who has access: Anyone) มาวางที่นี่เพื่อการเขียนกลับ (Two-way Push/Pull) แบบ 100%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNLOCK PERMISSIONS GUIDE */}
          {activeTab === 'unlock' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Unlock className="w-5 h-5" />
                  <span>คู่มือการปลดล็อคสิทธิ์การเข้าถึง (Permission Unlock Guide 100%)</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  เนื่องจาก Google Sheets มีระบบรักษาความปลอดภัยบัญชี เพื่อให้ระบบเว็บภายนอกสามารถอ่านและบันทึกข้อมูลได้อย่างราบรื่น กรุณาดำเนินการปลดล็อค 2 ขั้นตอนดังนี้:
                </p>

                {/* Step 1: Sheet Sharing */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">
                      1
                    </span>
                    <span>ปลดล็อคสิทธิ์บนตัว Google Sheet (สำหรับการอ่านข้อมูล)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-2 leading-relaxed">
                    <li>เปิด Google Sheet (ID: <code className="text-cyan-300 font-mono">{sheetIdInput}</code>)</li>
                    <li>คลิกปุ่ม <b>"แชร์ (Share)"</b> สีเขียว/น้ำเงิน ที่มุมขวาบน</li>
                    <li>ในหัวข้อ <b>"การเข้าถึงทั่วไป (General access)"</b> เปลี่ยนจาก <i>จำกัด (Restricted)</i> เป็น <b className="text-emerald-400">"ทุกคนที่มีลิงก์ (Anyone with the link)"</b></li>
                    <li>กำหนดสิทธิ์เป็น <b className="text-emerald-400">"ผู้แก้ไข (Editor)"</b> หรือ "ผู้มีสิทธิ์อ่าน (Viewer)"</li>
                    <li>กด <b>"เสร็จสิ้น (Done)"</b></li>
                  </ol>
                </div>

                {/* Step 2: Apps Script Web App Deployment */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">
                      2
                    </span>
                    <span>ปลดล็อคสิทธิ์ Web App ใน Google Apps Script (สำหรับการเขียน/บันทึก Two-way)</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-2 leading-relaxed">
                    <li>บน Google Sheet ไปที่เมนู <b>"ส่วนขยาย (Extensions)"</b> ➜ <b>"Apps Script"</b></li>
                    <li>วางโค้ดจากแท็บ <b>"3. ไฟล์ Code.gs"</b> ทั้งหมด แล้วกดบันทึก</li>
                    <li>กดปุ่ม <b>"ทำให้ใช้งานได้ (Deploy)"</b> สีน้ำเงิน ➜ <b>"การทำให้ใช้งานได้รายการใหม่ (New deployment)"</b></li>
                    <li>เลือกประเภทเฟือง ➜ <b>"เว็บแอป (Web app)"</b></li>
                    <li>
                      <b className="text-amber-300">จุดสำคัญที่สุดในการปลดล็อค:</b>
                      <ul className="list-disc list-inside pl-4 mt-0.5 space-y-0.5 text-slate-300">
                        <li>ดำเนินการในฐานะ (Execute as): <b className="text-white">"ฉัน (Me / บัญชีเจ้าของ)"</b></li>
                        <li>ผู้ที่มีสิทธิ์เข้าถึง (Who has access): <b className="text-emerald-400">"ทุกคน (Anyone)"</b> <span className="text-rose-400">(ห้ามเลือก Only myself)</span></li>
                      </ul>
                    </li>
                    <li>กด <b>"ทำให้ใช้งานได้ (Deploy)"</b></li>
                    <li>หากมีหน้าต่างขออนุญาตสิทธิ์ขึ้นมา ให้กด <b>"ตรวจสอบสิทธิ์ (Review permissions)"</b> ➜ เลือกบัญชี Google ➜ กด <b>"ขั้นสูง (Advanced)"</b> ➜ กด <b>"ไปที่ EOC Script (ไม่ปลอดภัย / Unsafe)"</b> ➜ กด <b>"อนุญาต (Allow)"</b></li>
                    <li>คัดลอก <b>Web App URL</b> นำมาใส่ในระบบ EOC Dashboard ช่องด้านล่างนี้ได้ทันที!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CODE.GS FULL SCRIPT */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-purple-400" />
                    <span>ไฟล์ Code.gs ฉบับสมบูรณ์ 100% (Production Grade)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    มีทั้งใน Root Directory (<code className="text-cyan-300">/Code.gs</code>) และสามารถดาวน์โหลดหรือคัดลอกได้ทันที
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
                <div className="font-semibold text-white">ฟีเจอร์เด่นใน Code.gs 100% ชุดนี้:</div>
                <div>✓ สร้างเมนูลัด <b>"🚨 EOC สสจ.นราธิวาส"</b> บนแถบเมนู Google Sheet อัตโนมัติ</div>
                <div>✓ ฟังก์ชัน <b>initSheets()</b> สร้างและจัดฟอร์แมต 4 แท็บมาตรฐาน (VulnerableRegistry, HospitalStatus, RoadCuts, EOC_Logs) พร้อมตรึงแถวบน</div>
                <div>✓ ฟังก์ชัน <b>seedInitialData()</b> นำเข้าข้อมูลเริ่มต้น 13 โรงพยาบาลครบถ้วน</div>
                <div>✓ รองรับ HTTP GET และ POST พร้อม Header ป้องกันปัญหา CORS ข้ามโดเมน 100%</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            ปิดหน้าต่าง
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
};
