function po_list() {
  // Import UI from po_list.json
  pjs.defineDisplay('po_list_UI', 'po_list.json');

  // Main Program Loop
  while (!exit_button) {

    // Retrieve PO list from database.
    var rows = pjs.query(`SELECT po_table.id, po_suppliers.po_supplier, 
                            po_status.status, po_table.order_total, po_table.approved_date, po_table.expected_date, 
                            po_table.payment_date, po_table.payment_method, po_table.payment_amount 
                                FROM po_table 
                                LEFT outer JOIN po_status 
                                ON (po_table.status_id = po_status.rrn)
                                LEFT outer JOIN po_suppliers 
                                ON po_table.supplier_id = po_suppliers.rrn`);

    // Put records into grid
    po_list_UI.po_list_gr.replaceRecords(rows);

    // Load KPI Cards
    metric1Value = 212; // getCurrentQuarterSales();
    metric2Value = 77.57; // getOnTimePayment();
    metric2ValueColor = getOnTimePaymentColor(metric2Value);

    // Display Screen 
    po_list_UI.po_list.execute();

    // Check for selection
    po_list_UI.po_list_gr.readChanged();
    if (!pjs.endOfData()) {
      if (selected) {
        // passing the purchase order id to po_edit.js
        pjs.call('podemohd6r', pjs.parm(Number(id), {type: 'packed', length: 11, decimals: 0 }));
      }
    }
    if (create_new_po_record) po_list_UI.funcnotall.execute();
  }
}

function getCurrentQuarterSales() {
  
  var result = pjs.query(`SELECT SUM(order_total) AS total FROM po_table 
                            WHERE YEAR(expected_date) = YEAR(CURRENT_DATE AND 
                                  QUARTER(expected_date) = QUARTER(CURRENT_DATE)`);
  if(result){
    return result[0].total;
  }
}

function getOnTimePayment() {
  // Count all POs
  var allrecs = pjs.query(`SELECT COUNT(*) AS total FROM po_table`);

  // Count POs paid within 60 days
  var ontime = pjs.query(`SELECT COUNT(*) AS total FROM po_table WHERE DAYS(payment_date) - DAYS(approved_date) < 61`);

  return ontime[0].total / allrecs[0].total * 100;
}

function getOnTimePaymentColor(value) {
  switch (value) {
    case value >= 90: return '#6EC85A'; break;
    case value >= 80: return '#F0DC46'; break;
    default: return '#F066AC'; break;
  }
}

module.exports.run = po_list;