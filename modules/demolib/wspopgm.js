function getPo(req, res) {
        if (req.body && req.body.poid) {
            pjs.define("poDS", { type: 'data structure', elements: {
                       "supplierid":{packed, length:11, decimals:0 },
                      "supplier":{ type:'char', length: 50 },
                      "status":{ type:'char', length: 50 },
                      "ordtotal":{ type:'decimal', length: 19, decimals:4 },
                      "payamount":{ type:'decimal', length: 19, decimals:4 },
                      "notes":{ type:'varchar', length: 500}
                }});
            pjs.define("poId",{ type: 'packed decimal', length: 11, decimals: 0 });
            poId = req.body.poid;
            pjs.call('RTNPOR', poId, poDS);
    
             res.json({
                success: true,
                id: poId,
                supplier: supplier,
                "order total": ordtotal,
                "amount paid": payamount,
                notes: notes
            });
        } else {
            res.send({
                    success: false
                }
            )
        }

}

exports.run = getPo;

