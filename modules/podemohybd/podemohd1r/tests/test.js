const path = require('path');

describe(__dirname, function(done) {

  context('main()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'Main_test.js'), done);
    });
  });

  context('deleteRecord()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'DeleteRecord_test.js'), done);
    });
  });

  context('updateRecord()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'UpdateRecord_test.js'), done);
    });
  });

})