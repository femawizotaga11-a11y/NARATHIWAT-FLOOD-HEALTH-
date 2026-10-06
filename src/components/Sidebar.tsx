import React from 'react';
import {
  LayoutDashboard,
  CloudRain,
  MapPin,
  Route,
  Building2,
  Stethoscope,
  Users2,
  HeartHandshake,
  Share2,
  ShieldCheck,
  Radio,
  Truck,
  TableProperties,
  ChevronRight,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export type TabId =
  | 'overview'
  | 'gistda_weather'
  | 'district_risk'
  | 'road_cuts'
  | 'hospitals'
  | 'shph'
  | 'staff'
  | 'vulnerable_registry'
  | 'referral_opoh'
  | 'bcp_resources'
  | 'communication'
  | 'replenishment'
  | 'gas_sync';

interface Props {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  vulnerableCount: number;
  roadCutCount: number;
  criticalHospCount: number;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  vulnerableCount,
  roadCutCount,
  criticalHospCount,
}) => {
  const navSections = [
    {
      group: 'ศูนย์บัญชาการสถานการณ์ (EOC)',
      items: [
        {
          id: 'overview' as TabId,
          label: 'ภาพรวมสถานการณ์ EOC',
          subLabel: 'Command Center Master',
          icon: LayoutDashboard,
          badge: 'Level 2',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        },
        {
          id: 'gistda_weather' as TabId,
          label: '1. เสี่ยงอุทกภัย GISTDA & ปภ.',
          subLabel: 'เรดาร์ฝน & แม่น้ำสายหลัก Live',
          icon: CloudRain,
          badge: 'เซ็นเซอร์จริง',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        },
        {
          id: 'district_risk' as TabId,
          label: '2. ความเสี่ยง 13 อำเภอ',
          subLabel: 'คาดการณ์ 6 / 12 / 24 ชม.',
          icon: MapPin,
          badge: '2 วิกฤต',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        },
        {
          id: 'road_cuts' as TabId,
          label: '3. เส้นทางตัดขาด 3 ปีย้อนหลัง',
          subLabel: 'ข้อ 2: แผนที่ + เส้นทางสำรอง',
          icon: Route,
          badge: `${roadCutCount} จุด`,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        },
      ],
    },
    {
      group: 'ดูแลประชาชน & บัญชาการ (ข้อ 4 - 7)',
      badgeGroup: 'CRUD Sheet',
      items: [
        {
          id: 'vulnerable_registry' as TabId,
          label: '4. ผู้ป่วยเปราะบาง & EVAC',
          subLabel: 'ทะเบียนรายชื่อ 7 กลุ่ม CRUD ลง Sheet',
          icon: HeartHandshake,
          badge: `${vulnerableCount} ราย`,
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse',
        },
        {
          id: 'referral_opoh' as TabId,
          label: '5. ส่งต่อ Dynamic Referral & OPOH',
          subLabel: 'ทางเลี่ยงน้ำท่วม & Bed Center CRUD',
          icon: Share2,
          badge: 'CRUD Sheet',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        },
        {
          id: 'bcp_resources' as TabId,
          label: '6. ทรัพยากร BCP ภาพรวม',
          subLabel: 'ไฟฟ้า, O2, เลือด, น้ำมัน CRUD ลง Sheet',
          icon: ShieldCheck,
          badge: 'CRUD Sheet',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        },
        {
          id: 'staff' as TabId,
          label: '7. กำลังคน Staff & บุคลากร',
          subLabel: 'ทีมแพทย์ A-B-C เวรฉุกเฉิน CRUD',
          icon: Users2,
          badge: 'CRUD Sheet',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        },
      ],
    },
    {
      group: 'ขีดความสามารถสถานพยาบาล (ข้อ 8 - 11)',
      badgeGroup: 'CRUD Sheet',
      items: [
        {
          id: 'hospitals' as TabId,
          label: '8. ทรัพยากร & RTO 13 รพ.',
          subLabel: 'Safe Operating Hours CRUD ลง Sheet',
          icon: Building2,
          badge: `${criticalHospCount} เฝ้าระวัง`,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        },
        {
          id: 'shph' as TabId,
          label: '9. เครือข่าย 111 รพ.สต.',
          subLabel: 'ด่านหน้าปฐมภูมิ CRUD ลง Sheet',
          icon: Stethoscope,
          badge: 'CRUD Sheet',
          badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        },
        {
          id: 'communication' as TabId,
          label: '10. ระบบสื่อสารสำรอง 4 ระดับ',
          subLabel: 'หากล่มใช้อะไร/หลักฐานจริง CRUD',
          icon: Radio,
          badge: 'CRUD Sheet',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        },
        {
          id: 'replenishment' as TabId,
          label: '11. นำเข้าจังหวัดเมื่อเกิน RTO',
          subLabel: 'ฮ./เรือ/ขบวนทหารนำส่ง CRUD ลง Sheet',
          icon: Truck,
          badge: 'CRUD Sheet',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        },
        {
          id: 'gas_sync' as TabId,
          label: '12. ซิงค์ Google Sheets (GAS)',
          subLabel: 'Sheet ID: 13KGqr... โค้ด Code.gs',
          icon: FileSpreadsheet,
          badge: 'Live Sync',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        },
      ],
    },
  ];

  return (
    <aside className="w-72 shrink-0 bg-slate-900/95 border-r border-sky-800/40 flex flex-col h-full overflow-hidden text-slate-200">
      {/* Sidebar Header Title */}
      <div className="p-4 border-b border-sky-800/40 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
            สารบัญระบบ EOC นราธิวาส
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900/60 border border-sky-700/50 text-sky-300 font-mono">
            10 ข้อกำหนดครบ
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        {navSections.map((sect, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              {sect.group}
            </div>
            {sect.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center justify-between group border ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-900/90 to-blue-900/70 border-cyan-400/60 text-white shadow-md shadow-sky-950/50'
                      : 'hover:bg-slate-800/70 text-slate-300 hover:text-white border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div
                      className={`p-1.5 rounded-md ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40'
                          : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-xs truncate leading-snug">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          isActive ? 'text-cyan-200/80' : 'text-slate-400'
                        }`}
                      >
                        {item.subLabel}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-sky-800/40 bg-slate-950/80 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>War Room สสจ.</span>
          </span>
          <span className="font-mono text-cyan-400">073-511124</span>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between">
          <span>สายด่วนการแพทย์ฉุกเฉิน</span>
          <span className="font-bold text-rose-400 font-mono">1669</span>
        </div>
      </div>
    </aside>
  );
};
