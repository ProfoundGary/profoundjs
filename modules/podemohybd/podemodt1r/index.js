
var controlOptions = { alwnull: '*usrctl', dateFormat: '*iso' };

exports.activationGroup = "*NEW";

function podemodt1r(recordid) {
  pjs.define("recordid", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordid });

  pjs.defineDisplay("display", "./podemodt1d.json", { userOpen: true, rrnFields: { detailssfl: 'rrn1' } });

  // global definitions
  pjs.define("rrn1", { type: 'integer', length: 10, decimals: 0 });
  pjs.define("action", { type: 'char', length: 10, varying: true });

  pjs.define("detailEdit_Fields", { type: 'data structure', elements: {
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

  pjs.import("./*.js");

  pjs.define("c1", { type: 'cursor' });
  pjs.define("sql_statement1", { type: 'cursor' });
  pjs.define("sql_statement2", { type: 'cursor' });
  pjs.define("sql_statement3", { type: 'cursor' });
  pjs.define("sql_statement4", { type: 'cursor' });

  // SQL options
  pjs.setConnectAttr(SQL_ATTR_DATE_FMT, SQL_FMT_ISO);
  pjs.setConnectAttr(SQL_TXN_ISOLATION, SQL_TXN_NO_COMMIT);

  main(pjs.refParm("recordid"));
}

exports.default = podemodt1r;

exports.parms = [
  { type: 'packed decimal', length: 11, decimals: 0 }
]
