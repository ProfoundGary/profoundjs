function getClaim(req, res) {

    if (req.body && req.body.claimid) {
    	pjs.define("claimId", { type: "packed decimal", length: 9, decimals: 0 });
    	claimId = req.body.claimid;
    	pjs.define("claimDS", { type: 'data structure', elements: {
    		  "cmdesc": { type: 'char', length: 25 },
    		  "cmdate": { type: 'date'},
    		  "cmcounty": { type: 'char', length: 20}
            }});

        pjs.callProc({
            srvpgm: "DEMOLIB/RTNCLAIMS",
            procedure: "RETURNCLAIM",
            arguments: [
              { field: "claimId", byRef: true }
            ],
            result: "claimDS"
          });
        
        res.send({
            success: true,
            claimid: claimId,
            description: cmdesc,
            date: cmdate,
            county: cmcounty
        }
    )
    } else {
        res.send({
                success: false
            }
        )
    }
}

exports.run = getClaim;