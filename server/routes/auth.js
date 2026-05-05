const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

const router = express.Router();

/* ======================================================
   SIGNUP (TC-01 + TC-02)
====================================================== */
router.post("/signup", async (req, res) => {
  console.log("🔥 REQUEST HIT /signup");

  try {
    const { username, email, contact, password, role } = req.body;

    // Missing fields
    if (!username || !email || !contact || !password || !role) {
      return res.status(400).json({
        error: "Please fill in all required fields",
      });
    }

    // Password constraint
    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    // Duplicate email
    const emailCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: "This email is already registered. Try logging in instead.",
      });
    }

    // Duplicate username
    const usernameCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (usernameCheck.rows.length > 0) {
      return res.status(409).json({
        error: "This username is already taken. Please choose another one.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (username, email, contact_number, password, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [username, email, contact, hashedPassword, role]
    );

    return res.status(201).json({
      message: "Account created successfully. You can now log in.",
    });

  } catch (err) {
    console.log("❌ SIGNUP ERROR:", err);
    return res.status(500).json({
      error: "Something went wrong while creating account",
    });
  }
});


/* ======================================================
   LOGIN (TC-03 + TC-04)
====================================================== */
router.post("/login", async (req, res) => {
  console.log("🔥 REQUEST HIT /login");

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    // JWT token (for future auth)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secretkey",
      { expiresIn: "1d" }
    );

    // Role-based response (TC-03)
    let redirectTo = "/citizen-dashboard";

    if (user.role === "ngo") {
      redirectTo = "/ngo-dashboard";
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      redirectTo,
    });

  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);
    return res.status(500).json({
      error: "Something went wrong during login",
    });
  }
});

module.exports = router;