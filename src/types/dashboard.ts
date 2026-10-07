/**
 * EOC Narathiwat Emergency Health Command Center Types
 * Official flood disaster response & BCP decision support
 */

export type RiskLevel = 'critical' | 'high' | 'warning' | 'normal'; // แดง | ส้ม | เหลือง | เขียว
export type RiskTrend = 'up' | 'stable' | 'down';

export interface DistrictRisk {
  id: string;
  name: string;
  nameEn: string;
  level: RiskLevel;
  trend: RiskTrend;
  forecast6h: 'เสี่ยงสูง' | 'น้ำเพิ่ม' | 'ท่วมขัง' | 'เฝ้าระวัง' | 'ปกติ';
  forecast12h: 'เสี่ยงสูง' | 'น้ำเพิ่ม' | 'ท่วมขัง' | 'เฝ้าระวัง' | 'ปกติ';
  forecast24h: 'น้ำเพิ่ม' | 'ท่วมขัง' | 'เฝ้าระวัง' | 'ปกติ';
  rainfall24h: number; // mm
  criticalPointsCount: number;
  vulnerableCount: number;
}

export type ServiceStatus = 'active' | 'partial' | 'closed';

export interface HospitalStatus {
  id: string;
  code?: string; // รหัสทะเบียนสถานพยาบาล เช่น REG-HOS-001
  hospCode5Digit?: string; // รหัส 5 หลัก สธ. เช่น 10672
  name: string;
  type: 'A+' | 'S+' | 'M' | 'S';
  district: string;
  riskLevel: RiskLevel;
  er: ServiceStatus;
  lr: ServiceStatus;
  or: ServiceStatus;
  icu: ServiceStatus;
  dialysis: ServiceStatus;
  opdNcd: ServiceStatus;
  autonomyHours: number; // RTO Safe Operating Time in hours
  fuelGeneratorHours: number;
  oxygenHours: number;
  waterHours: number;
  bloodUnits: number;
  bloodStatus: 'เพียงพอ' | 'เสี่ยงขาด' | 'วิกฤต';
  doctorCount: number;
  nurseCount: number;
  emtCount: number;
  staffReadinessPct: number;
  dialysisPatientsCount: number;
  homeOxygenPatientsCount: number;
  bedTotal: number;
  bedOccupied: number;
  lat: number;
  lng: number;
  bcpActive: boolean;
  notes?: string;
}

export interface ShphSummary {
  district: string;
  total: number;
  normal: number;
  monitoring: number;
  highRisk: number;
  closed: number;
}

export type VulnerableCategory =
  | 'pregnant_risk' // หญิงตั้งครรภ์เสี่ยงสูง / ใกล้คลอด
  | 'dialysis' // ผู้ป่วย Dialysis
  | 'home_o2' // Home O2 / Ventilator
  | 'bedridden' // ผู้ป่วยติดเตียง / พึ่งพาอุปกรณ์
  | 'critical_med' // ผู้ป่วยที่ขาดยาไม่ได้
  | 'smi_psych' // SMI / จิตเวชรุนแรง
  | 'palliative'; // Palliative / Device-dependent

export type EvacuationStatus =
  | 'pending' // รอดำเนินการ
  | 'contacted' // ติดต่อแล้ว
  | 'in_transit' // กำลังเคลื่อนย้าย
  | 'evacuated' // อพยพสำเร็จ / พักจุดปลอดภัย
  | 'declined'; // ปฏิเสธการย้าย / มีญาติดูแล

export interface VulnerablePatient {
  id: string;
  code: string; // รหัสอ้างอิง เช่น NRT-VUL-001
  fullName: string;
  idCardMasked: string; // e.g. 1-96xx-xxxxx-xx-3
  age: number;
  category: VulnerableCategory;
  conditionDetail: string;
  phone: string;
  relativePhone: string;
  district: string;
  subdistrict: string;
  villageNo: string;
  address: string;
  shphResponsible: string;
  hospitalRef: string;
  evacuationStatus: EvacuationStatus;
  shelterTarget: string;
  urgencyLevel: 'วิกฤตมาก' | 'เร่งด่วน' | 'เฝ้าระวัง';
  assignedTeam: string;
  transportVehicleNeeded: '4WD' | 'เรือท้องแบน' | 'รถพยาบาลฉุกเฉิน' | 'ฮ.กู้ชีพ';
  lat?: number;
  lng?: number;
  lastUpdated: string;
}

export interface RoadCutIncident {
  id: string;
  roadNumber: string; // e.g. ทางหลวง 4056
  locationName: string;
  district: string;
  type: 'หลัก' | 'สำรอง' | 'สะพาน/คอขวด';
  waterDepthCm: number;
  passable: 'ไม่ได้' | 'เฉพาะรถยกสูง/4WD' | 'ผ่านได้ด้วยความระมัดระวัง';
  historicalCutYears: number[]; // e.g. [2566, 2567, 2568]
  alternateRoute1: string;
  alternateRoute2: string;
  lat: number;
  lng: number;
  boatStandbyPoint?: string;
  incidentTime: string;
}

export interface WaterStation {
  id: string;
  stationCode: string;
  name: string;
  riverBasin: string; // แม่น้ำสายบุรี, แม่น้ำโก-ลก, แม่น้ำบางนรา
  district: string;
  waterLevelM: number;
  bankLevelM: number;
  status: 'วิกฤต (ล้นตลิ่ง)' | 'เตือนภัย' | 'เฝ้าระวัง' | 'ปกติ';
  trend: 'ขึ้น' | 'ทรงตัว' | 'ลดลง';
  lastUpdated: string;
}

export interface LiveWeatherData {
  temperature: number;
  rainfallCurrentMm: number;
  rainfall24hMm: number;
  rainfallForecast72hMm: number;
  humidity: number;
  windSpeedKmh: number;
  pressureHpa: number;
  weatherDescription: string;
  stationSource: string;
  updatedTime: string;
  hourlyRainForecast: { time: string; rainMm: number }[];
}

export interface CommunicationLayer {
  id?: string;
  code?: string; // e.g. REG-COM-001 ถึง REG-COM-004
  level: number;
  name: string;
  type: string;
  primaryChannel: string;
  equipment: string;
  coverage: string;
  responsibleOfficer: string;
  contact: string;
  failoverCondition: string;
  status: 'พร้อมใช้งาน' | 'เปิดใช้งานแล้ว' | 'ขัดข้อง';
  evidenceDocument: string;
  connectedHospitalCount?: number;
}

export interface ReplenishmentPlan {
  id: string;
  code?: string; // e.g. REG-REP-001
  resourceCategory: 'น้ำมันเชื้อเพลิง (Fuel)' | 'ออกซิเจนทางการแพทย์ (O2)' | 'ยาและเวชภัณฑ์จำเป็น' | 'โลหิตสำรอง' | 'น้ำดื่ม/เสบียงอาหาร';
  triggerThreshold: string; // e.g. "สำรองคงเหลือ < 24 ชม."
  targetHospitalCode?: string; // e.g. REG-HOS-002
  targetHospitalName?: string; // e.g. รพ.สุไหงโก-ลก
  linkedBcpCode?: string; // e.g. REG-BCP-001
  primaryInboundRoute: string;
  backupInboundRoute: string;
  transportMode: 'อากาศยาน (ฮ.)' | 'ขบวนรถ 4WD ยกสูง + ทหารนำขบวน' | 'เรือลำเลียง กองทัพเรือ/ปภ.' | 'ศูนย์สุขภาพที่ 12 สงขลา';
  supplyHubOrigin: string; // e.g. คลังยา รพ.หาดใหญ่ / ปตท. สงขลา
  contactPerson: string;
  slaHours: number;
  status: 'เตรียมพร้อมระดับ 2' | 'พร้อมขนส่งทันที' | 'ปฏิบัติการอยู่';
}

export interface ShphItem {
  id: string;
  code?: string; // e.g. REG-SHP-001
  mainHospitalCode?: string; // e.g. REG-HOS-002
  name: string;
  district: string;
  subdistrict: string;
  status: 'ปกติ' | 'เฝ้าระวัง' | 'เสี่ยง' | 'ปิดบริการ';
  totalStaff: number;
  phone: string;
  vulnerableCovered: number;
  riskLevel: 'เขียว' | 'เหลือง' | 'ส้ม' | 'แดง';
  contingencyPlan: string;
}

export interface StaffTeamItem {
  id: string;
  code?: string; // e.g. REG-STF-001
  hospitalCode?: string; // e.g. REG-HOS-001
  hospitalName: string;
  district: string;
  department: string;
  teamName: string;
  currentShift: 'ทีม A' | 'ทีม B' | 'ทีม C';
  doctorCount: number;
  nurseCount: number;
  emtCount: number;
  readinessPct: number;
  leaderName: string;
  contactPhone: string;
}

export interface BcpResourceItem {
  id: string;
  code?: string; // e.g. REG-BCP-001
  category?: string; // หมวด BCP เช่น ไฟฟ้า, ออกซิเจน, เลือด, น้ำมัน
  criticalHospitalCode?: string; // e.g. REG-HOS-002
  linkedReplenishmentCode?: string; // e.g. REG-REP-001
  title: string;
  duration: string;
  status: 'พร้อม' | 'เฝ้าระวัง' | 'เสี่ยงขาด' | 'วิกฤต';
  statusType: 'success' | 'warning' | 'danger';
  detail: string;
  contingencyPlan: string;
  lastChecked?: string;
}

export interface ReferralRouteItem {
  id: string;
  code?: string; // e.g. REG-REF-001
  originHospitalCode?: string; // e.g. REG-HOS-002
  destinationHospitalCode?: string; // e.g. REG-HOS-001
  originHospital: string;
  destinationHospital: string;
  routeType: 'ทางบก' | 'ทางน้ำ' | 'ทางอากาศ';
  primaryPath: string;
  bypassPath: string;
  estimatedMinutes: number;
  safetyStatus: 'พร้อมใช้' | 'เฝ้าระวัง' | 'วิกฤต';
  vehicleNeeded: string;
  availableBeds: number;
}

export interface SheetSyncConfig {
  sheetId: string;
  gasWebAppUrl: string;
  isAutoSync: boolean;
  lastSyncTime: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}
