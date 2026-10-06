import React, { useState } from 'react';
import { RoadCutIncident, HospitalStatus, WaterStation } from '../types/dashboard';
import { GisMap } from '../components/GisMap';
import {
  Route,
  AlertTriangle,
  Anchor,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle,
  Truck,
  Car,
  Printer,
  History,
} from 'lucide-react';

interface Props {
  roadCuts: RoadCutIncident[];
  hospitals: HospitalStatus[];
  waterStations: WaterStation[];
}

export const RoadCutMapView: React.FC<Props> = ({ roadCuts, hospitals, waterStations }) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(roadCuts[0]?.id || null);
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterPassable, setFilterPassable] = useState<string>('all');

  const selectedIncident = roadCuts.find((r) => r.id === selectedIncidentId) || roadCuts[0];

  const filteredRoads = roadCuts.filter((r) => {
    if (filterDistrict !== 'all' && r.district !== filterDistrict) return false;
    if (filterPassable !== 'all' && r.passable !== filterPassable) return false;
    return true;
  });

  const districtsList = Array.from(new Set(roadCuts.map((r) => r.district)));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold">
              ข้อ 2
            </span>
            <h2 className="text-base font-bold text-white">
              แผนที่เส้นทางที่ตัดขาด 3 ปีย้อนหลัง (2566 - 2568) พร้อมเส้นทางสำรอง 1-2
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            รวบรวมพิกัดจุดน้ำท่วมซ้ำซาก คอสะพานชำรุด ระดับน้ำท่วมขัง และเส้นทางเลี่ยงฉุกเฉินสำหรับการส่งต่อผู้ป่วยและเวชภัณฑ์
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-rose-950/70 border border-rose-500/40 px-3 py-1.5 rounded-lg text-rose-300 font-medium">
            ผ่านไม่ได้: <b>{roadCuts.filter((r) => r.passable === 'ไม่ได้').length} จุด</b>
          </div>
          <div className="bg-amber-950/70 border border-amber-500/40 px-3 py-1.5 rounded-lg text-amber-300 font-medium">
            เฉพาะ 4WD: <b>{roadCuts.filter((r) => r.passable.includes('4WD')).length} จุด</b>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Alternate Route Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Leaflet Map (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-rose-400" />
              <span>แผนที่พิกัดเส้นทางขาด & เส้นทางสำรอง (GIS Routing)</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              คลิกที่หมุด ✕ เพื่อเลือกจุดตัดขาด
            </span>
          </div>

          <GisMap
            hospitals={hospitals}
            roadCuts={roadCuts}
            waterStations={waterStations}
            selectedRoadCutId={selectedIncidentId}
            onSelectRoadCut={(id) => setSelectedIncidentId(id)}
            showAlternateRoutes={true}
          />
        </div>

        {/* Right Side: Selected Road Cut Deep Dive (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          {selectedIncident ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>จุดตัดขาดที่กำลังวิเคราะห์</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                  อ.{selectedIncident.district}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedIncident.roadNumber}
                </h4>
                <div className="text-xs text-slate-300 mt-0.5">
                  {selectedIncident.locationName}
                </div>
              </div>

              {/* Status & Water Depth */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ระดับน้ำท่วมผิวทาง</div>
                  <div className="text-lg font-bold font-mono text-rose-400">
                    {selectedIncident.waterDepthCm} <span className="text-xs text-slate-400">ซม.</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">สภาพการสัญจร</div>
                  <div
                    className={`text-xs font-bold mt-1 ${
                      selectedIncident.passable === 'ไม่ได้' ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {selectedIncident.passable}
                  </div>
                </div>
              </div>

              {/* 3-Year Historical Record */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ประวัติน้ำท่วมซ้ำซาก 3 ปีย้อนหลัง:</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[2566, 2567, 2568].map((yr) => {
                    const isCut = selectedIncident.historicalCutYears.includes(yr);
                    return (
                      <span
                        key={yr}
                        className={`text-xs px-2.5 py-1 rounded-md font-mono font-medium border ${
                          isCut
                            ? 'bg-rose-950 text-rose-300 border-rose-500/60'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        ปี {yr} {isCut ? '✕ ขาด' : '✓ ปกติ'}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Alternate Routes (เส้นทางสำรอง 1 และ 2) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-sky-200 uppercase tracking-wide">
                  เส้นทางสำรองสำหรับลำเลียงผู้ป่วย (Bypass Corridor)
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-0.5">
                    <Route className="w-3.5 h-3.5 text-emerald-400" />
                    <span>เส้นทางสำรองที่ 1:</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed text-[11px]">
                    {selectedIncident.alternateRoute1}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/40 text-xs">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5 mb-0.5">
                    <Route className="w-3.5 h-3.5 text-sky-400" />
                    <span>เส้นทางสำรองที่ 2 (กรณีน้ำท่วมสูงขึ้น):</span>
                  </div>
                  <div className="text-slate-200 leading-relaxed text-[11px]">
                    {selectedIncident.alternateRoute2}
                  </div>
                </div>
              </div>

              {/* Boat Standby Point */}
              {selectedIncident.boatStandbyPoint && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-cyan-800/40 flex items-center gap-2.5 text-xs text-cyan-200">
                  <Anchor className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">จุดสแตนด์บายเรือกู้ภัย: </span>
                    <span>{selectedIncident.boatStandbyPoint}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12 text-xs">
              กรุณาเลือกจุดตัดขาดเพื่อดูเส้นทางสำรอง
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Road Cut Table */}
      <div className="bg-slate-900/90 border border-sky-800/40 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>ตารางบัญชีเส้นทางตัดขาด 11 จุด (ทางหลวงหลัก 4 / สายรอง 7)</span>
          </h3>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">อำเภอ:</span>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value="all">ทั้งหมด</option>
                {districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">สถานะ:</span>
              <select
                value={filterPassable}
                onChange={(e) => setFilterPassable(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
              >
                <option value="all">ทั้งหมด</option>
                <option value="ไม่ได้">ไม่ได้</option>
                <option value="เฉพาะรถยกสูง/4WD">เฉพาะ 4WD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/60">
                <th className="py-2.5 px-3">สายทาง</th>
                <th className="py-2.5 px-3">อำเภอ/สถานที่</th>
                <th className="py-2.5 px-3 text-center">ระดับน้ำ</th>
                <th className="py-2.5 px-3">สภาพการผ่าน</th>
                <th className="py-2.5 px-3">ประวัติ 3 ปี</th>
                <th className="py-2.5 px-3">เส้นทางสำรอง 1</th>
                <th className="py-2.5 px-3">เส้นทางสำรอง 2</th>
                <th className="py-2.5 px-3 text-right">เลือกดู</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRoads.map((rc) => {
                const isSelected = rc.id === selectedIncidentId;
                return (
                  <tr
                    key={rc.id}
                    onClick={() => setSelectedIncidentId(rc.id)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-sky-950/60 font-medium text-white'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-cyan-300">
                      {rc.roadNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div>{rc.locationName}</div>
                      <div className="text-[10px] text-slate-400">อ.{rc.district} ({rc.type})</div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-400">
                      {rc.waterDepthCm} ซม.
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rc.passable === 'ไม่ได้'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/50'
                        }`}
                      >
                        {rc.passable}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      ปี {rc.historicalCutYears.join(', ')}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-emerald-300 max-w-xs truncate">
                      {rc.alternateRoute1}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-sky-300 max-w-xs truncate">
                      {rc.alternateRoute2}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="text-cyan-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-[10px]">
                        แผนที่
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
