
// =======================================================================
// Load Claims Subfile
// =======================================================================
function loadSubfile(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });

  pjs.define("details_in_ds", { type: 'data structure', qualified: true, elements: {
    "rrn": { type: 'packed decimal', length: 11, decimals: 0 },
    "prodid": { type: 'packed decimal', length: 11, decimals: 0 },
    "quantity": { type: 'packed decimal', length: 11, decimals: 0 },
    "unit_cost": { type: 'char', length: 18 },
    "invid": { type: 'packed decimal', length: 11, decimals: 0 },
    "receiveddt": { type: 'date' },
    "postedtxt": { type: 'char', length: 10 }
  }});

  rrn1 = 0;
  flags[70] = true;
  display.detailsctl.write();
  flags[70] = false;
  flags[90] = false;
  option = '';
  c1 = pjs.prepare("SELECT RRN , prodid , quantity , unit_cost , invid , receiveddt , case when posted = 1 then 'Posted' else 'Not Posted' end as postedtxt from po_details WHERE id = ? ORDER BY rrn limit 9999 FOR FETCH ONLY");
  c1.bindParameters([
    [recordId, SQL_PARAM_INPUT]
  ]);

  if (sqlcode >= 0) {

    c1.execute();

    if (sqlcode >= 0) {

      pjs.fetch(c1, details_in_ds);

      if (sqlcode >= 0) {

        while (sqlcode === 0) {

          rrn1 += 1;
          pjs.assignCorresponding(detailEdit_Fields, details_in_ds);
          display.detailssfl.write();

          pjs.fetch(c1, details_in_ds);
        }
      }
    }
  }

  if (rrn1 === 0) {
    rrn1 += 1;
    pjs.clear(detailEdit_Fields);
    flags[90] = true;
    display.detailssfl.write();
  }
  if (c1) c1.close();
}

exports.loadSubfile = loadSubfile;
