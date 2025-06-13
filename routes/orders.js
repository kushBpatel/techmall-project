

//updated code for the userorders section but not done yet use the upward code for the error as base code 

//this is the updated code where take this as base code  

const express = require("express");
const db = require("../connection");
const router = express.Router();

// ✅ Get all orders
router.get("/", (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// ✅ Add a new order
router.post("/", (req, res) => {
  const { user_id, total_amount, status, items } = req.body;

  console.log("📥 Received Order Data:", req.body); // ✅ Debugging log

  if (!user_id || !total_amount || !status || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "User ID, total amount, status, and at least one item are required" });
  }

  const productIds = items.map((item) => item.product_id);

  // ✅ Step 1: Check if all product IDs exist in the `products` table
  db.query("SELECT id FROM products WHERE id IN (?)", [productIds], (err, productResults) => {
    if (err) {
      console.error("❌ Error checking product IDs:", err.sqlMessage);
      return res.status(500).json({ error: "Failed to validate products", details: err.sqlMessage });
    }

    const existingProductIds = productResults.map((row) => row.id);
    const invalidProducts = productIds.filter((id) => !existingProductIds.includes(id));

    if (invalidProducts.length > 0) {
      return res.status(400).json({
        error: "Invalid product IDs",
        details: `The following product IDs do not exist: ${invalidProducts.join(", ")}`,
      });
    }

    // ✅ Step 2: Insert order into `orders` table
    db.query(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)",
      [user_id, total_amount, status],
      (err, result) => {
        if (err) {
          console.error("❌ Error inserting order:", err.sqlMessage);
          return res.status(500).json({ error: "Failed to place order", details: err.sqlMessage });
        }

        const orderId = result.insertId;
        console.log("✅ New Order Inserted with ID:", orderId);

        // ✅ Step 3: Insert valid order items
        const itemValues = items.map((item) => [orderId, item.product_id, item.quantity, item.price]);

        console.log("📦 Final Items to Insert:", itemValues);

        const itemQuery = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
        
        db.query(itemQuery, [itemValues], (err) => {
          if (err) {
            console.error("❌ Error inserting order items:", err.sqlMessage);
            return res.status(500).json({ error: "Failed to add order items", details: err.sqlMessage });
          }

          res.json({ message: "✅ Order placed successfully", orderId });
        });
      }
    );
  });
});




// ✅ Update order status
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "Order ID and status are required" });
  }

  console.log(`Updating Order ID: ${id} to Status: ${status}`);

  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated successfully" });
  });
});

// ✅ Delete an order
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  console.log(`Deleting Order ID: ${id}`);

  db.query("DELETE FROM orders WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  });
});

// ✅ Get orders for a specific user
router.get("/user-orders/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const query = `
  SELECT orders.id AS order_id, orders.status, orders.total_amount, orders.created_at, 
       COALESCE(
         JSON_ARRAYAGG(
           JSON_OBJECT(
             'product_name', IFNULL(products.name, 'Unknown Product'), 
             'quantity', IFNULL(order_items.quantity, 0)
           )
         ), JSON_ARRAY()
       ) AS products
  FROM orders
  LEFT JOIN order_items ON orders.id = order_items.order_id
  LEFT JOIN products ON order_items.product_id = products.id
  WHERE orders.user_id = ?
  GROUP BY orders.id
  ORDER BY orders.created_at DESC;
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user orders:", error);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.json(results);
  });
});

module.exports = router;




