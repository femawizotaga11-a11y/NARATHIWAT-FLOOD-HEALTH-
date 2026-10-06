import React, { useState } from 'react';
import { HospitalStatus } from '../types/dashboard';
import { Users2, ShieldCheck, UserCheck, Phone, Stethoscope, Award, HeartPulse } from 'lucide-react';

interface Props {
  hospitals: HospitalStatus[];
}

export const StaffManagementView: React.FC<Props> = ({ hospitals }) => {
  const totalDoctors = hospitals.reduce((acc, h) => acc + h.doctorCount, 0);
  const totalNurses = hospitals.reduce((acc, h) => acc + h.nurseCount, 0);
  const totalEmt = hospitals.reduce((acc, h) => acc + h.emtCount, 0);

  const [activeShift, setActiveShift] = useState<'A' | 'B' | 'C'>('A');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              ข้อ 5
            </span>
            <h2 className="text-base font-bold text-white">
              การบริหารจัดการกำลังคนและบุคลากรทางการแพทย์ (Staff & Medical Shift Matrix)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            โครงสร้างการจัดสรรอัตรากำลัง แพทย์ พยาบาล เวชกิจฉุกเฉิน (EMT) และทีมผลัดฉุกเฉิน A-B-C รองรับ BCP
          </p>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/60 px-3 py-1.5 rounded-lg text-emerald-300 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>อัตราความพร้อมรวม: 85% (ทีม A-B-C ครบ)</span>
          </div>
        </div>
      </div>

      {/* Staff Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-lg">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>แพทย์เวชปฏิบัติ / ผู้เชี่ยวชาญ</span>
            <Stethoscope className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalDoctors} ท่าน</div>
          <div className="text-[11px] text-cyan-400 mt-1">ประจำ 13 รพ. พร้อมศัลยกรรม/สูติ</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-lg">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>พยาบาลวิชาชีพ (RN)</span>
            <HeartPulse className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalNurses} คน</div>
          <div className="text-[11px] text-pink-400 mt-1">วอร์ดวิกฤต ICU/ER/ไตเทียม</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-lg">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>เจ้าหน้าที่กู้ชีพและ EMT</span>
            <Users2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalEmt} นาย</div>
          <div className="text-[11px] text-amber-400 mt-1">ประจำขบวนรถ 4WD และเรือกู้ภัย</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>ทีม MCATT ดูแลสุขภาพจิต</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">13 ทีม</div>
          <div className="text-[11px] text-emerald-400 mt-1">ประจำศูนย์พักพิงทุกอำเภอ</div>
        </div>
      </div>

      {/* Team A-B-C Rotation Protocols */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>ระบบจัดเวรผลัดฉุกเฉิน 3 ทีม (Shift Rotation Protocol A-B-C)</span>
            </h3>
            <p className="text-xs text-slate-400">
              ป้องกันความอ่อนล้าของบุคลากร และสำรองกำลังหากเส้นทางกลับบ้านถูกตัดขาด
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveShift('A')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeShift === 'A'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ทีม A (ปฏิบัติหน้าที่)
            </button>
            <button
              onClick={() => setActiveShift('B')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeShift === 'B'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ทีม B (สแตนด์บาย 2 ชม.)
            </button>
            <button
              onClick={() => setActiveShift('C')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                activeShift === 'C'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ทีม C (สำรอง/EVAC Escort)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className={`p-3 rounded-lg border ${activeShift === 'A' ? 'bg-cyan-950/40 border-cyan-500' : 'bg-slate-950 border-slate-800'}`}>
            <div className="font-bold text-cyan-300 mb-1 flex items-center justify-between">
              <span>ทีม A (On-Duty First Line)</span>
              <span className="text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded font-mono">ผลัดปัจจุบัน</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              บุคลากรปฏิบัติการในห้องฉุกเฉิน, หอผู้ป่วยวิกฤต, หอผู้ป่วยใน และหน่วยฟอกไต มีที่พักนอนเวรภายใน รพ. ปลอดภัยจากน้ำท่วม 100%
            </p>
          </div>

          <div className={`p-3 rounded-lg border ${activeShift === 'B' ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-950 border-slate-800'}`}>
            <div className="font-bold text-amber-300 mb-1 flex items-center justify-between">
              <span>ทีม B (Standby Relief)</span>
              <span className="text-[10px] bg-amber-900/60 px-2 py-0.5 rounded font-mono">เตรียมผลัดเปลี่ยน</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              พักผ่อน ณ จุดสำรอง สามารถระดมพลเข้าประจำการได้ภายใน 2 ชั่วโมง โดยมีรถยกสูง 4WD ทหารและ ปภ. รับ-ส่ง
            </p>
          </div>

          <div className={`p-3 rounded-lg border ${activeShift === 'C' ? 'bg-purple-950/40 border-purple-500' : 'bg-slate-950 border-slate-800'}`}>
            <div className="font-bold text-purple-300 mb-1 flex items-center justify-between">
              <span>ทีม C (Emergency Reserve & EVAC)</span>
              <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded font-mono">ชุดเคลื่อนย้าย</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              ชุดเฉพาะกิจร่วมกับทีมกู้ภัย ลงเรือและรถยกสูงลุยน้ำเข้าช่วยอพยพผู้ป่วยเปราะบาง 1,284 ราย ออกจากบ้านเรือน
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Staff Breakdown Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">
          สถิติกำลังคนแยกรายโรงพยาบาล 13 แห่ง
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">โรงพยาบาล</th>
                <th className="py-2.5 px-3">อำเภอ</th>
                <th className="py-2.5 px-3 text-center">แพทย์ (คน)</th>
                <th className="py-2.5 px-3 text-center">พยาบาล (คน)</th>
                <th className="py-2.5 px-3 text-center">EMT/กู้ชีพ (คน)</th>
                <th className="py-2.5 px-3 text-center">ความพร้อมบุคลากร</th>
                <th className="py-2.5 px-3">สถานะ BCP กำลังคน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-sky-200">{h.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">อ.{h.district}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                    {h.doctorCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                    {h.nurseCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-cyan-300">
                    {h.emtCount}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        h.staffReadinessPct >= 90
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                      }`}
                    >
                      {h.staffReadinessPct}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                    {h.autonomyHours <= 24 ? (
                      <span className="text-rose-400 font-semibold">
                        เสริมทีมสนับสนุนจาก รพ.รือเสาะ และ รพ.ระแงะ
                      </span>
                    ) : (
                      <span className="text-emerald-400">อัตรากำลังเข้าเวรครบตามเกณฑ์ BCP</span>
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
