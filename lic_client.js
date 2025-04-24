#!/usr/bin/env node

"use strict";

const profound = require("profoundjs");

(async function() {
  await profound.utils.floatingLicenses.cli();
})();
