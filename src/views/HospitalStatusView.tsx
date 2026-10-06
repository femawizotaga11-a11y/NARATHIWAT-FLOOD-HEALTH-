import React, { useState } from 'react';
import { HospitalStatus, RiskLevel, ServiceStatus } from '../types/dashboard';
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
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  hospitals: HospitalStatus[];
  onAddHospital: (hosp: HospitalStatus) => void;
  onUpdateHospital: (hosp: HospitalStatus) => void;
  onDeleteHospital: (id: string) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
}

export const HospitalStatusView: React.FC<Props> = ({
  hospitals,
  onAddHospital,
  onUpdateHospital,
  onDeleteHospital,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [selectedHospital, setSelectedHospital] = useState<HospitalStatus | null>(hospitals[0] || null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHosp, setEditingHosp] = useState<HospitalStatus | null>(null);

  const [formData, setFormData] = useState<Partial<HospitalStatus>>({
    name: '',
    type: 'M',
    district: 'เมืองนราธิวาส',
    riskLevel: 'warning',
    er: 'active',
    lr: 'active',
    or: 'active',
    icu: 'active',
    dialysis: 'active',
    opdNcd: 'active',
    autonomyHours: 72,
    fuelGeneratorHours: 72,
    oxygenHours: 72,
    waterHours: 72,
    bloodUnits: 20,
    bloodStatus: 'เพียงพอ',
    doctorCount: 8,
    nurseCount: 40,
    emtCount: 6,
    staffReadinessPct: 85,
    dialysisPatientsCount: 6,
    homeOxygenPatientsCount: 6,
    bedTotal: 60,
    bedOccupied: 40,
    lat: 6.42,
    lng: 101.82,
    bcpActive: false,
    notes: '',
  });

  const filtered = hospitals.filter((h) => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterRisk !== 'all' && h.riskLevel !== filterRisk) return false;
    return true;
  });

  const criticalRtoHospitals = hospitals.filter((h) => h.autonomyHours <= 24);
  const warningRtoHospitals = hospitals.filter((h) => h.autonomyHours > 24 && h.autonomyHours <= 36);

  const handleOpenAdd = () => {
    setEditingHosp(null);
    setFormData({
      name: '',
      type: 'M',
      district: 'เมืองนราธิวาส',
      riskLevel: 'warning',
      er: 'active',
      lr: 'active',
      or: 'active',
      icu: 'active',
      dialysis: 'active',
      opdNcd: 'active',
      autonomyHours: 72,
      fuelGeneratorHours: 72,
      oxygenHours: 72,
      waterHours: 72,
      bloodUnits: 20,
      bloodStatus: 'เพียงพอ',
      doctorCount: 8,
      nurseCount: 40,
      emtCount: 6,
      staffReadinessPct: 85,
      dialysisPatientsCount: 6,
      homeOxygenPatientsCount: 6,
      bedTotal: 60,
      bedOccupied: 40,
      lat: 6.42,
      lng: 101.82,
      bcpActive: false,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hosp: HospitalStatus) => {
    setEditingHosp(hosp);
    setFormData({ ...hosp });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingHosp) {
      onUpdateHospital({
        ...editingHosp,
        ...(formData as HospitalStatus),
      });
    } else {
      const newHosp: HospitalStatus = {
        ...(formData as HospitalStatus),
        id: `h-${Date.now()}`,
      };
      onAddHospital(newHosp);
    }
    setIsModalOpen(false);
  };

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
      {/* Header with CRUD & Sheet Controls */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              ข้อ 8 | ขีดความสามารถสถานพยาบาล
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>สถานะและทรัพยากร 13 โรงพยาบาล & RTO (CRUD ลง Sheet)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมต่อข้อมูลชีตแท็บ: <code className="text-cyan-300 font-mono">HospitalStatus</code> (Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มโรงพยาบาล</span>
          </button>

          <button
            onClick={onSyncWithSheet}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'กำลังซิงค์...' : 'บันทึกลง Sheet (Push)'}</span>
          </button>

          <button
            onClick={onPullFromSheet}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดึงจาก Sheet (Pull)</span>
          </button>
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
            <span>ตารางขีดความสามารถและทรัพยากรโรงพยาบาล (แสดงผลและ CRUD ข้อมูลจริงจาก Google Sheet)</span>
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
                <th className="py-2.5 px-2 text-right">จัดการ (CRUD)</th>
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
                        {h.bloodUnits} u
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300">
                      {h.staffReadinessPct}%
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenEdit(h)}
                          title="แก้ไขข้อมูลโรงพยาบาล"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ยืนยันการลบ ${h.name} หรือไม่?`)) {
                              onDeleteHospital(h.id);
                            }
                          }}
                          title="ลบโรงพยาบาล"
                          className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hospital Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-2xl shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>{editingHosp ? 'แก้ไขข้อมูลโรงพยาบาล' : 'เพิ่มโรงพยาบาลใหม่'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ชื่อโรงพยาบาล *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    placeholder="เช่น รพ.นราธิวาสราชนครินทร์"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ระดับโรงพยาบาล</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="A+">A+ (โรงพยาบาลศูนย์/ทั่วไปขนาดใหญ่)</option>
                    <option value="S+">S+ (โรงพยาบาลชุมชนแม่ข่าย)</option>
                    <option value="M">M (โรงพยาบาลชุมชนขนาดกลาง)</option>
                    <option value="S">S (โรงพยาบาลชุมชนขนาดเล็ก)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">อำเภอ</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ระดับความเสี่ยง</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as RiskLevel })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="critical">สีแดง (วิกฤต)</option>
                    <option value="high">สีส้ม (เสี่ยงสูง)</option>
                    <option value="warning">สีเหลือง (เฝ้าระวัง)</option>
                    <option value="normal">สีเขียว (ปกติ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Safe Operating Time (RTO ชม.)</label>
                  <input
                    type="number"
                    value={formData.autonomyHours}
                    onChange={(e) => setFormData({ ...formData, autonomyHours: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ไฟฟ้าสำรอง Generator (ชม.)</label>
                  <input
                    type="number"
                    value={formData.fuelGeneratorHours}
                    onChange={(e) => setFormData({ ...formData, fuelGeneratorHours: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ออกซิเจนสำรอง (ชม.)</label>
                  <input
                    type="number"
                    value={formData.oxygenHours}
                    onChange={(e) => setFormData({ ...formData, oxygenHours: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">เลือดสำรอง (ยูนิต)</label>
                  <input
                    type="number"
                    value={formData.bloodUnits}
                    onChange={(e) => setFormData({ ...formData, bloodUnits: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Department statuses */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">สถานะแผนกหลัก (ER, LR, OR, ICU, Dialysis, OPD)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['er', 'lr', 'or', 'icu', 'dialysis', 'opdNcd'] as const).map((dept) => (
                    <div key={dept}>
                      <span className="block text-[10px] uppercase text-slate-400 mb-0.5">{dept}</span>
                      <select
                        value={formData[dept]}
                        onChange={(e) => setFormData({ ...formData, [dept]: e.target.value as ServiceStatus })}
                        className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-white text-[11px]"
                      >
                        <option value="active">เปิดปกติ</option>
                        <option value="partial">จำกัด</option>
                        <option value="closed">ปิด</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">บันทึกเหตุการณ์ฉุกเฉิน / หมายเหตุ</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow"
                >
                  {editingHosp ? 'บันทึกการแก้ไข' : 'บันทึกโรงพยาบาล'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
