// const express = require("express");
// const db = require("../connection"); // Import database connection
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const router = express.Router();
// const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable

// // 🔹 Get all users
// router.get("/", (req, res) => {
//   db.query("SELECT * FROM users", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//     } else {
//       res.json(results);
//     }
//   });
// });

// // 🔹 Register a new user
// router.post("/register", (req, res) => {
//   const { username, email, password, role } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   db.query(
//     "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
//     [username, email, password, role || "customer"],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json({ message: "User registered successfully" });
//       }
//     }
//   );
// });

// // 🔹 Delete User
// router.delete("/:id", (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ message: "User deleted successfully" });
//   });
// });

// // 🔹 Update User Role
// router.put("/:id", (req, res) => {
//   const { id } = req.params;
//   const { role } = req.body;

//   db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json({ message: "User role updated successfully" });
//   });
// });

// // 🔹 Login User
// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   // Find user by email
//   db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (results.length === 0) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     const user = results[0];

//     // Compare entered password with the plain text password in the database
//     if (password !== user.password) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

//     res.json({ message: "Login successful", token, role: user.role });
//   });
// });




// // 🔹 Get Authenticated User
// router.get("/user", (req, res) => {
//   // Get the token from the request headers
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, SECRET_KEY);

//     // Fetch the user from the database
//     db.query("SELECT id, username, email, role FROM users WHERE id = ?", [decoded.id], (err, results) => {
//       if (err) return res.status(500).json({ error: err.message });

//       if (results.length === 0) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       res.json(results[0]); // Return user details
//     });
//   } catch (error) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

// module.exports = router;











const express = require("express");
const db = require("../connection"); // Import database connection
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable

// ✅ Get all users
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// ✅ Register a new user
router.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.query(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, role || "customer"],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "User registered successfully" });
      }
    }
  );
});

// ✅ Delete User
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

// ✅ Update User Role
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User role updated successfully" });
  });
});

// ✅ Login User
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user by email
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // Compare entered password with the plain text password in the database
    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role });
  });
});




//updated about the getting specific user 



router.get("/user", (req, res) => {
  console.log("🔹 Fetching authenticated user..."); // Debugging
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("✅ Token decoded:", decoded);

    db.query(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) {
          console.error("❌ Database error:", err.message);
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          console.log("❌ User not found in DB");
          return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User found:", results[0]);
        res.json(results[0]);
      }
    );
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
});



module.exports = router;
