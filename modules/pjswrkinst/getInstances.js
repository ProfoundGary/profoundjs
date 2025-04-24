const pjsBaseInstance = '/profoundjs-base/instances/';
const fs = require('fs');
const path = require('path');

function getInstances(request, reponse) {
 
  let instanceArray = getServerInstances();
  reponse.json(instanceArray);
  return;

  function directoryExists(dir) {
    var exists = false;
    try {
      var stat = fs.statSync(dir);
      if (stat && stat.isDirectory()) exists = true;
    }
    catch (err) {
      exists = false;
    }
    return exists;
  }

  function getServerInstances() {

    let instanceArray = [];
    if (directoryExists(pjsBaseInstance)) {
      const instanceDirs = fs.readdirSync(pjsBaseInstance);
      instanceDirs.forEach((instanceDir) => {
        let data;
        try {
          data = fs.readFileSync(path.join(pjsBaseInstance, instanceDir, "/conf"), "utf8");
        }
        catch (error) {
          return;
        }
        let options = data.split('\n');
        let config = { name: instanceDir, autostart: "0", ccsid: 37, nodePath: "/QOpenSys/pkgs/bin/node" };
  
        options.forEach(option => {
          let parts = option.split('=');
          let configOption = parts[0].trim();
          switch (configOption) {
            case 'path':
              config.path = parts[1].trim();
              break;
            case 'nodePath':
              config.nodePath = parts[1].trim();
              break;
            case 'nodeArgs':
              config.nodeArgs = parts[1].trim();
              break;
            case 'autostart':
              config.autostart = parts[1].trim();
              break;
            case 'ccsid':
              config.ccsid = parts[1].trim();
              break;
            case '':
              break;
            default:
              break;
          }
        });

        configPath = config.path.replace(/\/start.js/g, "/config.js");
        let instConfig = null;
        let port = 0;
        let securePort = 0;
        let configExists = "Yes";
        try { 
          instConfig = require(configPath);
          port = instConfig.port;
          securePort = instConfig.securePort;
        } catch (error) {
          configExists = "No";
        }
        
        var instPath = config.path;
        var to = instPath.lastIndexOf('/');
        to = to == -1 ? instPath.length : to + 1;
        instPath = instPath.substring(0, to);
        instanceArray.push({instName     : config.name,
                            instPath     : instPath,
                            nodePath     : config.nodePath,
                            autostart    : config.autostart,
                            ccsid        : config.ccsid,
                            configExists : configExists,
                            port         : port,
                            secureport   : securePort});
        
      });
    }
    return instanceArray;
  }
} 

module.exports.run = getInstances;
