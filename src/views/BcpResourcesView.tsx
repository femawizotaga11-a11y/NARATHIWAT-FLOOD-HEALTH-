import React from 'react';
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
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const BcpResourcesView: React.FC = () => {
  const bcpItems = [
    {
      id: 'bcp-1',
      title: 'ไฟฟ้าสำรอง / Generator',
      duration: 'คงอยู่ได้ 72 ชม.',
      status: 'พร้อม',
      statusType: 'success',
      icon: Zap,
      detail: 'เครื่องกำเนิดไฟฟ้าดีเซล 13 รพ. ผ่านการทดสอบ Load Test และสำรองน้ำมันเต็มถัง 100%',
      contingency: 'สัญญาจัดส่งน้ำมันด่วนกับ ปตท. นราธิวาส เติมได้ภายใน 6 ชม.',
    },
    {
      id: 'bcp-2',
      title: 'ออกซิเจนการแพทย์ (รวมทุกแห่ง)',
      duration: 'คงอยู่ได้ 48 ชม.',
      status: 'เฝ้าระวัง',
      statusType: 'warning',
      icon: Wind,
      detail: 'รพ.สุไหงโก-ลก และ รพ.ระแงะ ใช้ออกซิเจนเพิ่มขึ้น 40% จากผู้ป่วยกลุ่มทางเดินหายใจ',
      contingency: 'จัดรถ 6 ล้อทหารรับท่อออกซิเจนเพิ่มจากโรงงานก๊าซหาดใหญ่ 120 ท่อ',
    },
    {
      id: 'bcp-3',
      title: 'น้ำใช้สำรองใน รพ.',
      duration: 'คงอยู่ได้ 72 ชม.',
      status: 'พร้อม',
      statusType: 'success',
      icon: Droplet,
      detail: 'แท็งก์น้ำสำรองและระบบบำบัดน้ำบาดาลของ รพ. ทุกแห่งพร้อมใช้งาน',
      contingency: 'รถน้ำ ปภ. ประจำการ 4 คัน พร้อมสนับสนุนหากระบบประปาอำเภอดับ',
    },
    {
      id: 'bcp-4',
      title: 'ยาจำเป็น / เวชภัณฑ์ฉุกเฉิน',
      duration: 'สำรอง 30 วัน',
      status: 'พร้อม',
      statusType: 'success',
      icon: Pill,
      detail: 'ยาต้านเบาหวาน, ยาลดความดัน, ยาปฏิชีวนะ, น้ำยาล้างไต (CAPD) สำรองล่วงหน้า 1 เดือน',
      contingency: 'คลังยาสำรองยุทธศาสตร์เขตสุขภาพที่ 12 รพ.สงขลานครินทร์ พร้อมจ่าย',
    },
    {
      id: 'bcp-5',
      title: 'คลังโลหิตสำรอง',
      duration: 'เพียงพอ (เสี่ยงขาด O, A)',
      status: 'พร้อม',
      statusType: 'success',
      icon: HeartPulse,
      detail: 'คลังเลือด รพ.นราธิวาสราชนครินทร์ มีเลือดรวม 142 ยูนิต, รพ.สุไหงโก-ลก 45 ยูนิต',
      contingency: 'สแตนด์บายเบิกเพิ่มจากภาคบริการโลหิตแห่งชาติที่ 12 จ.สงขลา สภากาชาดไทย',
    },
    {
      id: 'bcp-6',
      title: 'น้ำมันเชื้อเพลิง (Diesel/Gasohol)',
      duration: 'คงอยู่ได้ 72 ชม.',
      status: 'เฝ้าระวัง',
      statusType: 'warning',
      icon: Fuel,
      detail: 'สำรองในถังใต้ดินของ รพ. และปั๊มน้ำมันพันธมิตรในพื้นที่ดอน',
      contingency: 'ขอความอนุเคราะห์คลังน้ำมันกองทัพเรือภาค 2 และค่ายจุฬาภรณ์',
    },
    {
      id: 'bcp-7',
      title: 'อาหารและเสบียงผู้ป่วย/จนท.',
      duration: 'คงอยู่ได้ 72 ชม.',
      status: 'พร้อม',
      statusType: 'success',
      icon: Utensils,
      detail: 'อาหารแห้ง, ข้าวสาร, อาหารฮาลาลสำเร็จรูป, นมผงสำหรับเด็ก และน้ำดื่มบรรจุขวด',
      contingency: 'ครัวสนามพระราชทาน สภากาชาดไทย และมูลนิธิกู้ภัยในพื้นที่',
    },
    {
      id: 'bcp-8',
      title: 'กำลังคนขั้นต่ำ / ทีม A-B-C',
      duration: 'ครบ 85%',
      status: 'เฝ้าระวัง',
      statusType: 'warning',
      icon: Users2,
      detail: 'บุคลากรบางส่วนติดปัญหาน้ำท่วมทางเข้าบ้าน ได้จัดที่พักภายใน รพ. ให้ครบแล้ว',
      contingency: 'เรียกระดมทีมแพทย์และพยาบาลจิตอาสาจาก อ.สุคิริน และ อ.บาเจาะ มาช่วยผลัดเปลี่ยน',
    },
    {
      id: 'bcp-9',
      title: 'วัสดุอุปกรณ์ฉุกเฉินและชุดกู้ชีพ',
      duration: 'พร้อมใช้งาน 100%',
      status: 'พร้อม',
      statusType: 'success',
      icon: Package,
      detail: 'ชุดกระเป๋ายาฉุกเฉิน Red Cross, เสื้อชูชีพ 500 ตัว, เครื่อง AED พกพา, เปลกู้ภัยทางน้ำ',
      contingency: 'สำรองชุดกู้ชีพไว้ที่ สสจ. อีก 50 ชุด พร้อมแจกจ่ายทันที',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold">
              ข้อ 8
            </span>
            <h2 className="text-base font-bold text-white">
              ทรัพยากรและความต่อเนื่องในการดำเนินงานของจังหวัด (BCP Continuity Matrix)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            เกณฑ์ติดตามความพร้อม 9 มิติ ตามมาตรฐานแผนความต่อเนื่องทางธุรกิจด้านสาธารณสุขในภาวะภัยพิบัติ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-emerald-950/80 border border-emerald-500/60 px-3 py-1.5 rounded-lg text-emerald-300 font-bold">
            สถานะความพร้อม BCP: ผ่านเกณฑ์ 100%
          </div>
        </div>
      </div>

      {/* 9 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bcpItems.map((item) => {
          const Icon = item.icon;
          const isWarning = item.statusType === 'warning';
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border shadow-lg transition-all ${
                isWarning
                  ? 'bg-amber-950/20 border-amber-500/50 hover:bg-amber-950/30'
                  : 'bg-slate-900/80 border-sky-800/40 hover:border-sky-700/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg ${
                      isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                      {item.duration}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isWarning
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/60 animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs space-y-1.5">
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <b>สภาพปัจจุบัน:</b> {item.detail}
                </div>
                <div className="text-cyan-200/90 text-[11px] leading-relaxed bg-slate-950/70 p-2 rounded border border-slate-800">
                  <span className="font-semibold text-cyan-400">แผนฉุกเฉิน (Contingency): </span>
                  {item.contingency}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
