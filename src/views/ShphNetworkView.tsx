import React from 'react';
import { SHPH_DISTRICT_DATA } from '../data/mockEocData';
import { Stethoscope, CheckCircle2, AlertTriangle, ShieldAlert, XCircle, Building2 } from 'lucide-react';

export const ShphNetworkView: React.FC = () => {
  const totalShph = SHPH_DISTRICT_DATA.reduce((acc, cur) => acc + cur.total, 0); // 111
  const normalShph = SHPH_DISTRICT_DATA.reduce((acc, cur) => acc + cur.normal, 0); // 58
  const monitoringShph = SHPH_DISTRICT_DATA.reduce((acc, cur) => acc + cur.monitoring, 0); // 12
  const highRiskShph = SHPH_DISTRICT_DATA.reduce((acc, cur) => acc + cur.highRisk, 0); // 18 / 6

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              ข้อ 3 (รพ.สต.)
            </span>
            <h2 className="text-base font-bold text-white">
              เครือข่ายโรงพยาบาลส่งเสริมสุขภาพตำบล 111 แห่ง (ด่านหน้าปฐมภูมิ)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ติดตามสถานะความต่อเนื่องการให้บริการ ณ ด่านหน้า ดูแลกลุ่มเปราะบางในชุมชน และสำรองยาจำเป็น
          </p>
        </div>

        {/* 111 SHPH KPI Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-emerald-950/70 border border-emerald-500/50 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">
            ปกติ: 58 แห่ง (53%)
          </div>
          <div className="bg-amber-950/70 border border-amber-500/50 px-3 py-1.5 rounded-lg text-amber-300 font-bold">
            เฝ้าระวัง: 12 แห่ง (11%)
          </div>
          <div className="bg-rose-950/70 border border-rose-500/50 px-3 py-1.5 rounded-lg text-rose-300 font-bold">
            เสี่ยงน้ำท่วม: 18 แห่ง
          </div>
          <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-bold font-mono">
            รวมทั้งหมด: 111 แห่ง
          </div>
        </div>
      </div>

      {/* Infographic Replicated Distribution Ratio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>สถานะปกติ (เปิดบริการ 100%)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">58 แห่ง</div>
          <div className="text-xs text-emerald-400/80 mt-1">สัดส่วน 53% ของทั้งจังหวัด</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>สถานะเฝ้าระวัง (น้ำปริ่มลาน)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">12 แห่ง</div>
          <div className="text-xs text-amber-400/80 mt-1">สัดส่วน 11% ยกของขึ้นที่สูงแล้ว</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>สถานะเสี่ยง / เส้นทางตัดขาด</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-300">18 แห่ง</div>
          <div className="text-xs text-rose-400/80 mt-1">สแตนด์บายเรือกู้ชีพและยาสำรอง</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>ปิดบริการ / ย้ายจุดบริการ</span>
            <XCircle className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">0 แห่ง</div>
          <div className="text-xs text-emerald-400 mt-1">ย้ายจุดสำรอง BCP ให้บริการครบ 100%</div>
        </div>
      </div>

      {/* 13 Districts SHPH Breakdown Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>บัญชีจำนวน รพ.สต. แยกตามรายอำเภอ (13 อำเภอ 111 แห่ง)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">อำเภอ</th>
                <th className="py-2.5 px-3 text-center">รพ.สต. ทั้งหมด</th>
                <th className="py-2.5 px-3 text-center">ปกติ</th>
                <th className="py-2.5 px-3 text-center">เฝ้าระวัง</th>
                <th className="py-2.5 px-3 text-center">เสี่ยง</th>
                <th className="py-2.5 px-3 text-center">ปิดบริการ</th>
                <th className="py-2.5 px-3">แผนรองรับ BCP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {SHPH_DISTRICT_DATA.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-sky-200">{item.district}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                    {item.total} แห่ง
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-400 font-bold">
                    {item.normal}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-amber-400 font-bold">
                    {item.monitoring}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-rose-400 font-bold">
                    {item.highRisk}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                    {item.closed}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                    {item.highRisk > 0 ? (
                      <span className="text-amber-300">
                        เปิดจุดบริการชั่วคราว ณ อบต. / มัสยิดดอน พร้อมจ่ายยา 30 วัน
                      </span>
                    ) : (
                      <span className="text-emerald-300">เปิดให้บริการ ณ ที่ตั้งปกติ</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
