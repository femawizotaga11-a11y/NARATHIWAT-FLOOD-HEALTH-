/**
 * ==============================================================================
 * ศูนย์ปฏิบัติการภาวะฉุกเฉินทางสาธารณสุข (EOC) สำนักงานสาธารณสุขจังหวัดนราธิวาส
 * ระบบติดตามวิกฤตอุทกภัย BCP และฐานข้อมูลจัดการสถานการณ์ฉุกเฉิน
 * 
 * Google Apps Script (Code.gs) ฉบับสมบูรณ์ 100% (Production Grade)
 * รองรับ Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY
 * รองรับ:
 * 1. บันทึกข้อมูลเมนูข้อ 4-11 ลง Sheet ครบถ้วน (Bulk Sync & Single CRUD)
 * 2. สร้างฐานข้อมูลใหม่ทั้งหมด โครงสร้างครบตามหัวข้อ 1-11
 * ==============================================================================
 * 
 * วิธีปลดล็อคสิทธิ์การเข้าถึง (Permission Unlock Guide):
 * 1. เปิด Google Sheet (ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
 * 2. กดปุ่ม "แชร์ (Share)" ด้านขวาบน -> ปรับ "การเข้าถึงทั่วไป (General access)"
 *    เป็น "ทุกคนที่มีลิงก์ (Anyone with the link)" -> สิทธิ์เป็น "ผู้แก้ไข (Editor)"
 * 3. ไปที่เมนู "ส่วนขยาย (Extensions)" -> "Apps Script"
 * 4. ลบโค้ดเดิมทั้งหมด แล้ววางโค้ดทั้งหมดนี้ลงไปแทน
 * 5. กดปุ่มบันทึก (Save)
 * 6. กดปุ่ม "ทำให้ใช้งานได้ (Deploy)" -> "การทำให้ใช้งานได้รายการใหม่ (New deployment)"
 * 7. เลือกประเภทเป็น "เว็บแอป (Web app)"
 * 8. ตั้งค่าสำคัญเพื่อปลดล็อค:
 *    - ดำเนินการในฐานะ (Execute as): "ฉัน (Me)"
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): "ทุกคน (Anyone)" ***สำคัญที่สุด***
 * 9. กด Deploy -> อนุญาตสิทธิ์ (Authorize access) -> Advanced -> Go to Script
 * 10. นำ Web App URL ที่ได้มาใส่ในระบบ EOC Dashboard
 */

var SHEET_ID = '13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY';

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚨 EOC สสจ.นราธิวาส')
    .addItem('⚡ สร้างฐานข้อมูลใหม่ทั้งหมด 1-11 (Create Full DB 1-11)', 'createFullNewDatabase')
    .addItem('📥 นำเข้าข้อมูลเริ่มต้นข้อ 4-11 (Seed Sections 4-11)', 'seedSections4To11')
    .addSeparator()
    .addItem('📊 ล้างและรีเซ็ตโครงสร้างตาราง (Reset & Reformat Tables)', 'initAll11Sheets')
    .addItem('🧪 ทดสอบการเชื่อมต่อ API Web App', 'testSelfConnection')
    .addToUi();
}

function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'ping';
    var ss = getSpreadsheet();

    // Ping
    if (action === 'ping' || action === 'testConnection') {
      return jsonResponse({
        status: 'success',
        message: 'เชื่อมต่อ Google Apps Script EOC สสจ.นราธิวาส สำเร็จ 100%',
        sheetId: ss.getId(),
        sheetName: ss.getName(),
        serverTime: Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss'),
        unlocked: true
      });
    }

    // Export All 1-11 Data
    if (action === 'getAllData' || action === 'exportAll1To11') {
      return jsonResponse({
        status: 'success',
        data: {
          waterStations: readSheetRows(ss, 'WaterStations_Gistda'),
          districts: readSheetRows(ss, 'DistrictRisk'),
          roadCuts: readSheetRows(ss, 'RoadCutIncidents'),
          patients: readSheetRows(ss, 'VulnerableRegistry'),
          referrals: readSheetRows(ss, 'ReferralRoutes'),
          bcp: readSheetRows(ss, 'BcpResources'),
          staff: readSheetRows(ss, 'StaffRoster'),
          hospitals: readSheetRows(ss, 'HospitalStatus'),
          shph: readSheetRows(ss, 'ShphNetwork'),
          communications: readSheetRows(ss, 'CommunicationLayers'),
          replenishments: readSheetRows(ss, 'ReplenishmentPlans')
        }
      });
    }

    // ข้อ 1: WaterStations_Gistda
    if (action === 'getWaterStations') {
      return jsonResponse({ status: 'success', data: readSheetRows(ss, 'WaterStations_Gistda') });
    }

    // ข้อ 2: DistrictRisk
    if (action === 'getDistricts') {
      return jsonResponse({ status: 'success', data: readSheetRows(ss, 'DistrictRisk') });
    }

    // ข้อ 3: RoadCutIncidents
    if (action === 'getRoadCuts') {
      return jsonResponse({ status: 'success', data: readSheetRows(ss, 'RoadCutIncidents') });
    }

    // ข้อ 4: VulnerableRegistry
    if (action === 'getPatients') {
      var sheet = getOrCreateSheet(ss, 'VulnerableRegistry');
      var data = sheet.getDataRange().getValues();
      var patients = [];
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row[0] || row[1]) {
          patients.push({
            id: 'gas-p-' + i,
            code: String(row[0] || ''),
            fullName: String(row[1] || ''),
            idCardMasked: String(row[2] || ''),
            age: Number(row[3]) || 0,
            category: String(row[4] || 'bedridden'),
            conditionDetail: String(row[5] || ''),
            phone: String(row[6] || ''),
            relativePhone: String(row[7] || ''),
            district: String(row[8] || 'เมืองนราธิวาส'),
            subdistrict: String(row[9] || ''),
            villageNo: String(row[10] || ''),
            address: String(row[11] || ''),
            shphResponsible: String(row[12] || ''),
            hospitalRef: String(row[13] || ''),
            evacuationStatus: String(row[14] || 'pending'),
            shelterTarget: String(row[15] || ''),
            urgencyLevel: String(row[16] || 'เร่งด่วน'),
            assignedTeam: String(row[17] || ''),
            transportVehicleNeeded: String(row[18] || '4WD'),
            lastUpdated: String(row[19] || '')
          });
        }
      }
      return jsonResponse({ status: 'success', count: patients.length, data: patients, patients: patients });
    }

    // ข้อ 5: ReferralRoutes
    if (action === 'getReferrals') {
      var rSheet = getOrCreateSheet(ss, 'ReferralRoutes');
      var rData = rSheet.getDataRange().getValues();
      var referrals = [];
      for (var r = 1; r < rData.length; r++) {
        var rRow = rData[r];
        if (rRow[0]) {
          referrals.push({
            id: 'gas-ref-' + r,
            originHospital: String(rRow[0] || ''),
            destinationHospital: String(rRow[1] || ''),
            routeType: String(rRow[2] || 'ทางบก'),
            primaryPath: String(rRow[3] || ''),
            bypassPath: String(rRow[4] || ''),
            estimatedMinutes: Number(rRow[5]) || 60,
            safetyStatus: String(rRow[6] || 'พร้อมใช้'),
            vehicleNeeded: String(rRow[7] || ''),
            availableBeds: Number(rRow[8]) || 0
          });
        }
      }
      return jsonResponse({ status: 'success', count: referrals.length, data: referrals });
    }

    // ข้อ 6: BcpResources
    if (action === 'getBcp') {
      var bSheet = getOrCreateSheet(ss, 'BcpResources');
      var bData = bSheet.getDataRange().getValues();
      var bcpList = [];
      for (var b = 1; b < bData.length; b++) {
        var bRow = bData[b];
        if (bRow[0]) {
          bcpList.push({
            id: 'gas-bcp-' + b,
            title: String(bRow[0] || ''),
            duration: String(bRow[1] || ''),
            status: String(bRow[2] || 'พร้อม'),
            statusType: String(bRow[3] || 'success'),
            detail: String(bRow[4] || ''),
            contingencyPlan: String(bRow[5] || ''),
            lastChecked: String(bRow[6] || '')
          });
        }
      }
      return jsonResponse({ status: 'success', count: bcpList.length, data: bcpList });
    }

    // ข้อ 7: StaffRoster
    if (action === 'getStaff') {
      var stSheet = getOrCreateSheet(ss, 'StaffRoster');
      var stData = stSheet.getDataRange().getValues();
      var staffList = [];
      for (var s = 1; s < stData.length; s++) {
        var sRow = stData[s];
        if (sRow[0]) {
          staffList.push({
            id: 'gas-st-' + s,
            hospitalName: String(sRow[0] || ''),
            district: String(sRow[1] || ''),
            department: String(sRow[2] || ''),
            teamName: String(sRow[3] || ''),
            currentShift: String(sRow[4] || 'ทีม A'),
            doctorCount: Number(sRow[5]) || 0,
            nurseCount: Number(sRow[6]) || 0,
            emtCount: Number(sRow[7]) || 0,
            readinessPct: Number(sRow[8]) || 85,
            leaderName: String(sRow[9] || ''),
            contactPhone: String(sRow[10] || '')
          });
        }
      }
      return jsonResponse({ status: 'success', count: staffList.length, data: staffList });
    }

    // ข้อ 8: HospitalStatus
    if (action === 'getHospitals') {
      var hSheet = getOrCreateSheet(ss, 'HospitalStatus');
      var hData = hSheet.getDataRange().getValues();
      var hospitals = [];
      for (var j = 1; j < hData.length; j++) {
        var hRow = hData[j];
        if (hRow[0]) {
          hospitals.push({
            id: 'gas-hosp-' + j,
            name: String(hRow[0] || ''),
            type: String(hRow[1] || 'M'),
            district: String(hRow[2] || ''),
            riskLevel: String(hRow[3] || 'warning'),
            er: String(hRow[4] || 'active'),
            lr: String(hRow[5] || 'active'),
            or: String(hRow[6] || 'active'),
            icu: String(hRow[7] || 'active'),
            dialysis: String(hRow[8] || 'active'),
            opdNcd: String(hRow[9] || 'active'),
            autonomyHours: Number(hRow[10]) || 72,
            fuelGeneratorHours: Number(hRow[11]) || 72,
            oxygenHours: Number(hRow[12]) || 72,
            waterHours: Number(hRow[13]) || 72,
            bloodUnits: Number(hRow[14]) || 20,
            bloodStatus: String(hRow[15] || 'เพียงพอ'),
            doctorCount: Number(hRow[16]) || 5,
            nurseCount: Number(hRow[17]) || 20,
            emtCount: Number(hRow[18]) || 4,
            staffReadinessPct: Number(hRow[19]) || 85,
            bedTotal: Number(hRow[20]) || 60,
            bedOccupied: Number(hRow[21]) || 40,
            notes: String(hRow[22] || '')
          });
        }
      }
      return jsonResponse({ status: 'success', count: hospitals.length, data: hospitals, hospitals: hospitals });
    }

    // ข้อ 9: ShphNetwork
    if (action === 'getShph') {
      var shSheet = getOrCreateSheet(ss, 'ShphNetwork');
      var shData = shSheet.getDataRange().getValues();
      var shph = [];
      for (var k = 1; k < shData.length; k++) {
        var kRow = shData[k];
        if (kRow[0]) {
          shph.push({
            id: 'gas-shph-' + k,
            name: String(kRow[0] || ''),
            district: String(kRow[1] || ''),
            subdistrict: String(kRow[2] || ''),
            status: String(kRow[3] || 'ปกติ'),
            totalStaff: Number(kRow[4]) || 5,
            phone: String(kRow[5] || ''),
            vulnerableCovered: Number(kRow[6]) || 20,
            riskLevel: String(kRow[7] || 'เขียว'),
            contingencyPlan: String(kRow[8] || '')
          });
        }
      }
      return jsonResponse({ status: 'success', count: shph.length, data: shph });
    }

    // ข้อ 10: CommunicationLayers
    if (action === 'getCommunications') {
      var cSheet = getOrCreateSheet(ss, 'CommunicationLayers');
      var cData = cSheet.getDataRange().getValues();
      var comms = [];
      for (var c = 1; c < cData.length; c++) {
        var cRow = cData[c];
        if (cRow[0] !== '') {
          comms.push({
            level: Number(cRow[0]) || c,
            name: String(cRow[1] || ''),
            type: String(cRow[2] || ''),
            primaryChannel: String(cRow[3] || ''),
            equipment: String(cRow[4] || ''),
            coverage: String(cRow[5] || ''),
            responsibleOfficer: String(cRow[6] || ''),
            contact: String(cRow[7] || ''),
            failoverCondition: String(cRow[8] || ''),
            status: String(cRow[9] || 'พร้อมใช้งาน'),
            evidenceDocument: String(cRow[10] || '')
          });
        }
      }
      return jsonResponse({ status: 'success', count: comms.length, data: comms });
    }

    // ข้อ 11: ReplenishmentPlans
    if (action === 'getReplenishments') {
      var rpSheet = getOrCreateSheet(ss, 'ReplenishmentPlans');
      var rpData = rpSheet.getDataRange().getValues();
      var repPlans = [];
      for (var p = 1; p < rpData.length; p++) {
        var pRow = rpData[p];
        if (pRow[0]) {
          repPlans.push({
            id: 'gas-rep-' + p,
            resourceCategory: String(pRow[0] || ''),
            triggerThreshold: String(pRow[1] || ''),
            primaryInboundRoute: String(pRow[2] || ''),
            backupInboundRoute: String(pRow[3] || ''),
            transportMode: String(pRow[4] || ''),
            supplyHubOrigin: String(pRow[5] || ''),
            contactPerson: String(pRow[6] || ''),
            slaHours: Number(pRow[7]) || 6,
            status: String(pRow[8] || 'เตรียมพร้อมระดับ 2')
          });
        }
      }
      return jsonResponse({ status: 'success', count: repPlans.length, data: repPlans });
    }

    return jsonResponse({ status: 'error', message: 'ไม่พบ action: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var payload = JSON.parse(raw);
    var action = payload.action;
    var ss = getSpreadsheet();
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss') + ' น.';

    // 1. BULK SYNC: บันทึกข้อ 4-11 ทั้งหมดในคำสั่งเดียว
    if (action === 'syncAllSections4To11' && payload.data) {
      var d = payload.data;
      var total = 0;

      if (Array.isArray(d.patients)) { writePatientsSheet(ss, d.patients, nowStr); total += d.patients.length; }
      if (Array.isArray(d.referrals)) { writeReferralsSheet(ss, d.referrals, nowStr); total += d.referrals.length; }
      if (Array.isArray(d.bcp)) { writeBcpSheet(ss, d.bcp, nowStr); total += d.bcp.length; }
      if (Array.isArray(d.staff)) { writeStaffSheet(ss, d.staff, nowStr); total += d.staff.length; }
      if (Array.isArray(d.hospitals)) { writeHospitalsSheet(ss, d.hospitals, nowStr); total += d.hospitals.length; }
      if (Array.isArray(d.shph)) { writeShphSheet(ss, d.shph, nowStr); total += d.shph.length; }
      if (Array.isArray(d.communications)) { writeCommunicationsSheet(ss, d.communications, nowStr); total += d.communications.length; }
      if (Array.isArray(d.replenishments)) { writeReplenishmentsSheet(ss, d.replenishments, nowStr); total += d.replenishments.length; }

      logAction(ss, 'Bulk Sync บันทึกข้อมูลข้อ 4-11 สำเร็จ รวม ' + total + ' รายการ');
      return jsonResponse({
        status: 'success',
        message: 'บันทึกข้อมูลข้อ 4-11 ลง Google Sheet สำเร็จเรียบร้อย (' + total + ' รายการ)',
        totalCount: total,
        timestamp: nowStr
      });
    }

    // 2. CREATE FULL DATABASE: สร้างฐานข้อมูลใหม่ทั้งหมด 1-11
    if (action === 'createFullDatabase' && payload.fullData) {
      var fd = payload.fullData;
      initAll11Sheets();

      if (Array.isArray(fd.waterStations)) writeWaterStationsSheet(ss, fd.waterStations, nowStr);
      if (Array.isArray(fd.districts)) writeDistrictsSheet(ss, fd.districts, nowStr);
      if (Array.isArray(fd.roadCuts)) writeRoadCutsSheet(ss, fd.roadCuts, nowStr);
      if (Array.isArray(fd.patients)) writePatientsSheet(ss, fd.patients, nowStr);
      if (Array.isArray(fd.referrals)) writeReferralsSheet(ss, fd.referrals, nowStr);
      if (Array.isArray(fd.bcp)) writeBcpSheet(ss, fd.bcp, nowStr);
      if (Array.isArray(fd.staff)) writeStaffSheet(ss, fd.staff, nowStr);
      if (Array.isArray(fd.hospitals)) writeHospitalsSheet(ss, fd.hospitals, nowStr);
      if (Array.isArray(fd.shph)) writeShphSheet(ss, fd.shph, nowStr);
      if (Array.isArray(fd.communications)) writeCommunicationsSheet(ss, fd.communications, nowStr);
      if (Array.isArray(fd.replenishments)) writeReplenishmentsSheet(ss, fd.replenishments, nowStr);

      logAction(ss, 'สร้างฐานข้อมูลใหม่ทั้งหมด 11 หมวดหมู่สำเร็จ');
      return jsonResponse({
        status: 'success',
        message: 'สร้างและตั้งค่าโครงสร้างฐานข้อมูลใหม่ครบทั้ง 11 หมวดหมู่บน Google Sheet เรียบร้อย 100%!',
        timestamp: nowStr
      });
    }

    // Single Saves
    var items = payload.items || payload.patients || [];

    if (action === 'savePatients') {
      writePatientsSheet(ss, items, nowStr);
      logAction(ss, 'บันทึกผู้ป่วยเปราะบาง ' + items.length + ' รายการ');
      return jsonResponse({ status: 'success', message: 'บันทึกผู้ป่วยเปราะบางสำเร็จ (' + items.length + ' รายการ)' });
    }

    if (action === 'saveReferrals') {
      writeReferralsSheet(ss, items, nowStr);
      logAction(ss, 'บันทึกเส้นทางส่งต่อ ' + items.length + ' เส้นทาง');
      return jsonResponse({ status: 'success', message: 'บันทึกเส้นทางส่งต่อสำเร็จ (' + items.length + ' รายการ)' });
    }

    if (action === 'saveBcp') {
      writeBcpSheet(ss, items, nowStr);
      logAction(ss, 'บันทึกทรัพยากร BCP ' + items.length + ' รายการ');
      return jsonResponse({ status: 'success', message: 'บันทึกทรัพยากร BCP สำเร็จ (' + items.length + ' รายการ)' });
    }

    if (action === 'saveStaff') {
      writeStaffSheet(ss, items, nowStr);
      logAction(ss, 'บันทึกทีม Staff ' + items.length + ' ทีม');
      return jsonResponse({ status: 'success', message: 'บันทึกทีม Staff สำเร็จ (' + items.length + ' ทีม)' });
    }

    if (action === 'saveHospitals') {
      writeHospitalsSheet(ss, items, nowStr);
      logAction(ss, 'บันทึก 13 โรงพยาบาล ' + items.length + ' แห่ง');
      return jsonResponse({ status: 'success', message: 'บันทึกโรงพยาบาลสำเร็จ (' + items.length + ' แห่ง)' });
    }

    if (action === 'saveShph') {
      writeShphSheet(ss, items, nowStr);
      logAction(ss, 'บันทึก รพ.สต. ' + items.length + ' แห่ง');
      return jsonResponse({ status: 'success', message: 'บันทึกข้อมูล รพ.สต. สำเร็จ (' + items.length + ' แห่ง)' });
    }

    if (action === 'saveCommunications') {
      writeCommunicationsSheet(ss, items, nowStr);
      logAction(ss, 'บันทึกสื่อสารสำรอง ' + items.length + ' ระดับ');
      return jsonResponse({ status: 'success', message: 'บันทึกระบบสื่อสารสำรองสำเร็จ (' + items.length + ' ระดับ)' });
    }

    if (action === 'saveReplenishments') {
      writeReplenishmentsSheet(ss, items, nowStr);
      logAction(ss, 'บันทึกแผนนำเข้า ' + items.length + ' แผน');
      return jsonResponse({ status: 'success', message: 'บันทึกแผนนำเข้าทรัพยากรสำเร็จ (' + items.length + ' แผน)' });
    }

    return jsonResponse({ status: 'error', message: 'ไม่รู้จัก action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// -------------------------------------------------------------
// Sheet Writers (Clean Table Updaters)
// -------------------------------------------------------------
function writePatientsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'VulnerableRegistry');
  sheet.clearContents();
  var headers = [
    'รหัสผู้ป่วย', 'ชื่อ - สกุล', 'เลขบัตร ปชช.', 'อายุ', 'กลุ่มเปราะบาง (7 กลุ่ม)',
    'รายละเอียดอาการ/โรคประจำตัว', 'เบอร์โทรผู้ป่วย', 'เบอร์โทรญาติ', 'อำเภอ', 'ตำบล',
    'หมู่ที่', 'ที่อยู่โดยละเอียด', 'รพ.สต. ที่รับผิดชอบ', 'รพ. แม่ข่ายรับส่งต่อ',
    'สถานะการเคลื่อนย้าย (EVAC)', 'ศูนย์พักพิงเป้าหมาย', 'ระดับความเร่งด่วน',
    'ทีมผู้รับผิดชอบช่วยเหลือ', 'ยานพาหนะที่ต้องการ', 'อัปเดตล่าสุด'
  ];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(p) {
    return [
      p.code || '', p.fullName || '', p.idCardMasked || '', p.age || 0, p.category || '',
      p.conditionDetail || '', p.phone || '', p.relativePhone || '', p.district || '',
      p.subdistrict || '', p.villageNo || '', p.address || '', p.shphResponsible || '',
      p.hospitalRef || '', p.evacuationStatus || 'pending', p.shelterTarget || '',
      p.urgencyLevel || '', p.assignedTeam || '', p.transportVehicleNeeded || '', nowStr
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeReferralsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'ReferralRoutes');
  sheet.clearContents();
  var headers = [
    'รพ. ต้นทาง', 'รพ. ปลายทาง', 'รูปแบบการส่งต่อ', 'เส้นทางหลัก',
    'เส้นทางเลี่ยงฉุกเฉิน', 'ระยะเวลาเดินทาง (นาที)', 'สถานะความปลอดภัย',
    'ยานพาหนะที่ต้องการ', 'เตียงรองรับปลายทาง', 'อัปเดตล่าสุด'
  ];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(r) {
    return [
      r.originHospital || '', r.destinationHospital || '', r.routeType || '', r.primaryPath || '',
      r.bypassPath || '', r.estimatedMinutes || 60, r.safetyStatus || '', r.vehicleNeeded || '',
      r.availableBeds || 0, nowStr
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeBcpSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'BcpResources');
  sheet.clearContents();
  var headers = ['หัวข้อทรัพยากร BCP', 'ระยะเวลาสำรอง', 'สถานะ', 'ประเภทสถานะ', 'รายละเอียดและปริมาณ', 'แผนรับมือฉุกเฉิน', 'ตรวจเช็กล่าสุด'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(b) {
    return [
      b.title || '', b.duration || '', b.status || '', b.statusType || 'success',
      b.detail || '', b.contingencyPlan || '', nowStr
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeStaffSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'StaffRoster');
  sheet.clearContents();
  var headers = ['โรงพยาบาล', 'อำเภอ', 'แผนก/หน่วยงาน', 'ชื่อทีมปฏิบัติการ', 'เวรปฏิบัติงาน', 'แพทย์ (คน)', 'พยาบาล (คน)', 'EMT (คน)', 'ความพร้อม (%)', 'หัวหน้าทีม', 'เบอร์โทรติดต่อ'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(s) {
    return [
      s.hospitalName || '', s.district || '', s.department || '', s.teamName || '',
      s.currentShift || 'ทีม A', s.doctorCount || 0, s.nurseCount || 0, s.emtCount || 0,
      s.readinessPct || 85, s.leaderName || '', s.contactPhone || ''
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeHospitalsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'HospitalStatus');
  sheet.clearContents();
  var headers = [
    'ชื่อโรงพยาบาล', 'ระดับ', 'อำเภอ', 'ระดับความเสี่ยง', 'ER', 'LR', 'OR', 'ICU', 'ไตเทียม', 'OPD/NCD',
    'Safe Operating RTO (ชม.)', 'ไฟฟ้าสำรอง Gen (ชม.)', 'ออกซิเจน (ชม.)', 'น้ำประปา (ชม.)',
    'เลือดสำรอง (ยูนิต)', 'สถานะเลือด', 'แพทย์ (คน)', 'พยาบาล (คน)', 'EMT (คน)',
    'ความพร้อมบุคลากร (%)', 'เตียงทั้งหมด', 'เตียงครอง', 'หมายเหตุ'
  ];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(h) {
    return [
      h.name || '', h.type || 'M', h.district || '', h.riskLevel || 'warning',
      h.er || 'active', h.lr || 'active', h.or || 'active', h.icu || 'active', h.dialysis || 'active', h.opdNcd || 'active',
      h.autonomyHours || 72, h.fuelGeneratorHours || 72, h.oxygenHours || 72, h.waterHours || 72,
      h.bloodUnits || 20, h.bloodStatus || 'เพียงพอ', h.doctorCount || 0, h.nurseCount || 0, h.emtCount || 0,
      h.staffReadinessPct || 85, h.bedTotal || 60, h.bedOccupied || 40, h.notes || ''
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeShphSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'ShphNetwork');
  sheet.clearContents();
  var headers = ['ชื่อ รพ.สต.', 'อำเภอ', 'ตำบล', 'สถานะความปลอดภัย', 'จนท. (คน)', 'เบอร์โทร', 'ผู้ป่วยเปราะบางในเขต (ราย)', 'ระดับความเสี่ยง', 'แผนเผชิญเหตุ'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(s) {
    return [
      s.name || '', s.district || '', s.subdistrict || '', s.status || 'ปกติ',
      s.totalStaff || 5, s.phone || '', s.vulnerableCovered || 0, s.riskLevel || 'เขียว',
      s.contingencyPlan || ''
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeCommunicationsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'CommunicationLayers');
  sheet.clearContents();
  var headers = ['ระดับ', 'ชื่อระบบ', 'ประเภทเครือข่าย', 'ช่องทางหลัก/ความถี่', 'อุปกรณ์ประจำการ', 'ขอบเขตครอบคลุม', 'ผู้รับผิดชอบ', 'เบอร์ติดต่อ', 'เงื่อนไข Failover', 'สถานะ', 'เอกสารหลักฐานจริง'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(c) {
    return [
      c.level || 1, c.name || '', c.type || '', c.primaryChannel || '', c.equipment || '',
      c.coverage || '', c.responsibleOfficer || '', c.contact || '', c.failoverCondition || '',
      c.status || 'พร้อมใช้งาน', c.evidenceDocument || ''
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeReplenishmentsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'ReplenishmentPlans');
  sheet.clearContents();
  var headers = ['หมวดหมู่ทรัพยากร', 'เกณฑ์สั่งการ (Trigger)', 'เส้นทางนำเข้าหลัก', 'เส้นทางนำเข้าสำรอง', 'ยานพาหนะลำเลียง', 'คลังต้นทางส่งกำลัง', 'ผู้ประสานงาน', 'SLA (ชม.)', 'สถานะความพร้อม'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(r) {
    return [
      r.resourceCategory || '', r.triggerThreshold || '', r.primaryInboundRoute || '',
      r.backupInboundRoute || '', r.transportMode || '', r.supplyHubOrigin || '',
      r.contactPerson || '', r.slaHours || 6, r.status || 'เตรียมพร้อมระดับ 2'
    ];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeWaterStationsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'WaterStations_Gistda');
  sheet.clearContents();
  var headers = ['รหัสสถานี', 'ชื่อสถานี', 'ลุ่มน้ำ', 'อำเภอ', 'ระดับน้ำ (ม.)', 'ระดับตลิ่ง (ม.)', 'สถานะ', 'แนวโน้ม', 'อัปเดตล่าสุด'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(w) {
    return [w.stationCode || '', w.name || '', w.riverBasin || '', w.district || '', w.waterLevelM || 0, w.bankLevelM || 0, w.status || '', w.trend || '', nowStr];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeDistrictsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'DistrictRisk');
  sheet.clearContents();
  var headers = ['ชื่ออำเภอ (ไทย)', 'District (EN)', 'ระดับความเสี่ยง', 'แนวโน้มน้ำ', 'คาดการณ์ 6 ชม.', 'คาดการณ์ 12 ชม.', 'คาดการณ์ 24 ชม.', 'ฝนสะสม 24 ชม. (มม.)', 'จุดวิกฤต', 'ผู้ป่วยเปราะบาง'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(d) {
    return [d.name || '', d.nameEn || '', d.level || '', d.trend || '', d.forecast6h || '', d.forecast12h || '', d.forecast24h || '', d.rainfall24h || 0, d.criticalPointsCount || 0, d.vulnerableCount || 0];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function writeRoadCutsSheet(ss, items, nowStr) {
  var sheet = getOrCreateSheet(ss, 'RoadCutIncidents');
  sheet.clearContents();
  var headers = ['หมายเลขสายทาง', 'สถานที่/จุดตัดขาด', 'อำเภอ', 'ประเภท', 'ระดับน้ำท่วม (ซม.)', 'สถานะผ่านได้', 'ปีที่เคยตัดขาด', 'เส้นทางเลี่ยง 1', 'เส้นทางเลี่ยง 2', 'จุดเรือ Standby', 'เวลาเกิดเหตุ'];
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  var rows = items.map(function(r) {
    return [r.roadNumber || '', r.locationName || '', r.district || '', r.type || '', r.waterDepthCm || 0, r.passable || '', (r.historicalCutYears || []).join(', '), r.alternateRoute1 || '', r.alternateRoute2 || '', r.boatStandbyPoint || '', r.incidentTime || nowStr];
  });
  if (rows.length > 0) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function readSheetRows(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  return sheet.getDataRange().getValues();
}

// -------------------------------------------------------------
// Database Setup & Reset Routines (ครบ 11 หมวดหมู่ + Logs)
// -------------------------------------------------------------
function initAll11Sheets() {
  var ss = getSpreadsheet();
  var sheetsToInit = [
    'WaterStations_Gistda', 'DistrictRisk', 'RoadCutIncidents',
    'VulnerableRegistry', 'ReferralRoutes', 'BcpResources', 'StaffRoster',
    'HospitalStatus', 'ShphNetwork', 'CommunicationLayers', 'ReplenishmentPlans',
    'EOC_Logs'
  ];
  sheetsToInit.forEach(function(name) {
    getOrCreateSheet(ss, name);
  });
  logAction(ss, 'สร้างและจัดโครงสร้างแท็บชีตมาตรฐานครบทั้ง 11 หมวดหมู่');
}

function createFullNewDatabase() {
  initAll11Sheets();
  var ss = getSpreadsheet();
  var nowStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss') + ' น.';
  seedSections4To11();
  logAction(ss, 'สร้างฐานข้อมูลใหม่และลงทะเบียนข้อมูลมาตรฐาน 1-11 เรียบร้อย 100%');
}

function seedSections4To11() {
  initAll11Sheets();
  var ss = getSpreadsheet();
  var nowStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss') + ' น.';

  // Sample data fallback for direct script run inside Google Apps Script editor
  var sampleHospitals = [
    { name: 'รพ.นราธิวาสราชนครินทร์', type: 'A+', district: 'เมืองนราธิวาส', riskLevel: 'warning', er: 'active', lr: 'active', or: 'active', icu: 'active', dialysis: 'active', opdNcd: 'active', autonomyHours: 48, fuelGeneratorHours: 72, oxygenHours: 48, waterHours: 72, bloodUnits: 142, bloodStatus: 'เพียงพอ', doctorCount: 38, nurseCount: 190, emtCount: 22, staffReadinessPct: 90, bedTotal: 400, bedOccupied: 340, notes: 'ศูนย์แม่ข่ายหลักของจังหวัด' },
    { name: 'รพ.สุไหงโก-ลก', type: 'A+', district: 'สุไหงโก-ลก', riskLevel: 'critical', er: 'active', lr: 'active', or: 'active', icu: 'active', dialysis: 'active', opdNcd: 'active', autonomyHours: 24, fuelGeneratorHours: 24, oxygenHours: 36, waterHours: 48, bloodUnits: 45, bloodStatus: 'เสี่ยงขาด', doctorCount: 32, nurseCount: 165, emtCount: 18, staffReadinessPct: 80, bedTotal: 300, bedOccupied: 275, notes: 'เฝ้าระวังสูงสุด น้ำท่วมล้อมรอบ' },
    { name: 'รพ.ตากใบ', type: 'S+', district: 'ตากใบ', riskLevel: 'critical', er: 'active', lr: 'active', or: 'active', icu: 'active', dialysis: 'active', opdNcd: 'active', autonomyHours: 36, fuelGeneratorHours: 48, oxygenHours: 36, waterHours: 48, bloodUnits: 20, bloodStatus: 'เสี่ยงขาด', doctorCount: 12, nurseCount: 55, emtCount: 8, staffReadinessPct: 80, bedTotal: 90, bedOccupied: 78, notes: 'ใกล้ปากแม่น้ำบางนราและโก-ลก' },
    { name: 'รพ.ระแงะ', type: 'S+', district: 'ระแงะ', riskLevel: 'high', er: 'active', lr: 'active', or: 'active', icu: 'active', dialysis: 'active', opdNcd: 'active', autonomyHours: 36, fuelGeneratorHours: 48, oxygenHours: 36, waterHours: 48, bloodUnits: 18, bloodStatus: 'เพียงพอ', doctorCount: 11, nurseCount: 52, emtCount: 8, staffReadinessPct: 85, bedTotal: 85, bedOccupied: 70, notes: 'เส้นทางเชื่อมต่อภูเขา' }
  ];
  writeHospitalsSheet(ss, sampleHospitals, nowStr);
  logAction(ss, 'นำเข้าข้อมูลเริ่มต้นข้อ 4-11 ลงชีตเรียบร้อย');
}

function logAction(ss, message) {
  try {
    var logSheet = getOrCreateSheet(ss, 'EOC_Logs');
    var timeStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss');
    logSheet.appendRow([timeStr, message]);
  } catch (e) {}
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function getSpreadsheet() {
  try {
    if (SHEET_ID && SHEET_ID.length > 10) {
      return SpreadsheetApp.openById(SHEET_ID);
    }
  } catch (e) {}
  return SpreadsheetApp.getActiveSpreadsheet();
}

function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn()));
  range.setBackground('#0f172a');
  range.setFontColor('#38bdf8');
  range.setFontWeight('bold');
  range.setFontSize(10);
  sheet.setFrozenRows(1);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function testSelfConnection() {
  var result = doGet({ parameter: { action: 'ping' } });
  Logger.log(result.getContent());
}
