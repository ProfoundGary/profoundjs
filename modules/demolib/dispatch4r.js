
var controlOptions = { alwnull: '*usrctl', dateFormat: '*iso' };

exports.activationGroup = "QILE";

function dispatch3r() {
  pjs.defineDisplay("display", "dispatch4d.json", { userOpen: true, rrnFields: { mainsfl: 'rrn1', detailsfl: 'rrn2' } });

  pjs.define("rrn1", { type: 'integer' });
  pjs.define("rrn2", { type: 'integer' });
  pjs.define("program", { type: 'char', length: 10 });
  pjs.define("action", { type: 'char', length: 10, varying: true });
  pjs.define("done", { type: 'boolean' });

  pjs.define("orders_in_ds", { type: 'data structure', qualified: true, elements: {
    "rn": { type: 'packed decimal', length: 4, decimals: 0 },
    "id": { type: 'packed decimal', length: 7, decimals: 0 },
    "customer": { type: 'char', length: 35 },
    "statusid": { type: 'packed decimal', length: 1, decimals: 0 },
    "status": { type: 'char', length: 20 },
    "driverid": { type: 'packed decimal', length: 7, decimals: 0 },
    "drivername": { type: 'char', length: 20 },
    "fromaddr1": { type: 'char', length: 30 },
    "fromcity": { type: 'char', length: 40 },
    "fromstate": { type: 'char', length: 2 },
    "fromzip": { type: 'char', length: 6 },
    "toaddr1": { type: 'char', length: 30 },
    "tocity": { type: 'char', length: 40 },
    "tostate": { type: 'char', length: 2 },
    "tozip": { type: 'char', length: 6 }
  }});

  pjs.define("detail_in_ds", { type: 'data structure', elements: {
    "id": { type: 'decimal', length: 7, decimals: 0 },
    "customer": { type: 'char', length: 35 },
    "statusid": { type: 'decimal', length: 1, decimals: 0 },
    "status": { type: 'char', length: 20 },
    "driverid": { type: 'decimal', length: 7, decimals: 0 },
    "drivername": { type: 'char', length: 20 },
    "fromaddr1": { type: 'char', length: 30 },
    "fromcity": { type: 'char', length: 45 },
    "fromstate": { type: 'char', length: 2 },
    "fromzip": { type: 'char', length: 6 },
    "toaddr1": { type: 'char', length: 30 },
    "tocity": { type: 'char', length: 45 },
    "tostate": { type: 'char', length: 2 },
    "tozip": { type: 'char', length: 6 },
    "hazard": { type: 'char', length: 1 },
    "poison": { type: 'char', length: 1 },
    "freezable": { type: 'char', length: 1 },
    "food": { type: 'char', length: 1 },
    "liquid": { type: 'char', length: 1 },
    "DISPATCHdt": { type: 'date', dateFormat: '*iso' },
    "PICKUPdt": { type: 'date', dateFormat: '*iso' },
    "DELIVERdt": { type: 'date', dateFormat: '*iso' }
  }});

  pjs.define("ctl_Fields", { type: 'data structure', likeRec: { record: 'mainctl', fields: 'String.all()' } });
  pjs.define("ctl_Fields_Out", { type: 'data structure', likeRec: { record: 'mainctl', fields: '* OUTPUT' } });
  pjs.define("sfl_In", { type: 'data structure', likeRec: { record: 'mainsfl', fields: '*INPUT' } });
  pjs.define("sfl_Out", { type: 'data structure', likeRec: { record: 'mainsfl', fields: '* OUTPUT' } });
  pjs.define("detail_Ctl_Fields", { type: 'data structure', likeRec: { record: 'detailctl', fields: 'String.all()' } });
  pjs.define("detail_Sfl_In", { type: 'data structure', likeRec: { record: 'detailsfl', fields: '*INPUT' } });
  pjs.define("detail_Sfl_Out", { type: 'data structure', likeRec: { record: 'detailsfl', fields: '* OUTPUT' } });
  pjs.define("progress_Fields", { type: 'data structure', likeRec: { record: 'progress', fields: 'String.all()' } });

  pjs.define("addrFSearch", { type: 'char', length: 30 });
  pjs.define("addrTSearch", { type: 'char', length: 30 });

  var c1; //cursor
  var sql_statement125; //cursor
  var c2; //cursor
  var sql_statement126; //cursor
  var sql_statement127; //cursor
  var sql_statement128; //cursor
  var sql_statement129; //cursor
  var sql_statement130; //cursor
  var sql_statement131; //cursor
  var sql_statement132; //cursor

  main();
  pjs.setConnectAttr(SQL_ATTR_DATE_FMT, SQL_FMT_ISO);

  // Main process

  function main() {
    pjs.clear(flags[03]);
    pjs.clear(c1addressf);
    pjs.clear(c1addresst);
    pjs.clear(c1number);

    pjs.setError(false);
    try {
      display.open();
    }
    catch(err) {
      pjs.setError(err);
    }
    while (!flags[03]) {
      loadSubfile();
      // Write Bottom;
      display.mainctl.execute();
      action = '';

      display.mainsfl.readChanged();
      if (!pjs.endOfData()) {

        if (option === '2') {
          details(id, false);
        }
        else if (option === '4') {
          deleteRecord();
        }
      }

      // Add Record Processing
      if (flags[06]) {
        action = 'add';
        pjs.clear(detail_in_ds);
        details(saveNewRecord(), true);
        addnew = false;
      }
    }
    display.close();
    flags["LR"] = true;

    // begsr *pssr;
    // close Display;
    // ENDSR;
  }

  // =======================================================================
  // Load Claims Subfile
  // =======================================================================
  // BegSr LoadSubfile;

  function loadSubfile() {

    rrn1 = 0;
    flags[70] = true;
    display.mainctl.write();
    flags[70] = false;

    addrFSearch = '%' + c1addressf.trim() + '%';
    addrTSearch = '%' + c1addresst.trim() + '%';

    c1 = pjs.prepare("SELECT ROW_NUMBER ( ) OVER ( ) , co.ID , co.customer , co.STATUSID , s.name , co.DRIVERID , coalesce ( d.name , '' ) , co.fromaddr1 , co.fromcity , co.fromstate , co.fromzip , co.toaddr1 , co.tocity , co.tostate , co.tozip FROM CUSTORDER co left outer JOIN DRIVER d ON co.DRIVERID = d.ID INNER JOIN DISPSTATUS s ON co.STATUSID = s.ID WHERE ( ? = 0 or co.id >= ? ) and ( ? = '%%' OR UPPER ( co.FROMADDR1 ) LIKE ( ? ) ) and ( ? = '%%' OR UPPER ( co.TOADDR1 ) LIKE ( ? ) ) ORDER BY co.id limit 9999");
    c1.bindParameters([
      [c1number, SQL_PARAM_INPUT],
      [c1number, SQL_PARAM_INPUT],
      [addrFSearch, SQL_PARAM_INPUT],
      [addrFSearch, SQL_PARAM_INPUT],
      [addrTSearch, SQL_PARAM_INPUT],
      [addrTSearch, SQL_PARAM_INPUT]
    ]);
    // FOR FETCH ONLY ;

    if (sqlcode >= 0) {

      c1.execute();

      if (sqlcode >= 0) {

        pjs.fetch(c1, orders_in_ds);

        if (sqlcode >= 0) {

          while (sqlcode === 0) {

            rrn1 += 1;
            pjs.clear(sfl_Out);
            pjs.assignCorresponding(sfl_Out, orders_in_ds);
            sfl_Out.image = '/profoundui/userdata/images/drivers/' + pjs.char(orders_in_ds.driverid) + '.jpg';
            display.mainsfl.write(pjs.ds("sfl_Out"));

            pjs.fetch(c1, orders_in_ds);
          }
        }
      }
    }

    if (rrn1 === 0) {
      rrn1 += 1;
      pjs.clear(sfl_Out);
      sfl_Out.fromaddr1 = ' No Records to display';
      display.mainsfl.write(pjs.ds("sfl_Out"));
    }
    c1.close();
    // ENDSR;
  }

  // =======================================================================
  // Load Details
  // =======================================================================

  function details(recordId, addNew) {
    pjs.define("recordId", { type: 'packed decimal', length: 7, decimals: 0, refParm: recordId });
    pjs.define("addNew", { type: 'boolean', refParm: addNew });
    pjs.define("redisplay", { type: 'boolean' });
    pjs.define("holdDriverId", { type: 'packed decimal', length: 7, decimals: 0 });

    do {
      pjs.clear(redisplay);
      if (recordId > 0) {

        sql_statement125 = pjs.prepare("SELECT co.ID , CUSTOMER , STATUSID , coalesce ( s.name , '' ) , DRIVERID , coalesce ( d.NAME , '' ) , FROMADDR1 , FROMCITY , FROMSTATE , FROMZIP , TOADDR1 , TOCITY , TOSTATE , TOZIP , HAZARD , POISON , FREEZABLE , FOOD , LIQUID , DISPATCHDt , pickupdt , DELIVERDt FROM CUSTORDER co left outer JOIN DRIVER d ON co.DRIVERID = d.ID left outer JOIN DISPSTATUS s ON co.STATUSID = s.ID WHERE co.ID = ?");
        sql_statement125.bindParameters([
          [recordId, SQL_PARAM_INPUT]
        ]);
        sql_statement125.execute();
        pjs.fetch(sql_statement125, detail_in_ds);
        sql_statement125.close(true);

        if (sqlcod === 0) {
          pjs.assignCorresponding(detail_Ctl_Fields, detail_in_ds);
          detail_Ctl_Fields.dispatchd = getMDY(pjs.refParm("DISPATCHdt"));
          detail_Ctl_Fields.pickupd = getMDY(pjs.refParm("PICKUPdt"));
          detail_Ctl_Fields.deliverd = getMDY(pjs.refParm("DELIVERdt"));
        }
      }
      else {
        pjs.clear(detail_Ctl_Fields);
      }

      loadDetailSubfile(pjs.refParm("recordId"));

      // Write detBottom;
      holdDriverId = detail_Ctl_Fields.driverid;
      detail_Ctl_Fields.addNew = addNew;
      display.detailctl.execute(pjs.ds("detail_Ctl_Fields"));
      if (!flags[12]) {
        updateRecord();
        redisplay = reload || updateDetails(pjs.refParm("recordId")) || holdDriverId !== detail_Ctl_Fields.driverid;
      }
      if (flags[07]) {
        progressOrder(pjs.refParm("recordId"));
        redisplay = true;
      }
      if (flags[06]) {
        // (recordId);
        redisplay = true;
      }
    } while (redisplay);
    pjs.clear(flags[12]);
  }

  // =======================================================================
  // Load Detail Subfile
  // =======================================================================

  function loadDetailSubfile(recordId) {
    pjs.define("recordId", { type: 'packed decimal', length: 7, decimals: 0, refParm: recordId });
    pjs.define("detail_sfl_in_ds", { type: 'data structure', qualified: true, elements: {
      "id": { type: 'packed decimal', length: 7, decimals: 0 },
      "units": { type: 'packed decimal', length: 7, decimals: 0 },
      "weight": { type: 'packed decimal', length: 7, decimals: 0 },
      "descript": { type: 'char', length: 45 }
    }});
    pjs.define("idx", { type: 'packed decimal', length: 1, decimals: 0 });
    rrn2 = 0;
    flags[71] = true;
    display.detailctl.write();
    flags[71] = false;

    c2 = pjs.prepare("SELECT id , handlingunits , weight , description FROM dispdetail WHERE dispatchid = ? limit 9999");
    c2.bindParameters([
      [recordId, SQL_PARAM_INPUT]
    ]);
    // FOR FETCH ONLY ;

    if (sqlcode >= 0) {

      c2.bindParameters([
        [id, SQL_PARAM_INPUT]
      ]);
      c2.execute();

      if (sqlcode >= 0) {

        pjs.fetch(c2, detail_sfl_in_ds);

        if (sqlcode >= 0) {

          while (sqlcode === 0) {

            rrn2 += 1;
            pjs.clear(detail_Sfl_Out);
            pjs.assignCorresponding(detail_Sfl_Out, detail_sfl_in_ds);
            display.detailsfl.write(pjs.ds("detail_Sfl_Out"));

            pjs.fetch(c2, detail_sfl_in_ds);
          }
          for (rrn2 = rrn2 + 1; rrn2 <= 6; rrn2++) {
            pjs.clear(detail_Sfl_Out);
            display.detailsfl.write(pjs.ds("detail_Sfl_Out"));
          }
        }
      }
    }

    if (rrn2 === 0) {
      rrn2 += 1;
      pjs.clear(detail_Sfl_Out);
      detail_Sfl_Out.descript = ' No Records to display';
      display.detailsfl.write(pjs.ds("detail_Sfl_Out"));
    }
    c2.close();
  }

  // =======================================================================
  // Progress Order
  // =======================================================================

  function progressOrder(recordId) {
    pjs.define("recordId", { type: 'packed decimal', length: 7, decimals: 0, refParm: recordId });

    pjs.define("progress_ds", { type: 'data structure', qualified: true, elements: {
      "statusId": { type: 'packed decimal', length: 1, decimals: 0 },
      "driverId": { type: 'packed decimal', length: 7, decimals: 0 },
      "dispatchdt": { type: 'date', dateFormat: '*iso' },
      "deliverdt": { type: 'date', dateFormat: '*iso' },
      "pickupdt": { type: 'date', dateFormat: '*iso' }
    }});

    pjs.define("statusId", { type: 'packed decimal', length: 7, decimals: 0 });
    pjs.define("driverId", { type: 'packed decimal', length: 7, decimals: 0 });

    pjs.define("done", { type: 'boolean' });

    sql_statement126 = pjs.prepare("SELECT statusid , driverid , dispatchdt , deliverdt , pickupdt FROM custorder WHERE id = ?");
    sql_statement126.bindParameters([
      [recordId, SQL_PARAM_INPUT]
    ]);
    sql_statement126.execute();
    pjs.fetch(sql_statement126, progress_ds);
    sql_statement126.close(true);

    if (sqlcode >= 0) {
      pjs.assignCorresponding(progress_Fields, progress_ds);
      while (!done) {
        pjs.clear(done);
        display.progress.execute(pjs.ds("progress_Fields"));
        if (progress_Fields.statusId > 1 && progress_Fields.driverId === 0) {
          flags[30] = true;
        }
        else {
          done = true;
        }
      }
      if (!flags[12]) {
        if (progress_ds.statusId === 1) {
          pjs.clear(progress_Fields.driverId);
          pjs.clear(progress_ds.dispatchdt);
          pjs.clear(progress_ds.pickupdt);
          pjs.clear(progress_ds.deliverdt);
        }
        if (progress_ds.statusId < 3 && progress_Fields.statusId >= 3) {
          progress_ds.dispatchdt =(pjs.date());
        }
        if (progress_ds.statusId < 4 && progress_Fields.statusId >= 4) {
          progress_ds.pickupdt =(pjs.date());
        }
        if (progress_ds.statusId < 5 && progress_Fields.statusId >= 5) {
          progress_ds.deliverdt =(pjs.date());
        }
        statusId = progress_Fields.statusId;
        driverId = progress_Fields.driverId;
        sql_statement127 = pjs.prepare("update custorder set statusid = ? , driverId = ? , dispatchdt = ? , deliverdt = ? , pickupdt = ? where id = ?");
        sql_statement127.bindParameters([
          [statusId, SQL_PARAM_INPUT],
          [driverId, SQL_PARAM_INPUT],
          [progress_ds.dispatchdt, SQL_PARAM_INPUT],
          [progress_ds.deliverdt, SQL_PARAM_INPUT],
          [progress_ds.pickupdt, SQL_PARAM_INPUT],
          [recordId, SQL_PARAM_INPUT]
        ]);
        sql_statement127.execute();
        sql_statement127.close(true);
      }
    }
    pjs.clear(flags[12]);
  }

  // =======================================================================
  // Process Delete Option
  // =======================================================================

  function deleteRecord() {

    sql_statement128 = pjs.prepare("select id , customer from custorder where id = ?");
    sql_statement128.bindParameters([
      [id, SQL_PARAM_INPUT]
    ]);
    sql_statement128.execute();
    pjs.fetch(sql_statement128, cmnumber, cmcust);
    sql_statement128.close(true);
    display.confirmdel.execute();
    if (!flags[12]) {
      sql_statement129 = pjs.prepare("Delete from CUSTORDER where id = ?");
      sql_statement129.bindParameters([
        [id, SQL_PARAM_INPUT]
      ]);
      sql_statement129.execute();
      sql_statement129.close(true);
    }
  }

  // =======================================================================
  // Update Details
  // =======================================================================

  function updateDetails(recordId) {
    pjs.define("recordId", { type: 'packed decimal', length: 7, decimals: 0, refParm: recordId });
    pjs.define("changes", { type: 'boolean' });
    display.detailsfl.readChanged();
    while (!pjs.endOfData()) {
      changes = true;
      sql_statement130 = pjs.allocStmt();
      sql_statement130.executeDirect("merge using = update set d.dispatchid = n.dispatchid , d.description = n.description , d.handlingunits = n.handlingunits , d.weight = n.weight when matched then delete when not matched and n.handlingunits > 0 then insert ( dispatchid , description , handlingunits , weight ) values ( n.dispatchid , n.description , n.handlingunits , n.weight )");
      sql_statement130.close(true);

      display.detailsfl.readChanged();
    }
    return changes;
  }

  // =======================================================================
  // GetDateField convert numeric field to date or minimum date
  // =======================================================================

  function getMDY(dateIn) {
    pjs.define("dateIn", { type: 'date', refParm: dateIn });
    try {
      return pjs.dec(dateIn, "*mdy");
    }
    catch(err) {
      pjs.setError(err);
      return 0;
    }
  }
  // =======================================================================
  // GetDateField convert numeric field to date or minimum date
  // =======================================================================

  function getDateField(numIn) {
    pjs.define("numIn", { type: 'packed decimal', length: 6, decimals: 0, refParm: numIn });
    try {
      return pjs.date(numIn, "*mdy");
    }
    catch(err) {
      pjs.setError(err);
      return pjs.date('0001-01-01');
    }
  }
  // =======================================================================
  // Update Record
  // =======================================================================

  function updateRecord() {
    pjs.define("pickd", { type: 'packed decimal', length: 6, decimals: 0 });
    pjs.define("dispd", { type: 'packed decimal', length: 6, decimals: 0 });
    pjs.define("delvd", { type: 'packed decimal', length: 6, decimals: 0 });
    pickd = detail_Ctl_Fields.pickupd;
    dispd = detail_Ctl_Fields.dispatchd;
    delvd = detail_Ctl_Fields.deliverd;
    DISPATCHdt = getDateField(pjs.refParm("dispd"));
    PICKUPdt = getDateField(pjs.refParm("pickd"));
    DELIVERdt = getDateField(pjs.refParm("delvd"));
    pjs.assignCorresponding(detail_in_ds, detail_Ctl_Fields);
    sql_statement131 = pjs.prepare("update custorder set CUSTOMER = ? , STATUSID = ? , DRIVERID = ? , FROMADDR1 = ? , FROMCITY = ? , FROMSTATE = ? , FROMZIP = ? , TOADDR1 = ? , TOCITY = ? , TOSTATE = ? , TOZIP = ? , HAZARD = ? , POISON = ? , FREEZABLE = ? , FOOD = ? , LIQUID = ? , DISPATCHDt = ? , DELIVERDt = ? , pickupdt = ? where id = ?");
    sql_statement131.bindParameters([
      [customer, SQL_PARAM_INPUT],
      [statusid, SQL_PARAM_INPUT],
      [driverid, SQL_PARAM_INPUT],
      [fromaddr1, SQL_PARAM_INPUT],
      [fromcity, SQL_PARAM_INPUT],
      [fromstate, SQL_PARAM_INPUT],
      [fromzip, SQL_PARAM_INPUT],
      [toaddr1, SQL_PARAM_INPUT],
      [tocity, SQL_PARAM_INPUT],
      [tostate, SQL_PARAM_INPUT],
      [tozip, SQL_PARAM_INPUT],
      [hazard, SQL_PARAM_INPUT],
      [poison, SQL_PARAM_INPUT],
      [freezable, SQL_PARAM_INPUT],
      [food, SQL_PARAM_INPUT],
      [liquid, SQL_PARAM_INPUT],
      [DISPATCHdt, SQL_PARAM_INPUT],
      [DELIVERdt, SQL_PARAM_INPUT],
      [PICKUPdt, SQL_PARAM_INPUT],
      [id, SQL_PARAM_INPUT]
    ]);
    sql_statement131.execute();
    sql_statement131.close(true);
  }

  // =======================================================================
  // Save New Record
  // =======================================================================

  function saveNewRecord() {

    pjs.define("returnId", { type: 'packed decimal', length: 7, decimals: 0 });

    sql_statement132 = pjs.allocStmt();
    sql_statement132.executeDirect("select id from final table ( insert into custorder ( customer ) values ( '' ) )");
    sql_statement132.close(true);

    return returnId;
  }
}

exports.run = dispatch3r;
