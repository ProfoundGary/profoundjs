
// =======================================================================
// Process Delete Option
// =======================================================================
function deleteRecord(id) {
  pjs.define("id", { type: 'packed decimal', length: 11, decimals: 0, refParm: id });

  sql_statement1 = pjs.allocStmt();
  sql_statement1.executeDirect("select coalesce ( supplier.supplier , '' ) from po_table left outer join po_suppliers supplier on supplier.rrn = supplierid");
  pjs.fetch(sql_statement1, supplier);
  sql_statement1.close(true);

  display.confirmdel.execute();
  if (!flags[12]) {
    sql_statement2 = pjs.prepare("Delete from po_table where id = ?");
    sql_statement2.bindParameters([
      [id, SQL_PARAM_INPUT]
    ]);
    sql_statement2.execute();
    sql_statement2.close(true);
  }
}

exports.deleteRecord = deleteRecord;
