import React, { useState } from 'react';
import { HospitalStatus, RoadCutIncident, ReferralRouteItem } from '../types/dashboard';
import {
  Share2,
  Route,
  Bed,
  Ambulance,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';

interface Props {
  hospitals: HospitalStatus[];
  roadCuts: RoadCutIncident[];
  referralRoutes: ReferralRouteItem[];
  onAddRoute: (route: ReferralRouteItem) => void;
  onUpdateRoute: (route: ReferralRouteItem) => void;
  onDeleteRoute: (id: string) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
}

export const ReferralOpohView: React.FC<Props> = ({
  hospitals,
  roadCuts,
  referralRoutes,
  onAddRoute,
  onUpdateRoute,
  onDeleteRoute,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
}) => {
  const [selectedRouteStrategy, setSelectedRouteStrategy] = useState<'land' | 'water' | 'air'>('land');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<ReferralRouteItem | null>(null);

  const [formData, setFormData] = useState<Partial<ReferralRouteItem>>({
    originHospital: 'รพ.สุไหงโก-ลก',
    destinationHospital: 'รพ.นราธิวาสราชนครินทร์',
    routeType: 'ทางบก',
    primaryPath: 'ทล. 4056',
    bypassPath: 'ทล. 4057 ผ่านสุไหงปาดี-ระแงะ',
    estimatedMinutes: 60,
    safetyStatus: 'พร้อมใช้',
    vehicleNeeded: 'รถ 4WD ยกสูง',
    availableBeds: 50,
  });

  const mainHub = hospitals.find((h) => h.id === 'h-1');
  const southHub = hospitals.find((h) => h.id === 'h-2');

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setFormData({
      originHospital: 'รพ.สุไหงโก-ลก',
      destinationHospital: 'รพ.นราธิวาสราชนครินทร์',
      routeType: 'ทางบก',
      primaryPath: 'ทล. 4056',
      bypassPath: 'ทล. 4057 ผ่านสุไหงปาดี-ระแงะ (รถยกสูงนำขบวน)',
      estimatedMinutes: 60,
      safetyStatus: 'พร้อมใช้',
      vehicleNeeded: 'รถ 4WD ยกสูง',
      availableBeds: 50,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: ReferralRouteItem) => {
    setEditingRoute(route);
    setFormData({ ...route });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.originHospital) return;

    if (editingRoute) {
      onUpdateRoute({
        ...editingRoute,
        ...(formData as ReferralRouteItem),
      });
    } else {
      const newRoute: ReferralRouteItem = {
        ...(formData as ReferralRouteItem),
        id: `ref-${Date.now()}`,
        code: formData.code || `REG-REF-${String(referralRoutes.length + 1).padStart(3, '0')}`,
      };
      onAddRoute(newRoute);
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
              ข้อ 5 | ดูแลประชาชน & บัญชาการ
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>ความพร้อมส่งต่อ Dynamic Referral & OPOH (CRUD ลง Sheet)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมต่อข้อมูลชีตแท็บ: <code className="text-cyan-300 font-mono">ReferralRoutes</code> (Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-mono font-bold">
              ทะเบียน: REG-REF-001 ~ REG-REF-005 ({referralRoutes.length} เส้นทางส่งต่อ)
            </span>
            <span className="text-slate-400">
              ➔ เชื่อมโยงเตียงว่างปลายทางตรงกับ 13 รพ. (ข้อ 8: REG-HOS-001 มีเตียงว่าง {mainHub ? mainHub.bedTotal - mainHub.bedOccupied : 52} เตียง)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มเส้นทางส่งต่อ</span>
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
              <span className="font-bold text-sky-200">{mainHub?.name || 'รพ.นราธิวาสราชนครินทร์'} (A+)</span>
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
              <span className="font-bold text-white">{southHub?.name || 'รพ.สุไหงโก-ลก'} (A+)</span>
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

          {/* Regional Tertiary Hub */}
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

      {/* Referral Routes Table (CRUD) */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Route className="w-4 h-4 text-emerald-400" />
          <span>เส้นทางส่งต่อฉุกเฉินและการแก้ไขปัญหาทางขาด (CRUD เชื่อมโยงชีต)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">ต้นทาง ➔ ปลายทาง</th>
                <th className="py-2.5 px-2 text-center">ประเภท</th>
                <th className="py-2.5 px-3">เส้นทางหลัก</th>
                <th className="py-2.5 px-3">เส้นทางสำรอง (Bypass)</th>
                <th className="py-2.5 px-2 text-center">เวลาเดินทาง</th>
                <th className="py-2.5 px-2 text-center">สถานะ</th>
                <th className="py-2.5 px-3">พาหนะ</th>
                <th className="py-2.5 px-2 text-right">จัดการ (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {referralRoutes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{r.originHospital} ➔ {r.destinationHospital}</span>
                      {r.code && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-cyan-300 font-mono">
                          {r.code}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      เตียงปลายทาง: <span className="text-emerald-300 font-bold">{r.availableBeds || 50} เตียง</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                      {r.routeType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{r.primaryPath}</td>
                  <td className="py-2.5 px-3 text-emerald-300 max-w-xs truncate">{r.bypassPath}</td>
                  <td className="py-2.5 px-2 text-center font-mono font-bold">{r.estimatedMinutes} นาที</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                      {r.safetyStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 text-[11px]">{r.vehicleNeeded}</td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(r)}
                        title="แก้ไข"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ยืนยันการลบเส้นทาง ${r.originHospital} -> ${r.destinationHospital} หรือไม่?`)) {
                            onDeleteRoute(r.id);
                          }
                        }}
                        title="ลบ"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-lg shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Route className="w-4 h-4 text-cyan-400" />
                <span>{editingRoute ? 'แก้ไขเส้นทางส่งต่อ' : 'เพิ่มเส้นทางส่งต่อใหม่'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">รพ. ต้นทาง *</label>
                  <input
                    type="text"
                    required
                    value={formData.originHospital}
                    onChange={(e) => setFormData({ ...formData, originHospital: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">รพ. ปลายทาง *</label>
                  <input
                    type="text"
                    required
                    value={formData.destinationHospital}
                    onChange={(e) => setFormData({ ...formData, destinationHospital: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ประเภท</label>
                  <select
                    value={formData.routeType}
                    onChange={(e) => setFormData({ ...formData, routeType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="ทางบก">ทางบก</option>
                    <option value="ทางน้ำ">ทางน้ำ</option>
                    <option value="ทางอากาศ">ทางอากาศ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">เวลาเดินทาง (นาที)</label>
                  <input
                    type="number"
                    value={formData.estimatedMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedMinutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">สถานะ</label>
                  <select
                    value={formData.safetyStatus}
                    onChange={(e) => setFormData({ ...formData, safetyStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="พร้อมใช้">พร้อมใช้</option>
                    <option value="เฝ้าระวัง">เฝ้าระวัง</option>
                    <option value="วิกฤต">วิกฤต</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">เส้นทางหลัก</label>
                <input
                  type="text"
                  value={formData.primaryPath}
                  onChange={(e) => setFormData({ ...formData, primaryPath: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">เส้นทางสำรอง (Bypass)</label>
                <input
                  type="text"
                  value={formData.bypassPath}
                  onChange={(e) => setFormData({ ...formData, bypassPath: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ยานพาหนะที่ต้องการ</label>
                <input
                  type="text"
                  value={formData.vehicleNeeded}
                  onChange={(e) => setFormData({ ...formData, vehicleNeeded: e.target.value })}
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
                  {editingRoute ? 'บันทึกการแก้ไข' : 'บันทึกเส้นทาง'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
