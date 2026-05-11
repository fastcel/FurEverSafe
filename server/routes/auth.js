const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const auditService = require("../services/audit.service");

/* ======================================================
   SIGNUP
====================================================== */
router.post("/signup", async (req, res) => {
  console.log("🔥 REQUEST HIT /signup");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { name, email, contact, password, role } = req.body;

    if (!name || !email || !contact || !password || !role) {
      return res.status(400).json({
        error: "Please fill in all required fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    const emailCheck = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // =====================================================
    // STEP 1: CREATE USER
    // =====================================================
    const result = await client.query(
      `INSERT INTO users (name, email, contact_number, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id`,
      [name, email, contact, hashedPassword, role]
    );

    const newUserId = result.rows[0].user_id;

    // =====================================================
    // STEP 2: IF NGO → CREATE NGO ENTRY
    // =====================================================
    if (role === "ngo") {
      await client.query(
        `INSERT INTO ngos (user_id, organization_name, verified)
         VALUES ($1, $2, false)`,
        [newUserId, name] // you can replace with org name later
      );
    }

    // =====================================================
    // STEP 3: AUDIT LOG
    // =====================================================
    await auditService.createAuditLog({
      admin_id: newUserId,
      action: "SIGNUP",
      target_type: "user",
      target_id: newUserId,
      description: `New ${role} registered: ${email}`,
    });

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Account created successfully",
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.log("❌ SIGNUP ERROR:", err);

    return res.status(500).json({
      error: "Something went wrong during signup",
    });

  } finally {
    client.release();
  }
});

/* ======================================================
   LOGIN
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
      "SELECT * FROM users WHERE name = $1 AND is_active = true",
      [username]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const redirectTo =
      user.role === "ngo"
        ? "/ngo-dashboard"
        : "/citizen-dashboard";

    await auditService.createAuditLog({
      admin_id: user.user_id,
      action: "LOGIN",
      target_type: "auth",
      target_id: user.user_id,
      description: `User logged in: ${user.email}`,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        name: user.name,
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