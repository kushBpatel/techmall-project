// const express= require("express")
// const connection = require("./connection");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Welcome to TechMall API");
// });

// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/orders", require("./routes/orders"));
// app.use("/order_items",require("./routes/order_items"));
// app.use("/admin", require("./routes/admin"));
// app.use("/dashboard", require("./routes/Dashboard"));


// const PORT = process.env.PORT;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });






//original code 👇🏻


const express = require("express");
const connection = require("./connection");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());

// Serve static images so they can be accessed via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images inside the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Image Upload Route (Use this in frontend to upload images)
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

// Use Routes
app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));
app.use("/order_items", require("./routes/order_items"));
app.use("/contact", require("./routes/contact"));
app.use("/admin", require("./routes/admin"));
app.use("/dashboard", require("./routes/Dashboard"));
app.use("/api/payment", require("./routes/payment")); // ✅ Correct Route




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});










// const express = require("express");
// const connection = require("./connection");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// require("dotenv").config();

// const app = express();
// app.use(express.json());

// // ✅ Enable CORS with credentials support
// app.use(
//   cors({
//     origin: "http://localhost:3000", // Allow frontend requests
//     credentials: true, // Allow cookies and authentication headers
//   })
// );

// // ✅ Serve static images so they can be accessed via URL
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ✅ Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save images inside the "uploads" directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage });

// // ✅ Image Upload Route (Use this in frontend to upload images)
// app.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   res.json({
//     message: "File uploaded successfully",
//     imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
//   });
// });

// // ✅ Use Routes
// app.use("/users", require("./routes/users"));
// app.use("/products", require("./routes/products"));
// app.use("/orders", require("./routes/orders"));
// app.use("/order_items", require("./routes/order_items"));
// app.use("/contact", require("./routes/contact"));
// app.use("/admin", require("./routes/admin"));
// app.use("/dashboard", require("./routes/Dashboard"));
// app.use("/api/payment", require("./routes/payment")); // ✅ Correct Route

// // ✅ Check Database Connection
// connection.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//     process.exit(1); // Stop the server if database connection fails
//   }
//   console.log("✅ Database connected successfully");
// });

// // ✅ Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
