
module.exports.activationGroup = "QILE";

function claim06r() {
  pjs.defineDisplay("display", "claim06d.json", { rrnFields: { claimsfl: 'rrn' } });
  display.claimctl.use("claim_subfile.html"); 

  pjs.defineTable("claimsp", { read: true,  update: true,  write: true,  delete: true,  keyed: true,  levelIds: [ '475A4AB4923B0' ] });
  pjs.defineTable("claims2l", { rename: { CLAIMS: 'CLAIMS2' },  read: true,  keyed: true,  levelIds: [ '475A4AB4923B0' ] });

  pjs.define("rrn", { type: 'integer' });
  pjs.define("program", { type: 'char', length: 10 });
  pjs.define("action", { type: 'char', length: 10, varying: true });
  pjs.define("done", { type: 'boolean' });
 
  // Keep running until F3=Exit is used
  while (!flags[03]) {

    // Load claims subfile
    LoadSubfile();

    // Show main claims subfile screen
    display.bottom.write();
    display.claimctl.execute();
    action = '';

    // Test if a subfile record was selected by user
    display.claimsfl.readChanged();
    if (!pjs.endOfData()) {

      if (option === '2') {
        action = 'change';
        LoadDetails();
        ShowDetails();
        if (!flags[03] && !flags[12]) {
          Save();
        }
      }
      else if (option === '4') {
        action = 'delete';
        LoadDetails();
        DoDelete();
      }
      else if (option === '5') {
        action = 'display';
        LoadDetails();
        ShowDetails();
      }
    }

    // Add Record Processing
    if (flags[06]) {
      action = 'add';
      NewRecord();
      ShowDetails();
      if (!flags[03] && !flags[12]) {
        Save();
      }
    }
  }

  flags["LR"] = true;  // End Program

  // =======================================================================
  // Load Claims Subfile
  // =======================================================================
  function LoadSubfile() {

    // Clear Subfile
    rrn = 0;
    flags[70] = true;  // Clear Subfile
    display.claimctl.write();
    flags[70] = false;

    // Read first record
    if (c1desc.rtrim() === '') {
      claimsp.positionTo(c1number);
      claimsp.fetchNext(true);
    }
    else {
      claims2l.positionTo(c1desc);
      claims2l.fetchNext();
    }

    while (!pjs.endOfData()) {
      // Write to subfile
      pjs.assign(rrn, rrn + 1);
      option = '';
      s1number = cmnumber;
      cmmdy = pjs.dec(cmdate, "*mdy");
      display.claimsfl.write();

      // Read next record
      if (c1desc.rtrim() === '') {
        claimsp.fetchNext(true);
      }
      else {
        claims2l.fetchNext();
      }
    }
  }

  // =======================================================================
  // Load Claim Details
  // =======================================================================
  function LoadDetails() {

    if (action === 'change') {
      claimsp.getRecord(s1number);
      flags[80] = false;  // No Protect
    }
    else {
      flags[80] = true;  // Protect
      claimsp.getRecord(s1number, true);
    }

    if (pjs.found()) {
      cmtotest = cmeqest + cmothest + cmpropest;
      cmtotcost = cmeqcost + cmothcost + cmpropcost;
    }
    else {
      cmtotest = 0;
      cmtotcost = 0;
    }

    cmmdy = pjs.dec(cmdate, "*mdy");

    imagefile = pjs.char(s1number) + '.jpg';
  }

  // =======================================================================
  // Show Claim Details
  // =======================================================================
  function ShowDetails() {

    message = action;

    do {

      program = '';
      uploadinfo = '000';
      done = true;
      display.detail.execute();

      if (flags[06]) {  // Damages
        program = 'CLAIM22R';
      }

      if (flags[07]) {  // Work Orders
        program = 'CLAIM23R';
      }

      if (flags[08]) {  // Injured
        program = 'CLAIM24R';
      }

      if (flags[09]) {  // Police
        program = 'CLAIM25R';
      }

      if (flags[10]) {  // Towing
        program = 'CLAIM26R';
      }

      if (flags[11]) {  // Notes
        program = 'CLAIM27R';
      }

      if (flags[14]) {  // Photos
        program = 'CLAIM28R';
      }

      if (flags[15]) {  // Documents
        program = 'CLAIM29R';
      }

      if (program.rtrim() !== '') {
        done = false;
        pjs.call(program, cmnumber);
      }

      if (uploadinfo === '001') {  // 1 file uploaded
        done = false;
      }

    } while (!(done));
  }

  // =======================================================================
  // Save Changes
  // =======================================================================
  function Save() {

    cmdate = pjs.date(cmmdy, "*mdy");

    if (action === 'add') {
      claimsp.write();
    }

    if (action === 'change') {
      claimsp.update();
    }
  }

  // =======================================================================
  // Process Delete Option
  // =======================================================================
  function DoDelete() {

    display.confirmdel.execute();
    if (!flags[12]) {
      claimsp.getRecord(cmnumber);
      if (pjs.found()) {
        claimsp.delete();
      }
    }
  }

  // =======================================================================
  // Create New Record
  // =======================================================================
  function NewRecord() {

    cmnumber = 0;
    claimsp.positionAfter(pjs.HIGH_VALUE);
    claimsp.fetchPrevious(true);
    s1number = cmnumber;
    cmnumber = s1number + 1;
    imagefile = pjs.char(cmnumber) + '.jpg';

    flags[80] = false;  // No Protect
    cmdate = pjs.date();
    cmmdy = pjs.dec(cmdate, "*mdy");
    pjs.setCurrentTime(cmtime);
    cmdesc = '';
    cmunits = 0;
    cminjured = 0;
    cmhitrun = 'N';
    cmcomplete = 'N';
    cmactype = '';
    cmcounty = '';
    cmaddr2 = '';
    cmaddr1 = '';
    cmcity = '';
    cmstate = '';
    cmzip = 0;
    cmeqest = 0;
    cmothest = 0;
    cmpropest = 0;
    cmeqcost = 0;
    cmothcost = 0;
    cmpropcost = 0;
    cmmotor = 'N';
    cmflattire = 'N';
    cmbrokenw = 'N';
    cmvandal = 'N';
    cmpedestr = 'N';
  }
}

module.exports.run = claim06r;
