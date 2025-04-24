function getClaim(req, res) {

 
  var header=(req.headers['authorization']||'').split(/\s+/).pop();

    if (authorizeUser(header) && req.body && req.body.claimid) {
    	pjs.define("claimDS", { type: 'data structure', elements: {
    		  "cmdesc": { type: 'char', length: 25 },
    		  "cmdate": { type: 'char', length:10},
    		  "cmcounty": { type: 'char', length: 20}
            }});
        pjs.define("claimId",{ type: 'packed decimal', length: 9, decimals: 0 });
        claimId = req.body.claimid;
        pjs.call('RTNCLAIMR', claimId, claimDS);

        res.json({
            success: true,
            claimid: claimId,
            description: cmdesc,
            date: cmdate,
            county: cmcounty
        });
    } else {
        res.send({
                success: false
            }
        )
    }
    
  //function to get username and password from authorization header and call system api to check username and password
  function authorizeUser(authHeader){
    pjs.define("username", { type: 'char', length: 10 });
    pjs.define("password", { type: 'char', length: 10 });
    pjs.define("handle", { type: 'char', length: 12 });
    pjs.define("error_DS", { type: 'data structure', elements: {
      "bytesProv": { type: 'integer', decimals: 0, from: 1, to: 4, initValue: 256 },
      "bytesAvail": { type: 'integer', decimals: 0, from: 5, to: 8, initValue: 0 },
      "exception": { type: 'char', from: 9, to: 15 },
      "reserved": { type: 'char', from: 16, to: 16 },
      "message": { type: 'char', from: 17, to: 256 }
    }});

    // convert from base64 and split on colon
    auth=new Buffer.from(authHeader, 'base64').toString();    
    parts=auth.split(/:/);                         
    username=parts[0];
    password=parts[1];
  
    //call system api to verify username and password
    pjs.call('QSYGETPH', username, password, handle, error_DS, pjs.parm(10, { type: 'integer', noPass: true }), pjs.parm(37, { type: 'integer', noPass: true }));
 
    //if there is an error bytesAvail will be greater than 0
    if(bytesAvail > 0){
        res.json({
            success: false,
            exception: exception,
            message: message
        })
    }
    else{
      // if there wasn't an error set the job to the signed in user
           pjs.call('QWTSETP',handle);
    }

    //if we made it here username and password are valid
    return true;
  
  }

}

exports.run = getClaim;

