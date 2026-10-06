import React from 'react';
import {
  DistrictRisk,
  HospitalStatus,
  LiveWeatherData,
  RoadCutIncident,
  WaterStation,
  VulnerablePatient,
} from '../types/dashboard';
import { TabId } from '../components/Sidebar';
import { VULNERABLE_CATEGORY_CONFIG } from '../data/mockEocData';
import {
  CloudRain,
  AlertTriangle,
  Building2,
  Route,
  Radio,
  Truck,
  HeartHandshake,
  CheckCircle2,
  Activity,
  ArrowRight,
  TrendingUp,
  Droplet,
  Flame,
  Shield,
  Zap,
} from 'lucide-react';
import { GisMap } from '../components/GisMap';

interface Props {
  weather: LiveWeatherData;
  districts: DistrictRisk[];
  hospitals: HospitalStatus[];
  roadCuts: RoadCutIncident[];
  waterStations: WaterStation[];
  patients: VulnerablePatient[];
  onNavigate: (tab: TabId) => void;
}

export const OverviewView: React.FC<Props> = ({
  weather,
  districts,
  hospitals,
  roadCuts,
  waterStations,
  patients,
  onNavigate,
}) => {
  const criticalDistricts = districts.filter((d) => d.level === 'critical');
  const highDistricts = districts.filter((d) => d.level === 'high');
  const monitoredHospitals = hospitals.filter((h) => h.autonomyHours <= 36 || h.riskLevel === 'critical' || h.riskLevel === 'high');
  const impassableRoads = roadCuts.filter((r) => r.passable === 'ไม่ได้');

  return (
    <div className="space-y-5">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 border border-sky-800/60 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>ศูนย์ปฏิบัติการภาวะฉุกเฉินทางสาธารณสุข (EOC) จังหวัดนราธิวาส</span>
              <span className="text-[10px] bg-red-900/60 border border-red-500/50 text-red-200 px-2 py-0.5 rounded font-mono">
                LIVE OPS ACTIVE
              </span>
            </h2>
            <p className="text-xs text-sky-200/80">
              ติดตาม เฝ้าระวัง ประเมินสถานการณ์อุทกภัย BCP ระบบสาธารณสุข และการคุ้มครองกลุ่มเปราะบาง 13 อำเภอ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('vulnerable_registry')}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>จัดการผู้ป่วยเปราะบาง ({patients.length})</span>
          </button>
          <button
            onClick={() => onNavigate('gas_sync')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition"
          >
            ซิงค์ Google Sheets
          </button>
        </div>
      </div>

      {/* Grid Row 1: GIS Tactical Map & Live River Sensor Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Map Box (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>1-2. แผนที่สถานการณ์ GIS, GISTDA, เส้นทางตัดขาด และ รพ.</span>
              </h3>
              <p className="text-xs text-slate-400">
                แสดงขอบเขตรอยน้ำท่วมดาวเทียม GISTDA, รพ. 13 แห่ง, ทางขาด 11 จุด และเส้นทางสำรอง
              </p>
            </div>
            <button
              onClick={() => onNavigate('road_cuts')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>ดูรายละเอียดเส้นทางตัดขาด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <GisMap
            hospitals={hospitals}
            roadCuts={roadCuts}
            waterStations={waterStations}
            showAlternateRoutes={true}
          />
        </div>

        {/* River Basin Water Sensors (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <span>ระดับน้ำในลุ่มน้ำหลัก (ThaiWater/ปภ.)</span>
              </h3>
              <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
                TELEMETRY LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              ตรวจวัดระดับน้ำเทียบระดับตลิ่ง แม่น้ำโก-ลก, แม่น้ำบางนรา, แม่น้ำสายบุรี
            </p>

            <div className="space-y-2.5">
              {waterStations.map((st) => {
                const diff = st.waterLevelM - st.bankLevelM;
                const isOver = diff > 0;
                return (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{st.name}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isOver ? 'bg-red-950 text-red-300 border border-red-800/60' : 'bg-blue-950 text-blue-300'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between">
                      <div className="text-sm font-bold text-white font-mono">
                        {st.waterLevelM} <span className="text-[10px] font-normal text-slate-400">ม.รสม.</span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-400">
                        ตลิ่ง {st.bankLevelM} ม. ({isOver ? <span className="text-rose-400 font-bold">+{diff.toFixed(2)} ม.</span> : <span>-{Math.abs(diff).toFixed(2)} ม.</span>})
                      </div>
                    </div>

                    {/* Gauge bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full ${isOver ? 'bg-rose-500' : 'bg-cyan-500'}`}
                        style={{ width: `${Math.min(100, (st.waterLevelM / (st.bankLevelM * 1.2)) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick weather status info */}
          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-sky-900/40 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                <span>เรดาร์ฝนรายชั่วโมง (TMD นราธิวาส)</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">ฝนหนักถึงหนักมาก</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              คาดการณ์ฝนสะสม 72 ชม. สูงถึง {weather.rainfallForecast72hMm} มม. เสี่ยงดินโคลนถล่มบริเวณเทือกเขาสันกาลาคีรี (อ.สุคิริน, อ.จะแนะ)
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: 13 Districts Risk & Hospital RTO Safe Autonomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* District Risk Table (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>3. ระดับความเสี่ยงและผลกระทบรายอำเภอ (13 อำเภอ)</span>
              </h3>
              <p className="text-xs text-slate-400">
                คาดการณ์ 6 ชม., 12 ชม., 24 ชม. และแนวโน้มสถานการณ์
              </p>
            </div>
            <button
              onClick={() => onNavigate('district_risk')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>ดูตารางเต็ม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-2 font-medium">อำเภอ</th>
                  <th className="py-2 px-2 font-medium">ระดับ</th>
                  <th className="py-2 px-2 font-medium">แนวโน้ม</th>
                  <th className="py-2 px-2 font-medium">6 ชม.</th>
                  <th className="py-2 px-2 font-medium">12 ชม.</th>
                  <th className="py-2 px-2 font-medium">24 ชม.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {districts.slice(0, 7).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-2 font-sans font-medium text-slate-200">
                      {d.name}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold ${
                          d.level === 'critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : d.level === 'high'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                            : d.level === 'warning'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {d.level === 'critical' ? 'แดง' : d.level === 'high' ? 'ส้ม' : d.level === 'warning' ? 'เหลือง' : 'เขียว'}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-bold text-amber-400">
                      {d.trend === 'up' ? '↑↑' : '→'}
                    </td>
                    <td className="py-2 px-2 font-sans text-slate-300">{d.forecast6h}</td>
                    <td className="py-2 px-2 font-sans text-slate-300">{d.forecast12h}</td>
                    <td className="py-2 px-2 font-sans text-rose-300">{d.forecast24h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-right">
            <span className="text-[10px] text-slate-500">แสดง 7 จาก 13 อำเภอ (คลิกเพื่อดูครบทั้งหมด)</span>
          </div>
        </div>

        {/* Hospital Autonomy & RTO (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>4-5. สถานะโรงพยาบาล & RTO Safe Operating Time</span>
              </h3>
              <p className="text-xs text-slate-400">
                ระยะเวลาความอยู่รอดของสถานพยาบาล (Autonomy Hours) เมื่อถูกตัดขาด
              </p>
            </div>
            <button
              onClick={() => onNavigate('hospitals')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>ดู 13 รพ.</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {hospitals.slice(0, 5).map((h) => {
              const isUrgent = h.autonomyHours <= 24;
              return (
                <div
                  key={h.id}
                  className={`p-2.5 rounded-lg border transition ${
                    isUrgent
                      ? 'bg-red-950/40 border-red-500/50 hover:bg-red-900/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{h.name}</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">
                        {h.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">RTO:</span>
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          isUrgent
                            ? 'bg-red-600 text-white animate-pulse'
                            : h.autonomyHours <= 36
                            ? 'bg-amber-600/90 text-white'
                            : 'bg-emerald-700/80 text-white'
                        }`}
                      >
                        {h.autonomyHours} ชม.
                      </span>
                    </div>
                  </div>

                  {/* Resource Indicators Mini Bar */}
                  <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <div>
                      ⚡ ไฟฟ้า: <b className="text-slate-200">{h.fuelGeneratorHours} ชม.</b>
                    </div>
                    <div>
                      💨 O2: <b className="text-slate-200">{h.oxygenHours} ชม.</b>
                    </div>
                    <div>
                      🩸 เลือด: <b className="text-slate-200">{h.bloodUnits} ยูนิต</b>
                    </div>
                    <div>
                      🛏️ ครองเตียง: <b className="text-slate-200">{Math.round((h.bedOccupied / h.bedTotal) * 100)}%</b>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Row 3: Vulnerable Registry Summary & BCP Resources Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Vulnerable Registry Groups (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-pink-400" />
                <span>6. กลุ่มผู้ป่วยเปราะบาง 1,284 ราย (Vulnerable Registry)</span>
              </h3>
              <p className="text-xs text-slate-400">
                แยกตาม 7 กลุ่มอาการวิกฤต ต้องอพยพ/ส่งต่อก่อนน้ำท่วมตัดขาด
              </p>
            </div>
            <button
              onClick={() => onNavigate('vulnerable_registry')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>จัดการทะเบียน CRUD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(VULNERABLE_CATEGORY_CONFIG).map(([key, item]) => (
              <div
                key={key}
                onClick={() => onNavigate('vulnerable_registry')}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-sky-500/60 cursor-pointer transition flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {item.action}
                  </div>
                </div>
                <div className="text-sm font-bold font-mono text-cyan-400 bg-sky-950/80 px-2 py-1 rounded border border-sky-800/60 shrink-0 ml-2">
                  {item.total} <span className="text-[10px] font-normal text-slate-400">ราย</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-pink-950/30 border border-pink-500/30 flex items-center justify-between text-xs text-pink-200">
            <span>รวมผู้ป่วยเปราะบางในพื้นที่เสี่ยงทั้งสิ้น:</span>
            <span className="font-bold font-mono text-sm text-pink-300">1,284 ราย (สำรวจครบ 100%)</span>
          </div>
        </div>

        {/* BCP Resources & Continuity Table (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>8. ทรัพยากรและความต่อเนื่องของจังหวัด (BCP Matrix)</span>
              </h3>
              <p className="text-xs text-slate-400">
                ประเมินความพร้อมและสต็อกสำรองระดับจังหวัด 9 ด้าน
              </p>
            </div>
            <button
              onClick={() => onNavigate('bcp_resources')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>ดูแผนสำรอง BCP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>⚡ ไฟฟ้าสำรอง / Generator</span>
              <span className="font-mono font-bold text-emerald-400">คงอยู่ได้ 72 ชม.</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>💨 ออกซิเจนทางการแพทย์</span>
              <span className="font-mono font-bold text-amber-400">คงอยู่ได้ 48 ชม. (เฝ้าระวัง)</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>💧 น้ำใช้สำรองใน รพ.</span>
              <span className="font-mono font-bold text-emerald-400">คงอยู่ได้ 72 ชม.</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>💊 ยาจำเป็น / เวชภัณฑ์</span>
              <span className="font-mono font-bold text-emerald-400">สำรอง 30 วัน</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>🩸 โลหิตสำรอง (สภากาชาด)</span>
              <span className="font-mono font-bold text-emerald-400">เพียงพอ (เสี่ยงบางกรุ๊ป)</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>⛽ น้ำมันเชื้อเพลิงเครื่องปั่นไฟ</span>
              <span className="font-mono font-bold text-amber-400">คงอยู่ได้ 72 ชม.</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>🍚 อาหาร/น้ำดื่มผู้ป่วยและจนท.</span>
              <span className="font-mono font-bold text-emerald-400">คงอยู่ได้ 72 ชม.</span>
            </div>
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800 flex justify-between items-center">
              <span>👥 กำลังคนขั้นต่ำ (ทีม A-B-C)</span>
              <span className="font-mono font-bold text-amber-400">ความพร้อม 85%</span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
            <span>วัสดุอุปกรณ์ฉุกเฉินและชุดกู้ชีพ:</span>
            <span className="font-bold text-emerald-300">พร้อมใช้งาน 100% ประจำ 13 รพ.</span>
          </div>
        </div>
      </div>

      {/* Grid Row 4: EMS, Failover Comms & Replenishment Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 9. EMS & Evac Fleets */}
        <div
          onClick={() => onNavigate('road_cuts')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-sky-800/40 rounded-xl p-4 shadow-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>9. EMS & ขีดความสามารถเคลื่อนย้าย</span>
            </h4>
            <span className="text-[10px] text-cyan-400 group-hover:translate-x-1 transition">
              ดูรายละเอียด ➜
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center mt-3">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-lg font-bold text-white font-mono">68</div>
              <div className="text-[10px] text-slate-400">รถพยาบาล</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-lg font-bold text-cyan-400 font-mono">22</div>
              <div className="text-[10px] text-slate-400">รถ 4WD ยกสูง</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-lg font-bold text-blue-400 font-mono">18</div>
              <div className="text-[10px] text-slate-400">เรือท้องแบน</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 text-center">
            อากาศยาน / จุดจอด ฮ. กู้ชีพ 3 จุดหลัก
          </div>
        </div>

        {/* 11. Communication Failover */}
        <div
          onClick={() => onNavigate('communication')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-sky-800/40 rounded-xl p-4 shadow-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>10. สื่อสารฉุกเฉิน (หากล่มใช้อะไร)</span>
            </h4>
            <span className="text-[10px] text-purple-400 group-hover:translate-x-1 transition">
              ดู 4 ระดับ ➜
            </span>
          </div>
          <div className="space-y-1.5 mt-2.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>ระดับ 1 (ปกติ): Line EOC / Fiber</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>ระดับ 2 (ล่ม): วิทยุ VHF 154.925 MHz</span>
              <span className="text-cyan-400 font-bold">STANDBY</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>ระดับ 3 (ล่มอีก): ข่ายมหาดไทย/ทหาร</span>
              <span className="text-amber-400 font-bold">STANDBY</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>ระดับ 4: Starlink Satellite Kit</span>
              <span className="text-purple-400 font-bold">READY</span>
            </div>
          </div>
        </div>

        {/* 12. Supply Replenishment */}
        <div
          onClick={() => onNavigate('replenishment')}
          className="bg-slate-900/90 hover:bg-slate-850 border border-sky-800/40 rounded-xl p-4 shadow-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>11. เกิน RTO / นำเข้าจังหวัดอย่างไร</span>
            </h4>
            <span className="text-[10px] text-amber-400 group-hover:translate-x-1 transition">
              ดูแผนขนส่ง ➜
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-300 mt-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>ลำเลียงทางอากาศ: ฮ. กรม ปภ./ทบ. ลงสนามบินนราธิวาส</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>ลำเลียงทางน้ำ: กองทัพเรือเทียบท่าตากใบ/บางนรา</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>คลังยาสำรองยุทธศาสตร์ เขตสุขภาพที่ 12 สงขลา</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-amber-400/90 font-medium">
            SLA จัดส่งฉุกเฉินภายใน 3-6 ชม.
          </div>
        </div>
      </div>

      {/* Bottom Goal Bar (Direct match to Infographic Bottom Targets) */}
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 border border-sky-800/50 rounded-xl p-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-bold text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>เป้าหมายก่อนน้ำท่วม จังหวัดนราธิวาส</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">100%</span>
              <span>13 รพ. มีข้อมูลครบ</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">100%</span>
              <span>111 รพ.สต. มีข้อมูลครบ</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">100%</span>
              <span>Route หลัก + สำรอง พร้อมใช้</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">100%</span>
              <span>Critical Services มี BCP</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">100%</span>
              <span>ผู้ป่วยเปราะบางมีแผนดูแล/เคลื่อนย้าย</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold font-mono">100%</span>
              <span>Safe Operating Time แจ้งเตือนล่วงหน้า</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
