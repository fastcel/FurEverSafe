const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  console.log("🔥 REQUEST HIT /signup");

  try {
    const { username, email, contact, password, role } = req.body;

    // =========================
    // VALIDATION (TC-01 RULES)
    // =========================

    if (!username || !email || !contact || !password || !role) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    // =========================
    // CHECK DUPLICATE EMAIL (TC-02)
    // =========================
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }
    const existingUsername = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
    );

    if (existingUsername.rows.length > 0) {
    return res.status(409).json({
        error: "Username already exists",
    });
    }

    
    // =========================
    // HASH PASSWORD
    // =========================
    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================
    // INSERT USER
    // =========================
    await pool.query(
      `INSERT INTO users (username, email, contact_number, password, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [username, email, contact, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log("❌ ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;