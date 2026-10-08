import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  AlertTriangle,
  HeartPulse,
  Truck,
  Building2,
  ShieldAlert,
  Users,
  Radio,
  Clock,
  RefreshCw,
  ExternalLink,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { LiveWeatherData } from '../types/dashboard';

export type FontSizeLevel = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  weather: LiveWeatherData;
  onRefreshWeather: () => void;
  isLoadingWeather: boolean;
  onOpenSheetModal: () => void;
  sheetConnected: boolean;
  fontSize: FontSizeLevel;
  onChangeFontSize: (size: FontSizeLevel) => void;
  vulnerableCount?: number;
  criticalHospCount?: number;
  hospitalCount?: number;
  shphRiskCount?: number;
  shphCount?: number;
  autoSyncEnabled?: boolean;
  autoSyncSeconds?: number;
  countdownSeconds?: number;
  lastSyncTime?: string | null;
  isSyncing?: boolean;
  onToggleAutoSync?: () => void;
  onChangeAutoSyncInterval?: (seconds: number) => void;
  onTriggerInstantSync?: () => void;
}

export const HeaderBanner: React.FC<Props> = ({
  weather,
  onRefreshWeather,
  isLoadingWeather,
  onOpenSheetModal,
  sheetConnected,
  fontSize,
  onChangeFontSize,
  vulnerableCount = 14,
  criticalHospCount = 5,
  hospitalCount = 13,
  shphRiskCount = 6,
  shphCount = 8,
  autoSyncEnabled = true,
  autoSyncSeconds = 60,
  countdownSeconds = 60,
  lastSyncTime,
  isSyncing = false,
  onToggleAutoSync,
  onChangeAutoSyncInterval,
  onTriggerInstantSync,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('th-TH', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
          ' ' +
          now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ' น.'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#03271b] via-[#05442e] to-[#022b1f] border-b-2 border-emerald-500/70 text-white shadow-2xl relative overflow-hidden">
      {/* Background MOPH green glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-20 bg-teal-500/15 blur-3xl pointer-events-none" />

      {/* Top Bar: Official MOPH Branding & Live Controls */}
      <div className="px-4 lg:px-6 py-2 border-b border-emerald-600/40 bg-[#021f15]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {/* Thai Ministry of Public Health Emblems / Seal icon */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-[#024a30] border-2 border-emerald-300/80 flex items-center justify-center font-bold text-white shadow-md ring-2 ring-emerald-400/30">
              <span className="text-[11px] font-black tracking-tight text-white">สธ</span>
            </div>
            <div>
              <div className="font-bold text-emerald-100 flex items-center gap-1.5 tracking-wide">
                <span>กระทรวงสาธารณสุข</span>
                <span className="text-emerald-400 font-normal">|</span>
                <span className="text-emerald-200 font-semibold">สำนักงานสาธารณสุขจังหวัดนราธิวาส</span>
              </div>
              <div className="text-[10px] text-emerald-300/80 font-mono tracking-wider">
                MINISTRY OF PUBLIC HEALTH • NARATHIWAT PROVINCIAL PUBLIC HEALTH OFFICE
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-5 w-px bg-emerald-700/60" />

          {/* Slogan */}
          <div className="hidden lg:flex items-center gap-2 text-emerald-200/90 italic text-[11px]">
            <span className="text-emerald-300 font-medium">“ปกป้องชีวิต ลดความสูญเสีย ระบบสาธารณสุขยังเดินต่อได้ ชีวิตประชาชนต้องมาก่อน”</span>
          </div>
        </div>

        {/* Live Status Indicators & GAS status */}
        <div className="flex items-center gap-2.5">
          {/* GAS Sheet Connection Button */}
          <button
            onClick={onOpenSheetModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${
              sheetConnected
                ? 'bg-emerald-900/80 border-emerald-400/80 text-emerald-100 hover:bg-emerald-850 shadow-sm'
                : 'bg-amber-950/70 border-amber-500/70 text-amber-200 hover:bg-amber-900/70'
            }`}
            title="จัดการการเชื่อมโยง Google Sheet"
          >
            <span className={`w-2 h-2 rounded-full ${sheetConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-medium">GAS Sheet: 13KGqr...</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {/* Auto-Sync Multi-Interval Controls */}
          <div className="flex items-center bg-[#022419] border border-emerald-600/60 rounded-md p-0.5 text-[11px] gap-1 shadow-sm">
            {/* Toggle Button */}
            <button
              onClick={onToggleAutoSync}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                autoSyncEnabled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={autoSyncEnabled ? 'คลิกเพื่อปิด Auto Sync' : 'คลิกเพื่อเปิด Auto Sync'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoSyncEnabled ? 'bg-emerald-200 animate-pulse' : 'bg-slate-500'}`} />
              <span>{autoSyncEnabled ? 'Auto-Sync' : 'ซิงค์ปิด'}</span>
            </button>

            {/* Dropdown Interval: Auto ซิงค์ทุกๆ */}
            <div className="flex items-center gap-1 text-[10px] text-emerald-200 px-1 border-l border-emerald-700/60">
              <span className="hidden xl:inline text-emerald-300 font-medium">ซิงค์ทุก:</span>
              <select
                value={autoSyncSeconds}
                onChange={(e) => onChangeAutoSyncInterval && onChangeAutoSyncInterval(Number(e.target.value))}
                className="bg-[#031c13] text-emerald-300 border border-emerald-600/80 rounded px-1.5 py-0.5 text-[10px] font-mono focus:outline-none focus:border-emerald-400 cursor-pointer"
                title="เลือกความถี่ของ Auto Sync"
              >
                <option value={30}>30 วินาที</option>
                <option value={60}>1 นาที (แนะนำ)</option>
                <option value={120}>2 นาที</option>
                <option value={300}>5 นาที</option>
                <option value={600}>10 นาที</option>
                <option value={900}>15 นาที</option>
                <option value={1800}>30 นาที</option>
              </select>
            </div>

            {/* Countdown Badge */}
            {autoSyncEnabled && (
              <div
                className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/50 text-[10px] font-mono text-emerald-200"
                title={`กำลังนับถอยหลังเพื่อซิงค์ข้อมูลรอบถัดไปอัตโนมัติ (ทุกๆ ${autoSyncSeconds} วินาที)`}
              >
                <Clock className="w-2.5 h-2.5 text-emerald-300" />
                <span>
                  {isSyncing
                    ? 'กำลังซิงค์...'
                    : Math.floor(countdownSeconds / 60) > 0
                    ? `${Math.floor(countdownSeconds / 60)}:${String(countdownSeconds % 60).padStart(2, '0')}`
                    : `${countdownSeconds}s`}
                </span>
              </div>
            )}

            {/* Instant Sync Button */}
            <button
              onClick={onTriggerInstantSync}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] transition shadow disabled:opacity-50"
              title="ซิงค์และบันทึกข้อมูลขึ้น Sheet ทันที ไม่ต้องรอนับถอยหลัง"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">ซิงค์ทันที</span>
            </button>

            {lastSyncTime && (
              <span className="hidden 2xl:inline text-[9px] text-emerald-300/80 border-l border-emerald-700/60 pl-1.5">
                {lastSyncTime}
              </span>
            )}
          </div>

          {/* Font Size Adjuster */}
          <div className="flex items-center bg-[#022419] border border-emerald-700/60 rounded-md p-0.5 text-[11px] gap-0.5">
            <span className="flex items-center gap-1 px-1.5 text-emerald-300/80 font-medium text-[10px]">
              <Type className="w-3 h-3 text-emerald-400" />
              <span>ตัวอักษร:</span>
            </span>
            <button
              onClick={() => onChangeFontSize('sm')}
              title="ขนาดตัวอักษรเล็ก (14px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'sm'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              ก-
            </button>
            <button
              onClick={() => onChangeFontSize('md')}
              title="ขนาดตัวอักษรปกติ (16px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'md'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              ก ปกติ
            </button>
            <button
              onClick={() => onChangeFontSize('lg')}
              title="ขนาดตัวอักษรใหญ่ (18px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'lg'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              ก+
            </button>
            <button
              onClick={() => onChangeFontSize('xl')}
              title="ขนาดตัวอักษรใหญ่พิเศษ (20px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'xl'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              ก++
            </button>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-1.5 text-emerald-100 font-mono text-[11px] bg-[#022419] px-2.5 py-1 rounded-md border border-emerald-700/60">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{timeStr || 'กำลังโหลดเวลา...'}</span>
          </div>

          {/* Weather Refresh */}
          <button
            onClick={onRefreshWeather}
            disabled={isLoadingWeather}
            title="รีเฟรชข้อมูลสภาพอากาศและเซ็นเซอร์สด"
            className="p-1.5 rounded-md bg-[#022419] hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-100 to-white">
                จังหวัดนราธิวาส ศูนย์ปฏิบัติการภาวะฉุกเฉินทางสาธารณสุข
              </span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-800/80 border border-emerald-400/60 text-emerald-100 font-bold tracking-wide shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span>EOC สธ. • BCP CRISIS COMMAND</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
            กระทรวงสาธารณสุข ร่วมกับ สสจ.นราธิวาส ปกป้องชีวิต ลดความสูญเสีย ระบบสุขภาพยังเดินต่อได้ 13 อำเภอ
          </p>
        </div>

        {/* EOC Level Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-950/90 to-amber-950/80 border-2 border-emerald-400 shadow-lg shadow-emerald-950/60">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                ระดับสถานการณ์สาธารณสุข
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-200 tracking-wide flex items-center gap-1.5">
                <span>LEVEL 2 : PRE-ACTIVATE BCP</span>
                <span className="text-[11px] font-semibold text-emerald-100 bg-emerald-800/80 px-2 py-0.2 rounded">
                  (เฝ้าระวัง : เตรียมพร้อม)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Official KPI Cards (Direct match to Infographic) */}
      <div className="px-4 lg:px-6 pb-3.5">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {/* 1. ปริมาณฝน 24 ชม. */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">ฝนสะสม 24 ชม.</span>
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              {weather.rainfall24hMm} <span className="text-xs font-normal text-emerald-300/80">มม.</span>
            </div>
            <div className="text-[10px] text-amber-300 font-medium truncate">
              (+32% จากสัปดาห์ก่อน)
            </div>
          </div>

          {/* 2. คาดการณ์ฝน 72 ชม. */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">คาดการณ์ 72 ชม.</span>
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              {weather.rainfallForecast72hMm} <span className="text-xs font-normal text-emerald-300/80">มม.</span>
            </div>
            <div className="text-[10px] text-rose-300 font-medium truncate">
              (เสี่ยงเพิ่มขึ้น / ฝนหนักมาก)
            </div>
          </div>

          {/* 3. จุดเสี่ยงวิกฤต */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">จุดเสี่ยงวิกฤต</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-300 tracking-tight">
              6 <span className="text-xs font-normal text-emerald-300/80">จุด</span>
            </div>
            <div className="text-[10px] text-emerald-300/80 truncate">
              (น้ำท่วมซ้ำซาก / สะพาน)
            </div>
          </div>

          {/* 4. ถนนผ่านไม่ได้ */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">ถนนผ่านไม่ได้</span>
              <Truck className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-300 tracking-tight">
              11 <span className="text-xs font-normal text-emerald-300/80">จุด</span>
            </div>
            <div className="text-[10px] text-emerald-300/80 truncate">
              (หลัก 4 / สำรอง 7 จุด)
            </div>
          </div>

          {/* 5. โรงพยาบาลที่เฝ้าระวัง (สัมพันธ์/ตรงทะเบียน) */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">รพ. ที่เฝ้าระวัง</span>
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-300 tracking-tight font-mono">
              {criticalHospCount} <span className="text-xs font-normal text-emerald-300/80">/ {hospitalCount} แห่ง</span>
            </div>
            <div className="text-[10px] text-amber-300/90 truncate">
              (ขีดความสามารถลดลง/เฝ้าระวัง)
            </div>
          </div>

          {/* 6. รพ.สต. เสี่ยง (สัมพันธ์/ตรงทะเบียน) */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">รพ.สต. เสี่ยง</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-300 tracking-tight font-mono">
              {shphRiskCount} <span className="text-xs font-normal text-emerald-300/80">/ {shphCount} แห่ง</span>
            </div>
            <div className="text-[10px] text-emerald-300/80 truncate">
              (ด่านหน้าปฐมภูมิในทะเบียน)
            </div>
          </div>

          {/* 7. ผู้ป่วยเปราะบาง (สัมพันธ์/ตรงทะเบียน) */}
          <div className="bg-[#032419]/90 hover:bg-[#053224] border border-emerald-600/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-semibold text-emerald-200">ผู้ป่วยเปราะบาง</span>
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-300 tracking-tight font-mono">
              {vulnerableCount} <span className="text-xs font-normal text-emerald-300/80">ราย</span>
            </div>
            <div className="text-[10px] text-emerald-300/90 truncate">
              (ในทะเบียนกลุ่มเปราะบาง/EVAC)
            </div>
          </div>

          {/* 8. เสียชีวิตจากน้ำท่วมนี้ */}
          <div className="bg-gradient-to-b from-emerald-900/90 to-[#022419] border-2 border-emerald-400/80 rounded-lg p-2.5 transition shadow-sm">
            <div className="flex items-center justify-between text-emerald-200 text-[11px] mb-1">
              <span className="font-bold text-emerald-100">เสียชีวิตจากน้ำท่วม</span>
              <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="text-lg font-black text-emerald-200 tracking-tight font-mono">
              0 <span className="text-xs font-normal text-emerald-300">ราย</span>
            </div>
            <div className="text-[10px] text-emerald-300 font-extrabold tracking-wider truncate uppercase">
              ZERO PREVENTABLE DEATH
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
