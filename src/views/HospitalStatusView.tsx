import React, { useState } from 'react';
import { HospitalStatus } from '../types/dashboard';
import {
  Building2,
  AlertTriangle,
  Clock,
  Zap,
  Wind,
  Droplet,
  HeartPulse,
  Users,
  Bed,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface Props {
  hospitals: HospitalStatus[];
}

export const HospitalStatusView: React.FC<Props> = ({ hospitals }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedHospital, setSelectedHospital] = useState<HospitalStatus | null>(hospitals[0] || null);

  const filtered = hospitals.filter((h) => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterRisk !== 'all' && h.riskLevel !== filterRisk) return false;
    return true;
  });

  const criticalRtoHospitals = hospitals.filter((h) => h.autonomyHours <= 24);
  const warningRtoHospitals = hospitals.filter((h) => h.autonomyHours > 24 && h.autonomyHours <= 36);

  const renderStatusBadge = (status: 'active' | 'partial' | 'closed') => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>เปิดปกติ</span>
        </span>
      );
    }
    if (status === 'partial') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>จำกัดบริการ</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <span>ปิดบริการ</span>
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              ข้อ 3 & ข้อ 4
            </span>
            <h2 className="text-base font-bold text-white">
              ทรัพยากรรายโรงพยาบาลและระยะเวลาความอยู่รอด (RTO / Autonomy Hours)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ติดตามขีดความสามารถการบริการ ER, LR, OR, ICU, Dialysis, OPD และประเมิน RTO (Recovery Time Objective) 13 โรงพยาบาล
          </p>
        </div>

        {/* Warning Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-rose-950/80 border border-rose-500/60 px-3 py-1.5 rounded-lg text-rose-300 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>RTO วิกฤต (≤24 ชม.): {criticalRtoHospitals.length} รพ.</span>
          </div>
          <div className="bg-amber-950/80 border border-amber-500/60 px-3 py-1.5 rounded-lg text-amber-300 font-semibold">
            RTO เฝ้าระวัง (36 ชม.): {warningRtoHospitals.length} รพ.
          </div>
        </div>
      </div>

      {/* Critical Alert Notice if Kolok or other hospital has low RTO */}
      {criticalRtoHospitals.length > 0 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/80 via-red-950/60 to-rose-950/80 border-2 border-rose-500/80 shadow-lg text-xs text-rose-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white font-bold">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <span>แจ้งเตือนด่วน EOC: โรงพยาบาลสุไหงโก-ลก RTO คงเหลือ 24 ชั่วโมง!</span>
                <span className="bg-rose-800 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  CRITICAL AUTONOMY
                </span>
              </div>
              <p className="text-[11px] text-rose-300/90 mt-0.5">
                ระดับน้ำรอบ รพ. เพิ่มสูงขึ้น เครื่องปั่นไฟเดินเครื่องต่อเนื่อง น้ำมันและออกซิเจนสำรองใกล้เกณฑ์เตือนภัย เริ่มกระบวนการส่งต่อผู้ป่วยวิกฤตและแผนนำส่งทรัพยากรทดแทน (ข้อ 10)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 13 Hospitals Comprehensive Master Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>ตารางขีดความสามารถและทรัพยากร 13 โรงพยาบาล (ภาพจำลองแผนภูมิ Infographic ข้อ 5)</span>
          </h3>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">ระดับ รพ.:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value="all">ทั้งหมด</option>
                <option value="A+">ระดับ A+</option>
                <option value="S+">ระดับ S+</option>
                <option value="M">ระดับ M</option>
                <option value="S">ระดับ S</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">ระดับความเสี่ยง:</span>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value="all">ทั้งหมด</option>
                <option value="critical">สีแดง (วิกฤต)</option>
                <option value="high">สีส้ม (เสี่ยงสูง)</option>
                <option value="warning">สีเหลือง (เฝ้าระวัง)</option>
                <option value="normal">สีเขียว (ปกติ)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">โรงพยาบาล</th>
                <th className="py-2.5 px-2 text-center">ระดับ</th>
                <th className="py-2.5 px-2 text-center">ER</th>
                <th className="py-2.5 px-2 text-center">LR (คลอด)</th>
                <th className="py-2.5 px-2 text-center">OR (ผ่าตัด)</th>
                <th className="py-2.5 px-2 text-center">ICU</th>
                <th className="py-2.5 px-2 text-center">Dialysis (ไต)</th>
                <th className="py-2.5 px-2 text-center">OPD/NCD</th>
                <th className="py-2.5 px-3 text-center">Autonomy (RTO)</th>
                <th className="py-2.5 px-2">ไฟฟ้า/Gen</th>
                <th className="py-2.5 px-2">ออกซิเจน</th>
                <th className="py-2.5 px-2">เลือดสำรอง</th>
                <th className="py-2.5 px-2">กำลังคน</th>
                <th className="py-2.5 px-2 text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((h) => {
                const isSelected = selectedHospital?.id === h.id;
                const isCriticalRto = h.autonomyHours <= 24;
                const isWarningRto = h.autonomyHours <= 36 && h.autonomyHours > 24;

                return (
                  <tr
                    key={h.id}
                    onClick={() => setSelectedHospital(h)}
                    className={`cursor-pointer transition ${
                      isSelected ? 'bg-sky-950/70 text-white font-medium' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-sky-200">{h.name}</div>
                      <div className="text-[10px] text-slate-400">อ.{h.district}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          h.riskLevel === 'critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                            : h.riskLevel === 'high'
                            ? 'bg-orange-950 text-orange-300 border border-orange-500/50'
                            : h.riskLevel === 'warning'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        }`}
                      >
                        {h.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">{renderStatusBadge(h.er)}</td>
                    <td className="py-2.5 px-2 text-center">{renderStatusBadge(h.lr)}</td>
                    <td className="py-2.5 px-2 text-center">{renderStatusBadge(h.or)}</td>
                    <td className="py-2.5 px-2 text-center">{renderStatusBadge(h.icu)}</td>
                    <td className="py-2.5 px-2 text-center">{renderStatusBadge(h.dialysis)}</td>
                    <td className="py-2.5 px-2 text-center">{renderStatusBadge(h.opdNcd)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          isCriticalRto
                            ? 'bg-rose-600 text-white animate-pulse'
                            : isWarningRto
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {h.autonomyHours} ชม.
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300">
                      {h.fuelGeneratorHours} ชม.
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300">
                      {h.oxygenHours} ชม.
                    </td>
                    <td className="py-2.5 px-2 text-[11px]">
                      <span
                        className={`font-semibold ${
                          h.bloodStatus === 'เสี่ยงขาด' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {h.bloodUnits} u ({h.bloodStatus})
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300">
                      {h.staffReadinessPct}%
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button className="text-cyan-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                        เปิดดู
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Hospital Detailed Profile Card */}
      {selectedHospital && (
        <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedHospital.name}</h3>
                <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-700/60 text-sky-200 text-xs font-mono font-bold">
                  ระดับ {selectedHospital.type}
                </span>
                <span className="text-xs text-slate-400">อ.{selectedHospital.district}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedHospital.notes || 'ความพร้อมของสถานพยาบาลในการรองรับแผนเผชิญเหตุอุทกภัย'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Safe Operating Time (RTO)</div>
                <div
                  className={`text-lg font-bold font-mono ${
                    selectedHospital.autonomyHours <= 24 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedHospital.autonomyHours} ชั่วโมง
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>ไฟฟ้าสำรอง (Gen)</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {selectedHospital.fuelGeneratorHours} ชม.
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>ออกซิเจนทางการแพทย์</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {selectedHospital.oxygenHours} ชม.
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                <span>น้ำใช้สำรอง</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {selectedHospital.waterHours} ชม.
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>คลังโลหิต</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {selectedHospital.bloodUnits} <span className="text-xs font-normal">ยูนิต</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>แพทย์ / พยาบาล</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {selectedHospital.doctorCount} / {selectedHospital.nurseCount} คน
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1 mb-1">
                <Bed className="w-3.5 h-3.5 text-emerald-400" />
                <span>อัตราครองเตียง</span>
              </div>
              <div className="text-base font-bold text-white font-mono">
                {selectedHospital.bedOccupied} / {selectedHospital.bedTotal}{' '}
                <span className="text-xs font-normal text-slate-400">
                  ({Math.round((selectedHospital.bedOccupied / selectedHospital.bedTotal) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
