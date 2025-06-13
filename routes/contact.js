const express = require("express");
const router = express.Router();
const connection = require("../connection"); // Import database connection

// 📌 1️⃣ Save Contact Form Data
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  const sql = "INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
  connection.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error("Error inserting message:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: "Message saved successfully" });
  });
});

// 📌 2️⃣ Get All Messages for Admin Panel
router.get("/", (req, res) => {
  const sql = "SELECT * FROM messages ORDER BY created_at DESC";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching messages:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// 📌 3️⃣ Delete a Message by ID (Admin Only)
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM messages WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: "Message deleted successfully" });
  });
});

module.exports = router;
