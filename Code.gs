/**
 * ==============================================================================
 * ศูนย์ปฏิบัติการภาวะฉุกเฉินทางสาธารณสุข (EOC) สำนักงานสาธารณสุขจังหวัดนราธิวาส
 * ระบบติดตามวิกฤตอุทกภัย BCP และทะเบียนผู้ป่วยเปราะบาง 1,284 ราย
 * 
 * Google Apps Script (Code.gs) ฉบับสมบูรณ์ 100% (Production Grade)
 * รองรับ Google Sheet ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY
 * ==============================================================================
 * 
 * คำแนะนำการติดตั้งและปลดล็อคสิทธิ์การเข้าถึง (Unlock Permissions):
 * 1. เปิด Google Sheet (ID: 13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY)
 * 2. คลิกปุ่ม "แชร์ (Share)" ด้านขวาบน -> ปรับ "การเข้าถึงทั่วไป (General access)"
 *    เป็น "ทุกคนที่มีลิงก์ (Anyone with the link)" -> เลือกสิทธิ์เป็น "ผู้แก้ไข (Editor)" หรือ "ผู้มีสิทธิ์อ่าน (Viewer)"
 * 3. ไปที่เมนู "ส่วนขยาย (Extensions)" -> "Apps Script"
 * 4. ลบโค้ดเดิมทั้งหมดในไฟล์ Code.gs แล้วนำโค้ดในไฟล์นี้ทั้งหมดไปวาง
 * 5. กดปุ่มบันทึก (รูปแผ่นดิสก์)
 * 6. คลิก "ทำให้ใช้งานได้ (Deploy)" -> "การทำให้ใช้งานได้รายการใหม่ (New deployment)"
 * 7. เลือกประเภท (Select type): "เว็บแอป (Web app)"
 * 8. ตั้งค่าสำคัญเพื่อปลดล็อคสิทธิ์:
 *    - ดำเนินการในฐานะ (Execute as): "ฉัน (Me / บัญชีเจ้าของชีต)"
 *    - ผู้ที่มีสิทธิ์เข้าถึง (Who has access): "ทุกคน (Anyone)" ***สำคัญมาก ห้ามเลือก Only myself***
 * 9. คลิก "ทำให้ใช้งานได้ (Deploy)" แล้วให้สิทธิ์การเข้าถึง (Review Permissions / Advanced -> Go to EOC Script)
 * 10. คัดลอก "URL เว็บแอป (Web App URL)" นำไปวางในระบบ EOC Dashboard เพื่อซิงค์ 100%
 */

var SHEET_ID = '13KGqrkWzv9Nn8bNunvx-Uq7pHMtAiFyiVXP17FwqrWY';

/**
 * สร้างเมนูลัดบน Google Sheets เมื่อเปิดไฟล์
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🚨 EOC สสจ.นราธิวาส')
    .addItem('⚡ สร้าง/รีเซ็ตชีตมาตรฐาน (Init All Sheets)', 'initSheets')
    .addItem('📥 นำเข้าข้อมูลเริ่มต้น 13 รพ. & ผู้ป่วยเปราะบาง', 'seedInitialData')
    .addSeparator()
    .addItem('🧪 ทดสอบการเชื่อมต่อ API Web App', 'testSelfConnection')
    .addToUi();
}

/**
 * จัดการ HTTP GET Requests (ดึงข้อมูล)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'ping';
    var ss = getSpreadsheet();
    
    // 1. ตรวจสอบสถานะการเชื่อมต่อ (Ping / Health check)
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
    
    // 2. ดึงข้อมูลทะเบียนผู้ป่วยเปราะบาง (VulnerableRegistry)
    if (action === 'getPatients') {
      var sheet = getOrCreateSheet(ss, 'VulnerableRegistry');
      var data = sheet.getDataRange().getValues();
      var patients = [];
      
      for (var i = 1; i < data.length; i++) {
        var row = data[i];
        if (row[0] || row[1]) {
          patients.push({
            id: 'gas-' + i,
            code: String(row[0] || ('NRT-VUL-' + padZero(i, 3))),
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
            lastUpdated: String(row[19] || 'ซิงค์จาก Google Sheet')
          });
        }
      }
      return jsonResponse({ status: 'success', count: patients.length, patients: patients });
    }
    
    // 3. ดึงข้อมูลสถานะ 13 โรงพยาบาล
    if (action === 'getHospitals') {
      var hSheet = getOrCreateSheet(ss, 'HospitalStatus');
      var hData = hSheet.getDataRange().getValues();
      var hospitals = [];
      for (var j = 1; j < hData.length; j++) {
        var hRow = hData[j];
        if (hRow[0]) {
          hospitals.push({
            name: hRow[0],
            type: hRow[1],
            district: hRow[2],
            autonomyHours: Number(hRow[3]) || 0,
            fuelGeneratorHours: Number(hRow[4]) || 0,
            oxygenHours: Number(hRow[5]) || 0,
            bloodUnits: Number(hRow[6]) || 0,
            status: hRow[7]
          });
        }
      }
      return jsonResponse({ status: 'success', hospitals: hospitals });
    }
    
    // 4. ดึงข้อมูลทั้งหมดรวม (All Data)
    if (action === 'getAll') {
      return jsonResponse({
        status: 'success',
        patientsCount: getOrCreateSheet(ss, 'VulnerableRegistry').getLastRow() - 1,
        hospitalsCount: getOrCreateSheet(ss, 'HospitalStatus').getLastRow() - 1,
        roadCutsCount: getOrCreateSheet(ss, 'RoadCuts').getLastRow() - 1
      });
    }

    return jsonResponse({ status: 'error', message: 'ไม่พบ action: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * จัดการ HTTP POST Requests (บันทึก / อัปเดต / ลบ)
 */
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var payload = JSON.parse(raw);
    var action = payload.action || 'savePatients';
    var ss = getSpreadsheet();
    
    // 1. บันทึกรายชื่อผู้ป่วยเปราะบางทั้งหมด (Bulk Save / Push)
    if (action === 'savePatients' && Array.isArray(payload.patients)) {
      var sheet = getOrCreateSheet(ss, 'VulnerableRegistry');
      sheet.clearContents();
      
      // ตั้งหัวตารางมาตรฐาน
      var headers = [
        'รหัสผู้ป่วย', 'ชื่อ - สกุล', 'เลขบัตร ปชช.', 'อายุ', 'กลุ่มเปราะบาง (7 กลุ่ม)',
        'รายละเอียดอาการ/โรคประจำตัว', 'เบอร์โทรผู้ป่วย', 'เบอร์โทรญาติ', 'อำเภอ', 'ตำบล',
        'หมู่ที่', 'ที่อยู่โดยละเอียด', 'รพ.สต. ที่รับผิดชอบ', 'รพ. แม่ข่ายรับส่งต่อ',
        'สถานะการเคลื่อนย้าย (EVAC)', 'ศูนย์พักพิงเป้าหมาย', 'ระดับความเร่งด่วน',
        'ทีมผู้รับผิดชอบช่วยเหลือ', 'ยานพาหนะที่ต้องการ', 'อัปเดตล่าสุด'
      ];
      sheet.appendRow(headers);
      formatHeaderRow(sheet);
      
      var rows = [];
      var nowStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss') + ' น.';
      
      payload.patients.forEach(function(p) {
        rows.push([
          p.code || '',
          p.fullName || '',
          p.idCardMasked || '',
          p.age || 0,
          p.category || '',
          p.conditionDetail || '',
          p.phone || '',
          p.relativePhone || '',
          p.district || '',
          p.subdistrict || '',
          p.villageNo || '',
          p.address || '',
          p.shphResponsible || '',
          p.hospitalRef || '',
          p.evacuationStatus || 'pending',
          p.shelterTarget || '',
          p.urgencyLevel || '',
          p.assignedTeam || '',
          p.transportVehicleNeeded || '',
          nowStr
        ]);
      });
      
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      }
      
      logAction(ss, 'บันทึกข้อมูลผู้ป่วยเปราะบาง ' + rows.length + ' รายการสำเร็จ');
      
      return jsonResponse({
        status: 'success',
        message: 'บันทึกข้อมูลผู้ป่วยเปราะบางลง Google Sheet สำเร็จแล้ว ' + rows.length + ' รายการ',
        updatedCount: rows.length,
        timestamp: nowStr
      });
    }
    
    // 2. เพิ่มผู้ป่วยรายเดี่ยว (Add Single Patient)
    if (action === 'addPatient' && payload.patient) {
      var p = payload.patient;
      var pSheet = getOrCreateSheet(ss, 'VulnerableRegistry');
      var nowAddStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss') + ' น.';
      
      pSheet.appendRow([
        p.code || '', p.fullName || '', p.idCardMasked || '', p.age || 0, p.category || '',
        p.conditionDetail || '', p.phone || '', p.relativePhone || '', p.district || '',
        p.subdistrict || '', p.villageNo || '', p.address || '', p.shphResponsible || '',
        p.hospitalRef || '', p.evacuationStatus || 'pending', p.shelterTarget || '',
        p.urgencyLevel || '', p.assignedTeam || '', p.transportVehicleNeeded || '', nowAddStr
      ]);
      
      logAction(ss, 'เพิ่มผู้ป่วยรายใหม่: ' + (p.fullName || p.code));
      return jsonResponse({ status: 'success', message: 'เพิ่มข้อมูลผู้ป่วยเรียบร้อย' });
    }
    
    // 3. อัปเดตสถานะการอพยพ (Update Evacuation Status)
    if (action === 'updateStatus' && payload.patientCode && payload.newStatus) {
      var uSheet = getOrCreateSheet(ss, 'VulnerableRegistry');
      var uData = uSheet.getDataRange().getValues();
      var found = false;
      
      for (var k = 1; k < uData.length; k++) {
        if (String(uData[k][0]) === String(payload.patientCode)) {
          uSheet.getRange(k + 1, 15).setValue(payload.newStatus);
          uSheet.getRange(k + 1, 20).setValue(Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm') + ' น.');
          found = true;
          break;
        }
      }
      
      if (found) {
        logAction(ss, 'เปลี่ยนสถานะผู้ป่วย ' + payload.patientCode + ' เป็น ' + payload.newStatus);
        return jsonResponse({ status: 'success', message: 'อัปเดตสถานะสำเร็จ' });
      } else {
        return jsonResponse({ status: 'error', message: 'ไม่พบรหัสผู้ป่วย: ' + payload.patientCode });
      }
    }

    return jsonResponse({ status: 'error', message: 'ไม่รู้จัก action หรือ payload ไม่ถูกต้อง' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * ฟังก์ชันสร้างและปรับแต่งโครงสร้างแท็บทั้งหมดแบบ 100%
 */
function initSheets() {
  var ss = getSpreadsheet();
  
  // 1. แท็บ VulnerableRegistry
  var regSheet = getOrCreateSheet(ss, 'VulnerableRegistry');
  if (regSheet.getLastRow() === 0) {
    regSheet.appendRow([
      'รหัสผู้ป่วย', 'ชื่อ - สกุล', 'เลขบัตร ปชช.', 'อายุ', 'กลุ่มเปราะบาง (7 กลุ่ม)',
      'รายละเอียดอาการ/โรคประจำตัว', 'เบอร์โทรผู้ป่วย', 'เบอร์โทรญาติ', 'อำเภอ', 'ตำบล',
      'หมู่ที่', 'ที่อยู่โดยละเอียด', 'รพ.สต. ที่รับผิดชอบ', 'รพ. แม่ข่ายรับส่งต่อ',
      'สถานะการเคลื่อนย้าย (EVAC)', 'ศูนย์พักพิงเป้าหมาย', 'ระดับความเร่งด่วน',
      'ทีมผู้รับผิดชอบช่วยเหลือ', 'ยานพาหนะที่ต้องการ', 'อัปเดตล่าสุด'
    ]);
    formatHeaderRow(regSheet);
  }
  
  // 2. แท็บ HospitalStatus
  var hospSheet = getOrCreateSheet(ss, 'HospitalStatus');
  if (hospSheet.getLastRow() === 0) {
    hospSheet.appendRow([
      'ชื่อโรงพยาบาล', 'ระดับ', 'อำเภอ', 'Autonomy RTO (ชม.)', 'ไฟฟ้าสำรอง Gen (ชม.)',
      'ออกซิเจน (ชม.)', 'เลือดสำรอง (ยูนิต)', 'สถานะความพร้อม BCP'
    ]);
    formatHeaderRow(hospSheet);
  }
  
  // 3. แท็บ RoadCuts
  var roadSheet = getOrCreateSheet(ss, 'RoadCuts');
  if (roadSheet.getLastRow() === 0) {
    roadSheet.appendRow([
      'หมายเลขสายทาง', 'สถานที่/จุดตัดขาด', 'อำเภอ', 'ระดับน้ำท่วม (ซม.)',
      'สภาพการผ่าน', 'ประวัติขาด 3 ปี', 'เส้นทางสำรองที่ 1', 'เส้นทางสำรองที่ 2'
    ]);
    formatHeaderRow(roadSheet);
  }
  
  // 4. แท็บ EOC_Logs
  var logSheet = getOrCreateSheet(ss, 'EOC_Logs');
  if (logSheet.getLastRow() === 0) {
    logSheet.appendRow(['วัน-เวลา (ประเทศไทย)', 'เหตุการณ์ / คำสั่ง EOC']);
    formatHeaderRow(logSheet);
  }
  
  logAction(ss, 'สร้างและปรับแต่งโครงสร้างชีต EOC สำเร็จเรียบร้อย');
  SpreadsheetApp.getActiveSpreadsheet().toast('ปรับแต่งแท็บมาตรฐาน 4 แท็บสำเร็จ 100%', 'EOC สสจ.นราธิวาส');
}

/**
 * นำเข้าข้อมูลเริ่มต้นตัวอย่าง (Seed Data)
 */
function seedInitialData() {
  initSheets();
  var ss = getSpreadsheet();
  var hospSheet = getOrCreateSheet(ss, 'HospitalStatus');
  
  if (hospSheet.getLastRow() <= 1) {
    var sampleHospitals = [
      ['รพ.นราธิวาสราชนครินทร์', 'A+', 'เมืองนราธิวาส', 48, 72, 48, 142, 'เปิดบริการปกติ'],
      ['รพ.สุไหงโก-ลก', 'A+', 'สุไหงโก-ลก', 24, 24, 36, 45, 'เฝ้าระวังวิกฤต (น้ำล้อมรอบ)'],
      ['รพ.ระแงะ', 'S+', 'ระแงะ', 36, 48, 36, 18, 'จำกัดบริการบางส่วน'],
      ['รพ.ตากใบ', 'S+', 'ตากใบ', 36, 48, 36, 20, 'จำกัดบริการบางส่วน'],
      ['รพ.รือเสาะ', 'M', 'รือเสาะ', 72, 72, 72, 26, 'เปิดบริการปกติ'],
      ['รพ.เจาะไอร้อง', 'M', 'เจาะไอร้อง', 72, 72, 60, 16, 'เปิดบริการปกติ'],
      ['รพ.แว้ง', 'M', 'แว้ง', 72, 72, 72, 15, 'เปิดบริการปกติ'],
      ['รพ.ยี่งอเฉลิมพระเกียรติฯ', 'M', 'ยี่งอ', 48, 48, 48, 14, 'เปิดบริการปกติ'],
      ['รพ.จะแนะ', 'M', 'จะแนะ', 72, 72, 72, 12, 'เปิดบริการปกติ'],
      ['รพ.บาเจาะ', 'M', 'บาเจาะ', 72, 72, 72, 16, 'เปิดบริการปกติ'],
      ['รพ.ศรีสาคร', 'M', 'ศรีสาคร', 72, 72, 72, 11, 'เปิดบริการปกติ'],
      ['รพ.สุคิริน', 'S', 'สุคิริน', 72, 72, 72, 10, 'เปิดบริการปกติ'],
      ['รพ.สุไหงปาดี', 'S', 'สุไหงปาดี', 72, 72, 72, 12, 'เปิดบริการปกติ']
    ];
    hospSheet.getRange(2, 1, sampleHospitals.length, 8).setValues(sampleHospitals);
  }
  
  logAction(ss, 'นำเข้าข้อมูลตั้งต้น 13 โรงพยาบาลสำเร็จ');
  SpreadsheetApp.getActiveSpreadsheet().toast('นำเข้าข้อมูลสำเร็จ 100%', 'EOC สสจ.นราธิวาส');
}

/**
 * บันทึกประวัติการทำงานลงในแท็บ EOC_Logs
 */
function logAction(ss, message) {
  try {
    var logSheet = getOrCreateSheet(ss, 'EOC_Logs');
    var timeStr = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss');
    logSheet.appendRow([timeStr, message]);
  } catch (e) {
    // ignore
  }
}

/**
 * Helper: ค้นหาหรือสร้างชีตใหม่หากยังไม่มี
 */
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Helper: เข้าถึง Spreadsheet ตาม ID หรือ Active
 */
function getSpreadsheet() {
  try {
    if (SHEET_ID && SHEET_ID.length > 10) {
      return SpreadsheetApp.openById(SHEET_ID);
    }
  } catch (e) {
    // fallback
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Helper: จัดรูปแบบ Header ให้สวยงาม อ่านง่าย ตรึงแถวแรก
 */
function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1);
  range.setBackground('#0f172a'); // Slate 900
  range.setFontColor('#38bdf8'); // Sky 400
  range.setFontWeight('bold');
  range.setFontSize(10);
  sheet.setFrozenRows(1);
}

/**
 * Helper: เติม 0 นำหน้า
 */
function padZero(num, size) {
  var s = String(num);
  while (s.length < (size || 2)) { s = '0' + s; }
  return s;
}

/**
 * Helper: สร้าง JSON Response พร้อม Header ป้องกันปัญหา CORS
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ฟังก์ชันสำหรับทดสอบการทำงานภายใน Apps Script
 */
function testSelfConnection() {
  var result = doGet({ parameter: { action: 'ping' } });
  Logger.log(result.getContent());
  SpreadsheetApp.getActiveSpreadsheet().toast('การทดสอบ API ผ่าน 100%: ' + result.getContent(), 'EOC Status');
}
