
exports.activationGroup = "QILE";

function claim08r() {
  pjs.defineDisplay("display", "claim08d.json", { rrnFields: { claimsfl: 'rrn' } });

  pjs.defineTable("claimsp", { read: true,  update: true,  write: true,  delete: true,  keyed: true,  levelIds: [ '475A4AB4923B0' ] });
  pjs.defineTable("claims2l", { rename: { CLAIMS: 'CLAIMS2' },  read: true,  keyed: true,  levelIds: [ '475A4AB4923B0' ] });

  pjs.define("rrn", { type: 'integer' });
  pjs.define("program", { type: 'char', length: 10 });
  pjs.define("action", { type: 'char', length: 10, varying: true });
  pjs.define("done", { type: 'boolean' });

  // Keep running until F3=Exit is used

  pjs.import("./claim08r/*.js");

  while (!flags[03]) {

    // Load claims subfile
    loadSubfile();

    // Show main claims subfile screen
    display.bottom.write();
    display.claimctl.execute();
    action = '';

    // Test if a subfile record was selected by user
    display.claimsfl.readChanged();
    if (!pjs.endOfData()) {

      if (option === '2') {
        action = 'change';
        loadDetails();
        showDetails();
        if (!flags[03] && !flags[12]) {
          save();
        }
      }
      else if (option === '4') {
        action = 'delete';
        loadDetails();
        doDelete();
      }
      else if (option === '5') {
        action = 'display';
        loadDetails();
        showDetails();
      }
    }

    // Add Record Processing
    if (flags[06]) {
      action = 'add';
      newRecord();
      showDetails();
      if (!flags[03] && !flags[12]) {
        save();
      }
    }
  }

  flags["LR"] = true;  // End Program
}

exports.run = claim08r;
