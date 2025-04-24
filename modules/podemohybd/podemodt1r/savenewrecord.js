
// =======================================================================
// Save New Record
// =======================================================================
function saveNewRecord(id) {
  pjs.define("id", { type: 'packed decimal', length: 11, decimals: 0, refParm: id });

  pjs.define("returnId", { type: 'packed decimal', length: 11, decimals: 0 });

  sql_statement4 = pjs.prepare("select rrn from final table ( insert into po_details ( id ) values ( ? ) )");
  sql_statement4.bindParameters([
    [id, SQL_PARAM_INPUT]
  ]);
  sql_statement4.execute();
  sql_statement4.close(true);

  return returnId;
}

exports.saveNewRecord = saveNewRecord;
