
// Main process
function main(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });

  pjs.define("somethingChanged", { type: 'boolean' });
  pjs.clear(flags[03]);
  pjs.clear(flags[12]);

  pjs.setError(false);
  try {
    display.open();
  }
  catch(err) {
    pjs.setError(err);
  }
  do {
    loadSubfile(pjs.refParm("recordId"));
    display.notebott.write();
    display.notectl.execute();
    if (!flags[12]) {
      somethingChanged = updateDetails(pjs.refParm("recordId"));
    }
  } while (!(flags[03] || flags[12] || !somethingChanged));
  display.close();
  flags["LR"] = true;
}

exports.main = main;
