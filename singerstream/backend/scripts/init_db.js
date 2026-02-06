const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function init() {
  try {
    const schemaPath = path.resolve(__dirname, '..', '..', 'database', 'schema.sql');
    const sql = await fs.readFile(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('Database schema executed successfully.');

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || null;

    if (adminUsername && adminPassword) {
      const existing = await pool.query(
        'SELECT id FROM users WHERE username=$1',
        [adminUsername]
      );
      if (!existing.rows.length) {
        const hash = await bcrypt.hash(adminPassword, 10);
        await pool.query(
          "INSERT INTO users(username,email,password_hash,role) VALUES($1,$2,$3,'admin')",
          [adminUsername, adminEmail, hash]
        );
        console.log('Admin user created.');
      } else {
        console.log('Admin user already exists.');
      }
    } else {
      console.log('Admin seed skipped (ADMIN_USERNAME/ADMIN_PASSWORD not set).');
    }
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
