
var controlOptions = { alwnull: '*usrctl', dateFormat: '*iso' };

exports.activationGroup = "QILE";

function podemo1r() {

  pjs.defineDisplay("display", "./podemo1d.json", { userOpen: true, rrnFields: { mainsfl: 'rrn1' } });
  pjs.defineTable("po_table", { rename: { PO_TABLE: 'PO_TABLER' }, read: true, levelIds: [ '48E903A6E399C' ]});

  pjs.define("rrn1", { type: 'integer', length: 10, decimals: 0 });
  pjs.define("action", { type: 'char', length: 10, varying: true });

  pjs.define("ctl_Fields", { type: 'data structure', likeRec: { record: 'mainctl', fields: '*ALL' } });
  pjs.define("sfl_Fields_Out", { type: 'data structure', likeRec: { record: 'mainsfl', fields: '* OUTPUT' } });

  pjs.import("./*.js");

  pjs.define("c1", { type: 'cursor' });
  pjs.define("sql_statement1", { type: 'cursor' });
  pjs.define("sql_statement2", { type: 'cursor' });
  pjs.define("sql_statement3", { type: 'cursor' });

  pjs.setConnectAttr(SQL_ATTR_DATE_FMT, SQL_FMT_ISO);

  main();
}

exports.default = podemo1r;
