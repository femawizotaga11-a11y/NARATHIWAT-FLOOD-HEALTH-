/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { HeaderBanner, FontSizeLevel } from './components/HeaderBanner';
import { OverviewView } from './views/OverviewView';
import { GistdaWeatherMap } from './views/GistdaWeatherMap';
import { DistrictRiskView } from './views/DistrictRiskView';
import { RoadCutMapView } from './views/RoadCutMapView';
import { HospitalStatusView } from './views/HospitalStatusView';
import { ShphNetworkView } from './views/ShphNetworkView';
import { StaffManagementView } from './views/StaffManagementView';
import { VulnerablePatientView } from './views/VulnerablePatientView';
import { ReferralOpohView } from './views/ReferralOpohView';
import { BcpResourcesView } from './views/BcpResourcesView';
import { CommunicationFailoverView } from './views/CommunicationFailoverView';
import { SupplyReplenishmentView } from './views/SupplyReplenishmentView';
import { GoogleSheetSyncModal } from './views/GoogleSheetSyncModal';

import {
  INITIAL_DISTRICTS,
  INITIAL_WEATHER,
  ROAD_CUT_INCIDENTS,
  WATER_STATIONS,
} from './data/mockEocData';

import {
  fetchLiveWeatherData,
  getWaterStationsLive,
  loadSheetConfig,
  saveSheetConfig,
  SheetConfigState,
  DEFAULT_SHEET_ID,
  // 8 Collection Loaders
  loadSavedPatients,
  loadSavedHospitals,
  loadSavedShph,
  loadSavedStaff,
  loadSavedBcp,
  loadSavedReferrals,
  loadSavedCommunications,
  loadSavedReplenishments,
  // 8 Collection Savers
  savePatientsToStorage,
  saveHospitalsToStorage,
  saveShphToStorage,
  saveStaffToStorage,
  saveBcpToStorage,
  saveReferralsToStorage,
  saveCommunicationsToStorage,
  saveReplenishmentsToStorage,
  // Sync
  syncSectionToSheet,
  fetchSectionFromSheet,
  fetchFromGoogleSheet,
  pushToGoogleSheet,
  pushAllSections4To11ToSheet,
  createFullDatabaseInSheet,
} from './services/apiService';

import {
  DistrictRisk,
  HospitalStatus,
  LiveWeatherData,
  RoadCutIncident,
  VulnerablePatient,
  WaterStation,
  ShphItem,
  StaffTeamItem,
  BcpResourceItem,
  ReferralRouteItem,
  CommunicationLayer,
  ReplenishmentPlan,
} from './types/dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Baseline Situational Data
  const [districts, setDistricts] = useState<DistrictRisk[]>(INITIAL_DISTRICTS);
  const [roadCuts, setRoadCuts] = useState<RoadCutIncident[]>(ROAD_CUT_INCIDENTS);
  const [waterStations, setWaterStations] = useState<WaterStation[]>(WATER_STATIONS);
  const [weather, setWeather] = useState<LiveWeatherData>(INITIAL_WEATHER);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // -------------------------------------------------------------------
  // 8 Official CRUD Datasets (ยึด Google Sheet ID: 13KGqr... เป็นหลัก)
  // -------------------------------------------------------------------

  // 1. ข้อ 4: ผู้ป่วยเปราะบาง 7 กลุ่ม (VulnerableRegistry)
  const [patients, setPatients] = useState<VulnerablePatient[]>(() => loadSavedPatients());

  // 2. ข้อ 5: แผนส่งต่อ Referral & OPOH (ReferralRoutes)
  const [referralRoutes, setReferralRoutes] = useState<ReferralRouteItem[]>(() => loadSavedReferrals());

  // 3. ข้อ 6: ทรัพยากร BCP สำรองภาพรวม (BcpResources)
  const [bcpItems, setBcpItems] = useState<BcpResourceItem[]>(() => loadSavedBcp());

  // 4. ข้อ 7: Staff & อัตรากำลังบุคลากร (StaffRoster)
  const [staffTeams, setStaffTeams] = useState<StaffTeamItem[]>(() => loadSavedStaff());

  // 5. ข้อ 8: ทรัพยากร & RTO 13 รพ. (HospitalStatus)
  const [hospitals, setHospitals] = useState<HospitalStatus[]>(() => loadSavedHospitals());

  // 6. ข้อ 9: เครือข่าย 111 รพ.สต. (ShphNetwork)
  const [shphList, setShphList] = useState<ShphItem[]>(() => loadSavedShph());

  // 7. ข้อ 10: ระบบสื่อสารสำรอง 4 ระดับ (CommunicationLayers)
  const [communicationLayers, setCommunicationLayers] = useState<CommunicationLayer[]>(() => loadSavedCommunications());

  // 8. ข้อ 11: แผนนำเข้าจังหวัดเมื่อเกิน RTO (ReplenishmentPlans)
  const [replenishmentPlans, setReplenishmentPlans] = useState<ReplenishmentPlan[]>(() => loadSavedReplenishments());

  // Sheet configuration & sync
  const [sheetConfig, setSheetConfig] = useState<SheetConfigState>(() => loadSheetConfig());
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState<boolean>(false);

  // Auto-Sync multi-interval state (Requirement 2 & 3: Auto ซิงค์ทุกๆ)
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('eoc_auto_sync_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch (_) {
      return true;
    }
  });

  const [autoSyncIntervalSeconds, setAutoSyncIntervalSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('eoc_auto_sync_interval_seconds');
      if (saved) return Number(saved) || 60;
    } catch (_) {}
    return 60; // ค่าเริ่มต้น 1 นาที (60 วินาที)
  });

  const [countdownSeconds, setCountdownSeconds] = useState<number>(autoSyncIntervalSeconds);

  useEffect(() => {
    try {
      localStorage.setItem('eoc_auto_sync_enabled', String(autoSyncEnabled));
    } catch (_) {}
  }, [autoSyncEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('eoc_auto_sync_interval_seconds', String(autoSyncIntervalSeconds));
    } catch (_) {}
    setCountdownSeconds(autoSyncIntervalSeconds);
  }, [autoSyncIntervalSeconds]);

  // Sync notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Font size state (Requirement 1: ปรับขนาดตัวอักษร)
  const [fontSize, setFontSize] = useState<FontSizeLevel>(() => {
    try {
      const saved = localStorage.getItem('eoc_font_size');
      if (saved === 'sm' || saved === 'md' || saved === 'lg' || saved === 'xl') return saved;
    } catch (_) {}
    return 'md';
  });

  useEffect(() => {
    try {
      localStorage.setItem('eoc_font_size', fontSize);
    } catch (_) {}
    const root = document.documentElement;
    root.classList.remove('font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl');
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch real weather on mount
  useEffect(() => {
    refreshWeather();
  }, []);

  const refreshWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const live = await fetchLiveWeatherData();
      setWeather(live);
    } catch (e) {
      console.warn('Weather fetch error', e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // -------------------------------------------------------------------
  // Cross-Registry Data Correlation (ข้อ 4 - 11 สัมพันธ์ สอดคล้อง เป็นตัวเลขเดียวกัน 100%)
  // -------------------------------------------------------------------
  // เตียงว่างปลายทางในข้อ 5 คำนวณเชื่อมโยงตรงกับ 13 รพ. ในข้อ 8 แบบ Real-time
  const correlatedReferralRoutes = useMemo(() => {
    return referralRoutes.map((r) => {
      const destHosp = hospitals.find(
        (h) =>
          h.name.includes(r.destinationHospital) ||
          r.destinationHospital.includes(h.name) ||
          (h.code && r.destinationHospitalCode === h.code)
      );
      if (destHosp) {
        return {
          ...r,
          availableBeds: Math.max(0, destHosp.bedTotal - destHosp.bedOccupied),
        };
      }
      return r;
    });
  }, [referralRoutes, hospitals]);

  // ตัวเลขผู้ป่วยฟอกไตและ Home O2 ใน 13 รพ. สอดคล้องกับทะเบียนผู้ป่วยเปราะบางในข้อ 4 แบบ Real-time
  const correlatedHospitals = useMemo(() => {
    return hospitals.map((h) => {
      const linkedDialysisCount = patients.filter(
        (p) =>
          p.category === 'dialysis' &&
          (p.hospitalRef.includes(h.name) || h.name.includes(p.hospitalRef) || p.district === h.district)
      ).length;
      const linkedHomeO2Count = patients.filter(
        (p) =>
          p.category === 'home_o2' &&
          (p.hospitalRef.includes(h.name) || h.name.includes(p.hospitalRef) || p.district === h.district)
      ).length;
      return {
        ...h,
        dialysisPatientsCount: (h.dialysisPatientsCount || 0) + linkedDialysisCount,
        homeOxygenPatientsCount: (h.homeOxygenPatientsCount || 0) + linkedHomeO2Count,
      };
    });
  }, [hospitals, patients]);

  // Requirement 2 & 3: Auto Push On Every Change Across Sections 4-11
  const autoPushOnChange = (actionMsg: string) => {
    showToast(actionMsg);
    setCountdownSeconds(autoSyncIntervalSeconds);
    if (autoSyncEnabled) {
      setTimeout(() => {
        handleBulkPush4To11(undefined, true);
      }, 500);
    }
  };

  // -------------------------------------------------------------------
  // CRUD Handlers for all 8 Sections (With Auto-Push on Every Change)
  // -------------------------------------------------------------------

  // 1. Patients CRUD (ข้อ 4)
  const handleAddPatient = (item: VulnerablePatient) => {
    const updated = [item, ...patients];
    setPatients(updated);
    savePatientsToStorage(updated);
    autoPushOnChange(`เพิ่มผู้ป่วย ${item.fullName} [${item.code}] เรียบร้อย (Auto-Sync)`);
  };
  const handleUpdatePatient = (item: VulnerablePatient) => {
    const updated = patients.map((p) => (p.id === item.id ? item : p));
    setPatients(updated);
    savePatientsToStorage(updated);
    autoPushOnChange(`อัปเดตข้อมูล ${item.fullName} [${item.code}] เรียบร้อย (Auto-Sync)`);
  };
  const handleDeletePatient = (id: string) => {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    savePatientsToStorage(updated);
    autoPushOnChange('ลบข้อมูลผู้ป่วยเรียบร้อย (Auto-Sync)');
  };

  // 2. Referral Routes CRUD (ข้อ 5)
  const handleAddReferral = (item: ReferralRouteItem) => {
    const updated = [item, ...referralRoutes];
    setReferralRoutes(updated);
    saveReferralsToStorage(updated);
    autoPushOnChange(`เพิ่มเส้นทางส่งต่อ ${item.originHospital} ➔ ${item.destinationHospital} (Auto-Sync)`);
  };
  const handleUpdateReferral = (item: ReferralRouteItem) => {
    const updated = referralRoutes.map((r) => (r.id === item.id ? item : r));
    setReferralRoutes(updated);
    saveReferralsToStorage(updated);
    autoPushOnChange('อัปเดตเส้นทางส่งต่อเรียบร้อย (Auto-Sync)');
  };
  const handleDeleteReferral = (id: string) => {
    const updated = referralRoutes.filter((r) => r.id !== id);
    setReferralRoutes(updated);
    saveReferralsToStorage(updated);
    autoPushOnChange('ลบเส้นทางส่งต่อเรียบร้อย (Auto-Sync)');
  };

  // 3. BCP Items CRUD (ข้อ 6)
  const handleAddBcp = (item: BcpResourceItem) => {
    const updated = [item, ...bcpItems];
    setBcpItems(updated);
    saveBcpToStorage(updated);
    autoPushOnChange(`เพิ่มทรัพยากร BCP "${item.title}" [${item.code}] (Auto-Sync)`);
  };
  const handleUpdateBcp = (item: BcpResourceItem) => {
    const updated = bcpItems.map((b) => (b.id === item.id ? item : b));
    setBcpItems(updated);
    saveBcpToStorage(updated);
    autoPushOnChange(`อัปเดตทรัพยากร BCP "${item.title}" (Auto-Sync)`);
  };
  const handleDeleteBcp = (id: string) => {
    const updated = bcpItems.filter((b) => b.id !== id);
    setBcpItems(updated);
    saveBcpToStorage(updated);
    autoPushOnChange('ลบทรัพยากร BCP เรียบร้อย (Auto-Sync)');
  };

  // 4. Staff Teams CRUD (ข้อ 7)
  const handleAddStaff = (item: StaffTeamItem) => {
    const updated = [item, ...staffTeams];
    setStaffTeams(updated);
    saveStaffToStorage(updated);
    autoPushOnChange(`เพิ่มทีมปฏิบัติการ ${item.teamName} [${item.code}] (Auto-Sync)`);
  };
  const handleUpdateStaff = (item: StaffTeamItem) => {
    const updated = staffTeams.map((s) => (s.id === item.id ? item : s));
    setStaffTeams(updated);
    saveStaffToStorage(updated);
    autoPushOnChange(`อัปเดตข้อมูลทีม ${item.teamName} (Auto-Sync)`);
  };
  const handleDeleteStaff = (id: string) => {
    const updated = staffTeams.filter((s) => s.id !== id);
    setStaffTeams(updated);
    saveStaffToStorage(updated);
    autoPushOnChange('ลบข้อมูลทีมปฏิบัติการเรียบร้อย (Auto-Sync)');
  };

  // 5. Hospitals CRUD (ข้อ 8)
  const handleAddHospital = (item: HospitalStatus) => {
    const updated = [item, ...hospitals];
    setHospitals(updated);
    saveHospitalsToStorage(updated);
    autoPushOnChange(`เพิ่มโรงพยาบาล ${item.name} [${item.code}] (Auto-Sync)`);
  };
  const handleUpdateHospital = (item: HospitalStatus) => {
    const updated = hospitals.map((h) => (h.id === item.id ? item : h));
    setHospitals(updated);
    saveHospitalsToStorage(updated);
    autoPushOnChange(`อัปเดตสถานะ ${item.name} (Auto-Sync)`);
  };
  const handleDeleteHospital = (id: string) => {
    const updated = hospitals.filter((h) => h.id !== id);
    setHospitals(updated);
    saveHospitalsToStorage(updated);
    autoPushOnChange('ลบข้อมูลโรงพยาบาลเรียบร้อย (Auto-Sync)');
  };

  // 6. SHPH Network CRUD (ข้อ 9)
  const handleAddShph = (item: ShphItem) => {
    const updated = [item, ...shphList];
    setShphList(updated);
    saveShphToStorage(updated);
    autoPushOnChange(`เพิ่ม ${item.name} [${item.code}] (Auto-Sync)`);
  };
  const handleUpdateShph = (item: ShphItem) => {
    const updated = shphList.map((s) => (s.id === item.id ? item : s));
    setShphList(updated);
    saveShphToStorage(updated);
    autoPushOnChange(`อัปเดตข้อมูล ${item.name} (Auto-Sync)`);
  };
  const handleDeleteShph = (id: string) => {
    const updated = shphList.filter((s) => s.id !== id);
    setShphList(updated);
    saveShphToStorage(updated);
    autoPushOnChange('ลบข้อมูล รพ.สต. เรียบร้อย (Auto-Sync)');
  };

  // 7. Communication Layers CRUD (ข้อ 10)
  const handleAddCommunication = (item: CommunicationLayer) => {
    const updated = [...communicationLayers, item];
    setCommunicationLayers(updated);
    saveCommunicationsToStorage(updated);
    autoPushOnChange(`เพิ่มระบบสื่อสาร ${item.name} (Auto-Sync)`);
  };
  const handleUpdateCommunication = (item: CommunicationLayer) => {
    const updated = communicationLayers.map((c) => (c.level === item.level ? item : c));
    setCommunicationLayers(updated);
    saveCommunicationsToStorage(updated);
    autoPushOnChange(`อัปเดตระบบสื่อสารระดับ ${item.level} (Auto-Sync)`);
  };
  const handleDeleteCommunication = (level: number) => {
    const updated = communicationLayers.filter((c) => c.level !== level);
    setCommunicationLayers(updated);
    saveCommunicationsToStorage(updated);
    autoPushOnChange('ลบระบบสื่อสารเรียบร้อย (Auto-Sync)');
  };

  // 8. Replenishment Plans CRUD (ข้อ 11)
  const handleAddReplenishment = (item: ReplenishmentPlan) => {
    const updated = [item, ...replenishmentPlans];
    setReplenishmentPlans(updated);
    saveReplenishmentsToStorage(updated);
    autoPushOnChange(`เพิ่มแผนนำเข้า "${item.resourceCategory}" [${item.code}] (Auto-Sync)`);
  };
  const handleUpdateReplenishment = (item: ReplenishmentPlan) => {
    const updated = replenishmentPlans.map((r) => (r.id === item.id ? item : r));
    setReplenishmentPlans(updated);
    saveReplenishmentsToStorage(updated);
    autoPushOnChange(`อัปเดตแผนนำเข้า "${item.resourceCategory}" (Auto-Sync)`);
  };
  const handleDeleteReplenishment = (id: string) => {
    const updated = replenishmentPlans.filter((r) => r.id !== id);
    setReplenishmentPlans(updated);
    saveReplenishmentsToStorage(updated);
    autoPushOnChange('ลบแผนนำเข้าทรัพยากรเรียบร้อย (Auto-Sync)');
  };

  // -------------------------------------------------------------------
  // Section-specific Google Sheet Push & Pull Handlers
  // -------------------------------------------------------------------
  const handlePushSection = async <T,>(action: string, items: T[], name: string) => {
    setIsSyncingSheet(true);
    try {
      const res = await syncSectionToSheet(action, items, sheetConfig.gasWebAppUrl, name);
      showToast(res.message);
    } catch (err) {
      showToast(`เกิดข้อผิดพลาดในการบันทึก: ${String(err)}`);
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handlePullSection = async <T,>(
    action: string,
    sheetTab: string,
    setter: (data: T[]) => void,
    saver?: (data: T[]) => void,
    name = 'ข้อมูล'
  ) => {
    setIsSyncingSheet(true);
    try {
      const res = await fetchSectionFromSheet<T>(action, sheetTab, sheetConfig.sheetId, sheetConfig.gasWebAppUrl);
      if (res.success && res.data && res.data.length > 0) {
        setter(res.data);
        if (saver) saver(res.data);
        showToast(`ดึงข้อมูล ${name} จาก Google Sheet สำเร็จ (${res.data.length} รายการ)`);
      } else {
        showToast(res.message || `ไม่สามารถดึงข้อมูล ${name} ได้ โปรดตรวจสอบสิทธิ์การแชร์ของชีต`);
      }
    } catch (err) {
      showToast(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${String(err)}`);
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Sheet config updater
  const handleSaveSheetConfig = (newConfig: SheetConfigState) => {
    setSheetConfig(newConfig);
    saveSheetConfig(newConfig);
  };

  // Global Pull & Push
  const handleGlobalPullFromSheet = async () => {
    setIsSyncingSheet(true);
    try {
      const res = await fetchFromGoogleSheet(sheetConfig.sheetId, sheetConfig.gasWebAppUrl);
      if (res.success && res.data && res.data.length > 0) {
        setPatients(res.data);
        savePatientsToStorage(res.data);
        const updatedConfig: SheetConfigState = {
          ...sheetConfig,
          lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
          status: 'success',
        };
        handleSaveSheetConfig(updatedConfig);
        showToast(`ดึงข้อมูลผู้ป่วยเปราะบางจาก Google Sheet สำเร็จ (${res.data.length} รายการ)`);
      } else {
        showToast(res.error || 'โปรดปลดล็อคสิทธิ์แชร์ชีต หรือติดตั้ง Web App URL');
      }
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการดึงข้อมูล: ' + String(err));
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleGlobalPushToSheet = async () => {
    setIsSyncingSheet(true);
    try {
      const res = await pushToGoogleSheet(patients, sheetConfig.gasWebAppUrl);
      const updatedConfig: SheetConfigState = {
        ...sheetConfig,
        lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
        status: res.success ? 'success' : 'error',
      };
      handleSaveSheetConfig(updatedConfig);
      showToast(res.message);
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + String(err));
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Requirement 1: นำข้อมูลในเมนู บันทึกใน sheet ตั้งแต่ ข้อ 4-11
  const handleBulkPush4To11 = async (customToast?: string, isSilent = false) => {
    if (isSyncingSheet) return;
    setIsSyncingSheet(true);
    try {
      const res = await pushAllSections4To11ToSheet(
        {
          patients,
          referrals: correlatedReferralRoutes,
          bcp: bcpItems,
          staff: staffTeams,
          hospitals: correlatedHospitals,
          shph: shphList,
          communications: communicationLayers,
          replenishments: replenishmentPlans,
        },
        sheetConfig.gasWebAppUrl
      );
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
      const updatedConfig: SheetConfigState = {
        ...sheetConfig,
        lastSyncTime: timeStr,
        status: res.success ? 'success' : 'error',
      };
      handleSaveSheetConfig(updatedConfig);
      if (customToast) {
        showToast(customToast);
      } else if (!isSilent) {
        showToast(res.message);
      }
    } catch (err) {
      if (!isSilent) showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูลข้อ 4-11: ' + String(err));
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Requirement 3: Auto ซิงค์ทุกๆ (Interval Ticker Loop)
  useEffect(() => {
    if (!autoSyncEnabled) return;

    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          handleBulkPush4To11(undefined, true);
          return autoSyncIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    autoSyncEnabled,
    autoSyncIntervalSeconds,
    patients,
    correlatedReferralRoutes,
    bcpItems,
    staffTeams,
    correlatedHospitals,
    shphList,
    communicationLayers,
    replenishmentPlans,
    sheetConfig.gasWebAppUrl,
  ]);

  // Requirement 2: รองรับสร้างฐานข้อมูลใหม่ทั้งหมด โดยยึดเนื้อหาข้อมูล โครงสร้างตามหัวข้อ 1-11
  const handleCreateFullDb1To11 = async () => {
    setIsSyncingSheet(true);
    try {
      const res = await createFullDatabaseInSheet(
        {
          waterStations,
          districts,
          roadCuts,
          patients,
          referrals: referralRoutes,
          bcp: bcpItems,
          staff: staffTeams,
          hospitals,
          shph: shphList,
          communications: communicationLayers,
          replenishments: replenishmentPlans,
        },
        sheetConfig.gasWebAppUrl
      );
      const updatedConfig: SheetConfigState = {
        ...sheetConfig,
        lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
        status: res.success ? 'success' : 'error',
      };
      handleSaveSheetConfig(updatedConfig);
      showToast(res.message);
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการสร้างฐานข้อมูลใหม่ 1-11: ' + String(err));
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Quick stats
  const criticalHospCount = hospitals.filter(
    (h) => h.autonomyHours <= 36 || h.riskLevel === 'critical' || h.riskLevel === 'high'
  ).length;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-[9999] bg-slate-900 border border-cyan-500/80 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top EOC Hero Banner */}
      <HeaderBanner
        weather={weather}
        onRefreshWeather={refreshWeather}
        isLoadingWeather={isLoadingWeather}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        sheetConnected={Boolean(sheetConfig.sheetId)}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        autoSyncEnabled={autoSyncEnabled}
        autoSyncSeconds={autoSyncIntervalSeconds}
        countdownSeconds={countdownSeconds}
        lastSyncTime={sheetConfig.lastSyncTime}
        isSyncing={isSyncingSheet}
        onToggleAutoSync={() => setAutoSyncEnabled(!autoSyncEnabled)}
        onChangeAutoSyncInterval={(sec) => setAutoSyncIntervalSeconds(sec)}
        onTriggerInstantSync={() => handleBulkPush4To11('ซิงค์ข้อมูลข้อ 4-11 ทันทีเรียบร้อย')}
      />

      {/* Main Workspace: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'gas_sync') {
              setIsSheetModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          vulnerableCount={patients.length}
          roadCutCount={roadCuts.length}
          criticalHospCount={criticalHospCount}
          referralCount={referralRoutes.length}
          bcpCount={bcpItems.length}
          staffCount={staffTeams.length}
          hospitalCount={hospitals.length}
          shphCount={shphList.length}
          commCount={communicationLayers.length}
          repCount={replenishmentPlans.length}
        />

        {/* Right Active View Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
          <div className="max-w-7xl mx-auto pb-12">
            {/* Overview Master */}
            {activeTab === 'overview' && (
              <OverviewView
                weather={weather}
                districts={districts}
                hospitals={hospitals}
                roadCuts={roadCuts}
                waterStations={waterStations}
                patients={patients}
                referrals={referralRoutes}
                bcpItems={bcpItems}
                staffTeams={staffTeams}
                shphList={shphList}
                communicationLayers={communicationLayers}
                replenishmentPlans={replenishmentPlans}
                onNavigate={(tab) => {
                  if (tab === 'gas_sync') {
                    setIsSheetModalOpen(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
              />
            )}

            {/* ข้อ 1: เสี่ยงอุทกภัย GISTDA & ปภ. (Leafmap Open GIS Engine) */}
            {activeTab === 'gistda_weather' && (
              <GistdaWeatherMap
                weather={weather}
                waterStations={waterStations}
                hospitals={hospitals}
                roadCuts={roadCuts}
                onRefreshWeather={refreshWeather}
                isLoading={isLoadingWeather}
              />
            )}

            {/* ข้อ 2: ความเสี่ยง 13 อำเภอ */}
            {activeTab === 'district_risk' && (
              <DistrictRiskView districts={districts} />
            )}

            {/* ข้อ 3: เส้นทางตัดขาด 3 ปีย้อนหลัง & เส้นทางสำรอง (Leafmap Open GIS Engine) */}
            {activeTab === 'road_cuts' && (
              <RoadCutMapView
                roadCuts={roadCuts}
                hospitals={hospitals}
                waterStations={waterStations}
              />
            )}

            {/* ======================================================== */}
            {/* เมนู ดูแลประชาชน & บัญชาการ (ข้อ 4 - 7: CRUD Sheet)       */}
            {/* ======================================================== */}

            {/* ข้อ 4: ผู้ป่วยเปราะบาง 7 กลุ่ม & EVAC (CRUD ลง Sheet) */}
            {activeTab === 'vulnerable_registry' && (
              <VulnerablePatientView
                patients={patients}
                onAddPatient={handleAddPatient}
                onUpdatePatient={handleUpdatePatient}
                onDeletePatient={handleDeletePatient}
                onOpenSheetSync={() => setIsSheetModalOpen(true)}
                isSyncing={isSyncingSheet}
              />
            )}

            {/* ข้อ 5: ส่งต่อ Dynamic Referral & OPOH (CRUD ลง Sheet) */}
            {activeTab === 'referral_opoh' && (
              <ReferralOpohView
                hospitals={hospitals}
                roadCuts={roadCuts}
                referralRoutes={referralRoutes}
                onAddRoute={handleAddReferral}
                onUpdateRoute={handleUpdateReferral}
                onDeleteRoute={handleDeleteReferral}
                onSyncWithSheet={() => handlePushSection('saveReferrals', referralRoutes, 'เส้นทางส่งต่อ')}
                onPullFromSheet={() => handlePullSection('getReferrals', 'ReferralRoutes', setReferralRoutes, saveReferralsToStorage, 'เส้นทางส่งต่อ')}
                isSyncing={isSyncingSheet}
              />
            )}

            {/* ข้อ 6: ทรัพยากร BCP ภาพรวม (CRUD ลง Sheet) */}
            {activeTab === 'bcp_resources' && (
              <BcpResourcesView
                bcpItems={bcpItems}
                onAddBcpItem={handleAddBcp}
                onUpdateBcpItem={handleUpdateBcp}
                onDeleteBcpItem={handleDeleteBcp}
                onSyncWithSheet={() => handlePushSection('saveBcp', bcpItems, 'ทรัพยากร BCP')}
                onPullFromSheet={() => handlePullSection('getBcp', 'BcpResources', setBcpItems, saveBcpToStorage, 'ทรัพยากร BCP')}
                isSyncing={isSyncingSheet}
              />
            )}

            {/* ข้อ 7: กำลังคน Staff & บุคลากร (CRUD ลง Sheet) */}
            {activeTab === 'staff' && (
              <StaffManagementView
                staffTeams={staffTeams}
                onAddStaffTeam={handleAddStaff}
                onUpdateStaffTeam={handleUpdateStaff}
                onDeleteStaffTeam={handleDeleteStaff}
                onSyncWithSheet={() => handlePushSection('saveStaff', staffTeams, 'ทีมบุคลากร')}
                onPullFromSheet={() => handlePullSection('getStaff', 'StaffRoster', setStaffTeams, saveStaffToStorage, 'ทีมบุคลากร')}
                isSyncing={isSyncingSheet}
                hospitals={hospitals}
              />
            )}

            {/* ======================================================== */}
            {/* เมนู ขีดความสามารถสถานพยาบาล (ข้อ 8 - 11: CRUD Sheet)     */}
            {/* ======================================================== */}

            {/* ข้อ 8: ทรัพยากร & Safe Operating RTO 13 รพ. (CRUD ลง Sheet) */}
            {activeTab === 'hospitals' && (
              <HospitalStatusView
                hospitals={hospitals}
                onAddHospital={handleAddHospital}
                onUpdateHospital={handleUpdateHospital}
                onDeleteHospital={handleDeleteHospital}
                onSyncWithSheet={() => handlePushSection('saveHospitals', hospitals, 'ข้อมูล 13 โรงพยาบาล')}
                onPullFromSheet={() => handlePullSection('getHospitals', 'HospitalStatus', setHospitals, saveHospitalsToStorage, 'ข้อมูล 13 โรงพยาบาล')}
                isSyncing={isSyncingSheet}
              />
            )}

            {/* ข้อ 9: เครือข่าย 111 รพ.สต. (CRUD ลง Sheet) */}
            {activeTab === 'shph' && (
              <ShphNetworkView
                shphList={shphList}
                onAddShph={handleAddShph}
                onUpdateShph={handleUpdateShph}
                onDeleteShph={handleDeleteShph}
                onSyncWithSheet={() => handlePushSection('saveShph', shphList, 'รพ.สต. ปฐมภูมิ')}
                onPullFromSheet={() => handlePullSection('getShph', 'ShphNetwork', setShphList, saveShphToStorage, 'รพ.สต. ปฐมภูมิ')}
                isSyncing={isSyncingSheet}
              />
            )}

            {/* ข้อ 10: ระบบสื่อสารสำรอง 4 ระดับ (CRUD ลง Sheet) */}
            {activeTab === 'communication' && (
              <CommunicationFailoverView
                communicationLayers={communicationLayers}
                onAddLayer={handleAddCommunication}
                onUpdateLayer={handleUpdateCommunication}
                onDeleteLayer={handleDeleteCommunication}
                onSyncWithSheet={() => handlePushSection('saveCommunications', communicationLayers, 'ระบบสื่อสารสำรอง')}
                onPullFromSheet={() => handlePullSection('getCommunications', 'CommunicationLayers', setCommunicationLayers, saveCommunicationsToStorage, 'ระบบสื่อสารสำรอง')}
                isSyncing={isSyncingSheet}
              />
            )}

            {/* ข้อ 11: นำเข้าจังหวัดเมื่อเกิน RTO (CRUD ลง Sheet) */}
            {activeTab === 'replenishment' && (
              <SupplyReplenishmentView
                plans={replenishmentPlans}
                onAddPlan={handleAddReplenishment}
                onUpdatePlan={handleUpdateReplenishment}
                onDeletePlan={handleDeleteReplenishment}
                onSyncWithSheet={() => handlePushSection('saveReplenishments', replenishmentPlans, 'แผนนำเข้าจังหวัด')}
                onPullFromSheet={() => handlePullSection('getReplenishments', 'ReplenishmentPlans', setReplenishmentPlans, saveReplenishmentsToStorage, 'แผนนำเข้าจังหวัด')}
                isSyncing={isSyncingSheet}
              />
            )}
          </div>
        </main>
      </div>

      {/* Google Sheets GAS Integration Modal */}
      {isSheetModalOpen && (
        <GoogleSheetSyncModal
          isOpen={isSheetModalOpen}
          onClose={() => setIsSheetModalOpen(false)}
          config={sheetConfig}
          onSaveConfig={handleSaveSheetConfig}
          patients={patients || []}
          referrals={correlatedReferralRoutes || []}
          bcp={bcpItems || []}
          staff={staffTeams || []}
          hospitals={correlatedHospitals || []}
          shph={shphList || []}
          communications={communicationLayers || []}
          replenishments={replenishmentPlans || []}
          waterStations={waterStations || []}
          districts={districts || []}
          roadCuts={roadCuts || []}
          onBulkPush4To11={handleBulkPush4To11}
          onCreateFullDb1To11={handleCreateFullDb1To11}
          onPullFromSheet={handleGlobalPullFromSheet}
          onPushToSheet={handleGlobalPushToSheet}
          isSyncing={isSyncingSheet}
          autoSyncEnabled={autoSyncEnabled}
          autoSyncSeconds={autoSyncIntervalSeconds}
          countdownSeconds={countdownSeconds}
          onToggleAutoSync={() => setAutoSyncEnabled(!autoSyncEnabled)}
          onChangeAutoSyncInterval={(sec) => setAutoSyncIntervalSeconds(sec)}
          onTriggerInstantSync={async () => {
            await handleBulkPush4To11('ซิงค์ข้อมูลข้อ 4-11 ทันทีเรียบร้อย');
          }}
        />
      )}
    </div>
  );
}
