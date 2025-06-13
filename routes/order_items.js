const express = require("express");
const db = require("../connection");
const router = express.Router();

// 🔹 Get all order items
router.get("/", (req, res) => {
  db.query("SELECT * FROM order_items", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Add items to an order
router.post("/", (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  
  db.query(
    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
    [order_id, product_id, quantity, price],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Item added to order_items table successfully" });
      }
    }
  );
});


module.exports=router;