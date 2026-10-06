import React from 'react';
import { REPLENISHMENT_PLANS } from '../data/mockEocData';
import { Truck, Fuel, Wind, Pill, HeartPulse, Droplet, Clock, ShieldAlert, ArrowRight, Anchor } from 'lucide-react';

export const SupplyReplenishmentView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              ข้อ 10
            </span>
            <h2 className="text-base font-bold text-white">
              แผนการลำเลียงทรัพยากรนำเข้าจังหวัด (เมื่อเกิน RTO หรือทรัพยากรสำรองหมด)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ขั้นตอนปฏิบัติการนำเข้าน้ำมันเชื้อเพลิง, ออกซิเจนการแพทย์, เลือด, ยาและเวชภัณฑ์ จากภายนอกจังหวัดนราธิวาส (เขตสุขภาพที่ 12)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-amber-950/80 border border-amber-500/60 px-3 py-1.5 rounded-lg text-amber-300 font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>SOP ส่งกำลังบำรุงวิกฤต: เตรียมพร้อมระดับ 2</span>
          </div>
        </div>
      </div>

      {/* 3 Main Logistics Inbound Corridors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Air-Bridge */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-purple-300">1. สะพานอากาศ (Air-Bridge Corridor)</span>
            <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-mono font-bold">
              SLA 3-4 ชม.
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            ใช้อากาศยานเฮลิคอปเตอร์ Ka-32 ปภ. / MI-17 ทบ. และ C-130 ทอ. บินจากคลังกองบิน 56 หาดใหญ่ ลงสนามบินนราธิวาส (บ้านทอน) และสนามกีฬาโก-ลก
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-purple-300/90 font-medium">
            เหมาะสำหรับ: ท่อออกซิเจน, โลหิตฉุกเฉิน, ยาช่วยชีวิต และแพทย์ผู้เชี่ยวชาญ
          </div>
        </div>

        {/* Naval Convoy */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-cyan-300">2. ขบวนเรือลำเลียง กองทัพเรือภาค 2</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono font-bold">
              SLA 6 ชม.
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            เรือตรวจการณ์และเรือลำเลียงน้ำจืด/น้ำมัน แล่นเลียบอ่าวไทยเข้าเทียบท่าเรือตากใบ และปากแม่น้ำบางนรา ส่งตรงถึงหลัง รพ.นราธิวาสราชนครินทร์
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-cyan-300/90 font-medium">
            เหมาะสำหรับ: น้ำมันดีเซลเติมเครื่องปั่นไฟปริมาณมาก, เสบียงอาหาร และน้ำดื่ม
          </div>
        </div>

        {/* Heavy Truck Convoy */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-300">3. ขบวนรถยกสูง 4WD ทหารนำขบวน</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">
              SLA 6-8 ชม.
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            ขบวนรถบรรทุก 6 ล้อยกสูงจากคลัง ปตท. สงขลา และคลังยาหาดใหญ่ เดินทางผ่าน ทล.43 ตัดเข้า ทล.42 โดยมี บก.ควบคุม มทบ.46 เคลียร์เส้นทาง
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-300/90 font-medium">
            เหมาะสำหรับ: เวชภัณฑ์ล็อตใหญ่, น้ำยาล้างไต (CAPD) และเครื่องมือแพทย์
          </div>
        </div>
      </div>

      {/* 5 Critical Category Replenishment Protocol Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>บัญชีแผนรองรับการส่งกำลังบำรุงฉุกเฉิน 5 หมวดทรัพยากรสำคัญ</span>
        </h3>

        <div className="space-y-3">
          {REPLENISHMENT_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-sky-700/60 transition text-xs space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{plan.resourceCategory}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-mono">
                    SLA: {plan.slaHours} ชั่วโมง
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 text-[10px] font-bold">
                    {plan.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div>
                  <div className="text-slate-400 text-[10px]">เกณฑ์แจ้งเตือนเพื่อเริ่มการขนส่ง (Trigger Threshold):</div>
                  <div className="text-rose-400 font-semibold">{plan.triggerThreshold}</div>
                  <div className="text-slate-400 text-[10px] mt-1.5">คลังต้นทาง (Origin Hub):</div>
                  <div className="text-slate-200">{plan.supplyHubOrigin}</div>
                </div>

                <div>
                  <div className="text-slate-400 text-[10px]">เส้นทางหลัก (Primary Inbound Route):</div>
                  <div className="text-emerald-300">{plan.primaryInboundRoute}</div>
                  <div className="text-slate-400 text-[10px] mt-1.5">เส้นทางสำรอง (Backup Route):</div>
                  <div className="text-sky-300">{plan.backupInboundRoute}</div>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>โหมดขนส่ง: <b className="text-white">{plan.transportMode}</b></span>
                <span>ผู้ประสานงานหลัก: <b className="text-cyan-300">{plan.contactPerson}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
