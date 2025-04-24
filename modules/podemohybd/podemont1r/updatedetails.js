
// =======================================================================
// Update Details
// =======================================================================
function updateDetails(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });
  pjs.define("noteBuilder", { type: 'char', length: 500, varying: true });
  pjs.define("idx", { type: 'integer', length: 5, decimals: 0 });
  pjs.define("somethingChanged", { type: 'boolean' });
  pjs.clear(note);
  for (idx = 1; idx <= 9999; idx++) {
    try {
      display.notesfl.getRecord(idx);
    }
    catch(err) {
      console.log('Error: ' + err);
    }
    if (note.rtrim() === '') {
      idx = 10000;
    }
    else {
      noteBuilder += note.trim() + ' ';
    }
  }
  console.log('full note:'+noteBuilder);
  console.log('id: ' + recordId);
  if (fullnote.trim() !== noteBuilder.trim()) {
    somethingChanged = true;
  }
  sql_statement2 = pjs.prepare("update po_table set notes = ? where id = ?");
  sql_statement2.bindParameters([
    [noteBuilder, SQL_PARAM_INPUT],
    [recordId, SQL_PARAM_INPUT]
  ]);
  sql_statement2.execute();
  sql_statement2.close(true);
  return somethingChanged;
}

exports.updateDetails = updateDetails;
