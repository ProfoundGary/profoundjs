
// =======================================================================
// Update Record
// =======================================================================
function updateRecord() {

  sql_statement3 = pjs.prepare("update po_details set prodid = ? , quantity = ? , unit_cost = ? , posted = ? , invid = ? , receiveddt = ? where rrn = ?");
  sql_statement3.bindParameters([
    [prodid, SQL_PARAM_INPUT],
    [quantity, SQL_PARAM_INPUT],
    [unit_cost, SQL_PARAM_INPUT],
    [posted, SQL_PARAM_INPUT],
    [invid, SQL_PARAM_INPUT],
    [receiveddt, SQL_PARAM_INPUT],
    [rrn, SQL_PARAM_INPUT]
  ]);
  sql_statement3.execute();
  sql_statement3.close(true);
}

exports.updateRecord = updateRecord;
