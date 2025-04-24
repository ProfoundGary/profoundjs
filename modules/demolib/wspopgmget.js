function getClaim(req, res) {
    if (req.params.claimid) {
    	pjs.define("claimDS", { type: 'data structure', elements: {
    		  "cmdesc": { type: 'char', length: 25 },
    		  "cmdate": { type: 'char', length:10},
    		  "cmcounty": { type: 'char', length: 20}
            }});
        pjs.define("claimId",{ type: 'packed decimal', length: 9, decimals: 0 })
        claimId = req.params.claimid
        
        pjs.call('RTNCLAIMR', claimId, claimDS)

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
    

}

exports.run = getClaim

