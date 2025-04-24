const path = require('path');

describe(__dirname, function(done) {

  context('main()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'main_test.js'), done);
    });
  });

  context('loadSubfile()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'LoadSubfile_test.js'), done);
    });
  });

  context('deleteRecord()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'DeleteRecord_test.js'), done);
    });
  });

  context('saveNewRecord()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'SaveNewRecord_test.js'), done);
    });
  });

  context('deadCodeExampleProcedure()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'DeadCodeExampleProcedure_test.js'), done);
    });
  });

})