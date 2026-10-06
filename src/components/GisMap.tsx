import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HospitalStatus, RoadCutIncident, WaterStation } from '../types/dashboard';
import { Map, Layers, Navigation, AlertTriangle, Shield, Anchor } from 'lucide-react';

interface Props {
  hospitals: HospitalStatus[];
  roadCuts: RoadCutIncident[];
  waterStations: WaterStation[];
  selectedRoadCutId?: string | null;
  onSelectRoadCut?: (id: string) => void;
  showAlternateRoutes?: boolean;
}

export const GisMap: React.FC<Props> = ({
  hospitals,
  roadCuts,
  waterStations,
  selectedRoadCutId,
  onSelectRoadCut,
  showAlternateRoutes = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [activeLayers, setActiveLayers] = useState({
    hospitals: true,
    roadCuts: true,
    waterStations: true,
    gistdaFloodZones: true,
    alternateRoutes: true,
    evacHelipads: true,
  });

  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'street' | 'topo'>('dark');

  // Narathiwat coordinates: approx 6.4255, 101.8253
  const centerLat = 6.25;
  const centerLng = 101.82;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 10,
      zoomControl: true,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add CartoDB Dark Matter tile layer by default for government tactical look (No API Key)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap contributors © CARTO (NO API KEY)',
      }
    ).addTo(map);

    // Initialize layer groups
    layersGroupRef.current.hospitals = L.layerGroup().addTo(map);
    layersGroupRef.current.roadCuts = L.layerGroup().addTo(map);
    layersGroupRef.current.waterStations = L.layerGroup().addTo(map);
    layersGroupRef.current.gistdaFloodZones = L.layerGroup().addTo(map);
    layersGroupRef.current.alternateRoutes = L.layerGroup().addTo(map);
    layersGroupRef.current.evacHelipads = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when style changes (100% Free - NO API KEY required)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((l) => {
      if (l instanceof L.TileLayer) {
        map.removeLayer(l);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attribution = '© OpenStreetMap © CARTO (NO API KEY)';
    let maxZoom = 19;

    if (mapStyle === 'satellite') {
      // 100% Free Public ESRI World Imagery (High-Res Real Satellite Photos - NO API KEY required)
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = '© Esri, Maxar, Earthstar Geographics (NO API KEY)';
      maxZoom = 18;
    } else if (mapStyle === 'street') {
      // 100% Free OpenStreetMap Standard (NO API KEY required)
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '© OpenStreetMap contributors (NO API KEY)';
      maxZoom = 19;
    } else if (mapStyle === 'topo') {
      // 100% Free OpenTopoMap (Elevation contours & river systems - NO API KEY required)
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = '© OpenTopoMap contributors (NO API KEY)';
      maxZoom = 17;
    }

    L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abc',
      attribution,
    }).addTo(map);
  }, [mapStyle]);

  // Render markers and vector geometries
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear all layer groups
    Object.values(layersGroupRef.current).forEach((g) => g.clearLayers());

    // 1. GISTDA Satellite Flood inundation polygons (Simulated official GISTDA footprint across Sungai Kolok & Tak Bai basin)
    if (activeLayers.gistdaFloodZones) {
      const floodPolygon1 = L.polygon(
        [
          [6.01, 101.94],
          [6.05, 101.99],
          [6.12, 102.04],
          [6.26, 102.08],
          [6.29, 102.04],
          [6.22, 101.95],
          [6.10, 101.91],
          [6.01, 101.94],
        ],
        {
          color: '#ef4444',
          weight: 2,
          fillColor: '#dc2626',
          fillOpacity: 0.25,
          dashArray: '4, 4',
        }
      ).bindPopup(`
        <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #1e293b;">
          <b style="color: #dc2626;">พื้นที่น้ำท่วมขังตรวจจับโดยดาวเทียม GISTDA</b><br/>
          <b>ลุ่มน้ำ:</b> แม่น้ำโก-ลก และคลองมูโนะ<br/>
          <b>ระดับความเสี่ยง:</b> วิกฤตสีแดง (ระดับน้ำเกินตลิ่ง 1.2 ม.)<br/>
          <b>พื้นที่ผลกระทบ:</b> ต.มูโนะ, ต.ปาเสมัส, อ.ตากใบ<br/>
          <small style="color: #64748b;">แหล่งข้อมูล: GISTDA Disaster Platform 05/10/2569</small>
        </div>
      `);
      layersGroupRef.current.gistdaFloodZones.addLayer(floodPolygon1);

      // Flood polygon 2: Bang Nara river basin near Ra-ngae
      const floodPolygon2 = L.polygon(
        [
          [6.28, 101.70],
          [6.33, 101.75],
          [6.35, 101.73],
          [6.32, 101.68],
        ],
        {
          color: '#f97316',
          weight: 2,
          fillColor: '#ea580c',
          fillOpacity: 0.28,
        }
      ).bindPopup(`
        <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #1e293b;">
          <b style="color: #ea580c;">พื้นที่น้ำท่วมขังริมแม่น้ำบางนรา (ระแงะ)</b><br/>
          <b>ระดับน้ำ:</b> ท่วมผิวจราจร 50-65 ซม.<br/>
          <b>สถานะ:</b> เฝ้าระวังระดับสีส้ม
        </div>
      `);
      layersGroupRef.current.gistdaFloodZones.addLayer(floodPolygon2);
    }

    // 2. Road Cuts (ข้อ 2 - แผนที่เส้นทางขาด 3 ปีย้อนหลัง + เส้นทางสำรอง)
    if (activeLayers.roadCuts) {
      roadCuts.forEach((rc) => {
        const isSelected = selectedRoadCutId === rc.id;
        const color = rc.passable === 'ไม่ได้' ? '#ef4444' : '#f59e0b';

        const customIcon = L.divIcon({
          className: 'custom-roadcut-icon',
          html: `
            <div style="
              background-color: ${color};
              width: ${isSelected ? '28px' : '22px'};
              height: ${isSelected ? '28px' : '22px'};
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 10px ${color};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
              cursor: pointer;
            ">
              ✕
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([rc.lat, rc.lng], { icon: customIcon });
        marker.on('click', () => {
          if (onSelectRoadCut) onSelectRoadCut(rc.id);
        });

        marker.bindPopup(`
          <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #0f172a; min-width: 220px;">
            <div style="font-weight: bold; color: ${color}; font-size: 13px;">${rc.roadNumber}</div>
            <div style="font-weight: 600; margin: 2px 0;">${rc.locationName}</div>
            <div style="margin: 4px 0; padding: 4px; background: #fee2e2; border-radius: 4px; color: #991b1b; font-size: 11px;">
              <b>ระดับน้ำท่วม:</b> ${rc.waterDepthCm} ซม. (${rc.passable})
            </div>
            <div><b>ประวัติน้ำท่วมซ้ำซาก:</b> ปี ${rc.historicalCutYears.join(', ')}</div>
            <div style="margin-top: 4px; color: #0284c7;">
              <b>ทางเลี่ยง 1:</b> ${rc.alternateRoute1}
            </div>
            <div style="color: #0284c7;">
              <b>ทางเลี่ยง 2:</b> ${rc.alternateRoute2}
            </div>
            ${rc.boatStandbyPoint ? `<div style="color: #059669; font-weight: 500; margin-top: 4px;">⚓ ${rc.boatStandbyPoint}</div>` : ''}
          </div>
        `);
        layersGroupRef.current.roadCuts.addLayer(marker);
      });
    }

    // 3. Alternate Routes Polylines (ข้อ 2 - เส้นทางสำรอง)
    if (activeLayers.alternateRoutes && showAlternateRoutes) {
      // Bypass route 1: Sungai Kolok to Tak Bai via Waeng-Sukhirin high ground corridor
      const bypassRoute1 = L.polyline(
        [
          [6.0305, 101.9669],
          [6.0821, 101.8802],
          [6.2952, 101.7226],
          [6.4277, 101.8214],
        ],
        {
          color: '#10b981',
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 6',
        }
      ).bindTooltip('เส้นทางสำรองที่ 1: สุไหงโก-ลก ➜ สุไหงปาดี ➜ ระแงะ ➜ รพ.นราธิวาสราชนครินทร์ (เปิดใช้งาน)', {
        sticky: true,
      });
      layersGroupRef.current.alternateRoutes.addLayer(bypassRoute1);

      // Bypass route 2: Rueso to Yala / Songkhla fallback corridor
      const bypassRoute2 = L.polyline(
        [
          [6.3934, 101.5173],
          [6.4521, 101.3541],
          [6.5541, 101.2845],
        ],
        {
          color: '#06b6d4',
          weight: 4,
          opacity: 0.85,
        }
      ).bindTooltip('เส้นทางส่งต่อสำรองออกนอกจังหวัด: รือเสาะ ➜ รามัน ➜ รพ.ศูนย์ยะลา / รพ.สงขลานครินทร์', {
        sticky: true,
      });
      layersGroupRef.current.alternateRoutes.addLayer(bypassRoute2);
    }

    // 4. Hospitals (ข้อ 3 & 4: ทรัพยากรและ RTO)
    if (activeLayers.hospitals) {
      hospitals.forEach((hosp) => {
        let pinColor = '#10b981';
        if (hosp.riskLevel === 'critical') pinColor = '#ef4444';
        else if (hosp.riskLevel === 'high') pinColor = '#f97316';
        else if (hosp.riskLevel === 'warning') pinColor = '#f59e0b';

        const hospIcon = L.divIcon({
          className: 'custom-hosp-icon',
          html: `
            <div style="
              background-color: ${pinColor};
              width: 26px;
              height: 26px;
              border-radius: 6px;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
            ">
              H
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospIcon });
        marker.bindPopup(`
          <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #0f172a; min-width: 240px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <b style="font-size: 13px; color: #0369a1;">${hosp.name} (${hosp.type})</b>
              <span style="background: ${pinColor}; color: white; padding: 1px 6px; border-radius: 10px; font-size: 10px;">
                ${hosp.riskLevel.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">อ.${hosp.district}</div>
            
            <div style="background: #f1f5f9; padding: 6px; border-radius: 6px; margin-bottom: 6px;">
              <div style="font-weight: 600; color: #0f172a;">⏱️ RTO Autonomy (Safe Operating Time):</div>
              <div style="font-size: 14px; font-weight: bold; color: ${hosp.autonomyHours <= 24 ? '#dc2626' : '#0369a1'};">
                ${hosp.autonomyHours} ชั่วโมง
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
              <div>⚡ ไฟฟ้าสำรอง: <b>${hosp.fuelGeneratorHours} ชม.</b></div>
              <div>💨 ออกซิเจน: <b>${hosp.oxygenHours} ชม.</b></div>
              <div>🩸 เลือดสำรอง: <b>${hosp.bloodUnits} ยูนิต</b></div>
              <div>💧 น้ำใช้สำรอง: <b>${hosp.waterHours} ชม.</b></div>
            </div>

            <div style="margin-top: 6px; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 4px;">
              <b>ผู้ป่วยฟอกไตในพื้นที่:</b> ${hosp.dialysisPatientsCount} ราย | 
              <b>Home O2:</b> ${hosp.homeOxygenPatientsCount} ราย
            </div>
          </div>
        `);
        layersGroupRef.current.hospitals.addLayer(marker);
      });
    }

    // 5. River Basin Water Stations (ThaiWater / สสน.)
    if (activeLayers.waterStations) {
      waterStations.forEach((ws) => {
        const isCritical = ws.status.includes('วิกฤต');
        const stationColor = isCritical ? '#dc2626' : '#2563eb';

        const stationIcon = L.divIcon({
          className: 'custom-water-icon',
          html: `
            <div style="
              background-color: ${stationColor};
              width: 18px;
              height: 18px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 6px ${stationColor};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 9px;
            ">
              💧
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        // Set coordinates based on station
        const coords: [number, number] =
          ws.id === 'ws-1'
            ? [6.035, 101.968]
            : ws.id === 'ws-2'
            ? [6.045, 101.985]
            : ws.id === 'ws-3'
            ? [6.435, 101.815]
            : ws.id === 'ws-4'
            ? [6.298, 101.718]
            : [6.218, 101.525];

        const marker = L.marker(coords, { icon: stationIcon });
        marker.bindPopup(`
          <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #0f172a;">
            <b style="color: ${stationColor};">${ws.name} (${ws.stationCode})</b><br/>
            <b>ลุ่มน้ำ:</b> ${ws.riverBasin} (อ.${ws.district})<br/>
            <b>ระดับน้ำปัจจุบัน:</b> <span style="font-size: 13px; font-weight: bold; color: ${stationColor};">${ws.waterLevelM} ม.รสม.</span><br/>
            <b>ระดับตลิ่ง:</b> ${ws.bankLevelM} ม.รสม. (${ws.waterLevelM > ws.bankLevelM ? 'ล้นตลิ่ง +' + (ws.waterLevelM - ws.bankLevelM).toFixed(2) + ' ม.' : 'ต่ำกว่าตลิ่ง'})<br/>
            <b>สถานะ:</b> ${ws.status} (แนวโน้ม ${ws.trend})<br/>
            <small style="color: #64748b;">${ws.lastUpdated}</small>
          </div>
        `);
        layersGroupRef.current.waterStations.addLayer(marker);
      });
    }

    // 6. Helipads & Emergency Staging Points
    if (activeLayers.evacHelipads) {
      const helipads = [
        { name: 'จุดจอด ฮ. ค่ายกัลยาณิวัฒนา (กรม ทพ.15)', lat: 6.305, lng: 101.735, desc: 'รองรับ ฮ.ท.212 / MI-17 ขนส่งผู้ป่วยหนัก' },
        { name: 'จุดจอด ฮ. สนามบินบ้านทอน (นราธิวาส)', lat: 6.522, lng: 101.745, desc: 'รองรับ C-130 และ ฮ. ขนาดใหญ่ ขนส่งโลจิสติกส์' },
        { name: 'จุดจอด ฮ. ชั่วคราว สนามกีฬาเทศบาลสุไหงโก-ลก', lat: 6.025, lng: 101.955, desc: 'จุดอพยพผู้ป่วยวิกฤตทางอากาศยาน' },
      ];

      helipads.forEach((hp) => {
        const heliIcon = L.divIcon({
          className: 'custom-heli-icon',
          html: `
            <div style="
              background-color: #8b5cf6;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 8px #8b5cf6;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
            ">
              🚁
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([hp.lat, hp.lng], { icon: heliIcon });
        marker.bindPopup(`
          <div style="font-family: 'Prompt', sans-serif; font-size: 12px; color: #0f172a;">
            <b style="color: #6d28d9;">🚁 ${hp.name}</b><br/>
            ${hp.desc}<br/>
            <span style="color: #059669; font-weight: 500;">✓ ลานพร้อมลงจอดตลอด 24 ชม.</span>
          </div>
        `);
        layersGroupRef.current.evacHelipads.addLayer(marker);
      });
    }
  }, [hospitals, roadCuts, waterStations, activeLayers, selectedRoadCutId, showAlternateRoutes]);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-sky-800/40 shadow-xl bg-slate-950">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Bar Top-Left */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-700/50 shadow-lg text-xs">
        <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5" />
          <span>Open GIS (NO API KEY)</span>
        </span>
        <div className="h-4 w-px bg-slate-700 mx-1" />
        {/* Base map style selector */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              mapStyle === 'dark' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tactical Dark
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              mapStyle === 'satellite' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛰️ ดาวเทียมจริง (ESRI)
          </button>
          <button
            onClick={() => setMapStyle('street')}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              mapStyle === 'street' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ ถนน (OSM)
          </button>
          <button
            onClick={() => setMapStyle('topo')}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              mapStyle === 'topo' ? 'bg-cyan-600 text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⛰️ ภูมิประเทศ (Topo)
          </button>
        </div>
      </div>

      {/* Layer Toggles Top-Right */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-sky-700/50 shadow-lg text-[11px] space-y-1.5 min-w-[210px]">
        <div className="font-semibold text-sky-200 flex items-center justify-between pb-1 border-b border-slate-700">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>ชั้นข้อมูล GIS (Layers)</span>
          </span>
        </div>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span>13 โรงพยาบาล & RTO</span>
          </span>
          <input
            type="checkbox"
            checked={activeLayers.hospitals}
            onChange={() => toggleLayer('hospitals')}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>เส้นทางตัดขาด 3 ปีย้อนหลัง</span>
          </span>
          <input
            type="checkbox"
            checked={activeLayers.roadCuts}
            onChange={() => toggleLayer('roadCuts')}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>เส้นทางสำรอง (Alternate 1-2)</span>
          </span>
          <input
            type="checkbox"
            checked={activeLayers.alternateRoutes}
            onChange={() => toggleLayer('alternateRoutes')}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>เซ็นเซอร์ระดับน้ำแม่น้ำ (ThaiWater)</span>
          </span>
          <input
            type="checkbox"
            checked={activeLayers.waterStations}
            onChange={() => toggleLayer('waterStations')}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-600/50 border border-red-500" />
            <span>ขอบเขตดาวเทียม GISTDA</span>
          </span>
          <input
            type="checkbox"
            checked={activeLayers.gistdaFloodZones}
            onChange={() => toggleLayer('gistdaFloodZones')}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0"
          />
        </label>

        <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>จุดจอด ฮ. ฉุกเฉิน</span>
          </span>
          <input
            type="checkbox"
            checked={activeLayers.evacHelipads}
            onChange={() => toggleLayer('evacHelipads')}
            className="rounded border-slate-700 text-cyan-600 focus:ring-0"
          />
        </label>
      </div>

      {/* Legend Bottom-Left */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-sky-700/50 shadow-lg text-[10px] text-slate-300 flex flex-wrap items-center gap-3">
        <span className="font-semibold text-slate-200">สัญลักษณ์แผนที่:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-emerald-500" /> รพ. ปกติ/ปลอดภัย
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-amber-500" /> รพ. เฝ้าระวัง
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-red-500" /> รพ. วิกฤต (RTO ≤ 24ชม.)
        </span>
        <span className="flex items-center gap-1 text-rose-400 font-semibold">
          ✕ ถนนขาด/ผ่านไม่ได้
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          ━ ทางเลี่ยงสำรอง
        </span>
      </div>
    </div>
  );
};
