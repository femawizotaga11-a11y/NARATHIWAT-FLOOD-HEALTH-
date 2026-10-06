import React, { useState } from 'react';
import { ShphItem } from '../types/dashboard';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  XCircle,
  Building2,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Phone,
  Users,
} from 'lucide-react';

interface Props {
  shphList: ShphItem[];
  onAddShph: (item: ShphItem) => void;
  onUpdateShph: (item: ShphItem) => void;
  onDeleteShph: (id: string) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
}

export const ShphNetworkView: React.FC<Props> = ({
  shphList,
  onAddShph,
  onUpdateShph,
  onDeleteShph,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
}) => {
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShph, setEditingShph] = useState<ShphItem | null>(null);

  const [formData, setFormData] = useState<Partial<ShphItem>>({
    name: '',
    district: 'สุไหงโก-ลก',
    subdistrict: 'มูโนะ',
    status: 'เสี่ยง',
    totalStaff: 6,
    phone: '073-611245',
    vulnerableCovered: 35,
    riskLevel: 'แดง',
    contingencyPlan: 'เปิดจุดบริการชั่วคราว ณ มัสยิดดอน พร้อมสำรองยา 30 วัน',
  });

  const districts = Array.from(new Set(shphList.map((s) => s.district)));

  const filtered = shphList.filter((s) => {
    if (filterDistrict !== 'all' && s.district !== filterDistrict) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingShph(null);
    setFormData({
      name: '',
      district: 'สุไหงโก-ลก',
      subdistrict: 'มูโนะ',
      status: 'เสี่ยง',
      totalStaff: 6,
      phone: '073-611245',
      vulnerableCovered: 35,
      riskLevel: 'แดง',
      contingencyPlan: 'เปิดจุดบริการชั่วคราว ณ อาคารมัสยิดดอน พร้อมสำรองยา 30 วัน',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shph: ShphItem) => {
    setEditingShph(shph);
    setFormData({ ...shph });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingShph) {
      onUpdateShph({
        ...editingShph,
        ...(formData as ShphItem),
      });
    } else {
      const newItem: ShphItem = {
        ...(formData as ShphItem),
        id: `shph-${Date.now()}`,
      };
      onAddShph(newItem);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header with CRUD & Sheet Controls */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              ข้อ 9 | ขีดความสามารถสถานพยาบาล
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>เครือข่ายโรงพยาบาลส่งเสริมสุขภาพตำบล 111 แห่ง (CRUD ลง Sheet)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมต่อข้อมูลชีตแท็บ: <code className="text-cyan-300 font-mono">ShphNetwork</code> (Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่ม รพ.สต.</span>
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

      {/* SHPH List Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>รายชื่อ รพ.สต. ในพื้นที่เสี่ยง (สามารถแก้ไข/ลบ/เพิ่ม และส่งขึ้นชีตได้ทันที)</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="all">ทุกอำเภอ</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="ปกติ">ปกติ</option>
              <option value="เฝ้าระวัง">เฝ้าระวัง</option>
              <option value="เสี่ยง">เสี่ยง</option>
              <option value="ปิดบริการ">ปิดบริการ</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">ชื่อ รพ.สต.</th>
                <th className="py-2.5 px-3">อำเภอ/ตำบล</th>
                <th className="py-2.5 px-2 text-center">สถานะ</th>
                <th className="py-2.5 px-2 text-center">ระดับความเสี่ยง</th>
                <th className="py-2.5 px-2 text-center">จนท.</th>
                <th className="py-2.5 px-2 text-center">ดูแลกลุ่มเปราะบาง</th>
                <th className="py-2.5 px-3">แผนสำรอง BCP</th>
                <th className="py-2.5 px-2 text-right">จัดการ (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-sky-200">
                    <div>{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-cyan-400" />
                      <span>{s.phone}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div>อ.{s.district}</div>
                    <div className="text-[10px] text-slate-400">ต.{s.subdistrict}</div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.status === 'เสี่ยง'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                          : s.status === 'เฝ้าระวัง'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        s.riskLevel === 'แดง'
                          ? 'bg-red-900/60 text-red-200'
                          : s.riskLevel === 'ส้ม'
                          ? 'bg-orange-900/60 text-orange-200'
                          : s.riskLevel === 'เหลือง'
                          ? 'bg-amber-900/60 text-amber-200'
                          : 'bg-emerald-900/60 text-emerald-200'
                      }`}
                    >
                      สี{s.riskLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">{s.totalStaff} คน</td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold text-cyan-300">
                    {s.vulnerableCovered} ราย
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px] max-w-xs truncate">
                    {s.contingencyPlan}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        title="แก้ไขข้อมูล รพ.สต."
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ยืนยันการลบ ${s.name} หรือไม่?`)) {
                            onDeleteShph(s.id);
                          }
                        }}
                        title="ลบ รพ.สต."
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

      {/* SHPH Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-lg shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>{editingShph ? 'แก้ไขข้อมูล รพ.สต.' : 'เพิ่ม รพ.สต. ใหม่'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">ชื่อ รพ.สต. *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  placeholder="เช่น รพ.สต.มูโนะ"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-slate-400 mb-1">ตำบล</label>
                  <input
                    type="text"
                    value={formData.subdistrict}
                    onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="ปกติ">ปกติ</option>
                    <option value="เฝ้าระวัง">เฝ้าระวัง</option>
                    <option value="เสี่ยง">เสี่ยง</option>
                    <option value="ปิดบริการ">ปิดบริการ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ระดับความเสี่ยง</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="แดง">สีแดง</option>
                    <option value="ส้ม">สีส้ม</option>
                    <option value="เหลือง">สีเหลือง</option>
                    <option value="เขียว">สีเขียว</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">จำนวนเจ้าหน้าที่ (คน)</label>
                  <input
                    type="number"
                    value={formData.totalStaff}
                    onChange={(e) => setFormData({ ...formData, totalStaff: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">กลุ่มเปราะบางในเขต (ราย)</label>
                  <input
                    type="number"
                    value={formData.vulnerableCovered}
                    onChange={(e) => setFormData({ ...formData, vulnerableCovered: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">แผนรองรับ BCP / จุดสำรอง</label>
                <textarea
                  rows={2}
                  value={formData.contingencyPlan}
                  onChange={(e) => setFormData({ ...formData, contingencyPlan: e.target.value })}
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
                  {editingShph ? 'บันทึกการแก้ไข' : 'บันทึก รพ.สต.'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
