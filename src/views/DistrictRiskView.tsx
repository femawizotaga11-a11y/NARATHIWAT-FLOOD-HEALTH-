import React from 'react';
import { DistrictRisk } from '../types/dashboard';
import { MapPin, TrendingUp, TrendingDown, Minus, AlertTriangle, Users, CloudRain } from 'lucide-react';

interface Props {
  districts: DistrictRisk[];
}

export const DistrictRiskView: React.FC<Props> = ({ districts }) => {
  const criticalCount = districts.filter((d) => d.level === 'critical').length;
  const highCount = districts.filter((d) => d.level === 'high').length;
  const warningCount = districts.filter((d) => d.level === 'warning').length;
  const normalCount = districts.filter((d) => d.level === 'normal').length;

  const renderTrend = (trend: 'up' | 'stable' | 'down') => {
    if (trend === 'up') {
      return (
        <span className="flex items-center gap-1 text-rose-400 font-bold font-mono">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>↑↑ เสี่ยงเพิ่ม</span>
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 font-bold font-mono">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>↓↓ ลดลง</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-slate-400 font-mono">
        <Minus className="w-3.5 h-3.5" />
        <span>→ ทรงตัว</span>
      </span>
    );
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded font-bold text-xs bg-rose-950 text-rose-300 border border-rose-500/60 animate-pulse">
            ระดับแดง (วิกฤต)
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded font-bold text-xs bg-orange-950 text-orange-300 border border-orange-500/60">
            ระดับส้ม (เสี่ยงสูง)
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded font-bold text-xs bg-amber-950 text-amber-300 border border-amber-500/60">
            ระดับเหลือง (เฝ้าระวัง)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/60">
            ระดับเขียว (ปกติ)
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              หัวข้อ 2-3
            </span>
            <h2 className="text-base font-bold text-white">
              ระดับความเสี่ยงและผลกระทบรายอำเภอ 13 อำเภอ จังหวัดนราธิวาส
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ประเมินความเสี่ยงล่วงหน้า 6 ชม., 12 ชม., และ 24 ชม. ตามปริมาณฝนสะสมและระดับน้ำในลำน้ำ
          </p>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-rose-950/70 border border-rose-500/50 px-3 py-1.5 rounded-lg text-rose-300 font-bold">
            วิกฤตสีแดง: {criticalCount} อำเภอ
          </div>
          <div className="bg-orange-950/70 border border-orange-500/50 px-3 py-1.5 rounded-lg text-orange-300 font-bold">
            เสี่ยงสูงสีส้ม: {highCount} อำเภอ
          </div>
          <div className="bg-amber-950/70 border border-amber-500/50 px-3 py-1.5 rounded-lg text-amber-300 font-bold">
            เฝ้าระวังสีเหลือง: {warningCount} อำเภอ
          </div>
          <div className="bg-emerald-950/70 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">
            ปกติสีเขียว: {normalCount} อำเภอ
          </div>
        </div>
      </div>

      {/* 13 Districts Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {districts.map((d) => (
          <div
            key={d.id}
            className={`p-4 rounded-xl border shadow-lg transition-all ${
              d.level === 'critical'
                ? 'bg-rose-950/20 border-rose-500/50 hover:bg-rose-950/30'
                : d.level === 'high'
                ? 'bg-orange-950/20 border-orange-500/50 hover:bg-orange-950/30'
                : d.level === 'warning'
                ? 'bg-amber-950/20 border-amber-500/50 hover:bg-amber-950/30'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{d.name}</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">{d.nameEn}</span>
              </div>
              <div>{getRiskBadge(d.level)}</div>
            </div>

            <div className="my-2 py-2 border-y border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-[10px] text-slate-400">ฝน 24 ชม.</div>
                <div className="text-sm font-bold font-mono text-cyan-300">{d.rainfall24h} มม.</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">จุดเสี่ยงวิกฤต</div>
                <div className="text-sm font-bold font-mono text-amber-300">{d.criticalPointsCount} จุด</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">กลุ่มเปราะบาง</div>
                <div className="text-sm font-bold font-mono text-pink-300">{d.vulnerableCount} ราย</div>
              </div>
            </div>

            {/* Impact Forecast Timeline 6h, 12h, 24h */}
            <div className="space-y-1.5 mt-3 text-xs">
              <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>คาดการณ์ผลกระทบล่วงหน้า:</span>
                <span>{renderTrend(d.trend)}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] pt-1">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">6 ชม.</div>
                  <div className="font-semibold text-amber-300 mt-0.5">{d.forecast6h}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">12 ชม.</div>
                  <div className="font-semibold text-orange-300 mt-0.5">{d.forecast12h}</div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[9px] text-slate-400">24 ชม.</div>
                  <div className="font-semibold text-rose-400 mt-0.5">{d.forecast24h}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
