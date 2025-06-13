// const express = require("express");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// require("dotenv").config();

// const router = express.Router();

// // ✅ Initialize Razorpay
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ✅ Create Order
// router.post("/pay", async (req, res) => {
//   try {
//     const { amount, currency } = req.body;

//     const options = {
//       amount: amount * 100, // Convert to paise
//       currency: currency,
//       receipt: `receipt_${Date.now()}`,
//       payment_capture: 1,
//     };

//     const order = await razorpayInstance.orders.create(options);
//     res.json({ orderId: order.id });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ error: "Payment creation failed" });
//   }
// });

// // ✅ Verify Payment
// router.post("/verify", (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generatedSignature === razorpay_signature) {
//       res.json({ success: true, message: "Payment verified successfully" });
//     } else {
//       res.status(400).json({ success: false, error: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// });


// module.exports = router;













const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const mysql = require("mysql2"); // ✅ Import MySQL
require("dotenv").config();

const router = express.Router();

// ✅ Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Create Order
router.post("/pay", async (req, res) => {
  try {
    const { amount, currency, user_id } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

// ✅ Verify Payment and Insert Order
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      amount,
      payment_method,
    } = req.body;

    // ✅ Validate Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }

    // ✅ Insert Order into Database
    const insertOrderQuery = `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES (?, ?, 'pending')`;

    db.query(insertOrderQuery, [user_id, amount], (err, result) => {
      if (err) {
        console.error("Error inserting order:", err);
        return res.status(500).json({ error: "Order creation failed" });
      }

      res.json({ success: true, message: "Payment verified and order placed successfully" });
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

module.exports = router;
 