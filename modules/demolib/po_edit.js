function po_edit(po_number) {
  // Import UI from po_edit.json
  pjs.defineDisplay('po_edit_UI', 'po_edit.json');
  po_id = po_number;

  // gets all the purchase order information

  while (true) {

    // gets readable values for supplier and status
    var po_info = pjs.query("SELECT * FROM po_table WHERE id = ?", po_number)[0];
    
    pjs.setFields(po_info);

    // queries details from purchase order
    var poDetails = pjs.query("SELECT * FROM po_details WHERE id = ?", po_number);

    // Puts purchase order details into grid
    po_edit_UI.po_details.replaceRecords(poDetails);

    // Display Screen 
    po_edit_UI.po_edit.execute();

    // Purchase Order changes
    if (submit_po_changes) {
      // Creates an object with the purchase order values currently on the screen
      var poUpdate = {
        supplier_id: supplier_id,
        status_id: status_id,
        created_by: created_by,
        submitted_by: submitted_by,
        approved_by: approved_by,
        creation_date: creation_date,
        submitted_date: submitted_date,
        approved_date: approved_date,
        payment_date: payment_date,
        expected_date: expected_date,
        order_total: order_total,
        shipping_fee: shipping_fee,
        taxes: taxes,
        payment_amount: payment_amount,
        payment_method: payment_method,
        notes: notes
      }
      pjs.query("UPDATE po_table SET ? WHERE id = ?", [poUpdate, po_id]);
    }

    // Deletes Purchase Order
    if (delete_po) po_edit_UI.function_not_allowed.execute();

    // Check for po_detail selected
    po_edit_UI.po_details.readChanged();
    if (!pjs.endOfData()) {

      // Submit changes in Purchase Order Detail
      if (submit_po_detail) {

        // Creates an object with all the Purchase Order Detail values in the correspondent row
        var poDetailUpdate = {
          id: po_id,
          product_id: product_id,
          quantity: quantity,
          unit_cost: unit_cost,
          posted_to_inventory: posted_to_inventory,
          inventory_id: inventory_id,
          date_received: date_received
        }
        console.log(rrn);
        console.log(poDetailUpdate);
        pjs.query("UPDATE po_details SET ? WHERE rrn = ?", [poDetailUpdate, rrn]);
      }

      // Deletes Purchase Order
      if (delete_po_detail) po_edit_UI.function_not_allowed.execute();
    }

    // Goes bak to Purchase Orders List screen
    if (back_screen) return;
  }

  function deletePO(id) {
    pjs.query("DELETE FROM po_table WHERE  id = ?", id);
  }
}

module.exports.run = po_edit;