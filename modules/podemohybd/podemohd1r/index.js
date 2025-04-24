
var controlOptions = { alwnull: '*usrctl', dateFormat: '*iso' };

exports.activationGroup = "QILE";

function podemohd1r(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });

  pjs.defineDisplay("display", "./podemohd1d.json", { userOpen: true });

  // Dcl-DS PoHeader_Fields LikeRec(PoHeader:*ALL) ;
  pjs.define("poHeader_Fields", { type: 'data structure', elements: {
    "id": { type: 'packed decimal', length: 11, decimals: 0 },
    "supplierid": { type: 'packed decimal', length: 11, decimals: 0 },
    "status_id": { type: 'packed decimal', length: 11, decimals: 0 },
    "supplier": { type: 'char', length: 50 },
    "status": { type: 'char', length: 50 },
    "created_by": { type: 'packed decimal', length: 11, decimals: 0 },
    "createname": { type: 'char', length: 50 },
    "submitted": { type: 'packed decimal', length: 11, decimals: 0 },
    "submitname": { type: 'char', length: 50 },
    "approved": { type: 'packed decimal', length: 11, decimals: 0 },
    "approvname": { type: 'char', length: 50 },
    "creationdt": { type: 'date' },
    "submitdt": { type: 'date' },
    "approveddt": { type: 'date' },
    "paymentdt": { type: 'date' },
    "expectdt": { type: 'date' },
    "ordtotal": { type: 'packed decimal', length: 19, decimals: 4 },
    "shipfee": { type: 'packed decimal', length: 19, decimals: 4 },
    "taxes": { type: 'packed decimal', length: 19, decimals: 4 },
    "payamount": { type: 'packed decimal', length: 19, decimals: 4 },
    "paymethod": { type: 'char', length: 50 }
  }});

  pjs.import("./*.js");

  pjs.define("sql_statement1", { type: 'cursor' });
  pjs.define("sql_statement2", { type: 'cursor' });
  pjs.define("sql_statement3", { type: 'cursor' });
  pjs.define("sql_statement4", { type: 'cursor' });

  pjs.setConnectAttr(SQL_ATTR_DATE_FMT, SQL_FMT_ISO);
  pjs.setConnectAttr(SQL_TXN_ISOLATION, SQL_TXN_NO_COMMIT);

  main(pjs.refParm("recordId"));
}

exports.default = podemohd1r;

exports.parms = [
  { type: 'packed decimal', length: 11, decimals: 0 }
]
