
var controlOptions = { alwnull: '*usrctl', dateFormat: '*iso' };

exports.activationGroup = "QILE";

function podemont1r(recordid) {
  pjs.define("recordid", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordid });

  pjs.defineDisplay("display", "./podemont1d.json", { userOpen: true, rrnFields: { notesfl: 'rrn1' } });

  // global definitions

  pjs.define("rrn1", { type: 'integer', length: 10, decimals: 0 });

  pjs.define("arrayWithCount_tp", { type: 'data structure', template: true, elements: {
    "lineCount": { type: 'integer', length: 5, decimals: 0 },
    "lineArray": { type: 'char', length: 255, dim: 256 }
  }});

  pjs.define("fullnote", { type: 'char', length: 500 });

  pjs.import("./*.js");

  pjs.define("sql_statement1", { type: 'cursor' });
  pjs.define("c1", { type: 'cursor' });
  pjs.define("sql_statement2", { type: 'cursor' });

  pjs.setConnectAttr(SQL_TXN_ISOLATION, SQL_TXN_NO_COMMIT);

  main(pjs.refParm("recordid"));
}

exports.default = podemont1r;

exports.parms = [
  { type: 'packed decimal', length: 11, decimals: 0 }
]
