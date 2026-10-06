import React, { useState } from 'react';
import { ReplenishmentPlan } from '../types/dashboard';
import {
  Truck,
  Fuel,
  Wind,
  Pill,
  HeartPulse,
  Droplet,
  Clock,
  ShieldAlert,
  ArrowRight,
  Anchor,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Search,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { DEFAULT_SHEET_ID } from '../services/apiService';

interface Props {
  plans: ReplenishmentPlan[];
  onAddPlan: (plan: ReplenishmentPlan) => void;
  onUpdatePlan: (plan: ReplenishmentPlan) => void;
  onDeletePlan: (id: string) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
}

export const SupplyReplenishmentView: React.FC<Props> = ({
  plans,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
}) => {
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ReplenishmentPlan | null>(null);

  const [formData, setFormData] = useState<Partial<ReplenishmentPlan>>({
    resourceCategory: 'น้ำมันเชื้อเพลิง (Fuel)',
    triggerThreshold: 'สำรองคงเหลือ < 24 ชม.',
    primaryInboundRoute: 'ทางบก ทล.42 สงขลา-ปัตตานี-นราธิวาส',
    backupInboundRoute: 'ทางเรือ กองทัพเรือภาค 2 เทียบท่าเรือตากใบ',
    transportMode: 'ขบวนรถ 4WD ยกสูง + ทหารนำขบวน',
    supplyHubOrigin: 'คลังน้ำมัน ปตท. สงขลา',
    contactPerson: 'พ.อ. ฝ่ายส่งกำลังบำรุง กอ.รมน. / สสจ. 081-999-1234',
    slaHours: 6,
    status: 'เตรียมพร้อมระดับ 2',
  });

  const filteredPlans = plans.filter((p) => {
    if (filterMode !== 'all' && !p.transportMode.includes(filterMode)) return false;
    if (search && !p.resourceCategory.toLowerCase().includes(search.toLowerCase()) && !p.supplyHubOrigin.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      resourceCategory: 'น้ำมันเชื้อเพลิง (Fuel)',
      triggerThreshold: 'สำรองคงเหลือ < 24 ชม.',
      primaryInboundRoute: 'ทางบก ทล.42 สงขลา-ปัตตานี-นราธิวาส',
      backupInboundRoute: 'ทางเรือ กองทัพเรือภาค 2 เทียบท่าเรือตากใบ',
      transportMode: 'ขบวนรถ 4WD ยกสูง + ทหารนำขบวน',
      supplyHubOrigin: 'คลังน้ำมัน ปตท. สงขลา',
      contactPerson: 'พ.อ. ฝ่ายส่งกำลังบำรุง กอ.รมน. / สสจ. 081-999-1234',
      slaHours: 6,
      status: 'เตรียมพร้อมระดับ 2',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: ReplenishmentPlan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceCategory) return;

    if (editingPlan) {
      onUpdatePlan({
        ...editingPlan,
        ...formData,
      } as ReplenishmentPlan);
    } else {
      const newPlan: ReplenishmentPlan = {
        id: `rep-${Date.now()}`,
        resourceCategory: formData.resourceCategory as any,
        triggerThreshold: formData.triggerThreshold || 'สำรองคงเหลือ < 24 ชม.',
        primaryInboundRoute: formData.primaryInboundRoute || '-',
        backupInboundRoute: formData.backupInboundRoute || '-',
        transportMode: formData.transportMode as any,
        supplyHubOrigin: formData.supplyHubOrigin || '-',
        contactPerson: formData.contactPerson || '-',
        slaHours: Number(formData.slaHours) || 6,
        status: (formData.status as any) || 'เตรียมพร้อมระดับ 2',
      };
      onAddPlan(newPlan);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              ข้อ 11 | ขีดความสามารถสถานพยาบาล
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white">
              แผนการลำเลียงทรัพยากรนำเข้าจังหวัด (เมื่อเกิน RTO หรือทรัพยากรสำรองหมด)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ขั้นตอนปฏิบัติการนำเข้าน้ำมันเชื้อเพลิง, ออกซิเจนการแพทย์, เลือด, ยาและเวชภัณฑ์ จากภายนอกจังหวัดนราธิวาส (เขตสุขภาพที่ 12)
          </p>
        </div>

        {/* Sheet Actions & Add */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sheet ID: {DEFAULT_SHEET_ID.substring(0, 10)}...</span>
          </div>

          <button
            onClick={onPullFromSheet}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isSyncing ? 'กำลังดึง...' : 'ดึงจาก Sheet'}</span>
          </button>

          <button
            onClick={onSyncWithSheet}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 text-xs font-medium flex items-center gap-1.5 transition shadow"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isSyncing ? 'กำลังส่ง...' : 'บันทึกลง Sheet'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแผนนำเข้า</span>
          </button>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาหมวดทรัพยากร, คลังต้นทาง, เส้นทาง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">โหมดยานพาหนะ:</span>
          {['all', 'อากาศยาน', 'เรือ', '4WD'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={`px-2.5 py-1 rounded text-xs transition ${
                filterMode === m
                  ? 'bg-cyan-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {m === 'all' ? 'ทั้งหมด' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Plans List with CRUD buttons */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>บัญชีแผนรองรับการส่งกำลังบำรุงฉุกเฉิน ({filteredPlans.length} รายการ - CRUD Google Sheet)</span>
          </h3>
          <span className="text-xs text-slate-400">
            ยึดข้อมูลตาม Google Sheet เป็นหลัก
          </span>
        </div>

        <div className="space-y-3">
          {filteredPlans.map((plan) => (
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

                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="แก้ไข"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`ยืนยันการลบแผน "${plan.resourceCategory}"?`)) {
                        onDeletePlan(plan.id);
                      }
                    }}
                    className="p-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition"
                    title="ลบ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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

              <div className="pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>โหมดขนส่ง: <b className="text-white">{plan.transportMode}</b></span>
                <span>ผู้ประสานงานหลัก: <b className="text-cyan-300">{plan.contactPerson}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-700/60 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-400" />
              <span>{editingPlan ? 'แก้ไขแผนการนำเข้าทรัพยากร' : 'เพิ่มแผนการนำเข้าทรัพยากรใหม่ (CRUD)'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">หมวดหมู่ทรัพยากร</label>
                  <input
                    type="text"
                    value={formData.resourceCategory || ''}
                    onChange={(e) => setFormData({ ...formData, resourceCategory: e.target.value as any })}
                    placeholder="เช่น น้ำมันเชื้อเพลิง, ออกซิเจน, โลหิต"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">โหมดการขนส่ง</label>
                  <select
                    value={formData.transportMode || 'อากาศยาน (ฮ.)'}
                    onChange={(e) => setFormData({ ...formData, transportMode: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="อากาศยาน (ฮ.)">อากาศยาน (ฮ. Ka-32 / MI-17 / C-130)</option>
                    <option value="เรือลำเลียง กองทัพเรือ/ปภ.">เรือลำเลียง กองทัพเรือภาค 2 / ปภ.</option>
                    <option value="ขบวนรถ 4WD ยกสูง + ทหารนำขบวน">ขบวนรถ 4WD ยกสูง + ทหาร มทบ.46 นำขบวน</option>
                    <option value="ศูนย์สุขภาพที่ 12 สงขลา">ศูนย์สนับสนุนบริการสุขภาพที่ 12 สงขลา</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">เกณฑ์สั่งการขนส่ง (Trigger Threshold)</label>
                  <input
                    type="text"
                    value={formData.triggerThreshold || ''}
                    onChange={(e) => setFormData({ ...formData, triggerThreshold: e.target.value })}
                    placeholder="เช่น สำรองคงเหลือ < 24 ชม."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">SLA เวลาลำเลียง (ชั่วโมง)</label>
                  <input
                    type="number"
                    value={formData.slaHours || 6}
                    onChange={(e) => setFormData({ ...formData, slaHours: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    min={1}
                    max={72}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">คลังต้นทางส่งกำลัง (Origin Hub)</label>
                  <input
                    type="text"
                    value={formData.supplyHubOrigin || ''}
                    onChange={(e) => setFormData({ ...formData, supplyHubOrigin: e.target.value })}
                    placeholder="เช่น คลังน้ำมัน ปตท. สงขลา / คลังยา รพ.หาดใหญ่"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">เส้นทางนำเข้าหลัก (Primary Inbound)</label>
                  <textarea
                    rows={2}
                    value={formData.primaryInboundRoute || ''}
                    onChange={(e) => setFormData({ ...formData, primaryInboundRoute: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">เส้นทางนำเข้าสำรอง (Backup Inbound)</label>
                  <textarea
                    rows={2}
                    value={formData.backupInboundRoute || ''}
                    onChange={(e) => setFormData({ ...formData, backupInboundRoute: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">ผู้ประสานงานหลัก & เบอร์ติดต่อ</label>
                  <input
                    type="text"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="ชื่อตำแหน่ง และเบอร์โทรศัพท์"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">สถานะความพร้อม</label>
                  <select
                    value={formData.status || 'เตรียมพร้อมระดับ 2'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="เตรียมพร้อมระดับ 2">เตรียมพร้อมระดับ 2</option>
                    <option value="พร้อมขนส่งทันที">พร้อมขนส่งทันที</option>
                    <option value="ปฏิบัติการอยู่">ปฏิบัติการอยู่</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
