
// Main process
function main() {
  pjs.clear(flags[03]);
    pjs.setError(false);
    try {
      display.open();
    }
    catch(err) {
      pjs.setError(err);
    }

  po_table.fetchNext();
  //display.open();
  while (!flags[03]) {
    loadSubfile();
    display.mainbottom.write();
    display.mainctl.execute();
    action = '';
    display.mainsfl.readChanged();
    if (!pjs.endOfData()) {

      if (option === '2') {
        pjs.call('PODEMOHD1R', id);
      }
      else if (option === '4') {
        deleteRecord(pjs.refParm("id"));
      }
    }

    // Add Record Processing
    if (flags[06]) {
      action = 'add';
      pjs.call('podemohdr', pjs.parm(saveNewRecord(), { type: 'packed decimal', length: 11, decimals: 0, const: true }));
    }

      //display.close();
  }
  display.close();
  flags["LR"] = true;
}

exports.main = main;
