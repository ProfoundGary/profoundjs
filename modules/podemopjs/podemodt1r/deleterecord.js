
// =======================================================================
// Process Delete Option
// =======================================================================
function deleteRecord(id) {
  pjs.define("id", { type: 'packed decimal', length: 11, decimals: 0, refParm: id });

  display.confirmdel.execute();
  if (!flags[12]) {
    sql_statement2 = pjs.prepare("Delete from po_details where rrn = ?");
    sql_statement2.bindParameters([
      [id, SQL_PARAM_INPUT]
    ]);
    sql_statement2.execute();
    sql_statement2.close(true);
    return true;
  }
  return false;
}

exports.deleteRecord = deleteRecord;
