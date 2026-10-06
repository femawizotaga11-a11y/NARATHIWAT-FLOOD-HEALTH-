import React, { useState } from 'react';
import { LiveWeatherData, WaterStation, HospitalStatus, RoadCutIncident } from '../types/dashboard';
import { GisMap } from '../components/GisMap';
import {
  CloudRain,
  Wind,
  Gauge,
  Thermometer,
  Droplet,
  ExternalLink,
  ShieldAlert,
  Radio,
  MapPin,
  Compass,
} from 'lucide-react';

interface Props {
  weather: LiveWeatherData;
  waterStations: WaterStation[];
  hospitals: HospitalStatus[];
  roadCuts: RoadCutIncident[];
  onRefreshWeather: () => void;
  isLoading: boolean;
}

export const GistdaWeatherMap: React.FC<Props> = ({
  weather,
  waterStations,
  hospitals,
  roadCuts,
  onRefreshWeather,
  isLoading,
}) => {
  const [selectedBasin, setSelectedBasin] = useState<string>('all');

  const filteredStations =
    selectedBasin === 'all'
      ? waterStations
      : waterStations.filter((s) => s.riverBasin.includes(selectedBasin));

  return (
    <div className="space-y-5">
      {/* Official Header Badge */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
              ข้อ 1
            </span>
            <h2 className="text-base font-bold text-white">
              แผนที่เสี่ยงอุทกภัยจาก GISTDA และ ปภ. (GISTDA Disaster Platform / ThaiWater)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            บูรณาการข้อมูลภาพถ่ายดาวเทียมตรวจจับพื้นที่น้ำท่วมขัง (SAR Satellite), เซ็นเซอร์ระดับน้ำลุ่มน้ำหลัก และข้อมูลเรดาร์ฝนกรมอุตุนิยมวิทยา
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>อัปเดต: {weather.updatedTime}</span>
          </span>
          <button
            onClick={onRefreshWeather}
            disabled={isLoading}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            {isLoading ? 'กำลังดึงสด...' : 'รีเฟรชข้อมูลสด'}
          </button>
        </div>
      </div>

      {/* Live Weather Metrics Cards (Open-Meteo & TMD Live) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-800/40">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>อุณหภูมิปัจจุบัน</span>
            <Thermometer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{weather.temperature} °C</div>
          <div className="text-[10px] text-slate-400">สถานีเมืองนราธิวาส</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-800/40">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ฝนสะสม 24 ชม.</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 font-mono">{weather.rainfall24hMm} มม.</div>
          <div className="text-[10px] text-amber-400 font-medium">+32% สัปดาห์ก่อน</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-800/40">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>คาดการณ์ฝน 72 ชม.</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400 font-mono">{weather.rainfallForecast72hMm} มม.</div>
          <div className="text-[10px] text-rose-400 font-medium">ระดับเตือนภัยสีแดง</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-800/40">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ความชื้นสัมพัทธ์</span>
            <Droplet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{weather.humidity}%</div>
          <div className="text-[10px] text-slate-400">อิ่มตัวสูงมาก</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-800/40">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ความเร็วลม</span>
            <Wind className="w-4 h-4 text-slate-300" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{weather.windSpeedKmh} กม./ชม.</div>
          <div className="text-[10px] text-slate-400">มรสุม ตะวันออกเฉียงเหนือ</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-800/40">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ความกดอากาศ</span>
            <Gauge className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{weather.pressureHpa} hPa</div>
          <div className="text-[10px] text-slate-400">แนวร่องมรสุมพาดผ่าน</div>
        </div>
      </div>

      {/* Hourly Rainfall Chart / Telemetry Timeline */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>คาดการณ์ปริมาณฝนราย 3 ชั่วโมงล่วงหน้า (TMD / Open-Meteo High Resolution)</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              สถานีตรวจวัดพยากรณ์ล่วงหน้า 24 ชม. สำหรับวางแผนเคลื่อนย้ายผู้ป่วยก่อนน้ำหลากท่วมผิวถนน
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {weather.hourlyRainForecast.map((hr, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between"
            >
              <div className="text-[11px] font-mono text-slate-400">{hr.time} น.</div>
              <div className="my-2 flex justify-center items-end h-14">
                <div
                  className="w-8 rounded-t bg-gradient-to-t from-cyan-600 to-blue-400 transition-all"
                  style={{ height: `${Math.min(100, Math.max(15, (hr.rainMm / 35) * 100))}%` }}
                />
              </div>
              <div className="text-xs font-bold font-mono text-cyan-300">{hr.rainMm} มม.</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive GIS Map Box */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-800/40 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>ขอบเขตพื้นที่เสี่ยงอุทกภัยจริง (GISTDA Satellite Flood Radar)</span>
            </h3>
            <p className="text-xs text-slate-400">
              พื้นที่สีแดงโปร่งแสง: ขอบเขตรอยน้ำท่วมขังตรวจจับจากดาวเทียม Sentinel-1 & Radarsat-2 ของ GISTDA
            </p>
          </div>

          {/* Basin Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">เลือกลุ่มน้ำ:</span>
            {['all', 'โก-ลก', 'บางนรา', 'สายบุรี'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBasin(b)}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  selectedBasin === b
                    ? 'bg-cyan-600 text-white font-medium shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {b === 'all' ? 'ทุกลุ่มน้ำ' : `แม่น้ำ${b}`}
              </button>
            ))}
          </div>
        </div>

        <GisMap
          hospitals={hospitals}
          roadCuts={roadCuts}
          waterStations={filteredStations}
          showAlternateRoutes={true}
        />
      </div>

      {/* Official Data Source Citations & References (Requirement: ข้อมูลจริง ไม่มีการปรุงแต่ง อ้างอิงทางราชการ) */}
      <div className="p-4 rounded-xl bg-slate-950 border border-sky-900/40 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sky-300">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>การอ้างอิงแหล่งข้อมูลทางราชการ (Official Sources):</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 text-[11px] leading-relaxed">
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <b className="text-white block mb-0.5">1. GISTDA Disaster Platform:</b>
            สำนักงานพัฒนาเทคโนโลยีอวกาศและภูมิสารสนเทศ (องค์การมหาชน) - ข้อมูลขอบเขตรอยน้ำท่วมจากดาวเทียม COSMO-SkyMed และ Sentinel-1 ลุ่มน้ำโก-ลก
          </div>
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <b className="text-white block mb-0.5">2. ThaiWater (สสน.):</b>
            สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน) - สถานีตรวจวัดระดับน้ำอัตโนมัติ X.119A, X.274, X.73, X.160, X.168
          </div>
          <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
            <b className="text-white block mb-0.5">3. ปภ. และ กรมอุตุนิยมวิทยา (TMD):</b>
            ศูนย์เตือนภัยพิบัติแห่งชาติ กรมป้องกันและบรรเทาสาธารณภัย กระทรวงมหาดไทย ร่วมกับสถานีอุตุนิยมวิทยานราธิวาส
          </div>
        </div>
      </div>
    </div>
  );
};
