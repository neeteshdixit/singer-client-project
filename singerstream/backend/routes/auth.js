const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users(username,email,password_hash,role) VALUES($1,$2,$3,'fan')",
    [username, email, hash]
  );

  res.json({ msg: "Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length) {
    return res.status(400).json({ msg: "No user" });
  }

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

module.exports = router;
