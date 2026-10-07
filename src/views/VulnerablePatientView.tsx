import React, { useState } from 'react';
import { VulnerablePatient, VulnerableCategory, EvacuationStatus } from '../types/dashboard';
import { VULNERABLE_CATEGORY_CONFIG } from '../data/mockEocData';
import {
  HeartHandshake,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Phone,
  MapPin,
  Ambulance,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  patients: VulnerablePatient[];
  onAddPatient: (patient: VulnerablePatient) => void;
  onUpdatePatient: (patient: VulnerablePatient) => void;
  onDeletePatient: (id: string) => void;
  onOpenSheetSync: () => void;
  isSyncing: boolean;
}

export const VulnerablePatientView: React.FC<Props> = ({
  patients,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  onOpenSheetSync,
  isSyncing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<VulnerablePatient | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<VulnerablePatient>>({
    fullName: '',
    idCardMasked: '',
    age: 45,
    category: 'pregnant_risk',
    conditionDetail: '',
    phone: '',
    relativePhone: '',
    district: 'สุไหงโก-ลก',
    subdistrict: 'มูโนะ',
    villageNo: 'หมู่ 1',
    address: '',
    shphResponsible: 'รพ.สต.มูโนะ',
    hospitalRef: 'รพ.สุไหงโก-ลก',
    evacuationStatus: 'pending',
    shelterTarget: 'รพ.นราธิวาสราชนครินทร์',
    urgencyLevel: 'วิกฤตมาก',
    assignedTeam: 'ทีมกู้ชีพเทศบาล',
    transportVehicleNeeded: 'รถพยาบาลฉุกเฉิน',
  });

  const districts = [
    'เมืองนราธิวาส',
    'สุไหงโก-ลก',
    'ตากใบ',
    'ระแงะ',
    'รือเสาะ',
    'ยี่งอ',
    'สุไหงปาดี',
    'เจาะไอร้อง',
    'จะแนะ',
    'ศรีสาคร',
    'แว้ง',
    'สุคิริน',
    'บาเจาะ',
  ];

  const filteredPatients = patients.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedDistrict !== 'all' && p.district !== selectedDistrict) return false;
    if (selectedStatus !== 'all' && p.evacuationStatus !== selectedStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        p.fullName.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.conditionDetail.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingPatient(null);
    setFormData({
      fullName: '',
      idCardMasked: '1-96xx-xxxxx-xx-' + Math.floor(Math.random() * 9),
      age: 45,
      category: 'pregnant_risk',
      conditionDetail: '',
      phone: '08' + Math.floor(10000000 + Math.random() * 90000000),
      relativePhone: '08' + Math.floor(10000000 + Math.random() * 90000000),
      district: 'สุไหงโก-ลก',
      subdistrict: 'มูโนะ',
      villageNo: 'หมู่ 1',
      address: 'ตำบลมูโนะ ริมน้ำโก-ลก',
      shphResponsible: 'รพ.สต.มูโนะ',
      hospitalRef: 'รพ.สุไหงโก-ลก',
      evacuationStatus: 'pending',
      shelterTarget: 'รพ.นราธิวาสราชนครินทร์',
      urgencyLevel: 'วิกฤตมาก',
      assignedTeam: 'ทีมกู้ชีพ ปภ. และ อสม.',
      transportVehicleNeeded: 'รถพยาบาลฉุกเฉิน',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: VulnerablePatient) => {
    setEditingPatient(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) {
      alert('กรุณากรอกชื่อ-นามสกุล');
      return;
    }

    if (editingPatient) {
      const updated: VulnerablePatient = {
        ...editingPatient,
        ...(formData as VulnerablePatient),
        lastUpdated: 'แก้ไขเมื่อสักครู่',
      };
      onUpdatePatient(updated);
    } else {
      const newPatient: VulnerablePatient = {
        ...(formData as VulnerablePatient),
        id: `pat-${Date.now()}`,
        code: formData.code || `REG-VUL-${String(patients.length + 1).padStart(3, '0')}`,
        lastUpdated: 'สร้างใหม่เมื่อสักครู่',
      };
      onAddPatient(newPatient);
    }

    setIsModalOpen(false);
  };

  const handleQuickStatusChange = (patient: VulnerablePatient, newStatus: EvacuationStatus) => {
    onUpdatePatient({
      ...patient,
      evacuationStatus: newStatus,
      lastUpdated: 'เปลี่ยนสถานะเมื่อสักครู่',
    });
  };

  const exportCsv = () => {
    const headers = [
      'รหัส',
      'ชื่อ-สกุล',
      'เลขบัตร',
      'อายุ',
      'กลุ่มเสี่ยง',
      'รายละเอียดอาการ',
      'เบอร์โทร',
      'เบอร์ญาติ',
      'อำเภอ',
      'ตำบล',
      'หมู่ที่',
      'ที่อยู่',
      'รพ.สต.',
      'รพ.แม่ข่าย',
      'สถานะการอพยพ',
      'สถานที่เป้าหมาย',
      'ความเร่งด่วน',
      'ทีมช่วยเหลือ',
      'พาหนะ',
    ];

    const rows = filteredPatients.map((p) => [
      `"${p.code}"`,
      `"${p.fullName}"`,
      `"${p.idCardMasked}"`,
      p.age,
      `"${VULNERABLE_CATEGORY_CONFIG[p.category]?.label || p.category}"`,
      `"${p.conditionDetail}"`,
      `"${p.phone}"`,
      `"${p.relativePhone}"`,
      `"${p.district}"`,
      `"${p.subdistrict}"`,
      `"${p.villageNo}"`,
      `"${p.address}"`,
      `"${p.shphResponsible}"`,
      `"${p.hospitalRef}"`,
      `"${p.evacuationStatus}"`,
      `"${p.shelterTarget}"`,
      `"${p.urgencyLevel}"`,
      `"${p.assignedTeam}"`,
      `"${p.transportVehicleNeeded}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vulnerable_Patients_Narathiwat_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const getStatusBadge = (status: EvacuationStatus) => {
    switch (status) {
      case 'evacuated':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold text-[10px]">
            ✓ อพยพสำเร็จแล้ว
          </span>
        );
      case 'in_transit':
        return (
          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold text-[10px] animate-pulse">
            ➔ กำลังเคลื่อนย้าย
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/50 font-bold text-[10px]">
            ☎ ติดต่อแล้ว/เตรียมพร้อม
          </span>
        );
      case 'declined':
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-bold text-[10px]">
            ✕ ปฏิเสธย้าย/มีญาติดูแล
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50 font-bold text-[10px]">
            ● รอดำเนินการ
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              ข้อ 4 | ดูแลประชาชน & บัญชาการ
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
              CRUD Sheet 100%
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>ทะเบียนกลุ่มผู้ป่วยเปราะบางที่ต้องเคลื่อนย้าย (Vulnerable Patient Registry & CRUD)</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            ระบบบริหารรายชื่อ ที่อยู่ เบอร์โทรติดต่อ แผนอพยพด่วน (EVAC ก่อนน้ำท่วม) เชื่อมโยงกับ Google Sheet ID: <code className="text-cyan-300">13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY</code>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-500/50 font-mono font-bold">
              ทะเบียน: REG-VUL-001 ~ REG-VUL-014 ({patients.length} รายการในระบบ / รวม 1,284 ราย 13 อำเภอ)
            </span>
            <span className="text-slate-400">
              ➔ เชื่อมโยง รพ.รับส่งต่อ 13 แห่ง (ข้อ 8: REG-HOS-xxx) และ รพ.สต.ดูแล (ข้อ 9: REG-SHP-xxx)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มผู้ป่วยรายใหม่</span>
          </button>

          <button
            onClick={onOpenSheetSync}
            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/60 text-xs font-semibold shadow-md transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>เชื่อมโยง Google Sheet</span>
          </button>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* 7 Vulnerable Categories Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {Object.entries(VULNERABLE_CATEGORY_CONFIG).map(([catKey, conf]) => {
          const isFilterActive = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(selectedCategory === catKey ? 'all' : catKey)}
              className={`p-2 rounded-xl text-left border transition-all ${
                isFilterActive
                  ? 'bg-sky-950 border-cyan-400 ring-2 ring-cyan-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800'
              }`}
            >
              <div className="text-[10px] text-slate-400 truncate">{conf.label}</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {conf.total} <span className="text-[10px] font-normal text-slate-400">ราย</span>
              </div>
              <div className="text-[9px] text-cyan-400/80 mt-1 truncate">
                {isFilterActive ? '✓ กรองอยู่' : 'คลิกเพื่อกรอง'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัส, อำเภอ, เบอร์โทร หรืออาการ..."
            className="bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">กลุ่ม:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="all">ทุกกลุ่ม (7 กลุ่ม)</option>
              {Object.entries(VULNERABLE_CATEGORY_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">อำเภอ:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="all">ทุกอำเภอ</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">สถานะ:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="contacted">ติดต่อแล้ว</option>
              <option value="in_transit">กำลังเคลื่อนย้าย</option>
              <option value="evacuated">อพยพสำเร็จ</option>
              <option value="declined">ปฏิเสธการย้าย</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Patient Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <div>
            พบข้อมูล <span className="text-white font-bold">{filteredPatients.length}</span> รายการ
            (จากทะเบียนสำรวจทั้งหมด 1,284 ราย)
          </div>
          <div className="text-[11px] text-cyan-400 font-mono">
            เชื่อมต่อ Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3">รหัส/ชื่อ-สกุล</th>
                <th className="py-2.5 px-3">กลุ่มเสี่ยง & อาการ</th>
                <th className="py-2.5 px-3">ที่อยู่/เบอร์ติดต่อ</th>
                <th className="py-2.5 px-3">หน่วยรับผิดชอบ & รพ.</th>
                <th className="py-2.5 px-3">แผนอพยพ/ศูนย์พักพิง</th>
                <th className="py-2.5 px-3 text-center">สถานะการเคลื่อนย้าย</th>
                <th className="py-2.5 px-3 text-right">จัดการ (CRUD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredPatients.map((p) => {
                const conf = VULNERABLE_CATEGORY_CONFIG[p.category];
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">{p.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span>{p.code}</span>
                        <span>•</span>
                        <span>อายุ {p.age} ปี</span>
                        <span>•</span>
                        <span>{p.idCardMasked}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${conf?.color || 'text-slate-300'}`}>
                        {conf?.label || p.category}
                      </span>
                      <div className="text-[11px] text-slate-300 mt-1 max-w-xs leading-relaxed">
                        {p.conditionDetail}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="text-slate-200 font-medium">
                        อ.{p.district} ต.{p.subdistrict} ({p.villageNo})
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.address}</div>
                      <div className="flex items-center gap-2 mt-1 text-[11px]">
                        <span className="text-cyan-400 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{p.phone}</span>
                        </span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400 font-mono">ญาติ: {p.relativePhone}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="text-sky-300 font-medium">{p.shphResponsible}</div>
                      <div className="text-[10px] text-slate-400">ส่งต่อ: {p.hospitalRef}</div>
                      <div className="text-[10px] text-amber-400 mt-0.5">
                        ทีม: {p.assignedTeam}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="text-emerald-300 font-medium">{p.shelterTarget}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Ambulance className="w-3 h-3 text-cyan-400" />
                        <span>พาหนะ: {p.transportVehicleNeeded}</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="mb-1">{getStatusBadge(p.evacuationStatus)}</div>
                      {/* Quick status switch dropdown */}
                      <select
                        value={p.evacuationStatus}
                        onChange={(e) => handleQuickStatusChange(p, e.target.value as EvacuationStatus)}
                        className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300"
                      >
                        <option value="pending">รอดำเนินการ</option>
                        <option value="contacted">ติดต่อแล้ว</option>
                        <option value="in_transit">กำลังเคลื่อนย้าย</option>
                        <option value="evacuated">อพยพสำเร็จ</option>
                        <option value="declined">ปฏิเสธย้าย</option>
                      </select>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="แก้ไขข้อมูล"
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`ยืนยันการลบข้อมูลของ ${p.fullName} หรือไม่?`)) {
                              onDeletePatient(p.id);
                            }
                          }}
                          title="ลบข้อมูล"
                          className="p-1 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 transition"
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

      {/* Modal: Add / Edit Vulnerable Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-sky-700/60 rounded-xl p-5 w-full max-w-2xl shadow-2xl my-8 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-cyan-400" />
                <span>
                  {editingPatient ? 'แก้ไขข้อมูลผู้ป่วยเปราะบาง' : 'ลงทะเบียนผู้ป่วยเปราะบางรายใหม่'}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ชื่อ - สกุล *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                    placeholder="เช่น นายอับดุลเลาะ มะดิง"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">เลขบัตร ปชช. (Masked)</label>
                  <input
                    type="text"
                    value={formData.idCardMasked}
                    onChange={(e) => setFormData({ ...formData, idCardMasked: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs font-mono"
                    placeholder="1-96xx-xxxxx-xx-x"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">กลุ่มเปราะบาง (7 กลุ่มวิกฤต)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VulnerableCategory })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  >
                    {Object.entries(VULNERABLE_CATEGORY_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">เบอร์โทรศัพท์ผู้ป่วย</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">เบอร์โทรศัพท์ญาติ/ผู้ดูแล</label>
                  <input
                    type="text"
                    value={formData.relativePhone}
                    onChange={(e) => setFormData({ ...formData, relativePhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">อำเภอ</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ตำบล / หมู่ที่</label>
                  <input
                    type="text"
                    value={formData.subdistrict}
                    onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                    placeholder="เช่น ต.มูโนะ หมู่ 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">รายละเอียดอาการ / ยาจำเป็น / อุปกรณ์ที่ต้องใช้</label>
                <textarea
                  rows={2}
                  value={formData.conditionDetail}
                  onChange={(e) => setFormData({ ...formData, conditionDetail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  placeholder="เช่น ผู้ป่วยฟอกไต 3 ครั้ง/สัปดาห์ เสี่ยงน้ำท่วมบ้านเรือน"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ที่อยู่โดยละเอียด / จุดสังเกต</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  placeholder="เช่น 45/2 หมู่ 1 ริมแม่น้ำโก-ลก"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">รพ.สต. ที่รับผิดชอบ</label>
                  <input
                    type="text"
                    value={formData.shphResponsible}
                    onChange={(e) => setFormData({ ...formData, shphResponsible: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">รพ. แม่ข่ายรับส่งต่อ</label>
                  <input
                    type="text"
                    value={formData.hospitalRef}
                    onChange={(e) => setFormData({ ...formData, hospitalRef: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">ยานพาหนะที่ต้องการ</label>
                  <select
                    value={formData.transportVehicleNeeded}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transportVehicleNeeded: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  >
                    <option value="รถพยาบาลฉุกเฉิน">รถพยาบาลฉุกเฉิน</option>
                    <option value="4WD">รถ 4WD ยกสูง</option>
                    <option value="เรือท้องแบน">เรือท้องแบน</option>
                    <option value="ฮ.กู้ชีพ">ฮ.กู้ชีพ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ศูนย์พักพิง / ปลายทางอพยพ</label>
                  <input
                    type="text"
                    value={formData.shelterTarget}
                    onChange={(e) => setFormData({ ...formData, shelterTarget: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">สถานะการเคลื่อนย้าย</label>
                  <select
                    value={formData.evacuationStatus}
                    onChange={(e) => setFormData({ ...formData, evacuationStatus: e.target.value as EvacuationStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-white text-xs"
                  >
                    <option value="pending">รอดำเนินการ</option>
                    <option value="contacted">ติดต่อแล้ว</option>
                    <option value="in_transit">กำลังเคลื่อนย้าย</option>
                    <option value="evacuated">อพยพสำเร็จ</option>
                    <option value="declined">ปฏิเสธย้าย</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow"
                >
                  {editingPatient ? 'บันทึกการแก้ไข' : 'บันทึกลงทะเบียน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
