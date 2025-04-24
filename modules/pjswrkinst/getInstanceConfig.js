function getInstanceConfig(request, reponse) {

  let instPath = request.body.instPath;
  let configPath = instPath + "config.js";
  let config = null;
  try { 
    config = require(configPath);       
  } catch (error) {
    config = {configExists: "No"};
  }

  reponse.json({success: true, result: config});
  return;
} 

module.exports.run = getInstanceConfig;
