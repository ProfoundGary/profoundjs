
// Main process

function main(recordId) {
  pjs.define("recordId", { type: 'packed decimal', length: 11, decimals: 0, refParm: recordId });
  pjs.define("repeat", { type: 'boolean' });
  repeat = true;
  pjs.clear(flags[03]);

  pjs.setError(false);
  try {
    display.open();
  }
  catch(err) {
    pjs.setError(err);
  }
  while (repeat) {
    loadSubfile(pjs.refParm("recordId"));
    repeat = false;
    display.detbottom.write();
    display.detailsctl.execute();
    action = '';
    display.detailssfl.readChanged();
    repeat = !pjs.endOfData();
    while (!pjs.endOfData()) {

      if (option === '2') {
        loadEditDetail(pjs.refParm("rrn"));
      }
      else if (option === '4') {
        deleteRecord(pjs.refParm("rrn"));
      }
      display.detailssfl.readChanged();
    }

    // Add Record Processing
    if (flags[06]) {
      action = 'add';
      loadEditDetail(saveNewRecord(pjs.refParm("recordId")));
      repeat = true;
    }
    flags["LR"] = true;
  }
  display.close();
}

exports.main = main;
