const path = require('path');
const fs = require('fs').promises;
const pool = require('../config/database');

async function init() {
  try {
    const schemaPath = path.resolve(__dirname, '..', '..', 'database', 'schema.sql');
    const sql = await fs.readFile(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('Database schema executed successfully.');
  } catch (err) {
    console.error('Failed to initialize DB:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

init();
