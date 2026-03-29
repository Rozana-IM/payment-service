const mysql = require("mysql2/promise");

/* =========================
   Create Connection Pool
========================= */

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/* =========================
   Test Connection (SAFE)
========================= */

async function connect() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Payment DB connected");
    connection.release();
  } catch (err) {
    console.error("❌ Payment DB connection failed:", err.message);
    // ❌ DO NOT EXIT
  }
}

/* =========================
   Query Helper
========================= */

async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    console.error("❌ Payment DB query error:", err.message);
    throw err;
  }
}

module.exports = {
  pool,
  connect,
  query
};
