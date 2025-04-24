#!/usr/bin/env node
async function startPJS() { 
  
  // Load Profound.js
  var profoundjs = require("profoundjs");
  
  // Apply configuration
  var config = require("./config.js");
   (await profoundjs.applyConfig(config) ) ;
  
  // Start Profound.js server
  var isWorker =  (await profoundjs.server.listen() ) ;
  if (isWorker) {
  
    // This is the top-level Express Application.
    // Custom Express coding can be added here.
    var express = profoundjs.server.express;
    var app = profoundjs.server.app;
    app.use(express.json());  // default to use JSON-encoded post data
    
  }
  
}
startPJS();