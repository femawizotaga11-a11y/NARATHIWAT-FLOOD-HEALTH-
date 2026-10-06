import React, { useState } from 'react';
import { HospitalStatus, RoadCutIncident } from '../types/dashboard';
import { Share2, Route, Bed, Ambulance, AlertTriangle, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  hospitals: HospitalStatus[];
  roadCuts: RoadCutIncident[];
}

export const ReferralOpohView: React.FC<Props> = ({ hospitals, roadCuts }) => {
  const [selectedRouteStrategy, setSelectedRouteStrategy] = useState<'land' | 'water' | 'air'>('land');

  // Tertiary hubs
  const mainHub = hospitals.find((h) => h.id === 'h-1'); // รพ.นราธิวาสราชนครินทร์
  const southHub = hospitals.find((h) => h.id === 'h-2'); // รพ.สุไหงโก-ลก

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              ข้อ 7 & 8
            </span>
            <h2 className="text-base font-bold text-white">
              ความพร้อมระบบส่งต่อฉุกเฉิน Dynamic Referral & OPOH (One Province One Hospital)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมโยงแผนที่เส้นทางตัดขาด (ข้อ 2) เข้ากับแผนแก้ปัญหาการส่งต่อผู้ป่วยวิกฤต เตียง Bed Center และการส่งออกนอกจังหวัด
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/60 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">
            ระบบ OPOH พร้อมใช้: 100%
          </div>
        </div>
      </div>

      {/* Bed Center Real-time Matrix */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bed className="w-4 h-4 text-cyan-400" />
            <span>ศูนย์บริหารจัดการเตียงแบบเรียลไทม์ (Bed Center & Critical Capacity)</span>
          </h3>
          <span className="text-xs text-cyan-300 font-mono">Real-time Bed Network</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Main Provincial Hub */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-sky-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sky-200">{mainHub?.name} (A+)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold">
                แม่ข่ายหลักตอนบน
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mb-2">
              รองรับผู้ป่วยผ่าตัดฉุกเฉิน, STEMI, Stroke, คลอดติดขัด และ ICU
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">เตียงว่าง</div>
                <div className="text-base font-bold text-emerald-400 font-mono">
                  {mainHub ? mainHub.bedTotal - mainHub.bedOccupied : 52}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ICU ว่าง</div>
                <div className="text-base font-bold text-cyan-400 font-mono">6</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ห้อง OR ว่าง</div>
                <div className="text-base font-bold text-white font-mono">3 / 8</div>
              </div>
            </div>
          </div>

          {/* South Hub: Sungai Kolok */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-white">{southHub?.name} (A+)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
                แม่ข่ายตอนล่าง (น้ำท่วมรอบ)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mb-2">
              ลดการรับเคสทั่วไป ระบายเคสเสถียรไปยัง รพ.แว้ง และ รพ.สุไหงปาดี
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">เตียงว่าง</div>
                <div className="text-base font-bold text-rose-400 font-mono">
                  {southHub ? southHub.bedTotal - southHub.bedOccupied : 21}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ICU ว่าง</div>
                <div className="text-base font-bold text-amber-400 font-mono">2</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">RTO คงเหลือ</div>
                <div className="text-base font-bold text-rose-400 font-mono">24 ชม.</div>
              </div>
            </div>
          </div>

          {/* Regional Tertiary Hub (Out of province fallback) */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-purple-200">รพ.ศูนย์ยะลา / มอ.หาดใหญ่</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-500/50 font-bold">
                ส่งต่อนอกจังหวัด (เขต 12)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mb-2">
              เปิดช่องทางพิเศษ Green Channel รับเคสผ่าตัดหัวใจ/สมอง/ทารกแรกเกิดวิกฤต
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">โควตาสำรอง</div>
                <div className="text-base font-bold text-purple-300 font-mono">35 เตียง</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ICU เขต 12</div>
                <div className="text-base font-bold text-cyan-400 font-mono">12 เตียง</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">ช่องทางส่ง</div>
                <div className="text-base font-bold text-white font-mono">ฮ. / รถไฟ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contingency Routing by Road Cut (อ้างอิงแผนที่ข้อ 2 พร้อมการแก้ปัญหา) */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-emerald-400" />
              <span>ยุทธศาสตร์การแก้ไขปัญหาเส้นทางถูกตัดขาด 3 รูปแบบ (Multimodal Evac)</span>
            </h3>
            <p className="text-xs text-slate-400">
              เมื่อเส้นทางหลัก ทล.4056 (สุไหงโก-ลก - ตากใบ) และ ทล.4055 ถูกตัดขาด
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedRouteStrategy('land')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedRouteStrategy === 'land'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              1. ทางบก (เส้นทางเลี่ยง 4WD)
            </button>
            <button
              onClick={() => setSelectedRouteStrategy('water')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedRouteStrategy === 'water'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              2. ทางน้ำ (เรือกู้ภัย/ทัพเรือ)
            </button>
            <button
              onClick={() => setSelectedRouteStrategy('air')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                selectedRouteStrategy === 'air'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              3. ทางอากาศ (ฮ.กู้ชีพ Sky Doctor)
            </button>
          </div>
        </div>

        {/* Strategy Explanations */}
        {selectedRouteStrategy === 'land' && (
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-xs space-y-2">
            <div className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ยุทธศาสตร์ที่ 1: เส้นทางเลี่ยงทางบกรถยกสูง 4WD (Primary Land Bypass)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <b>แนวทางแก้ปัญหา:</b> ใช้เส้นทางเลี่ยง ทล. 4057 (สุไหงโก-ลก ➜ สุไหงปาดี ➜ ระแงะ ➜ ยี่งอ ➜ รพ.นราธิวาสราชนครินทร์) ซึ่งเป็นแนวถนนบนที่ดอนเลียบแนวทางรถไฟ โดยมีรถยกสูงของ ตชด.447 และทหารพราน 48 คอยนำขบวนรถพยาบาลฉุกเฉินตลอด 24 ชั่วโมง
            </p>
            <div className="flex items-center gap-4 text-[11px] text-emerald-400 font-mono pt-1">
              <span>✓ ระยะทาง: 68 กม.</span>
              <span>✓ ระยะเวลาเดินทาง: 75 นาที</span>
              <span>✓ อัตราความปลอดภัย: 95%</span>
            </div>
          </div>
        )}

        {selectedRouteStrategy === 'water' && (
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/40 text-xs space-y-2">
            <div className="font-bold text-cyan-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ยุทธศาสตร์ที่ 2: ลำเลียงทางน้ำ กองทัพเรือและเรือท้องแบน ปภ. (Waterway Bypass)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <b>แนวทางแก้ปัญหา:</b> กรณีน้ำท่วมสูงคอสะพานมูโนะจนรถ 4WD ผ่านไม่ได้ นำผู้ป่วยลงเรือท้องแบนติดเครื่องยนต์ของ ปภ. ข้ามช่วงสะพานที่ขาด (ระยะ 800 เมตร) ไปถ่ายโอนขึ้นรถพยาบาลอีกฝั่งหนึ่ง หรือใช้เรือตรวจการณ์ลำน้ำกองทัพเรือแล่นตามลำน้ำบางนราเข้าเทียบท่าเรือหลัง รพ.นราธิวาสราชนครินทร์
            </p>
            <div className="flex items-center gap-4 text-[11px] text-cyan-400 font-mono pt-1">
              <span>✓ เรือสแตนด์บาย: 18 ลำ</span>
              <span>✓ จุดเปลี่ยนถ่าย: จุดจอดเรือเชิงสะพานมูโนะ & ท่าเรือยะกัง</span>
            </div>
          </div>
        )}

        {selectedRouteStrategy === 'air' && (
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/40 text-xs space-y-2">
            <div className="font-bold text-purple-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ยุทธศาสตร์ที่ 3: ปฏิบัติการอากาศยาน Sky Doctor ฮ. กรม ปภ. และ ทบ. (Air Evac)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              <b>แนวทางแก้ปัญหา:</b> สำหรับผู้ป่วยวิกฤตสีแดง (STEMI, อวัยวะขาด, สมองบวมรุนแรง, ทารกวิกฤต) ที่ไม่สามารถเคลื่อนย้ายทางบกได้ ใช้เฮลิคอปเตอร์ Bell 212 / Ka-32 ยกตัวจากสนามกีฬาสุไหงโก-ลก บินตรงลงลานจอด ฮ. สนามบินบ้านทอน หรือ รพ.ศูนย์ยะลา ภายใน 25 นาที
            </p>
            <div className="flex items-center gap-4 text-[11px] text-purple-400 font-mono pt-1">
              <span>✓ เวลาขึ้นบิน (Scramble Time): ภายใน 30 นาทีหลังรับแจ้ง</span>
              <span>✓ ทีมแพทย์ประจำ ฮ.: Sky Doctor รพ.นราธิวาสราชนครินทร์</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
