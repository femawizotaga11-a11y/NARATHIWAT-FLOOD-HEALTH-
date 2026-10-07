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
}

export const HeaderBanner: React.FC<Props> = ({
  weather,
  onRefreshWeather,
  isLoadingWeather,
  onOpenSheetModal,
  sheetConnected,
  fontSize,
  onChangeFontSize,
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
    <header className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-sky-800/40 text-white shadow-xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-20 bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-16 bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Top Bar: Official Branding & Live Time */}
      <div className="px-4 lg:px-6 py-2.5 border-b border-sky-800/30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {/* Thai Ministry Emblems / Seal icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700/80 border border-emerald-400/50 flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-emerald-500/20">
              <span className="text-[11px] font-serif">สธ</span>
            </div>
            <div>
              <div className="font-semibold text-sky-200 tracking-wide">
                สำนักงานสาธารณสุขจังหวัดนราธิวาส
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                NARATHIWAT PROVINCIAL PUBLIC HEALTH OFFICE
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-5 w-px bg-slate-700" />

          {/* Slogan */}
          <div className="hidden md:flex items-center gap-2 text-slate-300 italic text-[11px]">
            <span className="text-cyan-400 font-medium">“เตรียมก่อน ลดผลกระทบ ช่วยได้เร็วกว่า ปลอดภัยกว่า ชีวิตประชาชนต้องมาก่อน”</span>
          </div>
        </div>

        {/* Live Status Indicators & GAS status */}
        <div className="flex items-center gap-3">
          {/* GAS Sheet Connection Button */}
          <button
            onClick={onOpenSheetModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium transition-all ${
              sheetConnected
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-300 hover:bg-amber-900/60'
            }`}
            title="จัดการการเชื่อมโยง Google Sheet"
          >
            <span className={`w-2 h-2 rounded-full ${sheetConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>GAS Sheet: 13KGqr...</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
          </button>

          {/* Font Size Adjuster (Requirement 1: มีปุ่มปรับขนาดตัวอักษร) */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-md p-0.5 text-[11px] gap-0.5">
            <span className="flex items-center gap-1 px-1.5 text-slate-400 font-medium text-[10px]">
              <Type className="w-3 h-3 text-cyan-400" />
              <span>ตัวอักษร:</span>
            </span>
            <button
              onClick={() => onChangeFontSize('sm')}
              title="ขนาดตัวอักษรเล็ก (14px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'sm'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              ก-
            </button>
            <button
              onClick={() => onChangeFontSize('md')}
              title="ขนาดตัวอักษรปกติ (16px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'md'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              ก ปกติ
            </button>
            <button
              onClick={() => onChangeFontSize('lg')}
              title="ขนาดตัวอักษรใหญ่ (18px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'lg'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              ก+
            </button>
            <button
              onClick={() => onChangeFontSize('xl')}
              title="ขนาดตัวอักษรใหญ่พิเศษ (20px)"
              className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold transition ${
                fontSize === 'xl'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              ก++
            </button>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeStr || 'กำลังโหลดเวลา...'}</span>
          </div>

          {/* Weather Refresh */}
          <button
            onClick={onRefreshWeather}
            disabled={isLoadingWeather}
            title="รีเฟรชข้อมูลสภาพอากาศและเซ็นเซอร์สด"
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Command Header */}
      <div className="px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-white">
                จังหวัดนราธิวาส เตรียมพร้อมก่อนน้ำท่วม
              </span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-900/60 border border-cyan-400/40 text-cyan-200 font-medium tracking-wide">
              EOC EMERGENCY HEALTH COMMAND
            </span>
          </div>
          <p className="text-xs sm:text-sm text-sky-200/90 font-normal mt-0.5">
            ปกป้องชีวิต ลดความสูญเสีย ระบบสุขภาพยังเดินต่อได้ (BCP Health Crisis Monitoring)
          </p>
        </div>

        {/* EOC Level Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-950/80 to-amber-900/60 border-2 border-amber-500/80 shadow-lg shadow-amber-950/40">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80">
                ระดับสถานการณ์จังหวัด
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-amber-200 tracking-wide flex items-center gap-1.5">
                <span>LEVEL 2 : PRE-ACTIVATE BCP</span>
                <span className="text-[11px] font-normal text-amber-100 bg-amber-800/60 px-1.5 py-0.2 rounded">
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
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">ฝนสะสม 24 ชม.</span>
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              {weather.rainfall24hMm} <span className="text-xs font-normal text-slate-400">มม.</span>
            </div>
            <div className="text-[10px] text-amber-400 font-medium truncate">
              (+32% จากสัปดาห์ก่อน)
            </div>
          </div>

          {/* 2. คาดการณ์ฝน 72 ชม. */}
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">คาดการณ์ 72 ชม.</span>
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              {weather.rainfallForecast72hMm} <span className="text-xs font-normal text-slate-400">มม.</span>
            </div>
            <div className="text-[10px] text-rose-400 font-medium truncate">
              (เสี่ยงเพิ่มขึ้น / ฝนหนักมาก)
            </div>
          </div>

          {/* 3. จุดเสี่ยงวิกฤต */}
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">จุดเสี่ยงวิกฤต</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400 tracking-tight">
              6 <span className="text-xs font-normal text-slate-400">จุด</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              (น้ำท่วมซ้ำซาก / สะพาน)
            </div>
          </div>

          {/* 4. ถนนผ่านไม่ได้ */}
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">ถนนผ่านไม่ได้</span>
              <Truck className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-400 tracking-tight">
              11 <span className="text-xs font-normal text-slate-400">จุด</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              (หลัก 4 / สำรอง 7 จุด)
            </div>
          </div>

          {/* 5. โรงพยาบาลที่เฝ้าระวัง */}
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">รพ. ที่เฝ้าระวัง</span>
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-300 tracking-tight">
              5 <span className="text-xs font-normal text-slate-400">/ 13 แห่ง</span>
            </div>
            <div className="text-[10px] text-amber-400/90 truncate">
              (ขีดความสามารถลดลง)
            </div>
          </div>

          {/* 6. รพ.สต. เสี่ยง */}
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">รพ.สต. เสี่ยง</span>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-bold text-rose-300 tracking-tight">
              18 <span className="text-xs font-normal text-slate-400">แห่ง</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              (จากทั้งหมด 111 แห่ง)
            </div>
          </div>

          {/* 7. ผู้ป่วยเปราะบาง */}
          <div className="bg-slate-900/80 hover:bg-slate-850 border border-sky-800/40 rounded-lg p-2.5 transition">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-medium text-slate-300">ผู้ป่วยเปราะบาง</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-cyan-300 tracking-tight">
              1,284 <span className="text-xs font-normal text-slate-400">ราย</span>
            </div>
            <div className="text-[10px] text-cyan-400/90 truncate">
              (ต้องดูแลเป็นพิเศษ/EVAC)
            </div>
          </div>

          {/* 8. เสียชีวิตจากน้ำท่วมนี้ */}
          <div className="bg-gradient-to-b from-emerald-950/90 to-slate-900 border border-emerald-500/50 rounded-lg p-2.5 transition shadow-sm">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] mb-1">
              <span className="font-medium">เสียชีวิตจากน้ำท่วม</span>
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-300 tracking-tight">
              0 <span className="text-xs font-normal text-slate-300">ราย</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-extrabold tracking-wider truncate uppercase">
              ZERO PREVENTABLE DEATH
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
