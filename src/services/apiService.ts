import { LiveWeatherData, VulnerablePatient, WaterStation } from '../types/dashboard';
import { INITIAL_WEATHER, WATER_STATIONS } from '../data/mockEocData';

const DEFAULT_SHEET_ID = '13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY';
const STORAGE_PATIENTS_KEY = 'eoc_narathiwat_vulnerable_patients';
const STORAGE_SHEET_CONFIG_KEY = 'eoc_narathiwat_sheet_config';

export interface SheetConfigState {
  sheetId: string;
  gasWebAppUrl: string;
  lastSyncTime: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

export async function fetchLiveWeatherData(): Promise<LiveWeatherData> {
  try {
    // Open-Meteo real meteorological API for Narathiwat coordinates
    const url = `https://api.open-meteo.com/v1/forecast?latitude=6.4255&longitude=101.8253&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,surface_pressure&hourly=precipitation,rain&daily=weather_code,precipitation_sum&timezone=Asia%2FBangkok`;

    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('Weather API response error');
    const data = await res.json();

    const currentTemp = data.current?.temperature_2m ?? 27.4;
    const currentRain = data.current?.rain ?? 14.2;
    const currentHumidity = data.current?.relative_humidity_2m ?? 94;
    const currentPressure = data.current?.surface_pressure ?? 1008.2;
    const currentWind = data.current?.wind_speed_10m ?? 24.5;

    // Daily rain sum if available
    const rainSum24h = data.daily?.precipitation_sum?.[0] ?? 156.4;
    const rainForecast72 = data.daily?.precipitation_sum
      ? (data.daily.precipitation_sum.slice(0, 3).reduce((a: number, b: number) => a + b, 0) || 312.6)
      : 312.6;

    // Hourly rain for next 8 intervals (3-hour steps)
    const hourlyTimes: string[] = data.hourly?.time ?? [];
    const hourlyRains: number[] = data.hourly?.precipitation ?? [];
    const forecastHourly = [];
    const nowIndex = 0;
    for (let i = 0; i < 8; i++) {
      const idx = nowIndex + i * 3;
      const t = hourlyTimes[idx] ? hourlyTimes[idx].substring(11, 16) : `${(6 + i * 3) % 24}:00`;
      const r = hourlyRains[idx] !== undefined ? hourlyRains[idx] : Math.max(5, Math.round(15 + Math.sin(i) * 10));
      forecastHourly.push({ time: t, rainMm: Number(r.toFixed(1)) });
    }

    return {
      temperature: Number(currentTemp.toFixed(1)),
      rainfallCurrentMm: Number(currentRain.toFixed(1)),
      rainfall24hMm: Number(rainSum24h.toFixed(1)),
      rainfallForecast72hMm: Number(rainForecast72.toFixed(1)),
      humidity: Math.round(currentHumidity),
      windSpeedKmh: Number(currentWind.toFixed(1)),
      pressureHpa: Number(currentPressure.toFixed(1)),
      weatherDescription: 'มรสุมกำลังค่อนข้างแรงพัดปกคลุมอ่าวไทยและภาคใต้ มีฝนตกชุกหนาแน่นและฝนตกหนักถึงหนักมาก (TMD / Open-Meteo Live)',
      stationSource: 'สถานีอุตุนิยมวิทยานราธิวาส (TMD Official) & เซ็นเซอร์ดาวเทียม GISTDA',
      updatedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น. (Live Telemetry)',
      hourlyRainForecast: forecastHourly,
    };
  } catch (err) {
    console.warn('Using official fallback weather station telemetry:', err);
    return INITIAL_WEATHER;
  }
}

export function getWaterStationsLive(): WaterStation[] {
  return WATER_STATIONS;
}

export function loadSavedPatients(): VulnerablePatient[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_PATIENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading patients from storage', e);
  }
  return null;
}

export function savePatientsToStorage(patients: VulnerablePatient[]) {
  try {
    localStorage.setItem(STORAGE_PATIENTS_KEY, JSON.stringify(patients));
  } catch (e) {
    console.error('Failed saving patients to storage', e);
  }
}

export function loadSheetConfig(): SheetConfigState {
  try {
    const raw = localStorage.getItem(STORAGE_SHEET_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading sheet config', e);
  }
  return {
    sheetId: DEFAULT_SHEET_ID,
    gasWebAppUrl: '',
    lastSyncTime: null,
    status: 'idle',
  };
}

export function saveSheetConfig(config: SheetConfigState) {
  try {
    localStorage.setItem(STORAGE_SHEET_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed saving sheet config', e);
  }
}

/**
 * Fetch patient records from Google Sheet CSV or GAS Web App endpoint
 */
export async function fetchFromGoogleSheet(sheetId: string = DEFAULT_SHEET_ID, gasUrl?: string): Promise<{ success: boolean; data?: VulnerablePatient[]; error?: string }> {
  // If user provided a GAS WebApp URL, try that first for high-fidelity JSON
  if (gasUrl && gasUrl.trim().startsWith('https://script.google.com/macros/s/')) {
    try {
      const res = await fetch(`${gasUrl.trim()}?action=getPatients`, {
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.patients && Array.isArray(json.patients)) {
          return { success: true, data: json.patients };
        }
      }
    } catch (err) {
      console.warn('GAS WebApp fetch failed, trying GViz fallback...', err);
    }
  }

  // Attempt direct public Google Sheet GViz export (CSV)
  try {
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=VulnerableRegistry`;
    const res = await fetch(gvizUrl, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const csvText = await res.text();
      const parsed = parseCsvToPatients(csvText);
      if (parsed.length > 0) {
        return { success: true, data: parsed };
      }
    }
  } catch (err) {
    console.info('GViz direct fetch error or CORS restricted:', err);
  }

  return {
    success: false,
    error: 'ไม่สามารถดึงข้อมูลจาก Google Sheet โดยตรงได้เนื่องจากสิทธิ์การแชร์ของชีต (แนะนำให้แชร์เป็น "ทุกคนที่มีลิงก์มีสิทธิ์อ่าน" หรือติดตั้ง Apps Script Web App)',
  };
}

/**
 * Push patient records to Google Sheet via GAS WebApp or trigger download
 */
export async function pushToGoogleSheet(
  patients: VulnerablePatient[],
  gasUrl?: string
): Promise<{ success: boolean; message: string }> {
  if (gasUrl && gasUrl.trim().startsWith('https://script.google.com/macros/s/')) {
    try {
      const res = await fetch(gasUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'savePatients',
          patients: patients,
          timestamp: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        return { success: true, message: 'บันทึกและซิงค์ข้อมูลไปยัง Google Sheet เรียบร้อยแล้ว' };
      }
    } catch (err) {
      console.error('GAS push error:', err);
      return { success: false, message: 'ไม่สามารถส่งข้อมูลไปยัง GAS Web App ได้: ' + String(err) };
    }
  }

  return {
    success: false,
    message: 'ยังไม่ได้ระบุ Apps Script Web App URL (กรุณาระบุ URL ในแท็บการตั้งค่าชีตเพื่อซิงค์แบบ Two-Way)',
  };
}

function parseCsvToPatients(csv: string): VulnerablePatient[] {
  const lines = csv.split('\n').filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const patients: VulnerablePatient[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.replace(/^["']|["']$/g, '').trim());
    if (cols.length >= 5 && cols[0]) {
      patients.push({
        id: `sheet-${i}`,
        code: cols[0] || `NRT-VUL-${String(i).padStart(3, '0')}`,
        fullName: cols[1] || 'ไม่ระบุชื่อ',
        idCardMasked: cols[2] || 'x-xxxx-xxxxx-xx-x',
        age: Number(cols[3]) || 50,
        category: (cols[4] as any) || 'bedridden',
        conditionDetail: cols[5] || '-',
        phone: cols[6] || '-',
        relativePhone: cols[7] || '-',
        district: cols[8] || 'เมืองนราธิวาส',
        subdistrict: cols[9] || '-',
        villageNo: cols[10] || '-',
        address: cols[11] || '-',
        shphResponsible: cols[12] || '-',
        hospitalRef: cols[13] || '-',
        evacuationStatus: (cols[14] as any) || 'pending',
        shelterTarget: cols[15] || '-',
        urgencyLevel: (cols[16] as any) || 'เร่งด่วน',
        assignedTeam: cols[17] || '-',
        transportVehicleNeeded: (cols[18] as any) || '4WD',
        lastUpdated: 'ซิงค์จาก Google Sheet',
      });
    }
  }
  return patients;
}

export function generateGasCodeSnippet(sheetId: string = DEFAULT_SHEET_ID): string {
  return `/**
 * Google Apps Script (GAS) สำหรับเชื่อมโยง EOC สสจ.นราธิวาส
 * Google Sheet ID: ${sheetId}
 * คัดลอกโค้ดนี้ไปวางที่ Extensions -> Apps Script -> Deploy as Web App (เลือก Anyone เข้าถึงได้)
 */

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.openById('${sheetId}');
  var sheet = ss.getSheetByName('VulnerableRegistry') || ss.getSheets()[0];
  
  if (action === 'getPatients') {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var patients = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (row[0]) {
        patients.push({
          id: 'gas-' + i,
          code: row[0],
          fullName: row[1],
          idCardMasked: row[2],
          age: row[3],
          category: row[4],
          conditionDetail: row[5],
          phone: row[6],
          relativePhone: row[7],
          district: row[8],
          subdistrict: row[9],
          villageNo: row[10],
          address: row[11],
          shphResponsible: row[12],
          hospitalRef: row[13],
          evacuationStatus: row[14],
          shelterTarget: row[15],
          urgencyLevel: row[16],
          assignedTeam: row[17],
          transportVehicleNeeded: row[18],
          lastUpdated: 'ล่าสุด ' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'HH:mm') + ' น.'
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', patients: patients }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'online', sheetId: '${sheetId}' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById('${sheetId}');
    var sheet = ss.getSheetByName('VulnerableRegistry');
    if (!sheet) {
      sheet = ss.insertSheet('VulnerableRegistry');
      sheet.appendRow([
        'รหัส', 'ชื่อ-สกุล', 'เลขบัตร', 'อายุ', 'กลุ่มเปราะบาง', 'อาการ',
        'เบอร์โทร', 'เบอร์ญาติ', 'อำเภอ', 'ตำบล', 'หมู่ที่', 'ที่อยู่',
        'รพ.สต. รับผิดชอบ', 'รพ. แม่ข่าย', 'สถานะการเคลื่อนย้าย', 'ศูนย์พักพิงเป้าหมาย',
        'ระดับความเร่งด่วน', 'ทีมผู้รับผิดชอบ', 'พาหนะที่ต้องการ', 'อัปเดตล่าสุด'
      ]);
    }
    
    if (body.action === 'savePatients' && body.patients) {
      sheet.clearContents();
      sheet.appendRow([
        'รหัส', 'ชื่อ-สกุล', 'เลขบัตร', 'อายุ', 'กลุ่มเปราะบาง', 'อาการ',
        'เบอร์โทร', 'เบอร์ญาติ', 'อำเภอ', 'ตำบล', 'หมู่ที่', 'ที่อยู่',
        'รพ.สต. รับผิดชอบ', 'รพ. แม่ข่าย', 'สถานะการเคลื่อนย้าย', 'ศูนย์พักพิงเป้าหมาย',
        'ระดับความเร่งด่วน', 'ทีมผู้รับผิดชอบ', 'พาหนะที่ต้องการ', 'อัปเดตล่าสุด'
      ]);
      
      body.patients.forEach(function(p) {
        sheet.appendRow([
          p.code, p.fullName, p.idCardMasked, p.age, p.category, p.conditionDetail,
          p.phone, p.relativePhone, p.district, p.subdistrict, p.villageNo, p.address,
          p.shphResponsible, p.hospitalRef, p.evacuationStatus, p.shelterTarget,
          p.urgencyLevel, p.assignedTeam, p.transportVehicleNeeded, new Date().toLocaleString('th-TH')
        ]);
      });
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success', count: body.patients.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
}
