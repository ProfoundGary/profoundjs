
// =======================================================================
// Main
// =======================================================================
function main(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });
  pjs.define("redisplay", { type: 'boolean' });

  pjs.define("detail_in_ds", { type: 'data structure', qualified: true, elements: {
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

  pjs.define("hold_details_ds", { type: 'data structure', likeDS: 'poHeader_Fields' });
  pjs.clear(flags[03]);

  pjs.setError(false);
  try {
    display.open();
  }
  catch(err) {
    pjs.setError(err);
  }

  do {
    pjs.clear(redisplay);
    if (recordId > 0) {

      sql_statement1 = pjs.prepare("select po.id , supplierID , status_ID , coalesce ( supplier.supplier , '' ) , coalesce ( status.status , '' ) , created_by , coalesce ( crtemp.first_name || ' ' || crtemp.last_name , '' ) as createname , submitted , coalesce ( subemp.first_name || ' ' || subemp.last_name , '' ) as submitname , approved , coalesce ( appemp.first_name || ' ' || appemp.last_name , '' ) as approvname , creationdt , submitdt , approveddt , paymentdt , expectdt , ordtotal , shipfee , taxes , payamount , paymethod from po_table po left outer join po_suppliers supplier on supplier.rrn = po.supplierid left outer join po_status status on status.id = status_id LEFT OUTER JOIN po_employees crtemp on crtemp.id = created_by left outer join po_employees subemp on subemp.id = submitted left outer join po_employees appemp on appemp.id = approved WHERE po.ID = ?");
      sql_statement1.bindParameters([
        [recordId, SQL_PARAM_INPUT]
      ]);
      sql_statement1.execute();
      pjs.fetch(sql_statement1, detail_in_ds);
      sql_statement1.close(true);

      if (sqlcod === 0) {
        pjs.assignCorresponding(poHeader_Fields, detail_in_ds);
        pjs.assignCorresponding(hold_details_ds, detail_in_ds);
      }
    }
    else {
      pjs.clear(poHeader_Fields);
    }

    display.headbottom.write();
    display.poheader.execute();
    if (!flags[12]) {
      redisplay = pjs.getDSValue(poHeader_Fields) !== pjs.getDSValue(hold_details_ds);
      updateRecord();
    }
    if (flags[07]) {
      pjs.call('PODEMODT1R', recordId);
      redisplay = true;
    }
    if (flags[08]) {
      pjs.call('PODEMONT1R', recordId);
      redisplay = true;
    }
  } while (!(flags[03] || !redisplay));
  pjs.clear(flags[12]);

  display.close();
  flags["LR"] = true;
}

exports.main = main;
