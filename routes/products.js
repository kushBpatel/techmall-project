const express = require("express");
const db = require("../connection");
const router = express.Router();

// 🔹 Get all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Add a new product
router.post("/", (req, res) => {
  const { name, price, description, stock, image, category, type } = req.body;

  db.query(
    "INSERT INTO products (name, price, description, stock, image, category, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, price, description, stock || 0, image, category, type],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Product added successfully", productId: result.insertId });
      }
    }
  );
});

// 🔹 Update product
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, price, description, stock, image, category, type } = req.body;

  db.query(
    "UPDATE products SET name=?, price=?, description=?, stock=?, image=?, category=?, type=? WHERE id=?",
    [name, price, description, stock, image, category, type, id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Product updated successfully" });
      }
    }
  );
});

 

 // Delete product by ID
router.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const query = "DELETE FROM products WHERE id = ?";

  db.query(query, [productId], (err, result) => { // ✅ Use db.query() instead
      if (err) {
          console.error("Error deleting product:", err);
          return res.status(500).json({ message: "Failed to delete product" });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
  });
});



module.exports = router;
