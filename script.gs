function doOptions(e) {
  return ContentService.createTextOutput()
    .setMimeType(ContentService.MimeType.TEXT)
    .appendHeader('Access-Control-Allow-Origin', '*')
    .appendHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    .appendHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const data = e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : JSON.parse(JSON.stringify(e));

    const items = Array.isArray(data.items) ? data.items : [];
    const bottomLayers = Array.isArray(data.bottomLayers) ? data.bottomLayers : [];

    // Get all data from the sheet to find SIZE column
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(1, 1, lastRow, 10);
    const values = range.getValues();

    // Build a map of SIZE -> row number for quick lookup (case-insensitive)
    const sizeToRowMap = {};
    for (let row = 1; row < values.length; row++) {
      const size = String(values[row][1] || '').trim();
      if (size && size.length > 0 && size !== 'SIZE') {
        if (!sizeToRowMap[size.toUpperCase()]) {
          sizeToRowMap[size.toUpperCase()] = row + 1; // Google Sheets uses 1-based indexing
        }
      }
    }

    // Fill in data for each item by matching SIZE
    items.forEach(item => {
      const sizeKey = String(item.size || '').trim().toUpperCase();
      const rowNum = sizeToRowMap[sizeKey];

      if (rowNum) {
        // Found matching size row, fill in the data
        // Columns: A:NO, B:SIZE, C:LENGTH, D:PCS, E:TOTAL LENGTH, F:PRICE PER FEET, G:TOTAL PRICE
        sheet.getRange(rowNum, 3).setValue(item.length || 0);  // LENGTH (column C)
        sheet.getRange(rowNum, 4).setValue(item.pcs || 0);      // PCS (column D)
      }
    });

    // Update header info (Date, Quotation Number, Customer)
    if (data.date) {
      for (let row = 1; row <= Math.min(10, lastRow); row++) {
        const cellVal = String(values[row - 1][0] || '').toLowerCase();
        if (cellVal.includes('date')) {
          sheet.getRange(row, 2).setValue(data.date);
          break;
        }
      }
    }

    if (data.quoteNo) {
      for (let row = 1; row <= Math.min(10, lastRow); row++) {
        const cellVal = String(values[row - 1][0] || '').toLowerCase();
        if (cellVal.includes('quotation')) {
          sheet.getRange(row, 2).setValue(data.quoteNo);
          break;
        }
      }
    }

    if (data.customer) {
      for (let row = 1; row <= Math.min(10, lastRow); row++) {
        const cellVal = String(values[row - 1][0] || '').toLowerCase();
        if (cellVal.includes('customer')) {
          sheet.getRange(row, 2).setValue(data.customer);
          break;
        }
      }
    }

    // Append a summary record to a 'Quotations' sheet for logging
    let logSheet = ss.getSheetByName('Quotations');
    if (!logSheet) {
      logSheet = ss.insertSheet('Quotations');
      logSheet.appendRow(['Timestamp', 'Date', 'Quote No', 'Customer', 'Items', 'Bottom Layers', 'Grand Total', 'Status']);
    }
    const now = new Date();
    logSheet.appendRow([
      now,
      data.date || '',
      data.quoteNo || '',
      data.customer || '',
      JSON.stringify(items),
      JSON.stringify(bottomLayers),
      data.grandTotal || 0,
      data.status || 'Submitted'
    ]);

    return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Quotation saved successfully"}))
      .setMimeType(ContentService.MimeType.JSON)
      .appendHeader('Access-Control-Allow-Origin', '*')
      .appendHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .appendHeader('Access-Control-Allow-Origin', '*');
  }
}
