function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  data.items.forEach(item => {
    sheet.appendRow([
      data.date, 
      data.quoteNo, 
      data.customer,
      item.size, 
      item.length, 
      item.pcs, 
      item.totalLength, 
      item.price, 
      item.totalPrice
    ]);
  });
  
  return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
}
