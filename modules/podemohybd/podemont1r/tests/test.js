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

  context('updateDetails()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'UpdateDetails_test.js'), done);
    });
  });

  context('string_WordWrap()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'string_WordWrap_test.js'), done);
    });
  });

  context('string_ScanR()', function() {
    it('specify what the function should do...', async function() {
      await profound.runTest(path.join(__dirname, 'string_ScanR_test.js'), done);
    });
  });

})