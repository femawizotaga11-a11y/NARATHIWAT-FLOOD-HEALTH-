import React, { useState } from 'react';
import { CommunicationLayer } from '../types/dashboard';
import {
  Radio,
  ShieldCheck,
  FileText,
  ArrowDown,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
} from 'lucide-react';

interface Props {
  communicationLayers: CommunicationLayer[];
  onAddLayer: (layer: CommunicationLayer) => void;
  onUpdateLayer: (layer: CommunicationLayer) => void;
  onDeleteLayer: (level: number) => void;
  onSyncWithSheet: () => void;
  onPullFromSheet: () => void;
  isSyncing: boolean;
}

export const CommunicationFailoverView: React.FC<Props> = ({
  communicationLayers,
  onAddLayer,
  onUpdateLayer,
  onDeleteLayer,
  onSyncWithSheet,
  onPullFromSheet,
  isSyncing,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<CommunicationLayer | null>(null);

  const [formData, setFormData] = useState<Partial<CommunicationLayer>>({
    level: 5,
    name: '',
    type: '',
    primaryChannel: '',
    equipment: '',
    coverage: '',
    responsibleOfficer: '',
    contact: '',
    failoverCondition: '',
    status: 'พร้อมใช้งาน',
    evidenceDocument: '',
  });

  const handleOpenAdd = () => {
    setEditingLayer(null);
    setFormData({
      level: communicationLayers.length + 1,
      name: '',
      type: '',
      primaryChannel: '',
      equipment: '',
      coverage: '',
      responsibleOfficer: '',
      contact: '',
      failoverCondition: '',
      status: 'พร้อมใช้งาน',
      evidenceDocument: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (layer: CommunicationLayer) => {
    setEditingLayer(layer);
    setFormData({ ...layer });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingLayer) {
      onUpdateLayer({
        ...editingLayer,
        ...(formData as CommunicationLayer),
      });
    } else {
      const levelNum = Number(formData.level) || communicationLayers.length + 1;
      const newLayer: CommunicationLayer = {
        ...(formData as CommunicationLayer),
        id: `com-${Date.now()}`,
        level: levelNum,
        code: formData.code || `REG-COM-${String(levelNum).padStart(3, '0')}`,
      } as CommunicationLayer;
      onAddLayer(newLayer);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header with CRUD & Sheet Controls */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold">
              ข้อ 10 | ขีดความสามารถสถานพยาบาล
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>ความพร้อมระบบสื่อสารและแผนสำรอง 4 ระดับ (CRUD ลง Sheet)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เชื่อมต่อข้อมูลชีตแท็บ: <code className="text-cyan-300 font-mono">CommunicationLayers</code> (Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/50 font-mono font-bold">
              ทะเบียน: REG-COM-001 ~ REG-COM-004 ({communicationLayers.length} ระดับสื่อสารสำรอง)
            </span>
            <span className="text-slate-400">
              ➔ ครอบคลุม 13 โรงพยาบาล (ข้อ 8: REG-HOS-001~013) และ สสจ. นราธิวาส 100%
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
            <span>เพิ่มระดับการสื่อสาร</span>
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

      {/* 4-Tier Cascade Protocol Visualization with Edit/Delete */}
      <div className="space-y-4">
        {communicationLayers.map((layer, idx) => {
          const isPrimary = layer.level === 1;

          return (
            <div key={layer.level} className="relative">
              {idx > 0 && (
                <div className="flex justify-center -my-2.5 relative z-10">
                  <div className="bg-slate-800 border border-slate-700 px-3 py-0.5 rounded-full text-[10px] text-amber-300 font-bold flex items-center gap-1 shadow">
                    <ArrowDown className="w-3 h-3 text-amber-400" />
                    <span>หากระดับ {layer.level - 1} ล่ม ➔ สลับใช้ระดับ {layer.level} ทันที</span>
                  </div>
                </div>
              )}

              <div
                className={`p-4 rounded-xl border shadow-xl transition-all ${
                  isPrimary
                    ? 'bg-slate-900/95 border-emerald-500/50'
                    : layer.level === 2
                    ? 'bg-slate-900/90 border-cyan-500/50'
                    : layer.level === 3
                    ? 'bg-slate-900/90 border-amber-500/50'
                    : 'bg-slate-900/90 border-purple-500/60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow font-mono text-sm ${
                        layer.level === 1
                          ? 'bg-emerald-600'
                          : layer.level === 2
                          ? 'bg-cyan-600'
                          : layer.level === 3
                          ? 'bg-amber-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      L{layer.level}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="flex items-center gap-1.5">
                          <span>ระดับที่ {layer.level}: {layer.name}</span>
                          {layer.code && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-purple-300 font-mono">
                              {layer.code}
                            </span>
                          )}
                        </span>
                        {isPrimary && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                            หลัก
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-cyan-300 font-medium mt-0.5">
                        {layer.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono">
                      {layer.status}
                    </span>

                    <button
                      onClick={() => handleOpenEdit(layer)}
                      title="แก้ไข"
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`ยืนยันการลบระดับที่ ${layer.level} หรือไม่?`)) {
                          onDeleteLayer(layer.level);
                        }
                      }}
                      title="ลบ"
                      className="p-1.5 rounded bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-0.5">ช่องทางหลัก & ความถี่</div>
                    <div className="font-semibold text-white text-[11px] leading-snug">
                      {layer.primaryChannel}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-0.5">อุปกรณ์ประจำการ</div>
                    <div className="font-semibold text-slate-200 text-[11px] leading-snug">
                      {layer.equipment}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-0.5">เงื่อนไขสลับใช้ (Failover Trigger)</div>
                    <div className="font-semibold text-amber-300 text-[11px] leading-snug">
                      {layer.failoverCondition}
                    </div>
                  </div>
                </div>

                {/* Official Evidence & Responsible Officer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-[11px]">
                      <b>หลักฐานทางราชการ:</b> {layer.evidenceDocument}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    ผู้รับผิดชอบ: <span className="text-slate-200">{layer.responsibleOfficer}</span> ({layer.contact})
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-lg shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>{editingLayer ? 'แก้ไขระดับการสื่อสาร' : 'เพิ่มระดับการสื่อสารใหม่'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ลำดับชั้น (Level 1-5)</label>
                  <input
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">สถานะ</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                  >
                    <option value="เปิดใช้งานแล้ว">เปิดใช้งานแล้ว</option>
                    <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                    <option value="ขัดข้อง">ขัดข้อง</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ชื่อระบบสื่อสาร *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ประเภทโครงข่าย</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ช่องทางหลัก & คลื่นความถี่</label>
                <input
                  type="text"
                  value={formData.primaryChannel}
                  onChange={(e) => setFormData({ ...formData, primaryChannel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">อุปกรณ์ประจำการ</label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">เงื่อนไขการสลับมาใช้ (Failover Condition)</label>
                <input
                  type="text"
                  value={formData.failoverCondition}
                  onChange={(e) => setFormData({ ...formData, failoverCondition: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">เอกสารหลักฐานจริงทางราชการ</label>
                <input
                  type="text"
                  value={formData.evidenceDocument}
                  onChange={(e) => setFormData({ ...formData, evidenceDocument: e.target.value })}
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
                  {editingLayer ? 'บันทึกการแก้ไข' : 'บันทึกระดับการสื่อสาร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
