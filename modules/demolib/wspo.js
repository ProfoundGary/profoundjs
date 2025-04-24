function getClaim(req, res) {

    if (req.body && req.body.poid) {
        let po = pjs.query("SELECT supplier, status, ordtotal, payamount FROM DEMOLIB/po_view WHERE ID = ?", req.body.poid, 1)
        res.send({
            success: true,
            id: req.body.poid,
            supplier: po.supplier,
            status: po.status,
            "order total": po.ordtotal,
            "amount paid": po.payamount
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