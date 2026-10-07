import React, { useState } from 'react';
import { BcpResourceItem } from '../types/dashboard';
import {
  Zap,
  Wind,
  Droplet,
  Pill,
  HeartPulse,
  Fuel,
  Utensils,
  Users2,
  Package,
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';

interface Props {
  bcpItems: BcpResourceItem[];
  onAddBcpItem: (item: BcpResourceItem) => void;
  onUpdateBcpItem: (item: BcpResourceItem) => void;
  onDeleteBcpItem: (id: string) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
}

export const BcpResourcesView: React.FC<Props> = ({
  bcpItems,
  onAddBcpItem,
  onUpdateBcpItem,
  onDeleteBcpItem,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BcpResourceItem | null>(null);

  const [formData, setFormData] = useState<Partial<BcpResourceItem>>({
    title: '',
    duration: 'คงอยู่ได้ 72 ชม.',
    status: 'พร้อม',
    statusType: 'success',
    detail: '',
    contingencyPlan: '',
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      duration: 'คงอยู่ได้ 72 ชม.',
      status: 'พร้อม',
      statusType: 'success',
      detail: '',
      contingencyPlan: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BcpResourceItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingItem) {
      onUpdateBcpItem({
        ...editingItem,
        ...(formData as BcpResourceItem),
      });
    } else {
      const newItem: BcpResourceItem = {
        ...(formData as BcpResourceItem),
        id: `bcp-${Date.now()}`,
        code: formData.code || `REG-BCP-${String(bcpItems.length + 1).padStart(3, '0')}`,
      };
      onAddBcpItem(newItem);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header with CRUD & Sheet Controls */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold">
              ข้อ 6 | ดูแลประชาชน & บัญชาการ
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>ทรัพยากรและความต่อเนื่อง BCP จังหวัด 9 ด้าน (CRUD ลง Sheet)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมต่อข้อมูลชีตแท็บ: <code className="text-cyan-300 font-mono">BcpResources</code> (Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/50 font-mono font-bold">
              ทะเบียน: REG-BCP-001 ~ REG-BCP-009 ({bcpItems.length} หมวดทรัพยากร)
            </span>
            <span className="text-slate-400">
              ➔ เชื่อมโยงขีดความสามารถ 13 รพ. (ข้อ 8: ไฟฟ้า 72 ชม., O2 48 ชม.) และแผนส่งกำลังบำรุงนำเข้า (ข้อ 11: REG-REP-xxx)
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
            <span>เพิ่มทรัพยากร BCP</span>
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

      {/* Grid of BCP Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bcpItems.map((item) => {
          const isWarning = item.status === 'เฝ้าระวัง' || item.status === 'เสี่ยงขาด';
          const isDanger = item.status === 'วิกฤต';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border shadow-lg transition-all ${
                isDanger
                  ? 'bg-rose-950/20 border-rose-500/50'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/50'
                  : 'bg-slate-900/80 border-sky-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    {item.code && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-blue-300 font-mono">
                        {item.code}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                    {item.duration}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDanger
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/60'
                        : isWarning
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/60'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                    }`}
                  >
                    {item.status}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="แก้ไข"
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`ยืนยันการลบ ${item.title} หรือไม่?`)) {
                        onDeleteBcpItem(item.id);
                      }
                    }}
                    title="ลบ"
                    className="p-1 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs space-y-1.5">
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <b>สภาพปัจจุบัน:</b> {item.detail}
                </div>
                <div className="text-cyan-200/90 text-[11px] leading-relaxed bg-slate-950/70 p-2 rounded border border-slate-800">
                  <span className="font-semibold text-cyan-400">แผนฉุกเฉิน (Contingency): </span>
                  {item.contingencyPlan}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BCP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-lg shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{editingItem ? 'แก้ไขทรัพยากร BCP' : 'เพิ่มทรัพยากร BCP ใหม่'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">ชื่อทรัพยากร / หมวดหมู่ *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  placeholder="เช่น ไฟฟ้าสำรอง / Generator"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ระยะเวลาความอยู่รอด</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                    placeholder="เช่น คงอยู่ได้ 72 ชม."
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="พร้อม">พร้อม (Normal)</option>
                    <option value="เฝ้าระวัง">เฝ้าระวัง (Warning)</option>
                    <option value="เสี่ยงขาด">เสี่ยงขาด (Risk)</option>
                    <option value="วิกฤต">วิกฤต (Critical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">รายละเอียดสภาพปัจจุบัน</label>
                <textarea
                  rows={2}
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">แผนรองรับฉุกเฉิน (Contingency Plan)</label>
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
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกทรัพยากร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
