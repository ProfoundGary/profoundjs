
// =======================================================================
// Load Notes Subfile
// =======================================================================
function loadSubfile(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });

  pjs.define("noteArray", { type: 'data structure', likeDS: 'arrayWithCount_tp' });

  rrn1 = 0;
  flags[70] = true;
  display.notectl.write();
  flags[70] = false;

  sql_statement1 = pjs.prepare("SELECT notes from po_table WHERE id = ? limit 1");
  sql_statement1.bindParameters([
    [recordId, SQL_PARAM_INPUT]
  ]);
  sql_statement1.execute();
  pjs.fetch(sql_statement1, fullnote);
  sql_statement1.close(true);

  if (sqlcode >= 0) {

    noteArray = string_WordWrap(fullnote, 75);
    for (rrn1 = 1; rrn1 <= noteArray.lineCount; rrn1++) {

      note = noteArray.lineArray[rrn1];
      display.notesfl.write();
    }
    for (rrn1 = rrn1; rrn1 <= 12; rrn1++) {
      pjs.clear(note);
      display.notesfl.write();
    }
  }

  if (c1) c1.close();
}

exports.loadSubfile = loadSubfile;
