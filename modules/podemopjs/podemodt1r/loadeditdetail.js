
// =======================================================================
// Load POHeader
// =======================================================================
function loadEditDetail(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });
  pjs.define("redisplay", { type: 'boolean' });

  pjs.define("details_in_ds", { type: 'data structure', qualified: true, elements: {
    "id": { type: 'packed decimal', length: 11, decimals: 0 },
    "rrn": { type: 'packed decimal', length: 11, decimals: 0 },
    "prodid": { type: 'packed decimal', length: 11, decimals: 0 },
    "quantity": { type: 'packed decimal', length: 11, decimals: 0 },
    "unit_cost": { type: 'char', length: 18 },
    "posted": { type: 'packed decimal', length: 1, decimals: 0 },
    "invid": { type: 'packed decimal', length: 11, decimals: 0 },
    "receiveddt": { type: 'date' },
    "postedtxt": { type: 'char', length: 10 }
  }});

  pjs.define("hold_details_ds", { type: 'data structure', likeDS: 'detailEdit_Fields' });
console.log('loadEditDetail ' + recordId);
  do {
    pjs.clear(redisplay);
    if (recordId > 0) {

      sql_statement1 = pjs.prepare("SELECT ID , RRN , prodid , quantity , unit_cost , posted , invid , receiveddt , case when posted = 1 then 'Posted' else 'Not Posted' end as postedtxt from po_details WHERE rrn = ?");
      sql_statement1.bindParameters([
        [recordId, SQL_PARAM_INPUT]
      ]);
      sql_statement1.execute();
      pjs.fetch(sql_statement1, details_in_ds);
      sql_statement1.close(true);

      if (sqlcod === 0) {
        pjs.assignCorresponding(detailEdit_Fields, details_in_ds);
        pjs.assignCorresponding(hold_details_ds, details_in_ds);
      }
    }
    else {
      pjs.clear(detailEdit_Fields);
    }

    display.detailedit.execute();
    if (!flags[12]) {
      redisplay = pjs.getDSValue(detailEdit_Fields) !== pjs.getDSValue(hold_details_ds);
      updateRecord();
    }
    if (flags[04]) {
      flags[03] = deleteRecord(pjs.refParm("recordId"));
    }
  } while (!(flags[03] || flags[12] || !redisplay));
  pjs.clear(flags[12]);
  pjs.clear(flags[03]);
}

exports.loadEditDetail = loadEditDetail;
