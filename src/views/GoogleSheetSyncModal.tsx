import React, { useState } from 'react';
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
} from 'lucide-react';
import { SheetConfigState, generateGasCodeSnippet } from '../services/apiService';
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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-sky-700/60 rounded-2xl p-6 w-full max-w-3xl shadow-2xl text-xs text-slate-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>จัดการการเชื่อมต่อ Google Sheets & Apps Script (GAS)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                  LIVE CRUD SYNC
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                เชื่อมโยงฐานข้อมูลกับ Google Sheets ID: <b>{sheetIdInput}</b>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {message && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Sync Actions Bar */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-sky-900/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-xs">สถานะการเชื่อมต่อชีต</div>
              <div className="text-[11px] text-slate-400">
                ซิงค์ล่าสุด: {config.lastSyncTime || 'ยังไม่มีการซิงค์รอบล่าสุด'} | ข้อมูลในระบบปัจจุบัน: {patients.length} รายการ
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPullFromSheet}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดึงข้อมูลจากชีต (Pull)</span>
              </button>

              <button
                onClick={onPushToSheet}
                disabled={isSyncing}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ส่งข้อมูลขึ้นชีต (Push CRUD)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Inputs */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Google Sheet ID (ตามข้อกำหนดของผู้ใช้):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sheetIdInput}
                onChange={(e) => setSheetIdInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:border-cyan-500 outline-none"
              />
              <a
                href={`https://docs.google.com/spreadsheets/d/${sheetIdInput}/edit`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 text-xs shrink-0"
              >
                <span>เปิดชีตในเบราว์เซอร์</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 text-xs">
              Google Apps Script (GAS) Web App Deployment URL:
            </label>
            <input
              type="text"
              value={gasUrlInput}
              onChange={(e) => setGasUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec (หากมี ให้วางที่นี่เพื่อการเขียนกลับอัตโนมัติ)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:border-cyan-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              * หากยังไม่ได้สร้าง Web App URL ระบบจะบันทึกข้อมูลอย่างปลอดภัยในเครื่องและดาวน์โหลด CSV สำหรับอัปโหลดเข้าชีตได้ทันที
            </p>
          </div>
        </div>

        {/* 1-Click GAS Script Generator */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sky-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>โค้ด Google Apps Script สำเร็จรูป (พร้อมใช้งานทันที)</span>
            </span>

            <button
              onClick={copyScript}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                copiedSnippet
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'คัดลอกเรียบร้อย!' : 'คัดลอกโค้ด GAS'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1">
            <div>
              <b>วิธีเปิดใช้งานการเชื่อมต่อกับชีต:</b>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-300 pl-1">
              <li>เปิด Google Sheet ➜ ไปที่เมนู <b>ส่วนขยาย (Extensions)</b> ➜ <b>Apps Script</b></li>
              <li>ลบโค้ดเดิม แล้ววางโค้ดที่คัดลอกจากปุ่มด้านบนนี้</li>
              <li>คลิก <b>ทำให้ใช้งานได้ (Deploy)</b> ➜ <b>การทำให้ใช้งานได้รายการใหม่ (New deployment)</b></li>
              <li>เลือกประเภท: <b>เว็บแอป (Web app)</b> ➜ ผู้มีสิทธิ์เข้าถึง: <b>ทุกคน (Anyone)</b></li>
              <li>คัดลอก URL ของเว็บแอปที่ได้ มาวางในช่อง GAS Web App URL ด้านบนนี้</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
          >
            ปิดหน้าต่าง
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow"
          >
            บันทึกการตั้งค่า
          </button>
        </div>
      </div>
    </div>
  );
};
