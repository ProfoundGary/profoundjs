
// =======================================================================
// Update Record
// =======================================================================
function updateRecord() {

  sql_statement4 = pjs.prepare("update po_table set supplierid = ? , status_id = ? , created_by = ? , submitted = ? , approved = ? , creationdt = ? , submitdt = ? , approveddt = ? , paymentdt = ? , expectdt = ? , ordtotal = ? , shipfee = ? , taxes = ? , payamount = ? , paymethod = ? where id = ?");
  sql_statement4.bindParameters([
    [supplierid, SQL_PARAM_INPUT],
    [status_id, SQL_PARAM_INPUT],
    [created_by, SQL_PARAM_INPUT],
    [submitted, SQL_PARAM_INPUT],
    [approved, SQL_PARAM_INPUT],
    [creationdt, SQL_PARAM_INPUT],
    [submitdt, SQL_PARAM_INPUT],
    [approveddt, SQL_PARAM_INPUT],
    [paymentdt, SQL_PARAM_INPUT],
    [expectdt, SQL_PARAM_INPUT],
    [ordtotal, SQL_PARAM_INPUT],
    [shipfee, SQL_PARAM_INPUT],
    [taxes, SQL_PARAM_INPUT],
    [payamount, SQL_PARAM_INPUT],
    [paymethod, SQL_PARAM_INPUT],
    [id, SQL_PARAM_INPUT]
  ]);
  sql_statement4.execute();
  sql_statement4.close(true);

  paymethod = paymethod;
}

exports.updateRecord = updateRecord;
