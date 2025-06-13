const express = require("express");
const db = require("../connection");
const router = express.Router();

// 🔹 Get Dashboard Statistics
router.get("/", async (req, res) => {
  try {
    // Count total users
    const usersCount = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, result) => {
        if (err) reject(err);
        else resolve(result[0].totalUsers);
      });
    });

    // Count total orders and revenue
    const ordersData = await new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) AS totalOrders, SUM(total_amount) AS totalRevenue, SUM(status = 'pending') AS pendingOrders, SUM(status = 'completed') AS completedOrders FROM orders",
        (err, result) => {
          if (err) reject(err);
          else resolve(result[0]);
        }
      );
    });

    // Count total products
    const productsCount = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, result) => {
        if (err) reject(err);
        else resolve(result[0].totalProducts);
      });
    });

    
    const pendingMessagesCount = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS pendingMessages FROM messages", (err, result) => {
        if (err) reject(err);
        else resolve(result[0].pendingMessages);
      });
    });

    res.json({
      totalUsers: usersCount,
      totalOrders: ordersData.totalOrders || 0,
      totalRevenue: ordersData.totalRevenue || 0,
      pendingOrders: ordersData.pendingOrders || 0,
      completedOrders: ordersData.completedOrders || 0,
      totalProducts: productsCount || 0, // Added total products
      pendingMessages: pendingMessagesCount || 0,
    });


  } catch (error) {
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});

module.exports = router;
