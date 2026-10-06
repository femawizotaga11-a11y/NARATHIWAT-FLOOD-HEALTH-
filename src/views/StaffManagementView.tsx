import React, { useState } from 'react';
import { StaffTeamItem, HospitalStatus } from '../types/dashboard';
import {
  Users2,
  ShieldCheck,
  UserCheck,
  Phone,
  Stethoscope,
  Award,
  HeartPulse,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';

interface Props {
  staffTeams: StaffTeamItem[];
  onAddStaffTeam: (team: StaffTeamItem) => void;
  onUpdateStaffTeam: (team: StaffTeamItem) => void;
  onDeleteStaffTeam: (id: string) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
  hospitals: HospitalStatus[];
}

export const StaffManagementView: React.FC<Props> = ({
  staffTeams,
  onAddStaffTeam,
  onUpdateStaffTeam,
  onDeleteStaffTeam,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
  hospitals,
}) => {
  const [activeShift, setActiveShift] = useState<'all' | 'ทีม A' | 'ทีม B' | 'ทีม C'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<StaffTeamItem | null>(null);

  const [formData, setFormData] = useState<Partial<StaffTeamItem>>({
    hospitalName: 'รพ.นราธิวาสราชนครินทร์',
    district: 'เมืองนราธิวาส',
    department: 'อุบัติเหตุฉุกเฉิน (ER)',
    teamName: 'ทีมกู้ชีพเฉพาะกิจ',
    currentShift: 'ทีม A',
    doctorCount: 4,
    nurseCount: 16,
    emtCount: 4,
    readinessPct: 90,
    leaderName: 'นพ.หัวหน้าทีมแพทย์',
    contactPhone: '081-234-5678',
  });

  const totalDoctors = hospitals.reduce((acc, h) => acc + h.doctorCount, 0);
  const totalNurses = hospitals.reduce((acc, h) => acc + h.nurseCount, 0);
  const totalEmt = hospitals.reduce((acc, h) => acc + h.emtCount, 0);

  const filteredTeams = staffTeams.filter((t) => {
    if (activeShift !== 'all' && t.currentShift !== activeShift) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingTeam(null);
    setFormData({
      hospitalName: 'รพ.นราธิวาสราชนครินทร์',
      district: 'เมืองนราธิวาส',
      department: 'อุบัติเหตุฉุกเฉิน (ER)',
      teamName: 'ทีมฉุกเฉิน Alpha 2',
      currentShift: 'ทีม A',
      doctorCount: 4,
      nurseCount: 16,
      emtCount: 4,
      readinessPct: 90,
      leaderName: 'นพ.หัวหน้าชุดปฏิบัติการ',
      contactPhone: '081-234-5678',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (team: StaffTeamItem) => {
    setEditingTeam(team);
    setFormData({ ...team });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamName) return;

    if (editingTeam) {
      onUpdateStaffTeam({
        ...editingTeam,
        ...(formData as StaffTeamItem),
      });
    } else {
      const newTeam: StaffTeamItem = {
        ...(formData as StaffTeamItem),
        id: `st-${Date.now()}`,
      };
      onAddStaffTeam(newTeam);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header with CRUD & Sheet Controls */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              ข้อ 7 | ดูแลประชาชน & บัญชาการ
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>กำลังคนบุคลากรทางการแพทย์ & ทีม A-B-C (CRUD ลง Sheet)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมต่อข้อมูลชีตแท็บ: <code className="text-cyan-300 font-mono">StaffRoster</code> (Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มทีมกำลังคน</span>
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
            <span>ความพร้อมรวม BCP</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">85% พร้อม</div>
          <div className="text-[11px] text-emerald-400 mt-1">เข้าเวรครบตามเกณฑ์ทีม A-B-C</div>
        </div>
      </div>

      {/* Staff Teams Roster Table (CRUD) */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>บัญชีชุดปฏิบัติการฉุกเฉินและเวรผลัด A-B-C (CRUD เชื่อมโยงชีต)</span>
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">กรองผลัด:</span>
            {(['all', 'ทีม A', 'ทีม B', 'ทีม C'] as const).map((shift) => (
              <button
                key={shift}
                onClick={() => setActiveShift(shift)}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  activeShift === shift
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {shift === 'all' ? 'ทั้งหมด' : shift}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">ชื่อทีม / แผนก</th>
                <th className="py-2.5 px-3">โรงพยาบาล/อำเภอ</th>
                <th className="py-2.5 px-2 text-center">ผลัดเวร</th>
                <th className="py-2.5 px-2 text-center">แพทย์ (คน)</th>
                <th className="py-2.5 px-2 text-center">พยาบาล (คน)</th>
                <th className="py-2.5 px-2 text-center">EMT (คน)</th>
                <th className="py-2.5 px-2 text-center">ความพร้อม</th>
                <th className="py-2.5 px-3">หัวหน้าทีม & เบอร์ติดต่อ</th>
                <th className="py-2.5 px-2 text-right">จัดการ (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredTeams.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <div>{t.teamName}</div>
                    <div className="text-[10px] text-cyan-300 font-normal">{t.department}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{t.hospitalName}</div>
                    <div className="text-[10px] text-slate-400">อ.{t.district}</div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.currentShift === 'ทีม A'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                          : t.currentShift === 'ทีม B'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                          : 'bg-purple-950 text-purple-300 border border-purple-500/50'
                      }`}
                    >
                      {t.currentShift}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold">{t.doctorCount}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold">{t.nurseCount}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-cyan-300">{t.emtCount}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-400">
                    {t.readinessPct}%
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-200">{t.leaderName}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3 text-cyan-400" />
                      <span>{t.contactPhone}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        title="แก้ไขข้อมูลทีม"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ยืนยันการลบ ${t.teamName} หรือไม่?`)) {
                            onDeleteStaffTeam(t.id);
                          }
                        }}
                        title="ลบทีม"
                        className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-lg shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users2 className="w-4 h-4 text-cyan-400" />
                <span>{editingTeam ? 'แก้ไขข้อมูลทีมกำลังคน' : 'เพิ่มทีมกำลังคนใหม่'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">ชื่อทีม / ชุดปฏิบัติการ *</label>
                <input
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">โรงพยาบาล</label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">แผนก / หอผู้ป่วย</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ผลัดเวรฉุกเฉิน</label>
                  <select
                    value={formData.currentShift}
                    onChange={(e) => setFormData({ ...formData, currentShift: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="ทีม A">ทีม A (ปฏิบัติหน้าที่หน้างาน)</option>
                    <option value="ทีม B">ทีม B (สแตนด์บาย 2 ชม.)</option>
                    <option value="ทีม C">ทีม C (สำรอง/EVAC Escort)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">แพทย์ (คน)</label>
                  <input
                    type="number"
                    value={formData.doctorCount}
                    onChange={(e) => setFormData({ ...formData, doctorCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">พยาบาล (คน)</label>
                  <input
                    type="number"
                    value={formData.nurseCount}
                    onChange={(e) => setFormData({ ...formData, nurseCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">EMT/กู้ชีพ (คน)</label>
                  <input
                    type="number"
                    value={formData.emtCount}
                    onChange={(e) => setFormData({ ...formData, emtCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">หัวหน้าทีม</label>
                  <input
                    type="text"
                    value={formData.leaderName}
                    onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
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
                  {editingTeam ? 'บันทึกการแก้ไข' : 'บันทึกทีม'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
