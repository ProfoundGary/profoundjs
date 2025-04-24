#!/usr/bin/env node
async function startPJS() {
  const profoundjs = require("profoundjs");
  await profoundjs.applyConfig();
  await profoundjs.server.listen();
  var express = profoundjs.server.express;
  var app = profoundjs.server.app;
  app.use(express.json());
}
startPJS();
