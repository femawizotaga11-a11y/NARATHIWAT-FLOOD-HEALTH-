import React from 'react';
import { COMMUNICATION_LAYERS } from '../data/mockEocData';
import {
  Radio,
  WifiOff,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Layers,
  ArrowDown,
  CheckCircle2,
  Signal,
  Satellite,
} from 'lucide-react';

export const CommunicationFailoverView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
              ข้อ 9
            </span>
            <h2 className="text-base font-bold text-white">
              ความพร้อมระบบสื่อสารและแผนสำรอง 4 ระดับ (Failover Protocol & หลักฐานทางราชการ)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ลำดับขั้นตอนการสื่อสารฉุกเฉิน: <b>"หากล่ม ใช้อะไร ➔ หากล่มอีก ใช้อะไร ➔ หากล่มถึงที่สุด ใช้อะไร"</b> พร้อมเอกสารหลักฐานจริง
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-purple-950/80 border border-purple-500/60 px-3 py-1.5 rounded-lg text-purple-300 font-bold flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>เครือข่ายสื่อสารฉุกเฉิน: สแตนด์บาย 100%</span>
          </div>
        </div>
      </div>

      {/* 4-Tier Cascade Protocol Visualization */}
      <div className="space-y-4">
        {COMMUNICATION_LAYERS.map((layer, idx) => {
          const isPrimary = layer.level === 1;
          const isHighestFailover = layer.level === 4;

          return (
            <div key={layer.level} className="relative">
              {/* Downward flow connector arrow between steps */}
              {idx > 0 && (
                <div className="flex justify-center -my-2.5 relative z-10">
                  <div className="bg-slate-800 border border-slate-700 px-3 py-0.5 rounded-full text-[10px] text-amber-300 font-bold flex items-center gap-1 shadow">
                    <ArrowDown className="w-3 h-3 text-amber-400" />
                    <span>หากระดับ {layer.level - 1} ล่ม ➔ สลับใช้ระดับ {layer.level} ทันที</span>
                  </div>
                </div>
              )}

              <div
                className={`p-4 rounded-xl border shadow-xl transition-all ${
                  isPrimary
                    ? 'bg-slate-900/95 border-emerald-500/50'
                    : layer.level === 2
                    ? 'bg-slate-900/90 border-cyan-500/50'
                    : layer.level === 3
                    ? 'bg-slate-900/90 border-amber-500/50'
                    : 'bg-slate-900/90 border-purple-500/60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow font-mono text-sm ${
                        layer.level === 1
                          ? 'bg-emerald-600'
                          : layer.level === 2
                          ? 'bg-cyan-600'
                          : layer.level === 3
                          ? 'bg-amber-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      L{layer.level}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>ระดับที่ {layer.level}: {layer.name}</span>
                        {isPrimary && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                            หลัก (ใช้งานอยู่)
                          </span>
                        )}
                        {isHighestFailover && (
                          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded font-bold">
                            ด่านสุดท้าย (Extreme Fallback)
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-cyan-300 font-medium mt-0.5">
                        {layer.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono">
                      {layer.status}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-0.5">ช่องทางหลัก & ความถี่</div>
                    <div className="font-semibold text-white text-[11px] leading-snug">
                      {layer.primaryChannel}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-0.5">อุปกรณ์ประจำการ</div>
                    <div className="font-semibold text-slate-200 text-[11px] leading-snug">
                      {layer.equipment}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-0.5">เงื่อนไขการสลับมาใช้ (Failover Trigger)</div>
                    <div className="font-semibold text-amber-300 text-[11px] leading-snug">
                      {layer.failoverCondition}
                    </div>
                  </div>
                </div>

                {/* Official Evidence & Responsible Officer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-[11px]">
                      <b>หลักฐานทางราชการ:</b> {layer.evidenceDocument}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    ผู้รับผิดชอบ: <span className="text-slate-200">{layer.responsibleOfficer}</span> ({layer.contact})
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
