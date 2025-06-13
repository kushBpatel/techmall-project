const express = require("express");
const db = require("../connection"); // Import database connection
const router = express.Router();

// 🔹 Get all admins
router.get("/", (req, res) => {
  db.query("SELECT * FROM admin_users", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// 🔹 Admin login (without password hashing)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM admin_users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate a simple token (for now, using admin ID)
      const token = `admin-token-${results[0].id}`;
      res.json({ message: "Login successful", token });
    }
  );
});

// 🔹 Register a new admin (without password hashing)
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Admin registered successfully" });
      }
    }
  );
});

module.exports = router;