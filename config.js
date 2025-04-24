const connections = require('./connections');
const fs = require("fs");
const path = require("path");
module.exports = {
  "port": 8082, 
  "staticFilesDirectory": "/www/profoundui/htdocs",
  "pathlist": [
    "pjssamples",
    "demolib"
  ],
  
//connectorIPFilter: ["###.##.#.###"],
connectorIPFilter: (ip) => true,
  "initialModules": {
    "/hello": "pjssamples/hello",
    "/hello2": "pjssamples/hello2",
    "/connect4": "pjssamples/connect4", 
    "/upload": "pjssamples/upload",
    
    "/claim04r": {module: "demolib/claim04r", authenticate: false},
    "/claim05r": {module: "demolib/claim05r", authenticate: false},
    "/claim06r": {module: "demolib/claim06r", authenticate: false},
    "/claim08r": {module: "demolib/claim08r", authenticate: false},
    "/claim09r": {module: "demolib/claim09r", authenticate: false},
    "/claim11r": {module: "demolib/claim11r", authenticate: false},
    "/dispatch4": {module: "demolib/dispatch4r", authenticate: false},
    "/dispatch5": {module: "demolib/dispatch5r", authenticate: false},
  
    "/podemo":"demolib/po_list",
  }, 
  "databaseConnections": [
	    {
	        "name": "IBMi",
	        "default": true,
	        "driver": "IBMi",
					driverOptions: {
						SQL_ATTR_COMMIT: 1
					}
	      },
	      {
	        "name": "aws_mariaDB",
	        "driver": "mysql",
	        "driverOptions": {
	          "host": "demo-db-mysql.c4zcidhe0q79.us-east-2.rds.amazonaws.com",
	          "user": connections.mariadb.user,
	          "password": connections.mariadb.password,
	          "database": "pjsdemo"
	        }
	      },
	       {
	         "name": "aws_aurora",
	         "driver": "mysql",
	         "driverOptions": {
	           "host": "aurora-demodb.cluster-c4zcidhe0q79.us-east-2.rds.amazonaws.com",
	           "user": connections.aurora.user,
	           "password": connections.aurora.password,
	           "database": "pjsdemo"
	         }
	       },
	      {
	        "name": "AZURE MSSQL",
	        "driver": "mssql",
	        "driverOptions": {
	          "server": "pjsdemo.database.windows.net",
	          "user": connections.mssql.user,
	          "password": connections.mssql.password,
	          "database": "pjsdemo",
	          "options":{"enableArithAbort": false}
	        }
	      }
	    ],

  "timeout": 3600,
  "defaultMode": "compatibility",
  "connectorLibrary": "PROFOUNDJS",
  "profounduiLibrary": "PROFOUNDUI",
  "connectorCredentials": "/profoundjs/credentials_v7", 
  "encryptionKey": fs.readFileSync("/profoundjs/ekey"),
 	"basicAuthCredentials": "/profoundjs/credentials_v7", 
	"pjscallKeys":["Lfdv8x2Fk1UTI07MkhcdsaWpKn9tuyZNNnpfbNgeQb4="],
  "sslKey": "/pjscerts/key.pem",
  "sslCert": "/pjscerts/cert.pem",
  "securePort": 8081,
	"redirectHTTP": false,
  "showIBMiParmDefn": true
}
