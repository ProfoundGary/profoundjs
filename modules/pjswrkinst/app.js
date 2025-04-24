
function app() {
  pjs.defineDisplay("display", "app.json", {mode: "case-sensitive"});

  showPanel();

  // Show the interface; "onrowclick" displays config.js for the instance
  function showPanel() {
    getList();
    while (!quit) {
      display.testScreen.execute();
    }
  }

  // Call REST Web Service to get list and populate grid
  function getList() {
    var record = {};
    record.header = "config.js";
    pjs.setFields(record);

    var instanceList = pjs.httpRequest({
      method: "get",
      uri: "https://connectria1.profoundlogic.com:8081/run/pjswrkinst/getinstances"
    });
    display.grid.replaceRecords(instanceList);
  }

}

exports.default = app;
