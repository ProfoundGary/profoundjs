
// =======================================================================
// Save New Record
// =======================================================================
function saveNewRecord() {

  pjs.define("returnId", { type: 'packed decimal', length: 11, decimals: 0 });

  sql_statement3 = pjs.allocStmt();
  sql_statement3.executeDirect("select id from final table ( insert into po_table ( id ) values ( select max ( id ) + 10 from po_table ) )");
  pjs.fetch(sql_statement3, returnId);
  sql_statement3.close(true);

  return returnId;
}

exports.saveNewRecord = saveNewRecord;
