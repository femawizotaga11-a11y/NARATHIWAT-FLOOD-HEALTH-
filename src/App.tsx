/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, TabId } from './components/Sidebar';
import { HeaderBanner } from './components/HeaderBanner';
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
  INITIAL_HOSPITALS,
  INITIAL_PATIENTS,
  INITIAL_WEATHER,
  ROAD_CUT_INCIDENTS,
  WATER_STATIONS,
} from './data/mockEocData';
import {
  fetchLiveWeatherData,
  getWaterStationsLive,
  loadSavedPatients,
  savePatientsToStorage,
  loadSheetConfig,
  saveSheetConfig,
  fetchFromGoogleSheet,
  pushToGoogleSheet,
  SheetConfigState,
} from './services/apiService';
import {
  DistrictRisk,
  HospitalStatus,
  LiveWeatherData,
  RoadCutIncident,
  VulnerablePatient,
  WaterStation,
} from './types/dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // State
  const [districts, setDistricts] = useState<DistrictRisk[]>(INITIAL_DISTRICTS);
  const [hospitals, setHospitals] = useState<HospitalStatus[]>(INITIAL_HOSPITALS);
  const [roadCuts, setRoadCuts] = useState<RoadCutIncident[]>(ROAD_CUT_INCIDENTS);
  const [waterStations, setWaterStations] = useState<WaterStation[]>(WATER_STATIONS);
  const [weather, setWeather] = useState<LiveWeatherData>(INITIAL_WEATHER);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  // Vulnerable Patients Registry (CRUD + Local Storage + GAS)
  const [patients, setPatients] = useState<VulnerablePatient[]>(() => {
    const saved = loadSavedPatients();
    return saved && saved.length > 0 ? saved : INITIAL_PATIENTS;
  });

  // Sheet configuration
  const [sheetConfig, setSheetConfig] = useState<SheetConfigState>(() => loadSheetConfig());
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState<boolean>(false);

  // Fetch real weather on mount
  useEffect(() => {
    refreshWeather();
  }, []);

  // Save patients to local storage when changed
  useEffect(() => {
    savePatientsToStorage(patients);
  }, [patients]);

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

  // CRUD for Vulnerable Patients
  const handleAddPatient = (patient: VulnerablePatient) => {
    const updated = [patient, ...patients];
    setPatients(updated);
    savePatientsToStorage(updated);
  };

  const handleUpdatePatient = (patient: VulnerablePatient) => {
    const updated = patients.map((p) => (p.id === patient.id ? patient : p));
    setPatients(updated);
    savePatientsToStorage(updated);
  };

  const handleDeletePatient = (id: string) => {
    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    savePatientsToStorage(updated);
  };

  // Sheet actions
  const handleSaveSheetConfig = (newConfig: SheetConfigState) => {
    setSheetConfig(newConfig);
    saveSheetConfig(newConfig);
  };

  const handlePullFromSheet = async () => {
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
        alert(`ดึงข้อมูลสำเร็จ! อัปเดตข้อมูลผู้ป่วยเปราะบางแล้ว ${res.data.length} รายการ`);
      } else {
        alert(res.error || 'ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบสิทธิ์การแชร์ของชีตหรือติดตั้ง Apps Script');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลจากชีต: ' + String(err));
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handlePushToSheet = async () => {
    setIsSyncingSheet(true);
    try {
      const res = await pushToGoogleSheet(patients, sheetConfig.gasWebAppUrl);
      if (res.success) {
        const updatedConfig: SheetConfigState = {
          ...sheetConfig,
          lastSyncTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
          status: 'success',
        };
        handleSaveSheetConfig(updatedConfig);
        alert(res.message);
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + String(err));
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
      {/* Top EOC Hero Banner */}
      <HeaderBanner
        weather={weather}
        onRefreshWeather={refreshWeather}
        isLoadingWeather={isLoadingWeather}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        sheetConnected={Boolean(sheetConfig.sheetId)}
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
        />

        {/* Right Active View Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'overview' && (
              <OverviewView
                weather={weather}
                districts={districts}
                hospitals={hospitals}
                roadCuts={roadCuts}
                waterStations={waterStations}
                patients={patients}
                onNavigate={(tab) => {
                  if (tab === 'gas_sync') {
                    setIsSheetModalOpen(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
              />
            )}

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

            {activeTab === 'district_risk' && (
              <DistrictRiskView districts={districts} />
            )}

            {activeTab === 'road_cuts' && (
              <RoadCutMapView
                roadCuts={roadCuts}
                hospitals={hospitals}
                waterStations={waterStations}
              />
            )}

            {activeTab === 'hospitals' && (
              <HospitalStatusView hospitals={hospitals} />
            )}

            {activeTab === 'shph' && <ShphNetworkView />}

            {activeTab === 'staff' && (
              <StaffManagementView hospitals={hospitals} />
            )}

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

            {activeTab === 'referral_opoh' && (
              <ReferralOpohView hospitals={hospitals} roadCuts={roadCuts} />
            )}

            {activeTab === 'bcp_resources' && <BcpResourcesView />}

            {activeTab === 'communication' && <CommunicationFailoverView />}

            {activeTab === 'replenishment' && <SupplyReplenishmentView />}
          </div>
        </main>
      </div>

      {/* Google Sheets GAS Integration Modal */}
      <GoogleSheetSyncModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        config={sheetConfig}
        onSaveConfig={handleSaveSheetConfig}
        patients={patients}
        onPullFromSheet={handlePullFromSheet}
        onPushToSheet={handlePushToSheet}
        isSyncing={isSyncingSheet}
      />
    </div>
  );
}
