
// =======================================================================
// Load Claims Subfile
// =======================================================================
function loadSubfile() {
  pjs.define("orders_in_ds", { type: 'data structure', qualified: true, elements: {
    "rrn": { type: 'packed decimal', length: 4, decimals: 0 },
    "id": { type: 'packed decimal', length: 11, decimals: 0 },
    "supplier": { type: 'char', length: 50 },
    "supshort": { type: 'char', length: 20, overlay: 'supplier' },
    "status": { type: 'char', length: 50 },
    "statusshrt": { type: 'char', length: 9, overlay: 'status' },
    "ordtotala": { type: 'packed decimal', length: 14, decimals: 2 },
    "approveddt": { type: 'date' },
    "expecteddt": { type: 'date' },
    "paymentdt": { type: 'date' },
    "paymethod": { type: 'char', length: 50 },
    "paymthshrt": { type: 'char', length: 11, overlay: 'paymethod' },
    "payamounta": { type: 'packed decimal', length: 12, decimals: 2 }
  }});
  pjs.define("likeCondition", { type: 'char', length: 50, varying: true });

  rrn1 = 0;
  flags[70] = true;
  display.mainctl.write();
  flags[70] = false;
  likeCondition = '%' + pos2suplr.trim() + '%';
  c1 = pjs.prepare("SELECT ROW_NUMBER ( ) OVER ( ) , po.id , coalesce ( supplier.supplier , '' ) , coalesce ( status.status , '' ) , ordtotal , approveddt , expectdt , paymentdt , paymethod , payamount from po_table po left outer join po_suppliers supplier on supplier.rrn = po.supplierid left outer join po_status status on status.id = status_id WHERE ( ? = 0 or po.id >= ? ) and ( ? = '' OR UPPER ( supplier.supplier ) like ? ) ORDER BY po.id limit 9999 FOR FETCH ONLY");
  c1.bindParameters([
    [pos2po, SQL_PARAM_INPUT],
    [pos2po, SQL_PARAM_INPUT],
    [pos2suplr, SQL_PARAM_INPUT],
    [likeCondition, SQL_PARAM_INPUT]
  ]);

  if (sqlcode >= 0) {

    c1.execute();

    if (sqlcode >= 0) {

      pjs.fetch(c1, orders_in_ds);

      if (sqlcode >= 0) {

        while (sqlcode === 0) {
          rrn1 += 1;
          pjs.clear(sfl_Fields_Out);
          pjs.assignCorresponding(sfl_Fields_Out, orders_in_ds);
          display.mainsfl.write(pjs.ds("sfl_Fields_Out"));

          pjs.fetch(c1, orders_in_ds);
        }
      }
    }
  }

  if (rrn1 === 0) {
    rrn1 += 1;
    pjs.clear(sfl_Fields_Out);
    sfl_Fields_Out.supshort = ' No Records to display ';
    display.mainsfl.write(pjs.ds("sfl_Fields_Out"));
  }
  if (c1) c1.close();
}

exports.loadSubfile = loadSubfile;
