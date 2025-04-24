function getClaim(req, res) {

    if (req.body && req.body.claimid) {
        let claim = pjs.query("SELECT * FROM claimsp WHERE CMNUMBER = " + req.body.claimid, 1)
        res.send({
            success: true,
            claimid: Array.isArray(claim) ? claim[0].cmnumber : claim.cmnumber ,
            description: Array.isArray(claim) ? claim[0].cmdesc : claim.cmdesc,
            info:JSON.stringify(claim)
        }
    )
    } else {
        res.send({
                success: false
            }
        )
    }
}

exports.run = getClaim